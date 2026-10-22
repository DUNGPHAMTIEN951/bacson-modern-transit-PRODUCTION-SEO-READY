import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  MapPin,
  PhoneCall,
  ShieldCheck,
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
    <section id="top" aria-label="Đặt vé xe Bắc Sơn Cường Nguyệt" className="relative bg-[#FFF9F3]">
      <div className="relative min-h-[455px] overflow-hidden bg-[#392923] sm:min-h-[500px] lg:min-h-[575px]">
        <button
          id="hero-coach-interactive"
          type="button"
          onClick={() => openImmersive(image360Registry.heroBus)}
          className="absolute inset-0 block h-full w-full cursor-zoom-in text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
          aria-label="Khám phá ảnh thật xe Bắc Sơn Cường Nguyệt"
        >
          <img
            src={images.heroBus.src}
            srcSet="/images/optimized/hero-bus-480.webp 480w, /images/optimized/hero-bus-800.webp 800w, /images/optimized/hero-bus.webp 1200w"
            sizes="100vw"
            alt="Hình ảnh thật đội xe Bắc Sơn Cường Nguyệt"
            width={1200}
            height={800}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <span
            className="absolute inset-0 bg-gradient-to-r from-[#201915]/95 via-[#2B211A]/75 to-[#201915]/25 sm:from-[#201915]/95 sm:via-[#2B211A]/65 sm:to-[#201915]/10"
            aria-hidden="true"
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-[#201915]/60 via-transparent to-transparent"
            aria-hidden="true"
          />
        </button>

        <div className="container-page pointer-events-none relative z-10 flex min-h-[455px] items-center py-10 pb-20 sm:min-h-[500px] sm:pb-24 lg:min-h-[575px] lg:pb-28">
          <div className="max-w-[755px] text-white">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur-sm sm:text-sm">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Chuyên tuyến Hà Nội – Mộc Châu – Sơn La
            </p>
            <h1
              className="max-w-[720px] text-[2.35rem] font-bold leading-[1.09] tracking-[-0.025em] sm:text-5xl lg:text-[4.15rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Xe giường nằm
              <span className="mt-1 block text-[#FFE2AD]">Bắc Sơn Cường Nguyệt</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Hành trình Hà Nội – Mộc Châu – Sơn La. Giữ chỗ thuận tiện, nhân viên xác nhận lịch xe
              và điểm đón trước chuyến đi.
            </p>
            <div className="mt-5 flex max-w-xl flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/95 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <TicketPercent className="size-4 text-[#FFE2AD]" aria-hidden="true" /> Giảm 20% mọi
                chuyến
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#FFE2AD]" aria-hidden="true" /> Giấy phép{" "}
                {legalInfo.transportLicense.split(" — ")[0]}
              </span>
            </div>
            <p className="mt-5 text-xs font-medium text-white/75">
              Ảnh đoàn xe thực tế của nhà xe · Chạm vào ảnh để khám phá
            </p>
          </div>
        </div>
      </div>

      <div className="container-page relative z-20 -mt-14 pb-5 sm:-mt-[76px] lg:-mt-[86px]">
        <div className="overflow-hidden rounded-[22px] border border-[#E7D8CE] bg-white shadow-[0_20px_55px_rgba(53,30,25,0.19)]">
          <nav
            aria-label="Lựa chọn dịch vụ"
            className="flex overflow-x-auto border-b border-[#ECDDD2] bg-[#FFFCF8]"
          >
            <a
              href="#hero-quick-booking"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 border-b-[3px] border-[#BD1823] bg-white px-4 text-sm font-extrabold text-[#AE1924] sm:px-6"
            >
              <MapPin className="size-4" aria-hidden="true" /> Đặt vé xe
            </a>
            <a
              href="#lich-chay"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 px-4 text-sm font-semibold text-[#64544C] transition hover:bg-white hover:text-[#AE1924] sm:px-6"
            >
              <Clock3 className="size-4" aria-hidden="true" /> Lịch chạy
            </a>
            <a
              href="#diem-don"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 px-4 text-sm font-semibold text-[#64544C] transition hover:bg-white hover:text-[#AE1924] sm:px-6"
            >
              <MapPin className="size-4" aria-hidden="true" /> Điểm đón
            </a>
            <a
              href="/uu-dai-kham-benh"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 px-4 text-sm font-semibold text-[#64544C] transition hover:bg-white hover:text-[#AE1924] sm:px-6"
            >
              <HeartHandshake className="size-4" aria-hidden="true" /> Ưu đãi khám bệnh
            </a>
          </nav>
          <form
            id="hero-quick-booking"
            onSubmit={handleQuickBooking}
            aria-label="Chọn nhanh tuyến và ngày đi"
            className="grid scroll-mt-24 gap-3 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(200px,.9fr)] lg:items-end lg:gap-4 lg:p-6"
          >
            <label
              className="block min-w-0 text-sm font-bold text-[#40342F]"
              htmlFor="hero-quick-route"
            >
              <span className="mb-1.5 block">Tuyến đường</span>
              <span className="relative block">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#C51A27]"
                  aria-hidden="true"
                />
                <select
                  id="hero-quick-route"
                  name="route"
                  value={quickRoute}
                  onChange={(event) => setQuickRoute(event.target.value)}
                  className="min-h-12 w-full appearance-none rounded-xl border border-[#E5D6CA] bg-[#FFFCF9] pl-10 pr-3 text-sm font-semibold text-[#382720] focus:border-[#BA1A24] focus:outline-none focus:ring-2 focus:ring-[#BA1A24]/15"
                >
                  <option>Hà Nội → Sơn La</option>
                  <option>Hà Nội → Mộc Châu</option>
                  <option>Sơn La → Hà Nội</option>
                  <option>Mộc Châu → Hà Nội</option>
                </select>
              </span>
            </label>
            <label
              className="block min-w-0 text-sm font-bold text-[#40342F]"
              htmlFor="hero-quick-date"
            >
              <span className="mb-1.5 block">Ngày đi</span>
              <span className="relative block">
                <CalendarDays
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#C51A27]"
                  aria-hidden="true"
                />
                <input
                  id="hero-quick-date"
                  name="travel_date"
                  type="date"
                  min={new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  value={quickDate}
                  onChange={(event) => setQuickDate(event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#E5D6CA] bg-[#FFFCF9] pl-10 pr-3 text-sm font-semibold text-[#382720] focus:border-[#BA1A24] focus:outline-none focus:ring-2 focus:ring-[#BA1A24]/15"
                />
              </span>
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#C21825] px-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#A8171D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8171D]"
            >
              Chọn chuyến & giữ chỗ <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <p className="text-center text-xs leading-snug text-[#7C6C62] lg:col-span-3">
              Không thanh toán trước trên website · Nhà xe gọi xác nhận giá vé, lịch và điểm đón ·{" "}
              <a
                href={businessInfo.phoneTel}
                className="font-bold text-[#B71F1F] underline underline-offset-2"
              >
                Hotline {businessInfo.phone}
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
