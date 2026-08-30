/**
 * BẮC SƠN CƯỜNG NGUYỆT — BOOKING CRM / ANTI-SPAM API v2
 *
 * Các file .gs trong thư mục google-apps-script/ cùng thuộc một Apps Script project.
 * Sau khi đồng bộ mã nguồn sang Apps Script, chạy setupSystem() một lần rồi deploy Web App.
 */

const APP = {
  VERSION: "2.0.0",
  TZ: "Asia/Ho_Chi_Minh",
  STAFF_EMAIL: "nhaxe.cuongnguyet@gmail.com",
  ENABLE_EMAIL_NOTIFICATION: false,
  SHEETS: {
    LEADS_RAW: "LEADS_RAW",
    LEADS_VIEW: "LEADS_VIEW",
    PHONE_REGISTRY: "PHONE_REGISTRY",
    SPAM_QUARANTINE: "SPAM_QUARANTINE",
    REQUEST_LOG: "REQUEST_LOG",
    BOOKINGS: "BOOKINGS",
    PAYMENTS: "PAYMENTS",
    ACCOUNTING_DAILY: "ACCOUNTING_DAILY",
    DASHBOARD: "DASHBOARD",
    AUDIT_LOG: "AUDIT_LOG",
    ARCHIVE_INDEX: "ARCHIVE_INDEX",
    CONFIG: "CONFIG",
  },
  SPAM: {
    QUARANTINE_SCORE: 50,
    HARD_BLOCK_SCORE: 85,
    WINDOW_MINUTES: 15,
    MAX_PER_WINDOW: 3,
    MAX_PER_DAY: 8,
    LOG_SCAN_ROWS: 3000,
  },
  BACKUP: {
    GOOGLE_SHEETS_CELL_LIMIT: 10000000,
    ROLLOVER_RATIO: 0.72,
    DAILY_RETENTION_DAYS: 30,
    BACKUP_FOLDER_NAME: "BSCN_DATABASE_BACKUPS",
  },
};

function getSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty("ACTIVE_SPREADSHEET_ID") || props.getProperty("SPREADSHEET_ID");

  if (spreadsheetId && String(spreadsheetId).trim()) {
    return SpreadsheetApp.openById(String(spreadsheetId).trim());
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error("Chưa cấu hình SPREADSHEET_ID hoặc ACTIVE_SPREADSHEET_ID trong Script Properties.");
}

function doGet() {
  let spreadsheetId = "";
  try {
    spreadsheetId = getSpreadsheet().getId();
  } catch (error) {
    spreadsheetId = "not-configured";
  }

  return createJsonResponse({
    status: "active",
    service: "Bac Son Cuong Nguyet CRM API",
    version: APP.VERSION,
    spreadsheetId: spreadsheetId,
    timestamp: new Date().toISOString(),
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return createJsonResponse({
      success: false,
      message: "Hệ thống đang xử lý nhiều yêu cầu. Vui lòng thử lại sau ít giây.",
    });
  }

  try {
    const now = new Date();
    const ss = getSpreadsheet();
    ensureSystemSheets(ss);

    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, message: "Không tìm thấy dữ liệu gửi lên." });
    }

    let raw;
    try {
      raw = JSON.parse(e.postData.contents);
    } catch (error) {
      return createJsonResponse({ success: false, message: "Dữ liệu gửi lên không hợp lệ." });
    }

    const requestId = generateId("RQ", now);
    const payload = normalizeLeadPayload(raw, requestId, now);
    const validation = validateLeadPayload(payload);

    if (!validation.ok) {
      writeRequestLog(ss, {
        now: now,
        requestId: requestId,
        phone: payload.phone,
        payloadHash: payload.payloadHash,
        outcome: "INVALID",
        score: 0,
        reasons: validation.reason,
        source: payload.source,
        page: payload.page,
      });
      return createJsonResponse({ success: false, message: validation.message });
    }

    const registry = getPhoneRegistryRecord(ss, payload.phone);
    const risk = analyzeSubmission(ss, payload, registry, now);
    const phoneProfile = upsertPhoneRegistry(ss, payload, registry, risk, now);

    let outcome = "ACCEPTED";
    if (risk.hardBlock || risk.score >= APP.SPAM.HARD_BLOCK_SCORE) {
      outcome = "BLOCKED";
    } else if (risk.score >= APP.SPAM.QUARANTINE_SCORE) {
      outcome = "QUARANTINED";
    }

    writeRequestLog(ss, {
      now: now,
      requestId: requestId,
      phone: payload.phone,
      payloadHash: payload.payloadHash,
      outcome: outcome,
      score: risk.score,
      reasons: risk.reasons.join(" | "),
      source: payload.source,
      page: payload.page,
    });

    if (outcome !== "ACCEPTED") {
      writeSpamQuarantine(ss, payload, phoneProfile, risk, outcome, now);
      refreshOperationalViews(ss);

      // Soft-accept để người phá không biết chính xác rule nào đã chặn.
      return createJsonResponse({
        success: true,
        leadId: requestId,
        message: "Đã nhận yêu cầu. Nhà xe sẽ kiểm tra thông tin và liên hệ khi phù hợp.",
      });
    }

    const leadId = generateId("LD", now);
    writeLeadRaw(ss, payload, leadId, phoneProfile, risk, now);
    refreshOperationalViews(ss);

    if (APP.ENABLE_EMAIL_NOTIFICATION && APP.STAFF_EMAIL) {
      sendStaffNotificationEmail({
        leadId: leadId,
        time: formatDateTime(now),
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        route: payload.route,
        travelDate: payload.travelDate,
        passengers: payload.passengers,
        pickup: payload.pickup,
        dropoff: payload.dropoff,
        note: payload.note,
        source: payload.source,
      });
    }

    return createJsonResponse({
      success: true,
      leadId: leadId,
      message: "Đã nhận yêu cầu thành công! Nhà xe sẽ liên hệ trong thời gian sớm nhất.",
    });
  } catch (error) {
    Logger.log("doPost error: " + error.stack);
    return createJsonResponse({
      success: false,
      message: "Hệ thống tạm thời chưa lưu được yêu cầu. Vui lòng gọi trực tiếp hotline nhà xe.",
    });
  } finally {
    lock.releaseLock();
  }
}

function normalizeLeadPayload(raw, requestId, now) {
  const name = sanitizeInput(raw.name, 120);
  const phone = sanitizePhone(raw.phone);
  const email = sanitizeInput(raw.email, 160);
  const route = sanitizeInput(raw.route || "Hà Nội → Sơn La", 120);
  const travelDate = sanitizeInput(raw.travelDate, 50);
  const passengers = Math.max(1, Math.min(50, parseInt(raw.passengers, 10) || 1));
  const pickup = sanitizeInput(raw.pickup, 220);
  const dropoff = sanitizeInput(raw.dropoff, 220);
  const note = sanitizeInput(raw.note, 700);
  const source = sanitizeInput(raw.source || "website", 80);
  const page = sanitizeInput(raw.page || "/", 180);
  const submittedAt = sanitizeInput(raw.submittedAt, 80) || now.toISOString();
  const formStartedAt = sanitizeInput(raw.formStartedAt, 80);
  const clientRequestId = sanitizeInput(raw.clientRequestId, 100);

  const hashInput = [
    phone,
    name.toLowerCase(),
    route.toLowerCase(),
    travelDate,
    pickup.toLowerCase(),
    dropoff.toLowerCase(),
    note.toLowerCase(),
  ].join("|");

  return {
    requestId: requestId,
    name: name,
    phone: phone,
    email: email,
    route: route,
    travelDate: travelDate,
    passengers: passengers,
    pickup: pickup,
    dropoff: dropoff,
    note: note,
    source: source,
    page: page,
    consent: Boolean(raw.consent),
    honeypot: sanitizeInput(raw.honeypot, 200),
    submittedAt: submittedAt,
    formStartedAt: formStartedAt,
    clientRequestId: clientRequestId,
    payloadHash: sha256Hex(hashInput),
  };
}

function validateLeadPayload(payload) {
  if (!payload.name || payload.name.length < 2) {
    return { ok: false, reason: "INVALID_NAME", message: "Vui lòng nhập họ và tên hợp lệ." };
  }
  if (!payload.phone || !isValidVNPhone(payload.phone)) {
    return {
      ok: false,
      reason: "INVALID_PHONE_FORMAT",
      message: "Số điện thoại chưa đúng định dạng Việt Nam (10 số).",
    };
  }
  if (payload.email && !isValidEmail(payload.email)) {
    return { ok: false, reason: "INVALID_EMAIL", message: "Email chưa đúng định dạng." };
  }
  if (!payload.consent) {
    return { ok: false, reason: "NO_CONSENT", message: "Vui lòng đồng ý để nhà xe liên hệ." };
  }
  return { ok: true, reason: "", message: "" };
}

function setupSystem() {
  const ss = getSpreadsheet();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty("ACTIVE_SPREADSHEET_ID")) {
    props.setProperty("ACTIVE_SPREADSHEET_ID", ss.getId());
  }

  setupSystemForSpreadsheet(ss);
  refreshAccountingDaily(ss);
  refreshDashboard(ss);
  Logger.log("✅ CRM v" + APP.VERSION + " đã được khởi tạo: " + ss.getUrl());
  return ss.getUrl();
}

// Giữ tương thích với hướng dẫn / phiên bản cũ.
function setupSheet() {
  setupSystem();
  return getSpreadsheet().getSheetByName(APP.SHEETS.LEADS_RAW);
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🚍 BSCN CRM")
    .addItem("Khởi tạo / nâng cấp hệ thống", "setupSystem")
    .addItem("Làm mới Dashboard & Kế toán", "refreshAllReports")
    .addSeparator()
    .addItem("Tạo Booking từ Lead đang chọn", "createBookingFromSelectedLead")
    .addItem("Ghi khoản thu cho Booking đang chọn", "recordPaymentForSelectedBooking")
    .addSeparator()
    .addItem("Backup ngay", "createDailyBackup")
    .addItem("Kiểm tra dung lượng / rollover", "checkAndRolloverDatabase")
    .addItem("Cài trigger bảo trì tự động", "installMaintenanceTriggers")
    .addToUi();
}

function onEdit(e) {
  if (!e || !e.range) return;
  try {
    handleCrmEdit(e);
  } catch (error) {
    Logger.log("onEdit error: " + error.toString());
  }
}

function refreshAllReports() {
  const ss = getSpreadsheet();
  refreshAccountingDaily(ss);
  refreshDashboard(ss);
  refreshOperationalViews(ss);
  SpreadsheetApp.getActive().toast("Đã làm mới Dashboard, kế toán và bảng hiển thị.", "BSCN CRM", 4);
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function sanitizeInput(value, maxLength) {
  if (value === null || value === undefined) return "";
  let clean = String(value)
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/^[=+@]+/, "'") // giảm rủi ro formula injection khi ghi vào Sheet
    .trim();
  if (maxLength && clean.length > maxLength) clean = clean.substring(0, maxLength);
  return clean;
}

function sanitizePhone(phone) {
  if (!phone) return "";
  let clean = String(phone).replace(/[\s.\-()]/g, "");
  if (clean.startsWith("+84")) clean = "0" + clean.slice(3);
  else if (clean.startsWith("84") && clean.length === 11) clean = "0" + clean.slice(2);
  return clean;
}

function isValidVNPhone(phone) {
  return /^(03|05|07|08|09)[0-9]{8}$/.test(phone);
}

function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function sha256Hex(text) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(text),
    Utilities.Charset.UTF_8,
  );
  return bytes
    .map(function (b) {
      const v = b < 0 ? b + 256 : b;
      return ("0" + v.toString(16)).slice(-2);
    })
    .join("");
}

function generateId(prefix, date) {
  const day = Utilities.formatDate(date || new Date(), APP.TZ, "yyyyMMdd");
  const time = Utilities.formatDate(date || new Date(), APP.TZ, "HHmmss");
  const random = Math.floor(1000 + Math.random() * 9000);
  return prefix + "-" + day + "-" + time + "-" + random;
}

function formatDateTime(date) {
  return Utilities.formatDate(date, APP.TZ, "dd/MM/yyyy HH:mm:ss");
}

function dateKey(date) {
  return Utilities.formatDate(date, APP.TZ, "yyyy-MM-dd");
}

function parseDateSafe(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  if (!value) return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function sendStaffNotificationEmail(lead) {
  try {
    const subject = "🔥 [KHÁCH MỚI] " + lead.name + " (" + lead.phone + ") – " + lead.route;
    const body = [
      "BẮC SƠN CƯỜNG NGUYỆT — KHÁCH CẦN TƯ VẤN",
      "",
      "Mã yêu cầu: " + lead.leadId,
      "Thời gian: " + lead.time,
      "Họ tên: " + lead.name,
      "SĐT: " + lead.phone,
      "Email: " + (lead.email || "Không có"),
      "Tuyến: " + lead.route,
      "Ngày đi: " + (lead.travelDate || "Chưa xác định"),
      "Số khách: " + lead.passengers,
      "Điểm đón: " + (lead.pickup || "Chưa ghi"),
      "Điểm trả: " + (lead.dropoff || "Chưa ghi"),
      "Ghi chú: " + (lead.note || "Không có"),
      "Nguồn: " + lead.source,
      "",
      "Vui lòng mở Google Sheets CRM để xử lý.",
    ].join("\n");
    MailApp.sendEmail(APP.STAFF_EMAIL, subject, body);
  } catch (error) {
    Logger.log("sendStaffNotificationEmail error: " + error.toString());
  }
}
