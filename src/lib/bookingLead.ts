import type { BookingApiResponse, BookingLeadPayload } from "@/types/booking";

/** Chuẩn hóa số điện thoại Việt Nam về dạng 0xxxxxxxxx (10 chữ số). */
export function normalizeVietnamesePhone(raw: string): string {
  if (!raw) return "";

  let cleaned = raw.replace(/[\s.\-()]/g, "");
  if (cleaned.startsWith("+84")) {
    cleaned = `0${cleaned.slice(3)}`;
  } else if (cleaned.startsWith("84") && cleaned.length === 11) {
    cleaned = `0${cleaned.slice(2)}`;
  }

  return cleaned;
}

/** Chấp nhận các đầu số di động Việt Nam 03, 05, 07, 08, 09. */
export function isValidVietnamesePhone(phone: string): boolean {
  return /^(03|05|07|08|09)[0-9]{8}$/.test(normalizeVietnamesePhone(phone));
}

/** Email là optional; nếu có nhập thì phải đúng định dạng cơ bản. */
export function isValidEmail(email?: string): boolean {
  if (!email?.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const STORAGE_KEY_PHONE = "bs_last_lead_phone";
const STORAGE_KEY_TIME = "bs_last_lead_time";
const COOLDOWN_SECONDS = 30;
const REQUEST_TIMEOUT_MS = 12_000;

function getConfiguredEndpoint(): string | null {
  const value = import.meta.env.VITE_BOOKING_FORM_ENDPOINT?.trim();
  if (!value || value.includes("XXXXX") || value.includes("CI_PLACEHOLDER")) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "script.google.com") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function checkDuplicateSubmission(phone: string): {
  isDuplicate: boolean;
  remainingSeconds: number;
} {
  try {
    if (typeof window === "undefined") return { isDuplicate: false, remainingSeconds: 0 };

    const lastPhone = sessionStorage.getItem(STORAGE_KEY_PHONE);
    const lastTime = Number(sessionStorage.getItem(STORAGE_KEY_TIME));
    if (!lastPhone || !Number.isFinite(lastTime)) {
      return { isDuplicate: false, remainingSeconds: 0 };
    }

    if (normalizeVietnamesePhone(phone) !== normalizeVietnamesePhone(lastPhone)) {
      return { isDuplicate: false, remainingSeconds: 0 };
    }

    const elapsedSeconds = (Date.now() - lastTime) / 1000;
    if (elapsedSeconds >= COOLDOWN_SECONDS) {
      return { isDuplicate: false, remainingSeconds: 0 };
    }

    return {
      isDuplicate: true,
      remainingSeconds: Math.ceil(COOLDOWN_SECONDS - elapsedSeconds),
    };
  } catch {
    return { isDuplicate: false, remainingSeconds: 0 };
  }
}

export function recordSubmission(phone: string): void {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_KEY_PHONE, normalizeVietnamesePhone(phone));
    sessionStorage.setItem(STORAGE_KEY_TIME, Date.now().toString());
  } catch {
    // sessionStorage can be unavailable in restricted browser modes; submission should still work.
  }
}

export async function submitBookingLead(payload: BookingLeadPayload): Promise<BookingApiResponse> {
  const endpoint = getConfiguredEndpoint();

  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.warn(
        "[BookingLead] VITE_BOOKING_FORM_ENDPOINT is missing or invalid. See docs/GOOGLE_SHEETS_LEADS_SETUP.md.",
      );
    }
    return {
      success: false,
      message:
        "Biểu mẫu đang được cấu hình. Vui lòng gọi trực tiếp hotline nhà xe để được hỗ trợ nhanh nhất.",
    };
  }

  if (payload.honeypot?.trim()) {
    return { success: false, message: "Yêu cầu không hợp lệ." };
  }

  const normalizedPhone = normalizeVietnamesePhone(payload.phone);
  if (!isValidVietnamesePhone(normalizedPhone)) {
    return {
      success: false,
      message: "Số điện thoại chưa đúng định dạng. Vui lòng kiểm tra lại (10 số).",
    };
  }

  if (!isValidEmail(payload.email)) {
    return {
      success: false,
      message: "Email chưa đúng định dạng. Vui lòng kiểm tra lại hoặc để trống.",
    };
  }

  if (!payload.name?.trim() || payload.name.trim().length < 2) {
    return { success: false, message: "Vui lòng nhập họ và tên của bạn." };
  }

  if (!payload.consent) {
    return { success: false, message: "Vui lòng đồng ý để nhà xe liên hệ tư vấn." };
  }

  const duplicate = checkDuplicateSubmission(normalizedPhone);
  if (duplicate.isDuplicate) {
    return {
      success: true,
      message: `Yêu cầu của bạn đã được tiếp nhận. Nhà xe sẽ liên hệ sớm nhất! (Vui lòng chờ ${duplicate.remainingSeconds}s trước khi gửi lại)`,
    };
  }

  const formattedPayload = {
    name: payload.name.trim().slice(0, 120),
    phone: normalizedPhone,
    email: payload.email?.trim().slice(0, 160) || "",
    route: payload.route || "Hà Nội → Sơn La",
    travelDate: payload.travelDate || "",
    passengers: Math.max(1, Math.min(20, Number(payload.passengers) || 1)),
    pickup: payload.pickup?.trim().slice(0, 180) || "",
    dropoff: payload.dropoff?.trim().slice(0, 180) || "",
    note: payload.note?.trim().slice(0, 500) || "",
    source: payload.source || "website",
    page: payload.page || (typeof window !== "undefined" ? window.location.pathname : "/"),
    consent: true,
    honeypot: "",
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(formattedPayload),
      signal: controller.signal,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Booking endpoint returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as BookingApiResponse;
    if (!data?.success) {
      return {
        success: false,
        message:
          data?.message || "Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi trực tiếp cho nhà xe.",
      };
    }

    recordSubmission(normalizedPhone);
    return {
      success: true,
      leadId: data.leadId,
      message: data.message || "Đã nhận yêu cầu thành công!",
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        message: "Kết nối quá thời gian quy định. Vui lòng thử lại hoặc gọi trực tiếp hotline.",
      };
    }

    if (import.meta.env.DEV) {
      console.error("[BookingLead] request failed", error);
    }

    return {
      success: false,
      message:
        "Chưa gửi được yêu cầu do sự cố mạng. Vui lòng thử lại hoặc gọi trực tiếp hotline nhà xe.",
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
