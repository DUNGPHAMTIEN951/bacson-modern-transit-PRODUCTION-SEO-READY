const GOOGLE_ADS_LEAD_DESTINATION = "AW-18448937166/IHlKCM2u5fgcEM7hkd1E";

interface GoogleAdsLead {
  leadId?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
}

function normalizePhoneForGoogle(phone?: string): string | undefined {
  const digits = phone?.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("84")) return `+${digits}`;
  if (digits.startsWith("0")) return `+84${digits.slice(1)}`;
  return undefined;
}

/**
 * Ghi nhận một chuyển đổi Google Ads sau khi CRM đã trả về mã lead thật.
 * transaction_id giúp Google Ads loại trùng nếu callback bị chạy lại.
 * Dữ liệu người dùng chỉ được gửi khi khách đã đồng ý để nhà xe liên hệ.
 */
export function trackGoogleAdsLeadConversion({ leadId, email, phone }: GoogleAdsLead): boolean {
  if (typeof window === "undefined" || !leadId || typeof window.gtag !== "function") {
    return false;
  }

  const userData: { email?: string; phone_number?: string } = {};
  const normalizedPhone = normalizePhoneForGoogle(phone);
  if (email?.trim()) userData.email = email.trim().toLowerCase();
  if (normalizedPhone) userData.phone_number = normalizedPhone;

  if (Object.keys(userData).length > 0) {
    window.gtag("set", "user_data", userData);
  }

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_LEAD_DESTINATION,
    value: 1,
    currency: "VND",
    transaction_id: leadId,
  });

  return true;
}
