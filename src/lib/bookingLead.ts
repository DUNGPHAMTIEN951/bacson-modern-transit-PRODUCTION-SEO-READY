import type { BookingLeadPayload, BookingApiResponse } from "@/types/booking";

/**
 * Chuẩn hóa số điện thoại Việt Nam về dạng 0xxxxxxxxx (10 chữ số)
 */
export function normalizeVietnamesePhone(raw: string): string {
  if (!raw) return "";
  let cleaned = raw.replace(/[\s.\-()]/g, "");
  if (cleaned.startsWith("+84")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("84") && cleaned.length === 11) {
    cleaned = "0" + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Kiểm tra định dạng số điện thoại Việt Nam hợp lệ
 * Chấp nhận các đầu số: 03, 05, 07, 08, 09 (10 chữ số)
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const normalized = normalizeVietnamesePhone(phone);
  const vnPhoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
  return vnPhoneRegex.test(normalized);
}

/**
 * Kiểm tra định dạng email (nếu có nhập)
 */
export function isValidEmail(email?: string): boolean {
  if (!email || email.trim() === "") return true; // Email là optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

const STORAGE_KEY_PHONE = "bs_last_lead_phone";
const STORAGE_KEY_TIME = "bs_last_lead_time";
const COOLDOWN_SECONDS = 30;

/**
 * Kiểm tra xem có đang bị trùng lặp submission trong thời gian ngắn không
 */
export function checkDuplicateSubmission(phone: string): {
  isDuplicate: boolean;
  remainingSeconds: number;
} {
  try {
    if (typeof window === "undefined") return { isDuplicate: false, remainingSeconds: 0 };

    const lastPhone = sessionStorage.getItem(STORAGE_KEY_PHONE);
    const lastTimeStr = sessionStorage.getItem(STORAGE_KEY_TIME);

    if (lastPhone && lastTimeStr) {
      const normalizedCurrent = normalizeVietnamesePhone(phone);
      const normalizedLast = normalizeVietnamesePhone(lastPhone);

      if (normalizedCurrent === normalizedLast) {
        const lastTime = parseInt(lastTimeStr, 10);
        const elapsed = (Date.now() - lastTime) / 1000;
        if (elapsed < COOLDOWN_SECONDS) {
          return {
            isDuplicate: true,
            remainingSeconds: Math.ceil(COOLDOWN_SECONDS - elapsed),
          };
        }
      }
    }
  } catch {
    // Ignore storage restrictions
  }
  return { isDuplicate: false, remainingSeconds: 0 };
}

/**
 * Lưu lịch sử submission gần nhất
 */
export function recordSubmission(phone: string) {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY_PHONE, normalizeVietnamesePhone(phone));
      sessionStorage.setItem(STORAGE_KEY_TIME, Date.now().toString());
    }
  } catch {
    // Ignore
  }
}

const DEFAULT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxBmUCJZMnZP_e7wxo6l2VucDoJhold8SNfAB7ANwL-VBOzJCOl4C8CokSXjo-_BLGvpw/exec";

/**
 * Gửi dữ liệu yêu cầu gọi lại / tư vấn đến Google Apps Script Web App
 */
export async function submitBookingLead(payload: BookingLeadPayload): Promise<BookingApiResponse> {
  const envEndpoint = import.meta.env.VITE_BOOKING_FORM_ENDPOINT;
  const endpoint = envEndpoint && !envEndpoint.includes("XXXXX") ? envEndpoint : DEFAULT_ENDPOINT;

  // 1. Kiểm tra cấu hình endpoint
  if (!endpoint || endpoint.trim() === "") {
    console.warn(
      "[BookingLead] VITE_BOOKING_FORM_ENDPOINT chưa được cấu hình. Xem docs/GOOGLE_SHEETS_LEADS_SETUP.md để thiết lập.",
    );
    return {
      success: false,
      message:
        "Hệ thống đang hoàn tất cấu hình kết nối. Vui lòng gọi trực tiếp hotline nhà xe để được hỗ trợ nhanh nhất!",
    };
  }

  // 2. Chống bot Spam qua Honeypot
  if (payload.honeypot && payload.honeypot.trim() !== "") {
    console.warn("[BookingLead] Spam bot detected via honeypot field.");
    return {
      success: false,
      message: "Yêu cầu không hợp lệ.",
    };
  }

  // 3. Chuẩn hóa & Validate dữ liệu cơ bản ở frontend
  const normalizedPhone = normalizeVietnamesePhone(payload.phone);
  if (!isValidVietnamesePhone(normalizedPhone)) {
    return {
      success: false,
      message: "Số điện thoại chưa đúng định dạng. Vui lòng kiểm tra lại (10 số).",
    };
  }

  if (payload.email && !isValidEmail(payload.email)) {
    return {
      success: false,
      message: "Email chưa đúng định dạng. Vui lòng kiểm tra lại hoặc để trống.",
    };
  }

  if (!payload.name || payload.name.trim().length < 2) {
    return {
      success: false,
      message: "Vui lòng nhập họ và tên của bạn.",
    };
  }

  if (!payload.consent) {
    return {
      success: false,
      message: "Vui lòng đồng ý để nhà xe liên hệ tư vấn.",
    };
  }

  // 4. Kiểm tra chống gửi trùng lặp liên tục
  const duplicateCheck = checkDuplicateSubmission(normalizedPhone);
  if (duplicateCheck.isDuplicate) {
    return {
      success: true,
      message: `Yêu cầu của bạn đã được tiếp nhận. Nhà xe sẽ liên hệ sớm nhất! (Vui lòng chờ ${duplicateCheck.remainingSeconds}s trước khi gửi lại)`,
    };
  }

  // 5. Chuẩn bị payload chuẩn gửi đi
  const formattedPayload = {
    name: payload.name.trim(),
    phone: normalizedPhone,
    email: payload.email?.trim() || "",
    route: payload.route || "Hà Nội → Sơn La",
    travelDate: payload.travelDate || "",
    passengers: Number(payload.passengers) || 1,
    pickup: payload.pickup?.trim() || "",
    dropoff: payload.dropoff?.trim() || "",
    note: payload.note?.trim() || "",
    source: payload.source || "website",
    page: payload.page || (typeof window !== "undefined" ? window.location.pathname : "/"),
    consent: true,
    honeypot: "",
    submittedAt: new Date().toISOString(),
  };

  // 6. Thực hiện HTTP POST với timeout 12 giây
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // text/plain giúp tránh CORS preflight phức tạp trên Google Apps Script
      },
      body: JSON.stringify(formattedPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.success) {
      recordSubmission(normalizedPhone);
      return {
        success: true,
        leadId: data.leadId,
        message: data.message || "Đã nhận yêu cầu thành công!",
      };
    } else {
      return {
        success: false,
        message:
          data.message || "Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi trực tiếp cho nhà xe.",
      };
    }
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        message:
          "Kết nối quá thời gian quy định (12s). Vui lòng thử lại hoặc gọi trực tiếp hotline.",
      };
    }

    console.error("[BookingLead Error]", error);
    return {
      success: false,
      message:
        "Chưa gửi được yêu cầu do sự cố mạng. Vui lòng thử lại hoặc gọi trực tiếp hotline nhà xe.",
    };
  }
}
