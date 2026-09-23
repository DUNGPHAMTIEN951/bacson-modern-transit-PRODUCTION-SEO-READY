import { useState, useRef, useId, FormEvent } from "react";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { businessInfo } from "@/data/business";
import {
  submitBookingLead,
  isValidVietnamesePhone,
  normalizeVietnamesePhone,
} from "@/lib/bookingLead";
import { trackGoogleAdsLeadConversion } from "@/lib/googleAds";

interface Props {
  routeTitle: string;
  defaultPickup?: string;
}

export function RouteBooking({ routeTitle, defaultPickup = "" }: Props) {
  const formId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [pickup, setPickup] = useState(defaultPickup);
  const [note, setNote] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});

  const phoneRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    if (!name.trim() || name.trim().length < 2) {
      setFieldErrors((prev) => ({ ...prev, name: "Vui lòng nhập họ và tên của bạn" }));
      return;
    }

    const cleanPhone = normalizeVietnamesePhone(phone);
    if (!isValidVietnamesePhone(cleanPhone)) {
      setFieldErrors((prev) => ({
        ...prev,
        phone: "Số điện thoại chưa đúng định dạng 10 số (VD: 0848755766)",
      }));
      phoneRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const res = await submitBookingLead({
        name: name.trim(),
        phone: cleanPhone,
        route: routeTitle,
        travelDate: travelDate || "Chưa xác định ngày",
        passengers: 1,
        pickup: pickup.trim(),
        note: note.trim(),
        source: "route_landing",
        page: typeof window !== "undefined" ? window.location.pathname : "",
        consent: true,
        honeypot,
        submittedAt: new Date().toISOString(),
      });

      if (res.success) {
        if (res.conversionEligible) {
          trackGoogleAdsLeadConversion({
            leadId: res.leadId,
            phone: cleanPhone,
          });
        }
        setSuccess(true);
        setName("");
        setPhone("");
        setTravelDate("");
        setPickup("");
        setNote("");
      } else {
        setErrorMsg(res.message || "Có lỗi xảy ra, vui lòng liên hệ hotline.");
      }
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng gọi trực tiếp hotline để đặt xe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="booking"
      className="mt-12 sm:mt-16 scroll-mt-24 rounded-[32px] sm:rounded-[40px] border-2 border-[#EAD9C6] bg-white p-6 sm:p-8 md:p-12 shadow-[0_16px_48px_rgba(58,33,27,0.06)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* CỘT TRÁI: THÔNG TIN HỖ TRỢ & CAM KẾT (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#D51F26]/20 bg-[#FBE2DE] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D51F26] mb-3 shadow-2xs">
            <Sparkles className="size-3.5 text-[#D51F26]" aria-hidden="true" />
            <span>ĐĂNG KÝ CHUYẾN ĐI DỄ DÀNG</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3A211B] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Đăng ký chuyến đi cùng Bắc Sơn Cường Nguyệt
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#795F55] leading-relaxed">
            Điền thông tin bên dưới để nhà xe liên hệ kiểm tra chỗ trống, hỗ trợ chọn giường tầng
            dưới êm ái và xác nhận điểm đón thuận tiện nhất.
          </p>

          <div className="mt-6 rounded-2xl border border-[#EAD9C6] bg-[#FFF8EE] p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C6D58] flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[#D51F26]" />
              <span>Cam kết dịch vụ từ nhà xe</span>
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs sm:text-sm text-[#3A211B]" role="list">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#1B8341] shrink-0" />
                <span>Không phụ thu, thanh toán khi lên xe an tâm</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#1B8341] shrink-0" />
                <span>Ưu tiên xếp giường thuận lợi cho người lớn tuổi, trẻ em</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#1B8341] shrink-0" />
                <span>Nhân viên điều hành gọi lại xác nhận trong vòng 5 phút</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#795F55]">Cần giữ chỗ gấp?</span>
            <a
              href={`tel:${businessInfo.phone}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D51F26] hover:underline"
            >
              <PhoneCall className="size-4 stroke-[2]" />
              Hotline 24/7: {businessInfo.phone}
            </a>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG KÝ (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-[28px] sm:rounded-3xl border-2 border-[#EAD9C6] bg-[#FFFDF9] p-6 sm:p-8 shadow-sm">
            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#E8F8EE] text-[#1B8341] mb-4 shadow-sm">
                  <CheckCircle2 className="size-10 stroke-[2.5]" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-[#3A211B]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Đăng ký thành công!
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#795F55] max-w-md mx-auto leading-relaxed">
                  Nhà xe Bắc Sơn Cường Nguyệt đã nhận thông tin chuyến đi của bạn. Đội ngũ điều hành
                  sẽ gọi điện thoại trực tiếp để xác nhận giờ xuất bến và điểm đón.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-full border-2 border-[#D51F26] px-7 py-2.5 text-sm font-bold text-[#D51F26] hover:bg-[#D51F26] hover:text-white transition-colors shadow-2xs"
                >
                  Gửi yêu cầu chuyến khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Honeypot field (hidden from users, traps bots) */}
                <input
                  type="text"
                  name="user_note_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                {errorMsg && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Tuyến đường đang đăng ký */}
                <div className="rounded-xl bg-[#FFF8EE] border border-[#EAD9C6] px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm shadow-2xs">
                  <span className="font-semibold text-[#795F55]">Tuyến đăng ký:</span>
                  <span className="font-extrabold text-[#D51F26] text-sm sm:text-base">
                    {routeTitle}
                  </span>
                </div>

                {/* 1. Họ tên */}
                <div>
                  <label
                    htmlFor={`${formId}-name`}
                    className="block text-xs font-bold uppercase tracking-wider text-[#3A211B] mb-1.5"
                  >
                    Họ và tên <span className="text-[#D51F26]">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8C6D58]">
                      <User className="size-4" />
                    </div>
                    <input
                      id={`${formId}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) {
                          setFieldErrors((p) => {
                            const { name: _, ...rest } = p;
                            return rest;
                          });
                        }
                      }}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-[#3A211B] placeholder:text-[#9E8878] focus:border-[#D51F26] focus:outline-hidden focus:ring-2 focus:ring-[#D51F26]/20 transition ${
                        fieldErrors.name ? "border-red-500" : "border-[#EAD9C6]"
                      }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                  )}
                </div>

                {/* 2. Số điện thoại */}
                <div>
                  <label
                    htmlFor={`${formId}-phone`}
                    className="block text-xs font-bold uppercase tracking-wider text-[#3A211B] mb-1.5"
                  >
                    Số điện thoại <span className="text-[#D51F26]">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8C6D58]">
                      <Phone className="size-4" />
                    </div>
                    <input
                      id={`${formId}-phone`}
                      name="phone"
                      ref={phoneRef}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      placeholder="Ví dụ: 0848 755 766"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) {
                          setFieldErrors((p) => {
                            const { phone: _, ...rest } = p;
                            return rest;
                          });
                        }
                      }}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-[#3A211B] placeholder:text-[#9E8878] focus:border-[#D51F26] focus:outline-hidden focus:ring-2 focus:ring-[#D51F26]/20 transition ${
                        fieldErrors.phone ? "border-red-500" : "border-[#EAD9C6]"
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* 3. Ngày đi & 4. Điểm đón (2 cột trên màn hình vừa) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`${formId}-date`}
                      className="block text-xs font-bold uppercase tracking-wider text-[#3A211B] mb-1.5"
                    >
                      Ngày đi
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8C6D58]">
                        <Calendar className="size-4" />
                      </div>
                      <input
                        id={`${formId}-date`}
                        name="travel_date"
                        type="date"
                        autoComplete="off"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full rounded-xl border border-[#EAD9C6] bg-white py-3 pl-10 pr-4 text-sm text-[#3A211B] focus:border-[#D51F26] focus:outline-hidden focus:ring-2 focus:ring-[#D51F26]/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`${formId}-pickup`}
                      className="block text-xs font-bold uppercase tracking-wider text-[#3A211B] mb-1.5"
                    >
                      Điểm đón
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8C6D58]">
                        <MapPin className="size-4" />
                      </div>
                      <input
                        id={`${formId}-pickup`}
                        name="pickup"
                        type="text"
                        autoComplete="street-address"
                        placeholder="VD: Bến xe Mỹ Đình / Mộc Châu"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="w-full rounded-xl border border-[#EAD9C6] bg-white py-3 pl-10 pr-4 text-sm text-[#3A211B] placeholder:text-[#9E8878] focus:border-[#D51F26] focus:outline-hidden focus:ring-2 focus:ring-[#D51F26]/20 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Ghi chú */}
                <div>
                  <label
                    htmlFor={`${formId}-note`}
                    className="block text-xs font-bold uppercase tracking-wider text-[#3A211B] mb-1.5"
                  >
                    Ghi chú
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-3 left-3.5 text-[#8C6D58]">
                      <FileText className="size-4" />
                    </div>
                    <textarea
                      id={`${formId}-note`}
                      name="note"
                      autoComplete="off"
                      rows={2}
                      placeholder="VD: Muốn nằm tầng dưới cho người lớn tuổi / Có kèm thùng nông sản..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full rounded-xl border border-[#EAD9C6] bg-white py-2.5 pl-10 pr-4 text-sm text-[#3A211B] placeholder:text-[#9E8878] focus:border-[#D51F26] focus:outline-hidden focus:ring-2 focus:ring-[#D51F26]/20 transition resize-none"
                    />
                  </div>
                </div>

                {/* Button: Đăng ký chuyến đi */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D51F26] px-6 py-4 text-base font-bold text-white shadow-[0_4px_18px_rgba(213,31,38,0.38)] transition-all duration-200 hover:bg-[#A8171D] hover:shadow-[0_6px_24px_rgba(213,31,38,0.48)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>Đang gửi thông tin...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-5 stroke-[2.2]" />
                      <span>Đăng ký chuyến đi</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#8C6D58] flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="size-4 text-[#1B8341]" />
                  <span>Dữ liệu được bảo mật và truyền trực tiếp về hệ thống nhà xe.</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
