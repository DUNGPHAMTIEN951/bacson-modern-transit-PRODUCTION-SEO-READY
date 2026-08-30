/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - BẮC SƠN CƯỜNG NGUYỆT LEAD MANAGEMENT (MINI CRM)
 * =========================================================================
 *
 * Mô tả:
 *   Nhận yêu cầu gọi lại / đặt tư vấn online từ website qua HTTP POST JSON.
 *   Xác thực dữ liệu, chống spam, tạo mã ID duy nhất và ghi vào Google Sheets "LEADS".
 *
 * Hướng dẫn nhanh:
 *   1. Chạy hàm `setupSheet()` một lần để tự động tạo cấu trúc bảng và định dạng.
 *   2. Deploy dạng "Web App" với quyền truy cập "Anyone" (Bất kỳ ai).
 *   3. Lấy URL Web App và gắn vào file `.env` của website (`VITE_BOOKING_FORM_ENDPOINT`).
 */

// ── CẤU HÌNH CƠ BẢN ──
const CONFIG = {
  SHEET_NAME: "LEADS",
  ENABLE_EMAIL_NOTIFICATION: false, // Đổi thành true nếu muốn nhận email báo lead mới
  STAFF_EMAIL: "nhaxe.cuongnguyet@gmail.com", // Email nhận thông báo
};

/**
 * Lấy đối tượng Spreadsheet
 * Ưu tiên: Script Properties (SPREADSHEET_ID) -> Active Spreadsheet nếu gắn liền Sheet
 */
function getSpreadsheet() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const spreadsheetId = scriptProperties.getProperty("SPREADSHEET_ID");

  if (spreadsheetId && spreadsheetId.trim() !== "") {
    return SpreadsheetApp.openById(spreadsheetId.trim());
  }

  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    throw new Error("Chưa cấu hình SPREADSHEET_ID trong Script Properties.");
  }
}

/**
 * Xử lý HTTP GET (Health check / Test endpoint)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "active",
      service: "Bac Son Cuong Nguyet Booking Lead API",
      timestamp: new Date().toISOString(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Xử lý HTTP POST - Nhận dữ liệu Lead từ Website
 */
function doPost(e) {
  const lock = LockService.getScriptLock();

  // Chờ lock tối đa 10 giây để tránh race condition khi nhiều khách gửi cùng lúc
  const successLock = lock.tryLock(10000);
  if (!successLock) {
    return createJsonResponse({
      success: false,
      message: "Hệ thống đang bận xử lý yêu cầu khác, vui lòng thử lại sau vài giây.",
    });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        success: false,
        message: "Không tìm thấy nội dung gửi lên (Empty payload).",
      });
    }

    // Parse JSON
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({
        success: false,
        message: "Dữ liệu JSON không hợp lệ.",
      });
    }

    // 1. Chống Bot Spam qua Honeypot
    if (data.honeypot && String(data.honeypot).trim() !== "") {
      return createJsonResponse({
        success: false,
        message: "Yêu cầu bị từ chối do phát hiện spam bot.",
      });
    }

    // 2. Validate các trường bắt buộc
    const name = sanitizeInput(data.name, 100);
    const phone = sanitizePhone(data.phone);
    const route = sanitizeInput(data.route || "Hà Nội → Sơn La", 100);
    const consent = Boolean(data.consent);

    if (!name || name.length < 2) {
      return createJsonResponse({
        success: false,
        message: "Vui lòng nhập họ và tên hợp lệ.",
      });
    }

    if (!phone || !isValidVNPhone(phone)) {
      return createJsonResponse({
        success: false,
        message: "Số điện thoại không hợp lệ (cần 10 chữ số).",
      });
    }

    if (!consent) {
      return createJsonResponse({
        success: false,
        message: "Chưa đồng ý điều khoản liên hệ.",
      });
    }

    // 3. Xử lý các trường phụ
    const email = sanitizeInput(data.email, 100);
    if (email && !isValidEmail(email)) {
      return createJsonResponse({
        success: false,
        message: "Định dạng email không hợp lệ.",
      });
    }

    const travelDate = sanitizeInput(data.travelDate, 50);
    const passengers = parseInt(data.passengers, 10) || 1;
    const pickup = sanitizeInput(data.pickup, 200);
    const dropoff = sanitizeInput(data.dropoff, 200);
    const note = sanitizeInput(data.note, 500);
    const source = sanitizeInput(data.source || "website", 50);
    const page = sanitizeInput(data.page || "/", 100);

    // 4. Mở Sheet LEADS
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = setupSheet();
    }

    // 5. Tạo Lead ID và Timestamp
    const now = new Date();
    const leadId = generateLeadId(now, sheet);
    const formattedTimestamp = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    // 6. Ghi dòng dữ liệu vào Sheet
    const newRow = [
      leadId, // A: ID
      formattedTimestamp, // B: Thời gian
      name, // C: Họ tên
      phone, // D: Số điện thoại (dạng text)
      email, // E: Email
      route, // F: Tuyến đi
      travelDate, // G: Ngày đi
      passengers, // H: Số hành khách
      pickup, // I: Điểm đón mong muốn
      dropoff, // J: Điểm trả mong muốn
      note, // K: Ghi chú
      source, // L: Nguồn
      page, // M: Trang gửi form
      "Mới", // N: Trạng thái (Default)
      "", // O: Nhân viên phụ trách
      "", // P: Ghi chú tư vấn
    ];

    sheet.appendRow(newRow);

    // Đảm bảo cột SĐT lưu dạng Text (tránh mất số 0 đầu)
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat("@"); // ID dạng Text
    sheet.getRange(lastRow, 4).setNumberFormat("@"); // SĐT dạng Text

    // 7. Gửi email thông báo nội bộ nếu bật cấu hình
    if (CONFIG.ENABLE_EMAIL_NOTIFICATION && CONFIG.STAFF_EMAIL) {
      sendStaffNotificationEmail({
        leadId,
        time: formattedTimestamp,
        name,
        phone,
        email,
        route,
        travelDate,
        passengers,
        pickup,
        dropoff,
        note,
        source,
      });
    }

    return createJsonResponse({
      success: true,
      leadId: leadId,
      message: "Đã nhận yêu cầu gọi lại thành công! Nhà xe sẽ liên hệ trong ít phút.",
    });
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return createJsonResponse({
      success: false,
      message: "Lỗi hệ thống khi lưu yêu cầu: " + error.toString(),
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Sinh mã Lead ID duy nhất: LD-YYYYMMDD-XXXX
 */
function generateLeadId(date, sheet) {
  const dateStr = Utilities.formatDate(date, "Asia/Ho_Chi_Minh", "yyyyMMdd");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 chữ số ngẫu nhiên
  return "LD-" + dateStr + "-" + randomSuffix;
}

/**
 * Làm sạch chuỗi văn bản đầu vào
 */
function sanitizeInput(str, maxLength) {
  if (!str) return "";
  let clean = String(str)
    .replace(/<[^>]*>?/gm, "") // Bỏ HTML tags
    .replace(/[\r\n\t]+/g, " ") // Chuẩn hóa xuống dòng
    .trim();
  if (maxLength && clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }
  return clean;
}

/**
 * Chuẩn hóa số điện thoại Việt Nam
 */
function sanitizePhone(phone) {
  if (!phone) return "";
  let clean = String(phone).replace(/[\s.\-()]/g, "");
  if (clean.startsWith("+84")) {
    clean = "0" + clean.slice(3);
  } else if (clean.startsWith("84") && clean.length === 11) {
    clean = "0" + clean.slice(2);
  }
  return clean;
}

/**
 * Kiểm tra định dạng số điện thoại Việt Nam
 */
function isValidVNPhone(phone) {
  const regex = /^(03|05|07|08|09)[0-9]{8}$/;
  return regex.test(phone);
}

/**
 * Kiểm tra định dạng email
 */
function isValidEmail(email) {
  if (!email || email.trim() === "") return true;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Helper tạo JSON Response chuẩn
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Gửi email thông báo cho điều hành nhà xe
 */
function sendStaffNotificationEmail(lead) {
  try {
    const subject =
      "🔥 [KHÁCH MỚI CẦN GỌI LẠI] " + lead.name + " (" + lead.phone + ") – " + lead.route;

    const body =
      "KÍNH GỬI ĐIỀU HÀNH NHÀ XE BẮC SƠN CƯỜNG NGUYỆT,\n\n" +
      "Có khách hàng vừa để lại thông tin cần tư vấn trên website:\n\n" +
      "--------------------------------------------------\n" +
      "Mã yêu cầu:    " +
      lead.leadId +
      "\n" +
      "Thời gian:     " +
      lead.time +
      "\n" +
      "Họ và tên:     " +
      lead.name +
      "\n" +
      "Số điện thoại: " +
      lead.phone +
      "\n" +
      "Email:         " +
      (lead.email || "Không có") +
      "\n" +
      "Tuyến xe:      " +
      lead.route +
      "\n" +
      "Ngày đi:       " +
      (lead.travelDate || "Chưa xác định") +
      "\n" +
      "Số khách:      " +
      lead.passengers +
      " người\n" +
      "Điểm đón:      " +
      (lead.pickup || "Chưa ghi") +
      "\n" +
      "Điểm trả:      " +
      (lead.dropoff || "Chưa ghi") +
      "\n" +
      "Ghi chú:       " +
      (lead.note || "Không có") +
      "\n" +
      "Nguồn:         " +
      lead.source +
      "\n" +
      "--------------------------------------------------\n\n" +
      "👉 Vui lòng mở Google Sheets và gọi điện hỗ trợ khách sớm nhất có thể.\n\n" +
      "Trân trọng,\n" +
      "Hệ thống Website Tự động";

    MailApp.sendEmail(CONFIG.STAFF_EMAIL, subject, body);
  } catch (err) {
    Logger.log("Failed to send staff email: " + err.toString());
  }
}

/**
 * =========================================================================
 * SETUP HELPER - CHẠY HÀM NÀY 1 LẦN KHI KHỞI TẠO BẢNG TÍNH
 * =========================================================================
 */
function setupSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // 1. Tiêu đề 16 cột
  const headers = [
    "Mã yêu cầu (ID)",
    "Thời gian",
    "Họ tên khách",
    "Số điện thoại",
    "Email",
    "Tuyến đi",
    "Ngày đi",
    "Số khách",
    "Điểm đón mong muốn",
    "Điểm trả mong muốn",
    "Ghi chú khách hàng",
    "Nguồn gửi",
    "Trang gửi form",
    "Trạng thái",
    "Nhân viên phụ trách",
    "Ghi chú tư vấn",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // 2. Định dạng Header
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setFontWeight("bold")
    .setBackground("#3A211B")
    .setFontColor("#FFFFFF")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);

  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1); // Cố định dòng 1

  // 3. Đặt độ rộng các cột tối ưu
  sheet.setColumnWidth(1, 150); // ID
  sheet.setColumnWidth(2, 140); // Thời gian
  sheet.setColumnWidth(3, 170); // Họ tên
  sheet.setColumnWidth(4, 130); // SĐT
  sheet.setColumnWidth(5, 180); // Email
  sheet.setColumnWidth(6, 170); // Tuyến đi
  sheet.setColumnWidth(7, 110); // Ngày đi
  sheet.setColumnWidth(8, 90); // Số khách
  sheet.setColumnWidth(9, 180); // Điểm đón
  sheet.setColumnWidth(10, 180); // Điểm trả
  sheet.setColumnWidth(11, 220); // Ghi chú
  sheet.setColumnWidth(12, 110); // Nguồn
  sheet.setColumnWidth(13, 110); // Trang
  sheet.setColumnWidth(14, 150); // Trạng thái
  sheet.setColumnWidth(15, 150); // NV phụ trách
  sheet.setColumnWidth(16, 200); // Ghi chú tư vấn

  // 4. Định dạng cột SĐT thành Plain Text để không mất số 0
  sheet.getRange("D2:D").setNumberFormat("@");
  sheet.getRange("A2:A").setNumberFormat("@");

  // 5. Cấu hình Dropdown Data Validation & Conditional Formatting
  setupSheetFormatting(sheet);

  Logger.log("✅ Đã hoàn tất khởi tạo sheet LEADS thành công!");
  return sheet;
}

/**
 * Cấu hình Dropdown Trạng Thái & Màu Sắc Tự Động
 */
function setupSheetFormatting(sheet) {
  if (!sheet) {
    const ss = getSpreadsheet();
    sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  }
  if (!sheet) return;

  // 1. Data Validation cho Cột N (Trạng thái)
  const statusValues = ["Mới", "Đã gọi", "Đã xác nhận", "Hẹn gọi lại", "Không liên hệ được", "Hủy"];

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusValues, true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange("N2:N5000").setDataValidation(statusRule);

  // 2. Conditional Formatting (Tô màu tự động theo trạng thái)
  const range = sheet.getRange("N2:N5000");

  const ruleNew = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Mới")
    .setBackground("#FFF2C9") // Vàng nhạt
    .setFontColor("#B71F1F")
    .setRanges([range])
    .build();

  const ruleCalled = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Đã gọi")
    .setBackground("#D4EAF7") // Xanh dương nhạt
    .setFontColor("#0C5460")
    .setRanges([range])
    .build();

  const ruleConfirmed = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Đã xác nhận")
    .setBackground("#D1E7DD") // Xanh lá nhạt
    .setFontColor("#0F5132")
    .setRanges([range])
    .build();

  const ruleCallback = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Hẹn gọi lại")
    .setBackground("#E8DAEF") // Tím nhạt
    .setFontColor("#4A235A")
    .setRanges([range])
    .build();

  const ruleFailed = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Không liên hệ được")
    .setBackground("#FFE5D0") // Cam nhạt
    .setFontColor("#A04000")
    .setRanges([range])
    .build();

  const ruleCancelled = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Hủy")
    .setBackground("#E2E3E5") // Xám nhạt
    .setFontColor("#383D41")
    .setRanges([range])
    .build();

  sheet.setConditionalFormatRules([
    ruleNew,
    ruleCalled,
    ruleConfirmed,
    ruleCallback,
    ruleFailed,
    ruleCancelled,
  ]);

  Logger.log("✅ Đã thiết lập Dropdown và Tô màu Trạng thái thành công!");
}
