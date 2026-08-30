/**
 * CRM sheet schema, operational views, booking helpers and audit trail.
 */

const CRM_HEADERS = {
  LEADS_RAW: [
    "Mã Lead", "Thời gian", "Họ tên khách", "Số điện thoại", "Email", "Tuyến đi",
    "Ngày đi", "Số khách", "Điểm đón", "Điểm trả", "Ghi chú khách", "Nguồn gửi",
    "Trang gửi form", "Trạng thái", "Nhân viên phụ trách", "Ghi chú tư vấn",
    "Phân loại SĐT", "Xác minh SĐT", "Spam score", "Cờ spam", "Lý do rủi ro",
    "Số lần/15 phút", "Số lần/ngày", "Payload hash", "Booking ID", "Cập nhật lúc",
  ],
  PHONE_REGISTRY: [
    "Số điện thoại", "Phân loại", "Xác minh", "Trạng thái", "Lần đầu thấy",
    "Lần gần nhất", "Tổng lần gửi form", "Booking xác nhận", "Tổng tiền đã thu",
    "Tuyến gần nhất/ưa dùng", "Spam strikes", "Risk score gần nhất", "Lý do chặn",
    "Ghi chú nội bộ", "Tên gần nhất", "Cập nhật lúc",
  ],
  SPAM_QUARANTINE: [
    "Mã Request", "Thời gian", "Họ tên", "Số điện thoại", "Email", "Tuyến", "Ngày đi",
    "Số khách", "Điểm đón", "Điểm trả", "Ghi chú", "Nguồn", "Trang", "Spam score",
    "Lý do", "Phân loại SĐT", "Kết quả tự động", "Đã duyệt?", "Người duyệt",
    "Ghi chú duyệt", "Payload hash",
  ],
  REQUEST_LOG: [
    "Thời gian", "Mã Request", "Số điện thoại", "Payload hash", "Kết quả", "Spam score",
    "Lý do", "Nguồn", "Trang", "Tên khách", "Client request ID",
  ],
  BOOKINGS: [
    "Booking ID", "Lead ID", "Tạo lúc", "Ngày đi", "Họ tên", "Số điện thoại", "Tuyến",
    "Số khách", "Điểm đón", "Điểm trả", "Trạng thái booking", "Giá/người",
    "Tổng tiền trước giảm", "Giảm giá", "Thành tiền", "Đã thu", "Còn phải thu",
    "Trạng thái thanh toán", "Nhân viên", "Ghi chú", "Cập nhật lúc",
  ],
  PAYMENTS: [
    "Payment ID", "Booking ID", "Thời gian giao dịch", "Loại giao dịch", "Số tiền",
    "Phương thức", "Mã tham chiếu", "Số điện thoại", "Họ tên", "Nhân viên",
    "Ghi chú", "Tạo lúc",
  ],
  AUDIT_LOG: [
    "Thời gian", "Sheet", "Ô", "Đối tượng", "Giá trị cũ", "Giá trị mới",
    "Người thao tác", "Hành động",
  ],
  ARCHIVE_INDEX: [
    "Thời gian archive", "Spreadsheet ID", "Tên file", "URL", "Từ ngày", "Đến ngày",
    "Số Lead", "Số Request", "Lý do",
  ],
  CONFIG: ["Khóa", "Giá trị", "Mô tả"],
};

function ensureSystemSheets(ss) {
  if (!ss.getSheetByName(APP.SHEETS.LEADS_RAW)) setupSystemForSpreadsheet(ss);
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
  sheet.getRange(1, 1, 1, headers.length)
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

function columnBodyRange(sheet, column) {
  return sheet.getRange(2, column, Math.max(1, sheet.getMaxRows() - 1), 1);
}

function setupLeadFormatting(sheet) {
  if (!sheet) return;
  [185, 155, 170, 130, 180, 170, 110, 90, 190, 190, 220, 110, 130, 155, 150, 220, 130, 130, 90, 110, 240, 100, 100, 220, 190, 155]
    .forEach(function (width, index) { sheet.setColumnWidth(index + 1, width); });
  columnBodyRange(sheet, 1).setNumberFormat("@");
  columnBodyRange(sheet, 4).setNumberFormat("@");
  columnBodyRange(sheet, 2).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  columnBodyRange(sheet, 26).setNumberFormat("dd/MM/yyyy HH:mm:ss");

  columnBodyRange(sheet, 14).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["Mới", "Đã gọi", "Đã xác nhận", "Hẹn gọi lại", "Không liên hệ được", "Hủy"], true)
      .setAllowInvalid(false)
      .build(),
  );

  const range = columnBodyRange(sheet, 14);
  sheet.setConditionalFormatRules([
    conditionalTextRule(range, "Mới", "#FFF2C9", "#B71F1F"),
    conditionalTextRule(range, "Đã gọi", "#D4EAF7", "#0C5460"),
    conditionalTextRule(range, "Đã xác nhận", "#D1E7DD", "#0F5132"),
    conditionalTextRule(range, "Hẹn gọi lại", "#E8DAEF", "#4A235A"),
    conditionalTextRule(range, "Không liên hệ được", "#FFE5D0", "#A04000"),
    conditionalTextRule(range, "Hủy", "#E2E3E5", "#383D41"),
  ]);
}

function setupPhoneRegistryFormatting(sheet) {
  if (!sheet) return;
  columnBodyRange(sheet, 1).setNumberFormat("@");
  columnBodyRange(sheet, 5).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  columnBodyRange(sheet, 6).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  columnBodyRange(sheet, 9).setNumberFormat("#,##0 [$₫-vi-VN]");
  columnBodyRange(sheet, 16).setNumberFormat("dd/MM/yyyy HH:mm:ss");

  columnBodyRange(sheet, 2).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["MỚI", "KHÁCH_QUEN", "VIP", "SUSPECT", "SPAM", "BLOCKED"], true)
      .setAllowInvalid(false).build(),
  );
  columnBodyRange(sheet, 3).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["CHƯA_XÁC_MINH", "ĐÃ_XÁC_MINH", "SAI_SỐ", "KHÔNG_NGHE", "BỠN_CỢT"], true)
      .setAllowInvalid(false).build(),
  );
  columnBodyRange(sheet, 4).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["ACTIVE", "WATCH", "BLOCKED"], true)
      .setAllowInvalid(false).build(),
  );
}

function setupBookingFormatting(sheet) {
  if (!sheet) return;
  columnBodyRange(sheet, 1).setNumberFormat("@");
  columnBodyRange(sheet, 2).setNumberFormat("@");
  columnBodyRange(sheet, 6).setNumberFormat("@");
  columnBodyRange(sheet, 3).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  for (let col = 12; col <= 17; col++) columnBodyRange(sheet, col).setNumberFormat("#,##0 [$₫-vi-VN]");
  columnBodyRange(sheet, 21).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  columnBodyRange(sheet, 11).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["MỚI", "ĐÃ XÁC NHẬN", "ĐÃ ĐI", "HỦY", "HOÀN TIỀN"], true)
      .setAllowInvalid(false).build(),
  );
}

function setupPaymentFormatting(sheet) {
  if (!sheet) return;
  columnBodyRange(sheet, 1).setNumberFormat("@");
  columnBodyRange(sheet, 2).setNumberFormat("@");
  columnBodyRange(sheet, 8).setNumberFormat("@");
  columnBodyRange(sheet, 3).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  columnBodyRange(sheet, 5).setNumberFormat("#,##0 [$₫-vi-VN]");
  columnBodyRange(sheet, 12).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  columnBodyRange(sheet, 4).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(["PAYMENT", "REFUND"], true).setAllowInvalid(false).build(),
  );
  columnBodyRange(sheet, 6).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(["TIỀN MẶT", "CHUYỂN KHOẢN", "QR", "KHÁC"], true).setAllowInvalid(true).build(),
  );
}

function conditionalTextRule(range, text, background, fontColor) {
  return SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(text).setBackground(background).setFontColor(fontColor).setRanges([range]).build();
}

function setupConfigDefaults(ss) {
  const sheet = ss.getSheetByName(APP.SHEETS.CONFIG);
  const existing = {};
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues().forEach(function (row) {
      existing[String(row[0])] = true;
    });
  }
  [
    ["SPAM_QUARANTINE_SCORE", APP.SPAM.QUARANTINE_SCORE, "Từ điểm này request vào vùng kiểm tra"],
    ["SPAM_HARD_BLOCK_SCORE", APP.SPAM.HARD_BLOCK_SCORE, "Từ điểm này request bị chặn mềm"],
    ["MAX_PHONE_15M", APP.SPAM.MAX_PER_WINDOW, "Tối đa request cùng SĐT trong 15 phút"],
    ["MAX_PHONE_DAY", APP.SPAM.MAX_PER_DAY, "Tối đa request cùng SĐT mỗi ngày"],
    ["ROLLOVER_RATIO", APP.BACKUP.ROLLOVER_RATIO, "Tỷ lệ cell để tự tạo database mới"],
    ["BACKUP_RETENTION_DAYS", APP.BACKUP.DAILY_RETENTION_DAYS, "Số ngày giữ daily backup"],
  ].forEach(function (row) { if (!existing[String(row[0])]) sheet.appendRow(row); });
}

function setupLeadsView(ss) {
  let sheet = ss.getSheetByName(APP.SHEETS.LEADS_VIEW);
  if (!sheet) sheet = ss.insertSheet(APP.SHEETS.LEADS_VIEW, 0);
  sheet.clear();
  sheet.getRange("A1").setFormula('=QUERY(LEADS_RAW!A:Z,"select * where A is not null order by B desc",1)');
  sheet.setFrozenRows(1);
  sheet.getRange("A1:Z1").setFontWeight("bold").setBackground("#1F4E5F").setFontColor("#FFFFFF");
  columnBodyRange(sheet, 1).setNumberFormat("@");
  columnBodyRange(sheet, 4).setNumberFormat("@");
  columnBodyRange(sheet, 2).setNumberFormat("dd/MM/yyyy HH:mm:ss");
}

function refreshOperationalViews(ss) {
  const view = ss.getSheetByName(APP.SHEETS.LEADS_VIEW);
  if (!view || !view.getRange("A1").getFormula()) setupLeadsView(ss);
}

function writeLeadRaw(ss, payload, leadId, phoneProfile, risk, now) {
  const sheet = ss.getSheetByName(APP.SHEETS.LEADS_RAW);
  sheet.appendRow([
    leadId, now, payload.name, payload.phone, payload.email, payload.route, payload.travelDate,
    payload.passengers, payload.pickup, payload.dropoff, payload.note, payload.source, payload.page,
    "Mới", "", "", phoneProfile.customerType || "MỚI",
    phoneProfile.verification || "CHƯA_XÁC_MINH", risk.score,
    risk.score >= APP.SPAM.QUARANTINE_SCORE ? "CẦN KIỂM TRA" : "OK",
    risk.reasons.join(" | "), risk.stats.samePhoneWindow, risk.stats.samePhoneDay,
    payload.payloadHash, "", now,
  ]);
  const row = sheet.getLastRow();
  sheet.getRange(row, 1).setNumberFormat("@");
  sheet.getRange(row, 4).setNumberFormat("@");
}

function writeSpamQuarantine(ss, payload, phoneProfile, risk, outcome, now) {
  const sheet = ss.getSheetByName(APP.SHEETS.SPAM_QUARANTINE);
  sheet.appendRow([
    payload.requestId, now, payload.name, payload.phone, payload.email, payload.route,
    payload.travelDate, payload.passengers, payload.pickup, payload.dropoff, payload.note,
    payload.source, payload.page, risk.score, risk.reasons.join(" | "),
    phoneProfile.customerType || "MỚI", outcome, "CHƯA", "", "", payload.payloadHash,
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
    if (col === 14 && String(e.value || "") === "Đã xác nhận") ensureBookingFromLeadRow(getSpreadsheet(), row);
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
  const audit = getSpreadsheet().getSheetByName(APP.SHEETS.AUDIT_LOG);
  let user = "unknown";
  try { user = Session.getActiveUser().getEmail() || "unknown"; } catch (error) {}
  audit.appendRow([
    new Date(), e.range.getSheet().getName(), e.range.getA1Notation(), objectId,
    e.oldValue === undefined ? "" : e.oldValue,
    e.value === undefined ? "" : e.value,
    user, action,
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
    bookingId, leadId, new Date(), values[6], values[2], values[3], values[5],
    Number(values[7]) || 1, values[8], values[9], "ĐÃ XÁC NHẬN", 0, 0, 0, 0, 0, 0,
    "CHƯA THU", values[14], values[15], new Date(),
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
  sheet.getRange(row, 16).setFormula(
    '=IFERROR(SUMIFS(PAYMENTS!E:E,PAYMENTS!B:B,A' + row + ',PAYMENTS!D:D,"PAYMENT")-' +
    'SUMIFS(PAYMENTS!E:E,PAYMENTS!B:B,A' + row + ',PAYMENTS!D:D,"REFUND"),0)',
  );
  sheet.getRange(row, 17).setFormula("=MAX(0,O" + row + "-P" + row + ")");
  sheet.getRange(row, 18).setFormula(
    '=IF(P' + row + '<=0,"CHƯA THU",IF(P' + row + '<O' + row + ',"ĐÃ CỌC","ĐÃ THANH TOÁN"))',
  );
}

function updateRegistryBookingCount(ss, phone, increment) {
  const record = getPhoneRegistryRecord(ss, phone);
  if (!record) return;
  const sheet = ss.getSheetByName(APP.SHEETS.PHONE_REGISTRY);
  const count = (record.confirmedBookings || 0) + (increment || 0);
  let customerType = String(record.customerType || "MỚI");
  if (!["SPAM", "BLOCKED", "SUSPECT"].includes(customerType)) {
    if (count >= 10) customerType = "VIP";
    else if (count >= 3) customerType = "KHÁCH_QUEN";
  }
  sheet.getRange(record.row, 2).setValue(customerType);
  sheet.getRange(record.row, 8).setValue(count);
  sheet.getRange(record.row, 16).setValue(new Date());
}

function updateRegistryPaidTotal(ss, phone, signedAmount) {
  const record = getPhoneRegistryRecord(ss, phone);
  if (!record) return;
  const sheet = ss.getSheetByName(APP.SHEETS.PHONE_REGISTRY);
  const next = Math.max(0, (record.totalPaid || 0) + signedAmount);
  sheet.getRange(record.row, 9).setValue(next);
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
  SpreadsheetApp.getUi().alert("Booking đã sẵn sàng: " + ensureBookingFromLeadRow(ss, row));
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
  if (!isFinite(amount) || amount <= 0) { ui.alert("Số tiền không hợp lệ."); return; }

  const typePrompt = ui.prompt("Loại giao dịch", "Nhập PAYMENT hoặc REFUND:", ui.ButtonSet.OK_CANCEL);
  if (typePrompt.getSelectedButton() !== ui.Button.OK) return;
  const type = String(typePrompt.getResponseText() || "").trim().toUpperCase();
  if (!["PAYMENT", "REFUND"].includes(type)) { ui.alert("Loại giao dịch phải là PAYMENT hoặc REFUND."); return; }

  const methodPrompt = ui.prompt("Phương thức", "TIỀN MẶT / CHUYỂN KHOẢN / QR / KHÁC", ui.ButtonSet.OK_CANCEL);
  if (methodPrompt.getSelectedButton() !== ui.Button.OK) return;
  const method = sanitizeInput(methodPrompt.getResponseText(), 60) || "KHÁC";
  const phone = String(sheet.getRange(row, 6).getValue() || "");
  const name = String(sheet.getRange(row, 5).getValue() || "");
  const staff = String(sheet.getRange(row, 19).getValue() || "");

  const payments = ss.getSheetByName(APP.SHEETS.PAYMENTS);
  const paymentId = generateId("PAY", new Date());
  payments.appendRow([
    paymentId, bookingId, new Date(), type, amount, method, "", phone, name, staff, "", new Date(),
  ]);

  updateRegistryPaidTotal(ss, phone, type === "REFUND" ? -amount : amount);
  applyBookingFormulas(sheet, row);
  SpreadsheetApp.flush();
  refreshAccountingDaily(ss);
  refreshDashboard(ss);
  ui.alert("Đã ghi giao dịch " + paymentId + ".");
}
