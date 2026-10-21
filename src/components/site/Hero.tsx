import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  PhoneCall,
  TicketPercent,
} from "lucide-react";
import { businessInfo, legalInfo } from "@/data/business";
import { images } from "@/data/images";
import { image360Registry } from "@/data/image360";
import { useImmersiveViewer } from "./ImmersiveImageViewer";
import { useBookingModal } from "./BookingModalContext";

export function Hero() {
  const { openImmersive } = useImmersiveViewer();
  const { openBookingModal } = useBookingModal();
  const [quickRoute, setQuickRoute] = useState("Hà Nội → Sơn La");
  const [quickDate, setQuickDate] = useState("");

  const handleQuickBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openBookingModal({
      prefillRoute: quickRoute,
      prefillDate: quickDate || undefined,
      source: "hero_callback",
    });
  };

  return (
    <section id="top" className="relative overflow-hidden border-b border-[#EBDDD1] bg-[#FFFAF4]">
      <div className="container-page grid gap-7 py-7 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] lg:items-center lg:gap-10 lg:py-16">
        <div className="order-2 min-w-0 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F1DAD1] bg-white px-3 py-1.5 text-xs font-bold text-[#B71F1F]">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Chuyên tuyến Hà Nội – Mộc Châu – Sơn La
          </div>
          <h1
            className="mt-4 max-w-[630px] text-3xl font-bold leading-[1.14] tracking-[-0.03em] text-[#382720] sm:text-5xl lg:text-[3.35rem]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Xe giường nằm <span className="text-[#BE1821]">Bắc Sơn Cường Nguyệt</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5A483D]">
            Di chuyển Hà Nội – Mộc Châu – Sơn La bằng xe giường nằm. Chọn chuyến và ngày đi, nhà xe
            liên hệ xác nhận chỗ trước hành trình.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#55443B] sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <TicketPercent className="size-4 text-[#B71F1F]" aria-hidden="true" /> Giảm 20% mọi
              chuyến
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[#B71F1F]" aria-hidden="true" />{" "}
              {legalInfo.transportLicense.split(" — ")[0]}
            </span>
          </div>
          <form
            id="hero-quick-booking"
            onSubmit={handleQuickBooking}
            aria-label="Chọn nhanh tuyến và ngày đi"
            className="mt-6 scroll-mt-24 rounded-[22px] border border-[#E5D5C9] bg-white p-4 shadow-[0_16px_48px_rgba(55,32,26,0.09)] sm:p-5"
          >
            <p className="mb-4 text-lg font-extrabold text-[#3A211B]">Chọn chuyến & giữ chỗ</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className="block text-sm font-semibold text-[#4C3C33]"
                htmlFor="hero-quick-route"
              >
                <span className="mb-1.5 block">Tuyến đường</span>
                <span className="relative block">
                  <MapPin
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#C11E29]"
                    aria-hidden="true"
                  />
                  <select
                    id="hero-quick-route"
                    name="route"
                    value={quickRoute}
                    onChange={(event) => setQuickRoute(event.target.value)}
                    className="min-h-12 w-full appearance-none rounded-xl border border-[#E6DAD1] bg-[#FFFCF8] pl-9 pr-3 text-sm font-semibold text-[#382720] focus:border-[#B71F1F] focus:outline-none focus:ring-2 focus:ring-[#B71F1F]/15"
                  >
                    <option>Hà Nội → Sơn La</option>
                    <option>Hà Nội → Mộc Châu</option>
                    <option>Sơn La → Hà Nội</option>
                    <option>Mộc Châu → Hà Nội</option>
                  </select>
                </span>
              </label>
              <label
                className="block text-sm font-semibold text-[#4C3C33]"
                htmlFor="hero-quick-date"
              >
                <span className="mb-1.5 block">Ngày đi</span>
                <span className="relative block">
                  <CalendarDays
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#C11E29]"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-quick-date"
                    name="travel_date"
                    type="date"
                    min={new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    value={quickDate}
                    onChange={(event) => setQuickDate(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-[#E6DAD1] bg-[#FFFCF8] pl-9 pr-3 text-sm font-semibold text-[#382720] focus:border-[#B71F1F] focus:outline-none focus:ring-2 focus:ring-[#B71F1F]/15"
                  />
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C81925] px-4 text-sm font-extrabold text-white transition hover:bg-[#A6171E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6171E]"
            >
              Chọn chuyến & giữ chỗ <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-[#77655B]">
              Không cần thanh toán trước · Nhân viên gọi xác nhận giá, lịch và điểm đón
            </p>
          </form>
          <a
            href={businessInfo.phoneTel}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#B71F1F] underline underline-offset-4"
          >
            <PhoneCall className="size-4" aria-hidden="true" /> Cần đặt nhanh? Gọi{" "}
            {businessInfo.phone}
          </a>
        </div>
        <div className="order-1 min-w-0 lg:order-2">
          <div
            id="hero-coach-interactive"
            role="button"
            tabIndex={0}
            aria-label="Khám phá xe khách Bắc Sơn Cường Nguyệt"
            onClick={() => openImmersive(image360Registry.heroBus)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openImmersive(image360Registry.heroBus);
              }
            }}
            className="group relative cursor-pointer overflow-hidden rounded-[24px] border-[5px] border-white bg-[#F4EBE1] shadow-[0_22px_58px_rgba(54,32,27,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B71F1F]"
          >
            <img
              src={images.heroBus.src}
              srcSet="/images/optimized/hero-bus-480.webp 480w, /images/optimized/hero-bus-800.webp 800w, /images/optimized/hero-bus.webp 1200w"
              sizes="(max-width: 1023px) 100vw, 48vw"
              alt="Hình ảnh thật đội xe Bắc Sơn Cường Nguyệt"
              width={1200}
              height={800}
              loading="eager"
              fetchPriority="high"
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] lg:aspect-[4/4]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-5 pb-5 pt-16 text-white sm:px-7 sm:pb-7">
              <span className="block text-xs font-bold uppercase tracking-widest text-[#FFE1A8]">
                Hình ảnh xe thực tế
              </span>
              <span className="mt-1 block text-xl font-extrabold sm:text-2xl">
                Hà Nội ⇄ Mộc Châu ⇄ Sơn La
              </span>
              <span className="mt-1 block text-xs text-white/90">
                Chạm vào ảnh để khám phá không gian xe
              </span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-2xl border border-[#E5D5C9] bg-white p-2">
              <img
                src={images.cabinWindow.src}
                width="600"
                height="360"
                loading="lazy"
                alt="Ảnh thật khu vực giường nằm cạnh cửa sổ trên xe"
                className="aspect-[16/8] w-full rounded-xl object-cover"
              />
              <p className="px-1 pt-2 text-xs font-bold text-[#47372F]">Không gian giường nằm</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#E5D5C9] bg-white p-2">
              <img
                src={images.interior.src}
                width="600"
                height="360"
                loading="lazy"
                alt="Ảnh thật nội thất nhà xe Bắc Sơn Cường Nguyệt"
                className="aspect-[16/8] w-full rounded-xl object-cover"
              />
              <p className="px-1 pt-2 text-xs font-bold text-[#47372F]">Nội thất xe thực tế</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
