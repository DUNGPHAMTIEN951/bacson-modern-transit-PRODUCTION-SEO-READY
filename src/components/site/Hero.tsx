import {
  PhoneCall,
  PhoneIncoming,
  MessageCircle,
  BusFront,
  Route,
  Package,
  MapPin,
} from "lucide-react";
import { businessInfo } from "@/data/business";
import { images } from "@/data/images";
import { image360Registry } from "@/data/image360";
import { useImmersiveViewer } from "./ImmersiveImageViewer";
import { useBookingModal } from "./BookingModalContext";
import { useScrollParallax, useMouseParallax } from "@/hooks/useMotion";

/** SVG Vietnam Flag — displayed once, subtly, in hero */
function VietnamFlagBadge() {
  return (
    <svg
      width="36"
      height="24"
      viewBox="0 0 36 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cờ Việt Nam"
      role="img"
    >
      <rect width="36" height="24" rx="2" fill="#DA251D" />
      {/* Five-pointed star */}
      <polygon
        points="18,5 19.6,10 24.9,10 20.6,13.1 22.3,18.5 18,15.3 13.7,18.5 15.4,13.1 11.1,10 16.4,10"
        fill="#FFCD00"
      />
    </svg>
  );
}

/** Hexagonal 2/9 badge — decorative, near coach with slow floating animation */
function NationalDayBadge() {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center badge-float select-none"
      aria-hidden="true"
    >
      {/* Hexagon shape via CSS clip-path */}
      <div
        style={{
          clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
          background: "linear-gradient(160deg, #D51F26 0%, #A8171D 100%)",
          width: 72,
          height: 82,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(213,31,38,0.4)",
        }}
      >
        <span className="text-[#F4C84A] text-base leading-none star-twinkle">★</span>
        <span
          className="mt-0.5 text-[0.52rem] font-black leading-tight text-white uppercase tracking-wide"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          MỪNG
          <br />
          QUỐC KHÁNH
        </span>
        <span className="text-[#F4C84A] text-sm font-black leading-none mt-0.5">2/9</span>
      </div>
    </div>
  );
}

/** Location label — bottom of coach image */
function LocationLabel() {
  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm shadow-xs">
      <MapPin className="size-3 text-[#EAB83E] stroke-[2]" aria-hidden="true" />
      <span className="text-[0.65rem] font-semibold text-white">Đèo Pha Đin, Sơn La</span>
    </div>
  );
}

export function Hero() {
  const { openImmersive } = useImmersiveViewer();
  const { openBookingModal } = useBookingModal();

  // Parallax offsets on scroll
  const bgParallax = useScrollParallax(0.18, 35);
  const midParallax = useScrollParallax(0.28, 45);
  const coachParallax = useScrollParallax(0.08, 15);
  const textParallax = useScrollParallax(0.04, 10);

  // Mouse tilt depth on desktop pointer
  const mouseTilt = useMouseParallax(0.4, 3.5);

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[#EAD9C6]"
      style={{
        background: `linear-gradient(112deg, #FFF3DC 0%, #FFEBC8 35%, #FFE0B0 65%, #FFD49A 100%)`,
        minHeight: "clamp(520px, 80vh, 760px)",
      }}
    >
      {/* ── LAYER 1: Mountain landscape background with slow scroll parallax ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 will-change-transform"
        aria-hidden="true"
        style={{
          backgroundImage: `url(/images/son-la-mountain-hero.svg)`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          opacity: 0.82,
          transform: `translate3d(${mouseTilt.x * -0.6}px, ${bgParallax + mouseTilt.y * -0.6}px, 0)`,
          transition: "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* ── LAYER 2: Cinematic subtle travelling sunlight highlight ── */}
      <div
        className="pointer-events-none absolute -inset-y-32 -left-48 w-72 sunlight-highlight z-[1]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 235, 180, 0.45) 50%, transparent 100%)",
          filter: "blur(24px)",
        }}
      />

      {/* ── Left light veil — keeps headline clear and readable ── */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[58%]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,243,220,0.92) 0%, rgba(255,237,200,0.78) 55%, rgba(255,237,200,0) 100%)",
        }}
      />

      {/* ── Bottom gradient blend ── */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 z-[1] h-20"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,248,238,0) 0%, rgba(255,248,238,0.9) 100%)",
        }}
      />

      <div className="container-page relative z-10 flex min-h-[clamp(520px,80vh,760px)] items-center py-10 md:py-14">
        <div className="grid w-full items-center gap-8 lg:grid-cols-11 lg:gap-6">
          {/* ══════════════════════════════════════════════════
              LEFT: Narrative, 2-Tier Slogan, Benefits + CTAs
              ══════════════════════════════════════════════════ */}
          <div
            className="lg:col-span-6 will-change-transform"
            style={{
              transform: `translate3d(0, ${textParallax}px, 0)`,
            }}
          >
            {/* Double ribbon badge — matching reference with intro animation */}
            <div className="flex flex-wrap items-center gap-2 intro-badge">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 shadow-xs"
                style={{
                  background: "#D51F26",
                  borderRadius: "3px 0 0 3px",
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
                  paddingRight: "18px",
                }}
              >
                <span className="text-[#F4C84A] text-sm leading-none star-twinkle">★</span>
                <span
                  className="text-[0.68rem] font-black text-white uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Chào mừng Quốc khánh 2/9
                </span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 shadow-xs"
                style={{
                  background: "#FFF0C3",
                  border: "1.5px solid #F0D17A",
                  borderRadius: "3px",
                }}
              >
                <span
                  className="text-[0.68rem] font-black text-[#A8171D] uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Chuyến trở về quê hương
                </span>
              </div>
            </div>

            {/* Main editorial typography — 2 tiers with staggered intro */}
            <h1 className="mt-4 leading-none" style={{ fontFamily: "var(--font-serif)" }}>
              <span
                className="block font-bold text-[#3A211B] intro-slogan-1"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Sơn La
              </span>
              <span
                className="block font-semibold italic text-[#D51F26] intro-slogan-2"
                style={{
                  fontSize: "clamp(2.1rem, 5vw, 3.8rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.08,
                }}
              >
                những chuyến đi
              </span>
            </h1>

            {/* Supporting line */}
            <p
              className="mt-4 max-w-xl text-base leading-snug text-[#5A3828] sm:text-lg intro-slogan-2"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Chào mừng Quốc khánh 2/9 – đồng hành cùng những hành trình trở về quê nhà.
            </p>
            <p
              className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#795F55] intro-slogan-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Mỗi chuyến xe đưa khoảng cách ngắn lại, để những cuộc gặp gỡ đến gần hơn.
            </p>

            {/* Compact benefit row — 4 items with unified icon containers */}
            <div
              className="mt-5 grid grid-cols-2 gap-2.5 rounded-xl border border-[#EAD9C6] bg-white/80 p-3 backdrop-blur-sm sm:grid-cols-4 intro-cta"
              style={{ maxWidth: 540 }}
            >
              {[
                { icon: BusFront, label: "Xe giường nằm" },
                { icon: Route, label: "HN – MC – SL" },
                { icon: Package, label: "Gửi hàng" },
                { icon: PhoneCall, label: "Đặt vé hotline" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <div
                    className="grid size-10 place-items-center rounded-xl bg-[rgba(217,35,46,0.06)] text-[#D9232E] border border-[rgba(217,35,46,0.08)] shadow-xs"
                    aria-hidden="true"
                  >
                    <Icon className="size-5 stroke-[1.9] text-[#D9232E]" />
                  </div>
                  <span
                    className="text-[0.7rem] font-bold text-[#3B2922]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA group — 3 actions with balanced hierarchy */}
            <div className="mt-6 flex flex-wrap items-center gap-3 intro-cta">
              {/* Primary: Hotline */}
              <a
                href={businessInfo.phoneTel}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D9232E] px-5 text-[0.88rem] font-black text-white shadow-[0_2px_10px_rgba(217,35,46,0.28)] transition-all duration-[220ms] ease-out hover:-translate-y-0.5 hover:bg-[#A8171D] hover:shadow-[0_6px_20px_rgba(217,35,46,0.38)] active:scale-[0.98] btn-primary btn-pulse animate-cta-shimmer"
                style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}
              >
                <PhoneCall
                  className="size-4 shrink-0 stroke-[2] phone-wobble text-white"
                  aria-hidden="true"
                />
                <span>
                  GỌI ĐẶT VÉ 2/9
                  <span className="block text-[0.65rem] font-semibold opacity-90">
                    {businessInfo.phone}
                  </span>
                </span>
              </a>

              {/* Secondary: Yêu cầu gọi lại */}
              <button
                type="button"
                onClick={() => openBookingModal({ source: "hero_callback" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-[1.5px] border-[#EAD9C6] bg-white px-5 text-[0.88rem] font-bold text-[#D9232E] shadow-[0_2px_8px_rgba(43,43,43,0.04)] backdrop-blur-sm transition-all duration-[220ms] hover:-translate-y-0.5 hover:border-[#D9232E] hover:bg-[#FFF4E8] hover:shadow-[0_4px_14px_rgba(217,35,46,0.15)] active:scale-[0.98]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <PhoneIncoming
                  className="size-4 shrink-0 stroke-[2] text-[#D9232E]"
                  aria-hidden="true"
                />
                <span>Yêu cầu gọi lại</span>
              </button>

              {/* Tertiary: Zalo */}
              <a
                href={businessInfo.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-[1.5px] border-[#EAD9C6] bg-white/80 px-4 text-[0.88rem] font-bold text-[#3A211B] backdrop-blur-sm transition-all duration-[220ms] hover:-translate-y-0.5 hover:border-[#0068FF] hover:bg-[#EEF5FF] active:scale-[0.98]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <MessageCircle
                  className="size-4 shrink-0 stroke-[2] text-[#0068FF] transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                Chat Zalo
              </a>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT: Coach image + Layered depth + Badges
              ══════════════════════════════════════════════════ */}
          <div
            className="relative lg:col-span-5 intro-coach will-change-transform"
            style={{
              transform: `translate3d(${mouseTilt.x * 0.8}px, ${coachParallax + mouseTilt.y * 0.8}px, 0) rotate3d(${mouseTilt.rx}, ${mouseTilt.ry}, 0, ${Math.abs(mouseTilt.rx)}deg)`,
              transition: "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Vietnam flag in top-right corner */}
            <div className="absolute -top-2 right-0 z-20 drop-shadow-md">
              <VietnamFlagBadge />
            </div>

            {/* Coach image — full-bleed with landscape merge & immersive click */}
            <div className="relative">
              <div
                id="hero-coach-interactive"
                role="button"
                tabIndex={0}
                onClick={() => openImmersive(image360Registry.heroBus)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openImmersive(image360Registry.heroBus);
                  }
                }}
                aria-label="Khám phá xe khách Bắc Sơn Cường Nguyệt"
                className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-white/60 shadow-[0_8px_40px_rgba(58,33,27,0.22)] transition-all duration-400 ease-out select-none"
                style={{
                  background: "linear-gradient(160deg, #FFD9A0 0%, #FFC880 100%)",
                }}
              >
                <img
                  src={images.heroBus.src}
                  alt="Xe khách giường nằm Bắc Sơn Cường Nguyệt tuyến Hà Nội – Mộc Châu – Sơn La"
                  width={images.heroBus.width}
                  height={images.heroBus.height}
                  className="aspect-[16/11] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.018]"
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Subtle dark vignette on hover */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-400 group-hover:bg-black/15" />

                {/* Image warm overlay at bottom for depth */}
                <div
                  className="pointer-events-none absolute bottom-0 inset-x-0 h-24"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 0%, rgba(200,120,50,0.25) 100%)",
                  }}
                />

                <LocationLabel />

                {/* Subtle Interactive Indicator Badge (Top-Left of Image) */}
                <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/30 bg-black/60 px-3 py-1 text-[0.7rem] font-bold text-white shadow-md backdrop-blur-md transition-all duration-300 group-hover:border-[#EAB83E]/80 group-hover:bg-black/80">
                  <span
                    className="text-[#EAB83E] transition-transform duration-400 group-hover:rotate-[25deg]"
                    aria-hidden="true"
                  >
                    ↻
                  </span>
                  <span>Khám phá xe</span>
                </div>
              </div>

              {/* 2/9 Hexagonal badge — overlapping coach top-right */}
              <div className="absolute -right-3 top-4 z-20 drop-shadow-xl pointer-events-none">
                <NationalDayBadge />
              </div>

              {/* Route info floating card at bottom with subtle parallax */}
              <div className="absolute -bottom-5 left-4 right-10 rounded-xl border border-[#EAD9C6] bg-white/95 px-4 py-3 shadow-[0_4px_20px_rgba(58,33,27,0.12)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[0.65rem] font-black uppercase tracking-wider text-[#D51F26]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Tuyến chính
                  </span>
                  <span
                    className="flex items-center gap-1 text-[0.65rem] font-bold text-[#A8171D]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    <span className="text-[#EAB83E] star-twinkle">★</span>
                    Dịp lễ 2/9
                  </span>
                </div>
                <p
                  className="mt-0.5 text-base font-black text-[#3A211B]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Hà Nội ⇄ Mộc Châu ⇄ Sơn La
                </p>
                <p
                  className="mt-0.5 text-[0.68rem] text-[#795F55]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {businessInfo.distance} · {businessInfo.duration}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom breathing room for route card */}
      <div className="pb-8 md:pb-10" aria-hidden="true" />
    </section>
  );
}
