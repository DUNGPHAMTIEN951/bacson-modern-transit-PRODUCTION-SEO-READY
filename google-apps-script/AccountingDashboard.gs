/**
 * Accounting aggregation + management dashboard.
 * Revenue is calculated from PAYMENTS, never from raw leads.
 */

const ACCOUNTING_HEADERS = [
  "Ngày",
  "Booking",
  "Hành khách",
  "Doanh thu booking",
  "Tiền đã thu",
  "Hoàn tiền",
  "Thu ròng",
  "Còn phải thu",
  "Request spam",
  "Lead hợp lệ",
  "Spam rate (%)",
  "Lead → Booking (%)",
  "Khách mới",
  "Khách quen/VIP",
];

function setupAccountingSheets(ss) {
  setupStructuredSheet(ss, APP.SHEETS.ACCOUNTING_DAILY, ACCOUNTING_HEADERS, "#234E52");
  let dashboard = ss.getSheetByName(APP.SHEETS.DASHBOARD);
  if (!dashboard) dashboard = ss.insertSheet(APP.SHEETS.DASHBOARD, 0);
  dashboard.setFrozenRows(2);
}

function refreshAccountingDaily(optionalSs) {
  const ss = optionalSs || getSpreadsheet();
  ensureSystemSheets(ss);
  const daily = ss.getSheetByName(APP.SHEETS.ACCOUNTING_DAILY);
  const byDay = {};
  const preserved = {};

  // Các dòng lịch sử được copy sang khi rollover phải được giữ lại. Chỉ ngày nào có
  // dữ liệu trong database active hiện tại mới được tính lại.
  if (daily.getLastRow() > 1) {
    const previous = daily
      .getRange(2, 1, daily.getLastRow() - 1, ACCOUNTING_HEADERS.length)
      .getValues();
    previous.forEach(function (row) {
      const d = parseDateSafe(row[0]);
      if (d) preserved[dateKey(d)] = row;
    });
  }

  function bucket(key) {
    if (!byDay[key]) {
      byDay[key] = {
        bookings: 0,
        passengers: 0,
        gross: 0,
        collected: 0,
        refunds: 0,
        outstanding: 0,
        spam: 0,
        validLeads: 0,
        newCustomers: 0,
        returningCustomers: 0,
      };
    }
    return byDay[key];
  }

  const requestSheet = ss.getSheetByName(APP.SHEETS.REQUEST_LOG);
  if (requestSheet && requestSheet.getLastRow() > 1) {
    const rows = requestSheet.getRange(2, 1, requestSheet.getLastRow() - 1, 6).getValues();
    rows.forEach(function (row) {
      const timestamp = parseDateSafe(row[0]);
      if (!timestamp) return;
      const b = bucket(dateKey(timestamp));
      const outcome = String(row[4] || "").toUpperCase();
      if (["BLOCKED", "QUARANTINED"].indexOf(outcome) >= 0) b.spam += 1;
    });
  }

  const leadsSheet = ss.getSheetByName(APP.SHEETS.LEADS_RAW);
  if (leadsSheet && leadsSheet.getLastRow() > 1) {
    const rows = leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, 18).getValues();
    rows.forEach(function (row) {
      const timestamp = parseDateSafe(row[1]);
      if (!timestamp) return;
      const b = bucket(dateKey(timestamp));
      b.validLeads += 1;
      const phoneType = String(row[16] || "").toUpperCase();
      if (["KHÁCH_QUEN", "VIP"].indexOf(phoneType) >= 0) b.returningCustomers += 1;
      else b.newCustomers += 1;
    });
  }

  const bookingsSheet = ss.getSheetByName(APP.SHEETS.BOOKINGS);
  if (bookingsSheet && bookingsSheet.getLastRow() > 1) {
    const rows = bookingsSheet.getRange(2, 1, bookingsSheet.getLastRow() - 1, 21).getValues();
    rows.forEach(function (row) {
      const created = parseDateSafe(row[2]);
      if (!created) return;
      const status = String(row[10] || "").toUpperCase();
      if (status === "HỦY") return;
      const b = bucket(dateKey(created));
      b.bookings += 1;
      b.passengers += Number(row[7]) || 0;
      b.gross += Number(row[14]) || 0;
      b.outstanding += Number(row[16]) || 0;
    });
  }

  const paymentsSheet = ss.getSheetByName(APP.SHEETS.PAYMENTS);
  if (paymentsSheet && paymentsSheet.getLastRow() > 1) {
    const rows = paymentsSheet.getRange(2, 1, paymentsSheet.getLastRow() - 1, 5).getValues();
    rows.forEach(function (row) {
      const timestamp = parseDateSafe(row[2]);
      if (!timestamp) return;
      const type = String(row[3] || "").toUpperCase();
      const amount = Math.max(0, Number(row[4]) || 0);
      const b = bucket(dateKey(timestamp));
      if (type === "REFUND") b.refunds += amount;
      else if (type === "PAYMENT") b.collected += amount;
    });
  }

  const recomputed = {};
  Object.keys(byDay).forEach(function (key) {
    const b = byDay[key];
    const totalRequests = b.validLeads + b.spam;
    const spamRate = totalRequests > 0 ? (b.spam / totalRequests) * 100 : 0;
    const conversion = b.validLeads > 0 ? (b.bookings / b.validLeads) * 100 : 0;
    recomputed[key] = [
      new Date(key + "T00:00:00+07:00"),
      b.bookings,
      b.passengers,
      b.gross,
      b.collected,
      b.refunds,
      b.collected - b.refunds,
      b.outstanding,
      b.spam,
      b.validLeads,
      spamRate,
      conversion,
      b.newCustomers,
      b.returningCustomers,
    ];
  });

  const merged = {};
  Object.keys(preserved).forEach(function (key) {
    merged[key] = preserved[key];
  });
  Object.keys(recomputed).forEach(function (key) {
    merged[key] = recomputed[key];
  });

  const output = Object.keys(merged)
    .sort()
    .map(function (key) {
      return merged[key];
    });

  if (daily.getLastRow() > 1) {
    daily.getRange(2, 1, daily.getLastRow() - 1, ACCOUNTING_HEADERS.length).clearContent();
  }
  if (output.length) {
    daily.getRange(2, 1, output.length, ACCOUNTING_HEADERS.length).setValues(output);
  }
  daily.getRange("A2:A").setNumberFormat("dd/MM/yyyy");
  daily.getRange("D2:H").setNumberFormat("#,##0 [$₫-vi-VN]");
  daily.getRange("K2:L").setNumberFormat("0.0\"%\"");
  daily.setFrozenRows(1);
  return output;
}

function refreshDashboard(optionalSs) {
  const ss = optionalSs || getSpreadsheet();
  const accounting = ss.getSheetByName(APP.SHEETS.ACCOUNTING_DAILY);
  let dashboard = ss.getSheetByName(APP.SHEETS.DASHBOARD);
  if (!dashboard) dashboard = ss.insertSheet(APP.SHEETS.DASHBOARD, 0);

  const values = accounting && accounting.getLastRow() > 1
    ? accounting.getRange(2, 1, accounting.getLastRow() - 1, ACCOUNTING_HEADERS.length).getValues()
    : [];

  const today = dateKey(new Date());
  const month = today.slice(0, 7);
  let todayRow = null;
  const monthAgg = {
    bookings: 0,
    passengers: 0,
    gross: 0,
    collected: 0,
    refunds: 0,
    net: 0,
    outstanding: 0,
    spam: 0,
    validLeads: 0,
    newCustomers: 0,
    returningCustomers: 0,
  };

  values.forEach(function (row) {
    const d = parseDateSafe(row[0]);
    if (!d) return;
    const key = dateKey(d);
    if (key === today) todayRow = row;
    if (key.slice(0, 7) === month) {
      monthAgg.bookings += Number(row[1]) || 0;
      monthAgg.passengers += Number(row[2]) || 0;
      monthAgg.gross += Number(row[3]) || 0;
      monthAgg.collected += Number(row[4]) || 0;
      monthAgg.refunds += Number(row[5]) || 0;
      monthAgg.net += Number(row[6]) || 0;
      monthAgg.outstanding += Number(row[7]) || 0;
      monthAgg.spam += Number(row[8]) || 0;
      monthAgg.validLeads += Number(row[9]) || 0;
      monthAgg.newCustomers += Number(row[12]) || 0;
      monthAgg.returningCustomers += Number(row[13]) || 0;
    }
  });

  const todayData = todayRow || [new Date(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const monthRequests = monthAgg.validLeads + monthAgg.spam;
  const monthSpamRate = monthRequests ? (monthAgg.spam / monthRequests) * 100 : 0;
  const monthConversion = monthAgg.validLeads ? (monthAgg.bookings / monthAgg.validLeads) * 100 : 0;

  dashboard.getCharts().forEach(function (chart) {
    dashboard.removeChart(chart);
  });
  try {
    dashboard.getRange(1, 1, dashboard.getMaxRows(), dashboard.getMaxColumns()).breakApart();
  } catch (error) {
    // Không có merged range cũng không ảnh hưởng.
  }
  dashboard.clear();

  dashboard.getRange("A1:H1").merge();
  dashboard
    .getRange("A1")
    .setValue("BẮC SƠN CƯỜNG NGUYỆT — DASHBOARD VẬN HÀNH & KẾ TOÁN")
    .setFontSize(18)
    .setFontWeight("bold")
    .setBackground("#3A211B")
    .setFontColor("#FFFFFF")
    .setHorizontalAlignment("center");
  dashboard.setRowHeight(1, 46);

  const cards = [
    ["Doanh thu hôm nay", Number(todayData[6]) || 0, "currency"],
    ["Doanh thu tháng này", monthAgg.net, "currency"],
    ["Booking hôm nay", Number(todayData[1]) || 0, "number"],
    ["Còn phải thu", monthAgg.outstanding, "currency"],
    ["Spam rate tháng", monthSpamRate, "percent"],
    ["Lead → Booking", monthConversion, "percent"],
    ["Khách mới tháng", monthAgg.newCustomers, "number"],
    ["Khách quen/VIP", monthAgg.returningCustomers, "number"],
  ];

  const cardRows = [3, 6];
  cards.forEach(function (card, index) {
    const group = index < 4 ? 0 : 1;
    const col = ((index % 4) * 2) + 1;
    const row = cardRows[group];
    dashboard.getRange(row, col, 1, 2).merge();
    dashboard.getRange(row, col).setValue(card[0]).setFontWeight("bold").setFontColor("#6B4B3E");
    dashboard.getRange(row + 1, col, 1, 2).merge();
    const valueCell = dashboard.getRange(row + 1, col);
    valueCell.setValue(card[1]).setFontSize(16).setFontWeight("bold").setBackground("#FFF7ED");
    if (card[2] === "currency") valueCell.setNumberFormat("#,##0 [$₫-vi-VN]");
    else if (card[2] === "percent") valueCell.setNumberFormat("0.0\"%\"");
    else valueCell.setNumberFormat("0");
  });

  dashboard.getRange("J2:K4").setValues([
    ["Phân loại request", "Số lượng"],
    ["Lead hợp lệ", monthAgg.validLeads],
    ["Spam / cách ly", monthAgg.spam],
  ]);
  dashboard.getRange("J6:K8").setValues([
    ["Nhóm khách", "Số lượng"],
    ["Khách mới", monthAgg.newCustomers],
    ["Khách quen/VIP", monthAgg.returningCustomers],
  ]);

  const lastRow = accounting ? accounting.getLastRow() : 1;
  if (accounting && lastRow > 1) {
    const start = Math.max(2, lastRow - 30);
    const length = lastRow - start + 1;

    const revenueChart = dashboard
      .newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(accounting.getRange(start, 1, length, 1))
      .addRange(accounting.getRange(start, 7, length, 1))
      .setPosition(10, 1, 0, 0)
      .setOption("title", "Thu ròng theo ngày (31 ngày gần nhất)")
      .setOption("legend", { position: "bottom" })
      .setOption("curveType", "function")
      .build();
    dashboard.insertChart(revenueChart);

    const spamChart = dashboard
      .newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(accounting.getRange(start, 1, length, 1))
      .addRange(accounting.getRange(start, 11, length, 1))
      .setPosition(10, 6, 0, 0)
      .setOption("title", "Tỷ lệ spam theo ngày")
      .setOption("legend", { position: "bottom" })
      .setOption("vAxis", { format: "0.0'%'" })
      .build();
    dashboard.insertChart(spamChart);

    const conversionChart = dashboard
      .newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(accounting.getRange(start, 1, length, 1))
      .addRange(accounting.getRange(start, 12, length, 1))
      .setPosition(28, 1, 0, 0)
      .setOption("title", "Tỷ lệ Lead → Booking")
      .setOption("legend", { position: "bottom" })
      .setOption("vAxis", { format: "0.0'%'" })
      .build();
    dashboard.insertChart(conversionChart);
  }

  const spamPie = dashboard
    .newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dashboard.getRange("J2:K4"))
    .setPosition(28, 6, 0, 0)
    .setOption("title", "Lead hợp lệ vs Spam — tháng này")
    .setOption("pieHole", 0.45)
    .build();
  dashboard.insertChart(spamPie);

  const customerPie = dashboard
    .newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dashboard.getRange("J6:K8"))
    .setPosition(46, 1, 0, 0)
    .setOption("title", "Khách mới vs Khách quen/VIP — tháng này")
    .setOption("pieHole", 0.45)
    .build();
  dashboard.insertChart(customerPie);

  dashboard.getRange("A65:H66").merge();
  dashboard
    .getRange("A65")
    .setValue(
      "Ghi chú: Doanh thu được tính từ PAYMENTS. Lead/form không tự động được tính là doanh thu. " +
        "Các giao dịch REFUND được trừ khỏi thu ròng.",
    )
    .setWrap(true)
    .setFontColor("#6B7280")
    .setBackground("#F8FAFC");

  dashboard.setColumnWidths(1, 8, 120);
  dashboard.setColumnWidths(10, 2, 145);
  return dashboard;
}
