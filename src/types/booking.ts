/**
 * Types cho hệ thống Yêu Cầu Gọi Lại / Đặt Tư Vấn Online
 */

export type BookingSource =
  | "hero_callback"
  | "fares_callback"
  | "schedule_card"
  | "schedule_section"
  | "contact_dock"
  | "inline_section"
  | "mobile_sticky"
  | "final_cta"
  | "direct";

export interface BookingFormValues {
  name: string;
  phone: string;
  email?: string | undefined;
  route: string;
  travelDate?: string | undefined;
  passengers: number;
  pickup?: string | undefined;
  dropoff?: string | undefined;
  note?: string | undefined;
  consent: boolean;
  honeypot?: string | undefined; // Field ẩn để chặn bot spam
}

export interface BookingLeadPayload extends BookingFormValues {
  source: BookingSource;
  page: string;
  submittedAt?: string | undefined;
}

export interface BookingApiResponse {
  success: boolean;
  leadId?: string | undefined;
  message?: string | undefined;
}

export type FormState = "idle" | "submitting" | "success" | "error";

export interface BookingModalOptions {
  prefillRoute?: string | undefined;
  prefillDate?: string | undefined;
  source?: BookingSource | undefined;
}

export interface BookingModalContextType {
  isOpen: boolean;
  options: BookingModalOptions;
  openBookingModal: (options?: BookingModalOptions | undefined) => void;
  closeBookingModal: () => void;
}
