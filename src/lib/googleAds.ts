const GOOGLE_ADS_LEAD_DESTINATION = "AW-18448937166/IHlKCM2u5fgcEM7hkd1E";

/**
 * Ghi nhận một chuyển đổi Google Ads sau khi CRM đã trả về mã lead thật.
 * transaction_id giúp Google Ads loại trùng nếu callback bị chạy lại.
 */
export function trackGoogleAdsLeadConversion(leadId?: string): boolean {
  if (typeof window === "undefined" || !leadId || typeof window.gtag !== "function") {
    return false;
  }

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_LEAD_DESTINATION,
    value: 1,
    currency: "VND",
    transaction_id: leadId,
  });

  return true;
}
