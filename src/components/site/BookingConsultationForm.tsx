import { useState, useRef, useEffect, useId } from "react";
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Users,
  MapPin,
  FileText,
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Navigation,
} from "lucide-react";
import { businessInfo } from "@/data/business";
import {
  submitBookingLead,
  isValidVietnamesePhone,
  isValidEmail,
  normalizeVietnamesePhone,
} from "@/lib/bookingLead";
import type { BookingFormValues, BookingSource, FormState } from "@/types/booking";

const ROUTE_OPTIONS = [
  "Hà Nội → Mộc Châu",
  "Hà Nội → Sơn La",
  "Mộc Châu → Hà Nội",
  "Sơn La → Hà Nội",
  "Mộc Châu → Sơn La",
  "Sơn La → Mộc Châu",
  "Khác / cần tư vấn",
] as const;

interface Props {
  prefillRoute?: string | undefined;
  prefillDate?: string | undefined;
  source?: BookingSource | undefined;
  onSuccess?: (() => void) | undefined;
  className?: string | undefined;
  hideHeader?: boolean | undefined;
}

export function BookingConsultationForm({
  prefillRoute,
  prefillDate,
  source = "inline_section",
  onSuccess,
  className = "",
  hideHeader = false,
}: Props) {
  const formId = useId();

  // Giá trị form
  const [values, setValues] = useState<BookingFormValues>({
    name: "",
    phone: "",
    email: "",
    route: prefillRoute || "Hà Nội → Sơn La",
    travelDate: prefillDate || "",
    passengers: 1,
    pickup: "",
    dropoff: "",
    note: "",
    consent: false,
    honeypot: "",
  });

  // Cập nhật khi prop prefill thay đổi
  useEffect(() => {
    if (prefillRoute) {
      // Tìm xem có route tương ứng trong danh sách không
      const matched = ROUTE_OPTIONS.find((r) =>
        r.toLowerCase().includes(prefillRoute.toLowerCase()),
      );
      setValues((v) => ({ ...v, route: matched || prefillRoute }));
    }
  }, [prefillRoute]);

  useEffect(() => {
    if (prefillDate) {
      setValues((v) => ({ ...v, travelDate: prefillDate }));
    }
  }, [prefillDate]);

  // Validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFormValues, boolean>>>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [leadId, setLeadId] = useState<string>("");

  // Refs để auto focus field lỗi đầu tiên
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  // Lấy ngày hôm nay theo format YYYY-MM-DD để chặn chọn ngày quá khứ
  const todayStr = new Date().toISOString().split("T")[0];

  // GPS Định vị vị trí hiện tại
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationStatus("Trình duyệt không hỗ trợ định vị GPS.");
      setTimeout(() => setLocationStatus(null), 4000);
      return;
    }

    setLocating(true);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocoding qua OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "vi,en",
              },
            },
          );
          if (res.ok) {
            const data = await res.json();
            const road =
              data.address?.road ||
              data.address?.suburb ||
              data.address?.quarter ||
              data.address?.amenity ||
              "";
            const district =
              data.address?.district || data.address?.city_district || data.address?.county || "";
            const city = data.address?.city || data.address?.state || "";

            const fullAddr = [road, district, city].filter(Boolean).join(", ");
            if (fullAddr) {
              handleChange("pickup", fullAddr);
              setLocationStatus("✓ Đã lấy vị trí hiện tại của bạn thành công!");
              setTimeout(() => setLocationStatus(null), 3500);
              setLocating(false);
              return;
            }
          }
        } catch {
          // Fallback nếu reverse geocoding không khả dụng
        }

        handleChange(
          "pickup",
          `Vị trí hiện tại (Tọa độ: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        );
        setLocationStatus("✓ Đã lấy tọa độ vị trí hiện tại!");
        setTimeout(() => setLocationStatus(null), 3500);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus("Bạn đã từ chối quyền GPS. Vui lòng gõ tay điểm đón.");
        } else {
          setLocationStatus("Không thể lấy vị trí. Vui lòng gõ tay điểm đón.");
        }
        setTimeout(() => setLocationStatus(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  // Validate 1 field
  const validateField = (field: keyof BookingFormValues, val: unknown): string => {
    switch (field) {
      case "name":
        if (!val || typeof val !== "string" || val.trim().length < 2) {
          return "Vui lòng nhập họ và tên của bạn.";
        }
        return "";
      case "phone":
        if (!val || typeof val !== "string" || val.trim() === "") {
          return "Số điện thoại là bắt buộc để nhà xe liên hệ.";
        }
        if (!isValidVietnamesePhone(val)) {
          return "Số điện thoại chưa đúng định dạng (10 số, ví dụ 0987 654 321).";
        }
        return "";
      case "email":
        if (typeof val === "string" && val && !isValidEmail(val)) {
          return "Email chưa đúng định dạng (ví dụ: ten@gmail.com).";
        }
        return "";
      case "consent":
        if (!val) {
          return "Vui lòng đồng ý điều khoản để gửi yêu cầu.";
        }
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: keyof BookingFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, values[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = <K extends keyof BookingFormValues>(field: K, val: BookingFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState === "submitting") return;

    // Validate toàn bộ
    const newErrors: Partial<Record<keyof BookingFormValues, string>> = {
      name: validateField("name", values.name),
      phone: validateField("phone", values.phone),
      email: validateField("email", values.email),
      consent: validateField("consent", values.consent),
    };

    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true, consent: true });

    // Focus field lỗi đầu tiên
    if (newErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (newErrors.phone) {
      phoneRef.current?.focus();
      return;
    }
    if (newErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (newErrors.consent) {
      consentRef.current?.focus();
      return;
    }

    // Submit
    setFormState("submitting");
    setServerMessage("");

    const res = await submitBookingLead({
      ...values,
      source,
      page: typeof window !== "undefined" ? window.location.pathname : "/",
    });

    if (res.success) {
      setFormState("success");
      setLeadId(res.leadId || "");
      setServerMessage(res.message || "");
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setFormState("error");
      setServerMessage(res.message || "Có lỗi xảy ra khi gửi yêu cầu.");
    }
  };

  const handleReset = () => {
    setValues({
      name: "",
      phone: "",
      email: "",
      route: prefillRoute || "Hà Nội → Sơn La",
      travelDate: "",
      passengers: 1,
      pickup: "",
      dropoff: "",
      note: "",
      consent: false,
      honeypot: "",
    });
    setErrors({});
    setTouched({});
    setFormState("idle");
    setServerMessage("");
    setLeadId("");
  };

  // ─── STATE: SUCCESS ───
  if (formState === "success") {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border border-[#EAD9C6] bg-white p-6 sm:p-8 text-center shadow-[0_4px_24px_rgba(58,33,27,0.06)] animate-fade-in ${className}`}
        aria-live="polite"
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-[#E8F8EE] text-[#1B8341] shadow-[0_0_16px_rgba(27,131,65,0.15)]">
          <CheckCircle2 className="size-9 animate-scale-in" aria-hidden="true" />
        </div>

        <h3
          className="mt-4 text-xl sm:text-2xl font-black text-[#2B2B2B]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Đã nhận yêu cầu của bạn!
        </h3>

        {leadId && (
          <p className="mt-1 text-xs font-mono font-semibold text-[#8C6D58]">
            Mã yêu cầu: <span className="text-[#D51F26]">{leadId}</span>
          </p>
        )}

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5A3828]">
          Nhà xe sẽ liên hệ qua số điện thoại{" "}
          <strong className="text-[#D51F26] font-bold">
            {normalizeVietnamesePhone(values.phone)}
          </strong>{" "}
          trong thời gian sớm nhất để tư vấn lịch chạy và giữ chỗ cho bạn.
        </p>

        <div className="mt-6 w-full max-w-sm rounded-xl border border-[#F5E6D3] bg-[#FFF9F3] p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8C6D58]">
            Hành trình đã đăng ký:
          </p>
          <div className="mt-2 space-y-1 text-sm text-[#2B2B2B]">
            <p>
              <span className="font-semibold">Họ tên:</span> {values.name}
            </p>
            <p>
              <span className="font-semibold">Tuyến:</span> {values.route}
            </p>
            {values.travelDate && (
              <p>
                <span className="font-semibold">Ngày đi:</span> {values.travelDate}
              </p>
            )}
            <p>
              <span className="font-semibold">Số khách:</span> {values.passengers} người
            </p>
          </div>
        </div>

        {/* Cụm liên hệ ngay nếu khách cần gấp */}
        <div className="mt-6 w-full max-w-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#795F55]">
            Cần hỗ trợ hoặc xác nhận ngay?
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={businessInfo.phoneTel}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D51F26] px-4 text-xs font-black text-white shadow-[0_2px_8px_rgba(213,31,38,0.25)] transition-all hover:bg-[#A8171D] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              <span>GỌI NHÀ XE NGAY</span>
            </a>
            <a
              href={businessInfo.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#EAD9C6] bg-[#FFF4E8] px-4 text-xs font-bold text-[#3A211B] transition-all hover:border-[#0068FF] hover:bg-[#EEF5FF] hover:text-[#0068FF] hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="size-3.5 text-[#0068FF]" aria-hidden="true" />
              <span>CHAT QUA ZALO</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6D58] hover:text-[#D51F26] transition-colors"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          <span>Gửi yêu cầu cho hành trình khác</span>
        </button>
      </div>
    );
  }

  // ─── FORM VIEW (IDLE, SUBMITTING, ERROR) ───
  return (
    <div
      className={`rounded-2xl border border-[rgba(210,170,90,0.28)] bg-white/95 p-5 sm:p-7 shadow-[0_4px_24px_rgba(58,33,27,0.06)] backdrop-blur-xs ${className}`}
    >
      {!hideHeader && (
        <div className="border-b border-[#F0E4D4] pb-4 mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF2C9] px-3 py-1 text-[0.72rem] font-bold text-[#B71F1F]">
            <PhoneCall className="size-3 text-[#D51F26] stroke-[2]" aria-hidden="true" />
            TƯ VẤN NHANH MIỄN PHÍ
          </span>
          <h3
            className="mt-2 text-xl sm:text-2xl font-black text-[#2B2B2B]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Để nhà xe gọi lại tư vấn
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#6B635B] leading-relaxed">
            Để lại số điện thoại và hành trình dự kiến. Nhà xe sẽ liên hệ để tư vấn lịch chạy, điểm
            đón và giá vé phù hợp.
          </p>
        </div>
      )}

      {/* Thông báo lỗi server nếu có */}
      {formState === "error" && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-[#F5C2C7] bg-[#FFF0F2] p-3.5 text-xs sm:text-sm text-[#842029] animate-shake"
        >
          <AlertCircle
            className="size-5 shrink-0 text-[#D51F26] stroke-[2] mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1">
            <p className="font-bold">Chưa gửi được yêu cầu</p>
            <p className="mt-0.5">{serverMessage}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href={businessInfo.phoneTel}
                className="font-bold underline text-[#D51F26] hover:text-[#A8171D]"
              >
                Gọi hotline: {businessInfo.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* HONEYPOT FIELD — Ẩn hoàn toàn với người thật để bẫy bot spam */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={`${formId}-hp`}>Website URL</label>
          <input
            id={`${formId}-hp`}
            type="text"
            name="website_url"
            value={values.honeypot || ""}
            onChange={(e) => handleChange("honeypot", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* HÀNG 1: HỌ TÊN + SĐT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. Họ và tên */}
          <div>
            <label
              htmlFor={`${formId}-name`}
              className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
            >
              Họ và tên <span className="text-[#D51F26]">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E8E84]">
                <User className="size-4" aria-hidden="true" />
              </div>
              <input
                ref={nameRef}
                id={`${formId}-name`}
                type="text"
                required
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Ví dụ: Nguyễn Văn An"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${formId}-name-err` : undefined}
                className={`w-full rounded-xl border bg-white pl-9 pr-3.5 py-2.5 text-sm text-[#2B2B2B] shadow-xs outline-none transition-all placeholder:text-[#B5A89E] focus:ring-2 ${
                  errors.name
                    ? "border-[#D51F26] focus:border-[#D51F26] focus:ring-[#D51F26]/20"
                    : "border-[#E5D7C7] focus:border-[#EAB83E] focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF]"
                }`}
                style={{ height: "46px" }}
              />
            </div>
            {errors.name && (
              <p id={`${formId}-name-err`} className="mt-1 text-xs font-medium text-[#D51F26]">
                {errors.name}
              </p>
            )}
          </div>

          {/* 2. Số điện thoại */}
          <div>
            <label
              htmlFor={`${formId}-phone`}
              className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
            >
              Số điện thoại <span className="text-[#D51F26]">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E8E84]">
                <Phone className="size-4" aria-hidden="true" />
              </div>
              <input
                ref={phoneRef}
                id={`${formId}-phone`}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={values.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="Ví dụ: 0987 654 321"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? `${formId}-phone-err` : undefined}
                className={`w-full rounded-xl border bg-white pl-9 pr-3.5 py-2.5 text-sm font-semibold text-[#2B2B2B] shadow-xs outline-none transition-all placeholder:text-[#B5A89E] focus:ring-2 ${
                  errors.phone
                    ? "border-[#D51F26] focus:border-[#D51F26] focus:ring-[#D51F26]/20"
                    : "border-[#E5D7C7] focus:border-[#EAB83E] focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF]"
                }`}
                style={{ height: "46px" }}
              />
            </div>
            {errors.phone && (
              <p id={`${formId}-phone-err`} className="mt-1 text-xs font-medium text-[#D51F26]">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* HÀNG 2: TUYẾN ĐI + SỐ KHÁCH */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 3. Tuyến đi */}
          <div className="sm:col-span-2">
            <label
              htmlFor={`${formId}-route`}
              className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
            >
              Tuyến đi <span className="text-[#D51F26]">*</span>
            </label>
            <div className="relative mt-1.5">
              <select
                id={`${formId}-route`}
                value={values.route}
                onChange={(e) => handleChange("route", e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E5D7C7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#2B2B2B] shadow-xs outline-none transition-all focus:border-[#EAB83E] focus:ring-2 focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF]"
                style={{ height: "46px" }}
              >
                {ROUTE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8C6D58]">
                ▼
              </div>
            </div>
          </div>

          {/* 4. Số hành khách */}
          <div>
            <label
              htmlFor={`${formId}-passengers`}
              className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
            >
              Số khách
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E8E84]">
                <Users className="size-4" aria-hidden="true" />
              </div>
              <input
                id={`${formId}-passengers`}
                type="number"
                min={1}
                max={20}
                value={values.passengers}
                onChange={(e) => handleChange("passengers", parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-xl border border-[#E5D7C7] bg-white pl-9 pr-3 py-2.5 text-sm font-semibold text-[#2B2B2B] shadow-xs outline-none transition-all focus:border-[#EAB83E] focus:ring-2 focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF]"
                style={{ height: "46px" }}
              />
            </div>
          </div>
        </div>

        {/* HÀNG 3: NGÀY ĐI + EMAIL (OPTIONAL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 5. Ngày dự kiến đi */}
          <div>
            <label
              htmlFor={`${formId}-date`}
              className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
            >
              Ngày dự kiến đi
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E8E84]">
                <Calendar className="size-4" aria-hidden="true" />
              </div>
              <input
                id={`${formId}-date`}
                type="date"
                min={todayStr}
                value={values.travelDate || ""}
                onChange={(e) => handleChange("travelDate", e.target.value)}
                className="w-full rounded-xl border border-[#E5D7C7] bg-white pl-9 pr-3.5 py-2.5 text-sm text-[#2B2B2B] shadow-xs outline-none transition-all focus:border-[#EAB83E] focus:ring-2 focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF]"
                style={{ height: "46px" }}
              />
            </div>
          </div>

          {/* 6. Email (optional) */}
          <div>
            <label
              htmlFor={`${formId}-email`}
              className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
            >
              Email{" "}
              <span className="text-[0.68rem] font-normal text-[#8C6D58]">(không bắt buộc)</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E8E84]">
                <Mail className="size-4" aria-hidden="true" />
              </div>
              <input
                ref={emailRef}
                id={`${formId}-email`}
                type="email"
                value={values.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="name@gmail.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${formId}-email-err` : undefined}
                className={`w-full rounded-xl border bg-white pl-9 pr-3.5 py-2.5 text-sm text-[#2B2B2B] shadow-xs outline-none transition-all placeholder:text-[#B5A89E] focus:ring-2 ${
                  errors.email
                    ? "border-[#D51F26] focus:border-[#D51F26] focus:ring-[#D51F26]/20"
                    : "border-[#E5D7C7] focus:border-[#EAB83E] focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF]"
                }`}
                style={{ height: "46px" }}
              />
            </div>
            {errors.email && (
              <p id={`${formId}-email-err`} className="mt-1 text-xs font-medium text-[#D51F26]">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* HÀNG 4: ĐIỂM ĐÓN & ĐIỂM TRẢ (OPTIONAL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 7. Điểm đón */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-pickup`}
                className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
              >
                Điểm đón mong muốn{" "}
                <span className="text-[0.68rem] font-normal text-[#8C6D58]">(tùy chọn)</span>
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#D51F26] hover:text-[#A8171D] hover:underline disabled:opacity-60 transition-colors"
                title="Lấy vị trí GPS hiện tại của bạn"
              >
                {locating ? (
                  <>
                    <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                    <span>Đang định vị...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="size-3 text-[#D51F26]" aria-hidden="true" />
                    <span>Lấy vị trí hiện tại</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E8E84]">
                <MapPin className="size-4" aria-hidden="true" />
              </div>
              <input
                id={`${formId}-pickup`}
                type="text"
                value={values.pickup || ""}
                onChange={(e) => handleChange("pickup", e.target.value)}
                placeholder="Ví dụ: Bến xe Mỹ Đình / Ngã tư..."
                className="w-full rounded-xl border border-[#E5D7C7] bg-white pl-9 pr-9 py-2.5 text-sm text-[#2B2B2B] shadow-xs outline-none transition-all placeholder:text-[#B5A89E] focus:border-[#EAB83E] focus:ring-2 focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF]"
                style={{ height: "46px" }}
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                aria-label="Lấy vị trí GPS hiện tại"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#D51F26] hover:text-[#A8171D] transition-colors"
              >
                {locating ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Navigation className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {locationStatus && (
              <p className="mt-1 text-[0.72rem] font-semibold text-[#D51F26] animate-fade-in">
                {locationStatus}
              </p>
            )}
          </div>

          {/* 8. Điểm trả */}
          <div>
            <label
              htmlFor={`${formId}-dropoff`}
              className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
            >
              Điểm trả mong muốn{" "}
              <span className="text-[0.68rem] font-normal text-[#8C6D58]">(tùy chọn)</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E8E84]">
                <MapPin className="size-4 text-[#D51F26]" aria-hidden="true" />
              </div>
              <input
                id={`${formId}-dropoff`}
                type="text"
                value={values.dropoff || ""}
                onChange={(e) => handleChange("dropoff", e.target.value)}
                placeholder="Ví dụ: TP Sơn La / Mộc Châu..."
                className="w-full rounded-xl border border-[#E5D7C7] bg-white pl-9 pr-3.5 py-2.5 text-sm text-[#2B2B2B] shadow-xs outline-none transition-all placeholder:text-[#B5A89E] focus:border-[#EAB83E] focus:ring-2 focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF]"
                style={{ height: "46px" }}
              />
            </div>
          </div>
        </div>

        {/* HÀNG 5: GHI CHÚ */}
        <div>
          <label
            htmlFor={`${formId}-note`}
            className="block text-xs font-bold uppercase tracking-wider text-[#3A211B]"
          >
            Ghi chú thêm{" "}
            <span className="text-[0.68rem] font-normal text-[#8C6D58]">(tùy chọn)</span>
          </label>
          <div className="relative mt-1.5">
            <textarea
              id={`${formId}-note`}
              rows={2}
              maxLength={500}
              value={values.note || ""}
              onChange={(e) => handleChange("note", e.target.value)}
              placeholder="Ví dụ: Muốn nằm giường dưới gần tài xế, có hành lý cồng kềnh..."
              className="w-full rounded-xl border border-[#E5D7C7] bg-white p-3 text-sm text-[#2B2B2B] shadow-xs outline-none transition-all placeholder:text-[#B5A89E] focus:border-[#EAB83E] focus:ring-2 focus:ring-[#EAB83E]/25 hover:border-[#D5C2AF] resize-none"
            />
          </div>
        </div>

        {/* HÀNG 6: CONSENT CHECKBOX & PRIVACY DISCLOSURE */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              ref={consentRef}
              type="checkbox"
              required
              checked={values.consent}
              onChange={(e) => handleChange("consent", e.target.checked)}
              onBlur={() => handleBlur("consent")}
              className="mt-0.5 size-4.5 rounded border-[#E5D7C7] text-[#D51F26] accent-[#D51F26] focus:ring-[#D51F26]"
            />
            <span className="text-xs leading-snug text-[#4A3025]">
              Tôi đồng ý để nhà xe liên hệ qua điện thoại/Zalo nhằm tư vấn chuyến đi và đặt vé.{" "}
              <span className="text-[#D51F26]">*</span>
            </span>
          </label>
          {errors.consent && (
            <p className="mt-1 pl-7 text-xs font-medium text-[#D51F26]">{errors.consent}</p>
          )}
          <p className="mt-1.5 pl-7 text-[0.72rem] text-[#8C6D58] leading-tight flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-[#D51F26] stroke-[2]" aria-hidden="true" />
            <span>Thông tin chỉ được sử dụng để nhà xe liên hệ và hỗ trợ chuyến đi của bạn.</span>
          </p>
        </div>

        {/* HÀNG 7: SUBMIT CTA BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={formState === "submitting"}
            className="group relative flex w-full min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#D51F26] px-6 text-sm font-black text-white shadow-[0_4px_16px_rgba(213,31,38,0.28)] transition-all duration-200 hover:bg-[#A8171D] hover:shadow-[0_6px_22px_rgba(213,31,38,0.38)] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
            style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}
          >
            {formState === "submitting" ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                <span>ĐANG GỬI YÊU CẦU…</span>
              </>
            ) : (
              <>
                <PhoneIncoming
                  className="size-4 shrink-0 stroke-[2] transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <span>GỬI YÊU CẦU GỌI LẠI</span>
                <ArrowRight
                  className="size-4 shrink-0 stroke-[2] transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
          <p className="mt-2 text-center text-[0.72rem] font-medium text-[#8C6D58]">
            Không thanh toán online • Chỉ gửi yêu cầu tư vấn
          </p>
        </div>
      </form>
    </div>
  );
}
