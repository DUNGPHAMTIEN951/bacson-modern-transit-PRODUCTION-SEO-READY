/**
 * CRM sheet schema, operational views, booking helpers and audit trail.
 */

const CRM_HEADERS = {
  LEADS_RAW: [
    "Mã Lead",
    "Thời gian",
    "Họ tên khách",
    "Số điện thoại",
    "Email",
    "Tuyến đi",
    "Ngày đi",
    "Số khách",
    "Điểm đón",
    "Điểm trả",
    "Ghi chú khách",
    "Nguồn gửi",
    "Trang gửi form",
    "Trạng thái",
    "Nhân viên phụ trách",
    "Ghi chú tư vấn",
    "Phân loại SĐT",
    "Xác minh SĐT",
    "Spam score",
    "Cờ spam",
    "Lý do rủi ro",
    "Số lần/15 phút",
    "Số lần/ngày",
    "Payload hash",
    "Booking ID",
    "Cập nhật lúc",
  ],
  PHONE_REGISTRY: [
    "Số điện thoại",
    "Phân loại",
    "Xác minh",
    "Trạng thái",
    "Lần đầu thấy",
    "Lần gần nhất",
    "Tổng lần gửi form",
    "Booking xác nhận",
    "Tổng tiền đã thu",
    "Tuyến gần nhất/ưa dùng",
    "Spam strikes",
    "Risk score gần nhất",
    "Lý do chặn",
    "Ghi chú nội bộ",
    "Tên gần nhất",
    "Cập nhật lúc",
  ],
  SPAM_QUARANTINE: [
    "Mã Request",
    "Thời gian",
    "Họ tên",
    "Số điện thoại",
    "Email",
    "Tuyến",
    "Ngày đi",
    "Số khách",
    "Điểm đón",
    "Điểm trả",
    "Ghi chú",
    "Nguồn",
    "Trang",
    "Spam score",
    "Lý do",
    "Phân loại SĐT",
    "Kết quả tự động",
    "Đã duyệt?",
    "Người duyệt",
    "Ghi chú duyệt",
    "Payload hash",
  ],
  REQUEST_LOG: [
    "Thời gian",
    "Mã Request",
    "Số điện thoại",
    "Payload hash",
    "Kết quả",
    "Spam score",
    "Lý do",
    "Nguồn",
    "Trang",
    "Tên khách",
    "Client request ID",
  ],
  BOOKINGS: [
    "Booking ID",
    "Lead ID",
    "Tạo lúc",
    "Ngày đi",
    "Họ tên",
    "Số điện thoại",
    "Tuyến",
    "Số khách",
    "Điểm đón",
    "Điểm trả",
    "Trạng thái booking",
    "Giá/người",
    "Tổng tiền trước giảm",
    "Giảm giá",
    "Thành tiền",
    "Đã thu",
    "Còn phải thu",
    "Trạng thái thanh toán",
    "Nhân viên",
    "Ghi chú",
    "Cập nhật lúc",
  ],
  PAYMENTS: [
    "Payment ID",
    "Booking ID",
    "Thời gian giao dịch",
    "Loại giao dịch",
    "Số tiền",
    "Phương thức",
    "Mã tham chiếu",
    "Số điện thoại",
    "Họ tên",
    "Nhân viên",
    "Ghi chú",
    "Tạo lúc",
  ],
  AUDIT_LOG: [
    "Thời gian",
    "Sheet",
    "Ô",
    "Đối tượng",
    "Giá trị cũ",
    "Giá trị mới",
    "Người thao tác",
    "Hành động",
  ],
  ARCHIVE_INDEX: [
    "Thời gian archive",
    "Spreadsheet ID",
    "Tên file",
    "URL",
    "Từ ngày",
    "Đến ngày",
    "Số Lead",
    "Số Request",
    "Lý do",
  ],
  CONFIG: ["Khóa", "Giá trị", "Mô tả"],
};

function ensureSystemSheets(ss) {
  if (!ss.getSheetByName(APP.SHEETS.LEADS_RAW)) {
    setupSystemForSpreadsheet(ss);
  }
}

function setupSystemForSpreadsheet(ss) {
  setupStructuredSheet(ss, APP.SHEETS.LEADS_RAW, CRM_HEADERS.LEADS_RAW, "#3A211B");
  setupStructuredSheet(ss, APP.SHEETS.PHONE_REGISTRY, CRM_HEADERS.PHONE_REGISTRY, "#274C77");
  setupStructuredSheet(ss, APP.SHEETS.SPAM_QUARANTINE, CRM_HEADERS.SPAM_QUARANTINE, "#7A1F1F");
  setupStructuredSheet(ss, APP.SHEETS.REQUEST_LOG, CRM_HEADERS.REQUEST_LOG, "#5B5B5B");
  setupStructuredSheet(ss, APP.SHEETS.BOOKINGS, CRM_HEADERS.BOOKINGS, "#2F6B4F");
  setupStructuredSheet(ss, APP.SHEETS.PAYMENTS, CRM_HEADERS.PAYMENTS, "#6A4C93");
  setupStructuredSheet(ss, APP.SHEETS.AUDIT_LOG, CRM_HEADERS.AUDIT_LOG, "#455A64");
  setupStructuredSheet(ss, APP.SHEETS.ARCHIVE_INDEX, CRM_HEADERS.ARCHIVE_INDEX, "#455A64");
  setupStructuredSheet(ss, APP.SHEETS.CONFIG, CRM_HEADERS.CONFIG, "#795548");

  setupLeadFormatting(ss.getSheetByName(APP.SHEETS.LEADS_RAW));
  setupPhoneRegistryFormatting(ss.getSheetByName(APP.SHEETS.PHONE_REGISTRY));
  setupBookingFormatting(ss.getSheetByName(APP.SHEETS.BOOKINGS));
  setupPaymentFormatting(ss.getSheetByName(APP.SHEETS.PAYMENTS));
  setupConfigDefaults(ss);
  setupLeadsView(ss);
  setupAccountingSheets(ss);
}

function setupStructuredSheet(ss, name, headers, headerColor) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground(headerColor)
    .setFontColor("#FFFFFF")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 40);
  return sheet;
}

function setupLeadFormatting(sheet) {
  if (!sheet) return;
  sheet.setColumnWidth(1, 185);
  sheet.setColumnWidth(2, 155);
  sheet.setColumnWidth(3, 170);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(6, 170);
  sheet.setColumnWidth(9, 190);
  sheet.setColumnWidth(10, 190);
  sheet.setColumnWidth(11, 220);
  sheet.setColumnWidth(14, 155);
  sheet.setColumnWidth(16, 220);
  sheet.setColumnWidth(21, 240);
  sheet.getRange("A2:A").setNumberFormat("@");
  sheet.getRange("D2:D").setNumberFormat("@");
  sheet.getRange("B2:B").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange("Z2:Z").setNumberFormat("dd/MM/yyyy HH:mm:ss");

  const statusValues = [
    "Mới",
    "Đã gọi",
    "Đã xác nhận",
    "Hẹn gọi lại",
    "Không liên hệ được",
    "Hủy",
  ];
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusValues, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("N2:N50000").setDataValidation(rule);

  const statusRange = sheet.getRange("N2:N50000");
  const rules = [
    conditionalTextRule(statusRange, "Mới", "#FFF2C9", "#B71F1F"),
    conditionalTextRule(statusRange, "Đã gọi", "#D4EAF7", "#0C5460"),
    conditionalTextRule(statusRange, "Đã xác nhận", "#D1E7DD", "#0F5132"),
    conditionalTextRule(statusRange, "Hẹn gọi lại", "#E8DAEF", "#4A235A"),
    conditionalTextRule(statusRange, "Không liên hệ được", "#FFE5D0", "#A04000"),
    conditionalTextRule(statusRange, "Hủy", "#E2E3E5", "#383D41"),
  ];
  sheet.setConditionalFormatRules(rules);
}

function setupPhoneRegistryFormatting(sheet) {
  if (!sheet) return;
  sheet.getRange("A2:A").setNumberFormat("@");
  sheet.getRange("E2:F").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange("P2:P").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange("I2:I").setNumberFormat("#,##0 [$₫-vi-VN]");

  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["MỚI", "KHÁCH_QUEN", "VIP", "SUSPECT", "SPAM", "BLOCKED"], true)
    .setAllowInvalid(false)
    .build();
  const verifyRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["CHƯA_XÁC_MINH", "ĐÃ_XÁC_MINH", "SAI_SỐ", "KHÔNG_NGHE", "BỠN_CỢT"], true)
    .setAllowInvalid(false)
    .build();
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["ACTIVE", "WATCH", "BLOCKED"], true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange("B2:B50000").setDataValidation(typeRule);
  sheet.getRange("C2:C50000").setDataValidation(verifyRule);
  sheet.getRange("D2:D50000").setDataValidation(statusRule);
}

function setupBookingFormatting(sheet) {
  if (!sheet) return;
  sheet.getRange("A2:B").setNumberFormat("@");
  sheet.getRange("F2:F").setNumberFormat("@");
  sheet.getRange("C2:C").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange("L2:Q").setNumberFormat("#,##0 [$₫-vi-VN]");
  sheet.getRange("U2:U").setNumberFormat("dd/MM/yyyy HH:mm:ss");

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["MỚI", "ĐÃ XÁC NHẬN", "ĐÃ ĐI", "HỦY", "HOÀN TIỀN"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("K2:K50000").setDataValidation(statusRule);
}

function setupPaymentFormatting(sheet) {
  if (!sheet) return;
  sheet.getRange("A2:B").setNumberFormat("@");
  sheet.getRange("H2:H").setNumberFormat("@");
  sheet.getRange("C2:C").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange("E2:E").setNumberFormat("#,##0 [$₫-vi-VN]");
  sheet.getRange("L2:L").setNumberFormat("dd/MM/yyyy HH:mm:ss");

  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["PAYMENT", "REFUND"], true)
    .setAllowInvalid(false)
    .build();
  const methodRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["TIỀN MẶT", "CHUYỂN KHOẢN", "QR", "KHÁC"], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange("D2:D50000").setDataValidation(typeRule);
  sheet.getRange("F2:F50000").setDataValidation(methodRule);
}

function conditionalTextRule(range, text, background, fontColor) {
  return SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(text)
    .setBackground(background)
    .setFontColor(fontColor)
    .setRanges([range])
    .build();
}

function setupConfigDefaults(ss) {
  const sheet = ss.getSheetByName(APP.SHEETS.CONFIG);
  const existing = {};
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues().forEach(function (row) {
      existing[String(row[0])] = true;
    });
  }

  const defaults = [
    ["SPAM_QUARANTINE_SCORE", APP.SPAM.QUARANTINE_SCORE, "Từ điểm này request vào vùng kiểm tra"],
    ["SPAM_HARD_BLOCK_SCORE", APP.SPAM.HARD_BLOCK_SCORE, "Từ điểm này request bị chặn mềm"],
    ["MAX_PHONE_15M", APP.SPAM.MAX_PER_WINDOW, "Tối đa request cùng SĐT trong 15 phút"],
    ["MAX_PHONE_DAY", APP.SPAM.MAX_PER_DAY, "Tối đa request cùng SĐT mỗi ngày"],
    ["ROLLOVER_RATIO", APP.BACKUP.ROLLOVER_RATIO, "Tỷ lệ cell để tự tạo database mới"],
    ["BACKUP_RETENTION_DAYS", APP.BACKUP.DAILY_RETENTION_DAYS, "Số ngày giữ daily backup"],
  ];
  defaults.forEach(function (row) {
    if (!existing[String(row[0])]) sheet.appendRow(row);
  });
}

function setupLeadsView(ss) {
  let sheet = ss.getSheetByName(APP.SHEETS.LEADS_VIEW);
  if (!sheet) sheet = ss.insertSheet(APP.SHEETS.LEADS_VIEW, 0);
  sheet.clear();
  sheet.getRange("A1").setFormula(
    '=QUERY(LEADS_RAW!A:Z,"select * where A is not null order by B desc",1)',
  );
  sheet.setFrozenRows(1);
  sheet.getRange("A1:Z1").setFontWeight("bold").setBackground("#1F4E5F").setFontColor("#FFFFFF");
  sheet.getRange("A:A").setNumberFormat("@");
  sheet.getRange("D:D").setNumberFormat("@");
  sheet.getRange("B:B").setNumberFormat("dd/MM/yyyy HH:mm:ss");
}

function refreshOperationalViews(ss) {
  const view = ss.getSheetByName(APP.SHEETS.LEADS_VIEW);
  if (!view || !view.getRange("A1").getFormula()) setupLeadsView(ss);
}

function writeLeadRaw(ss, payload, leadId, phoneProfile, risk, now) {
  const sheet = ss.getSheetByName(APP.SHEETS.LEADS_RAW);
  const spamFlag = risk.score >= APP.SPAM.QUARANTINE_SCORE ? "CẦN KIỂM TRA" : "OK";
  sheet.appendRow([
    leadId,
    now,
    payload.name,
    payload.phone,
    payload.email,
    payload.route,
    payload.travelDate,
    payload.passengers,
    payload.pickup,
    payload.dropoff,
    payload.note,
    payload.source,
    payload.page,
    "Mới",
    "",
    "",
    phoneProfile.customerType || "MỚI",
    phoneProfile.verification || "CHƯA_XÁC_MINH",
    risk.score,
    spamFlag,
    risk.reasons.join(" | "),
    risk.stats.samePhoneWindow,
    risk.stats.samePhoneDay,
    payload.payloadHash,
    "",
    now,
  ]);
  const row = sheet.getLastRow();
  sheet.getRange(row, 1).setNumberFormat("@");
  sheet.getRange(row, 4).setNumberFormat("@");
}

function writeSpamQuarantine(ss, payload, phoneProfile, risk, outcome, now) {
  const sheet = ss.getSheetByName(APP.SHEETS.SPAM_QUARANTINE);
  sheet.appendRow([
    payload.requestId,
    now,
    payload.name,
    payload.phone,
    payload.email,
    payload.route,
    payload.travelDate,
    payload.passengers,
    payload.pickup,
    payload.dropoff,
    payload.note,
    payload.source,
    payload.page,
    risk.score,
    risk.reasons.join(" | "),
    phoneProfile.customerType || "MỚI",
    outcome,
    "CHƯA",
    "",
    "",
    payload.payloadHash,
  ]);
  const row = sheet.getLastRow();
  sheet.getRange(row, 1).setNumberFormat("@");
  sheet.getRange(row, 4).setNumberFormat("@");
}

function handleCrmEdit(e) {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();
  const row = e.range.getRow();
  const col = e.range.getColumn();
  if (row <= 1) return;

  if (sheetName === APP.SHEETS.PHONE_REGISTRY && [2, 3, 4, 13, 14].indexOf(col) >= 0) {
    sheet.getRange(row, 16).setValue(new Date());
    logAuditEdit(e, String(sheet.getRange(row, 1).getValue() || ""), "PHONE_PROFILE_UPDATE");
  }

  if (sheetName === APP.SHEETS.LEADS_RAW && [14, 15, 16].indexOf(col) >= 0) {
    sheet.getRange(row, 26).setValue(new Date());
    const leadId = String(sheet.getRange(row, 1).getValue() || "");
    logAuditEdit(e, leadId, "LEAD_UPDATE");
    if (col === 14 && String(e.value || "") === "Đã xác nhận") {
      ensureBookingFromLeadRow(getSpreadsheet(), row);
    }
  }

  if (sheetName === APP.SHEETS.BOOKINGS && col >= 11 && col <= 20) {
    sheet.getRange(row, 21).setValue(new Date());
    applyBookingFormulas(sheet, row);
    logAuditEdit(e, String(sheet.getRange(row, 1).getValue() || ""), "BOOKING_UPDATE");
  }

  if (sheetName === APP.SHEETS.PAYMENTS && col >= 2 && col <= 11) {
    logAuditEdit(e, String(sheet.getRange(row, 1).getValue() || ""), "PAYMENT_UPDATE");
  }
}

function logAuditEdit(e, objectId, action) {
  const ss = getSpreadsheet();
  const audit = ss.getSheetByName(APP.SHEETS.AUDIT_LOG);
  let user = "";
  try {
    user = Session.getActiveUser().getEmail() || "unknown";
  } catch (error) {
    user = "unknown";
  }
  audit.appendRow([
    new Date(),
    e.range.getSheet().getName(),
    e.range.getA1Notation(),
    objectId,
    e.oldValue === undefined ? "" : e.oldValue,
    e.value === undefined ? "" : e.value,
    user,
    action,
  ]);
}

function ensureBookingFromLeadRow(ss, leadRow) {
  const leads = ss.getSheetByName(APP.SHEETS.LEADS_RAW);
  const values = leads.getRange(leadRow, 1, 1, 26).getValues()[0];
  const leadId = String(values[0] || "");
  if (!leadId) return "";
  const existing = String(values[24] || "");
  if (existing) return existing;

  const bookings = ss.getSheetByName(APP.SHEETS.BOOKINGS);
  const bookingId = generateId("BK", new Date());
  bookings.appendRow([
    bookingId,
    leadId,
    new Date(),
    values[6],
    values[2],
    values[3],
    values[5],
    Number(values[7]) || 1,
    values[8],
    values[9],
    "ĐÃ XÁC NHẬN",
    0,
    0,
    0,
    0,
    0,
    0,
    "CHƯA THU",
    values[14],
    values[15],
    new Date(),
  ]);
  const bookingRow = bookings.getLastRow();
  applyBookingFormulas(bookings, bookingRow);
  leads.getRange(leadRow, 25).setValue(bookingId);
  updateRegistryBookingCount(ss, String(values[3] || ""), 1);
  return bookingId;
}

function applyBookingFormulas(sheet, row) {
  if (!sheet || row <= 1) return;
  sheet.getRange(row, 13).setFormula("=IFERROR(H" + row + "*L" + row + ",0)");
  sheet.getRange(row, 15).setFormula("=MAX(0,M" + row + "-N" + row + ")");
  sheet
    .getRange(row, 16)
    .setFormula(
      '=IFERROR(SUMIFS(PAYMENTS!E:E,PAYMENTS!B:B,A' +
        row +
        ',PAYMENTS!D:D,"PAYMENT")-SUMIFS(PAYMENTS!E:E,PAYMENTS!B:B,A' +
        row +
        ',PAYMENTS!D:D,"REFUND"),0)',
    );
  sheet.getRange(row, 17).setFormula("=MAX(0,O" + row + "-P" + row + ")");
  sheet
    .getRange(row, 18)
    .setFormula(
      '=IF(P' +
        row +
        '<=0,"CHƯA THU",IF(P' +
        row +
        '<O' +
        row +
        ',"ĐÃ CỌC","ĐÃ THANH TOÁN"))',
    );
}

function updateRegistryBookingCount(ss, phone, increment) {
  const record = getPhoneRegistryRecord(ss, phone);
  if (!record) return;
  const sheet = ss.getSheetByName(APP.SHEETS.PHONE_REGISTRY);
  sheet.getRange(record.row, 8).setValue((record.confirmedBookings || 0) + (increment || 0));
  sheet.getRange(record.row, 16).setValue(new Date());
}

function createBookingFromSelectedLead() {
  const ss = getSpreadsheet();
  const active = ss.getActiveSheet();
  if (active.getName() !== APP.SHEETS.LEADS_RAW) {
    SpreadsheetApp.getUi().alert("Hãy chọn một dòng trong LEADS_RAW trước.");
    return;
  }
  const row = active.getActiveRange().getRow();
  if (row <= 1) return;
  const bookingId = ensureBookingFromLeadRow(ss, row);
  SpreadsheetApp.getUi().alert("Booking đã sẵn sàng: " + bookingId);
}

function recordPaymentForSelectedBooking() {
  const ss = getSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();
  if (sheet.getName() !== APP.SHEETS.BOOKINGS) {
    ui.alert("Hãy chọn một dòng trong BOOKINGS trước.");
    return;
  }
  const row = sheet.getActiveRange().getRow();
  if (row <= 1) return;
  const bookingId = String(sheet.getRange(row, 1).getValue() || "");
  if (!bookingId) return;

  const amountPrompt = ui.prompt("Ghi khoản thu", "Nhập số tiền (VD: 350000):", ui.ButtonSet.OK_CANCEL);
  if (amountPrompt.getSelectedButton() !== ui.Button.OK) return;
  const amount = Number(String(amountPrompt.getResponseText()).replace(/[^0-9.-]/g, ""));
  if (!isFinite(amount) || amount <= 0) {
    ui.alert("Số tiền không hợp lệ.");
    return;
  }

  const typePrompt = ui.prompt("Loại giao dịch", "Nhập PAYMENT hoặc REFUND:", ui.ButtonSet.OK_CANCEL);
  if (typePrompt.getSelectedButton() !== ui.Button.OK) return;
  const type = String(typePrompt.getResponseText() || "").trim().toUpperCase();
  if (["PAYMENT", "REFUND"].indexOf(type) < 0) {
    ui.alert("Loại giao dịch phải là PAYMENT hoặc REFUND.");
    return;
  }

  const methodPrompt = ui.prompt("Phương thức", "TIỀN MẶT / CHUYỂN KHOẢN / QR / KHÁC", ui.ButtonSet.OK_CANCEL);
  if (methodPrompt.getSelectedButton() !== ui.Button.OK) return;
  const method = sanitizeInput(methodPrompt.getResponseText(), 60) || "KHÁC";

  const payments = ss.getSheetByName(APP.SHEETS.PAYMENTS);
  const paymentId = generateId("PAY", new Date());
  payments.appendRow([
    paymentId,
    bookingId,
    new Date(),
    type,
    amount,
    method,
    "",
    sheet.getRange(row, 6).getValue(),
    sheet.getRange(row, 5).getValue(),
    sheet.getRange(row, 19).getValue(),
    "",
    new Date(),
  ]);

  applyBookingFormulas(sheet, row);
  refreshAccountingDaily(ss);
  refreshDashboard(ss);
  ui.alert("Đã ghi giao dịch " + paymentId + ".");
}
