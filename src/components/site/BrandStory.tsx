import { images } from "@/data/images";
import { image360Registry } from "@/data/image360";
import { ImmersiveImage } from "./ImmersiveImage";
import { useScrollReveal } from "@/hooks/useMotion";

/* ── 4 Custom SVG Line Illustrations for the Journey Stages (Style: warm terracotta / gold line art) ── */
function CitySkylineIllustration() {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      className="w-full h-14 transition-colors duration-300 group-hover:stroke-[#D51F26]"
      stroke="#B88A68"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* City buildings & landmark silhouettes */}
      <line x1="5" y1="62" x2="115" y2="62" stroke="#D4A882" strokeWidth="1.5" />
      {/* Tall building */}
      <rect x="15" y="24" width="16" height="38" />
      <line x1="23" y1="12" x2="23" y2="24" />
      <line x1="19" y1="30" x2="19" y2="33" />
      <line x1="27" y1="30" x2="27" y2="33" />
      <line x1="19" y1="40" x2="19" y2="43" />
      <line x1="27" y1="40" x2="27" y2="43" />
      <line x1="19" y1="50" x2="19" y2="53" />
      <line x1="27" y1="50" x2="27" y2="53" />
      {/* Medium tower */}
      <rect x="36" y="16" width="20" height="46" />
      <polygon points="46,6 40,16 52,16" />
      <line x1="41" y1="24" x2="44" y2="24" />
      <line x1="48" y1="24" x2="51" y2="24" />
      <line x1="41" y1="34" x2="44" y2="34" />
      <line x1="48" y1="34" x2="51" y2="34" />
      <line x1="41" y1="44" x2="44" y2="44" />
      <line x1="48" y1="44" x2="51" y2="44" />
      {/* Stepped building */}
      <path d="M62,62 L62,32 L70,32 L70,22 L78,22 L78,32 L86,32 L86,62" />
      <line x1="68" y1="38" x2="80" y2="38" />
      <line x1="68" y1="46" x2="80" y2="46" />
      <line x1="68" y1="54" x2="80" y2="54" />
      {/* Modern low block */}
      <rect x="92" y="38" width="18" height="24" />
      <line x1="97" y1="46" x2="105" y2="46" />
      <line x1="97" y1="54" x2="105" y2="54" />
    </svg>
  );
}

function MountainPassIllustration() {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      className="w-full h-14 transition-colors duration-300 group-hover:stroke-[#D51F26]"
      stroke="#B88A68"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Mountain peaks background */}
      <path d="M5,62 L28,26 L48,50 L68,18 L92,48 L115,62" stroke="#C49B7A" strokeDasharray="3,2" />
      {/* Main mountain ridge */}
      <path d="M12,62 L42,32 L58,46 L82,22 L110,62" />
      <path d="M42,32 L46,40 L38,44" stroke="#D4A882" />
      <path d="M82,22 L88,32 L78,38" stroke="#D4A882" />
      {/* Winding mountain road */}
      <path d="M60,62 Q45,54 58,46 Q72,38 64,30" stroke="#D51F26" strokeWidth="1.4" />
      <path
        d="M64,62 Q50,54 62,46 Q76,38 68,30"
        stroke="#EAB83E"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      {/* Sun / mist hint */}
      <circle cx="98" cy="18" r="7" stroke="#EAB83E" strokeDasharray="2,2" />
    </svg>
  );
}

function SonLaHomeIllustration() {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      className="w-full h-14 transition-colors duration-300 group-hover:stroke-[#D51F26]"
      stroke="#B88A68"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Backdrop hill */}
      <path d="M10,62 Q50,28 110,62" stroke="#C49B7A" strokeDasharray="3,2" />
      {/* Northwest stilt house / traditional roof */}
      <polygon points="35,38 20,48 50,48" />
      <polygon points="35,34 16,48 54,48" stroke="#D51F26" />
      <rect x="23" y="48" width="24" height="14" />
      <line x1="30" y1="52" x2="30" y2="62" />
      <rect x="35" y="52" width="8" height="6" />
      {/* Second house */}
      <polygon points="75,42 62,50 88,50" />
      <rect x="65" y="50" width="20" height="12" />
      <line x1="72" y1="54" x2="72" y2="62" />
      {/* Trees */}
      <path d="M96,62 L96,44 M96,44 Q90,40 96,36 Q102,40 96,44 M96,48 Q88,46 96,42 Q104,46 96,48" />
      <path d="M12,62 L12,48 M12,48 Q8,45 12,42 Q16,45 12,48" />
      <line x1="5" y1="62" x2="115" y2="62" stroke="#D4A882" />
    </svg>
  );
}

function CoachContinuingIllustration() {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      className="w-full h-14 transition-colors duration-300 group-hover:stroke-[#D51F26]"
      stroke="#B88A68"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Coach bus body */}
      <path
        d="M18,30 Q22,24 35,24 L92,24 Q102,24 104,32 L106,46 Q106,52 98,52 L22,52 Q16,52 16,46 Z"
        stroke="#D51F26"
        strokeWidth="1.4"
      />
      {/* Windshield & windows */}
      <path d="M22,28 L34,28 L34,40 L19,40 Q19,34 22,28 Z" />
      <rect x="38" y="28" width="16" height="12" rx="1" />
      <rect x="58" y="28" width="16" height="12" rx="1" />
      <rect x="78" y="28" width="16" height="12" rx="1" />
      {/* Wheels */}
      <circle cx="34" cy="52" r="6" fill="#FFF8EE" stroke="#3A211B" strokeWidth="1.5" />
      <circle cx="34" cy="52" r="2.5" fill="#D51F26" />
      <circle cx="86" cy="52" r="6" fill="#FFF8EE" stroke="#3A211B" strokeWidth="1.5" />
      <circle cx="86" cy="52" r="2.5" fill="#D51F26" />
      {/* Road speed lines */}
      <line x1="8" y1="58" x2="112" y2="58" stroke="#D4A882" strokeWidth="1.5" />
      <line x1="2" y1="44" x2="10" y2="44" stroke="#EAB83E" strokeDasharray="3,3" />
      <line x1="4" y1="48" x2="12" y2="48" stroke="#EAB83E" strokeDasharray="3,3" />
    </svg>
  );
}

/* ── Ribbon Flourish SVG decoration for bottom-right corner ── */
function RedRibbonFlourish() {
  return (
    <svg
      viewBox="0 0 220 80"
      fill="none"
      className="pointer-events-none absolute -bottom-6 -right-6 w-52 md:w-64 opacity-90"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D51F26" />
          <stop offset="50%" stopColor="#E83038" />
          <stop offset="100%" stopColor="#A8171D" />
        </linearGradient>
        <linearGradient id="goldEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F4C84A" />
          <stop offset="100%" stopColor="#D4A52E" />
        </linearGradient>
      </defs>
      {/* Flowing ribbon wave */}
      <path
        d="M10,65 C60,20 120,75 180,35 C195,25 210,30 220,40 L218,52 C205,42 192,38 178,48 C120,88 62,35 12,78 Z"
        fill="url(#ribbonGrad)"
      />
      {/* Golden edge line */}
      <path
        d="M10,65 C60,20 120,75 180,35 C195,25 210,30 220,40"
        stroke="url(#goldEdge)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const stages = [
  {
    step: "01",
    title: "Rời Hà Nội",
    desc: "Từ những ngày bận rộn nơi thành phố, hành trình trở về bắt đầu.",
    Illustration: CitySkylineIllustration,
  },
  {
    step: "02",
    title: "Qua Mộc Châu",
    desc: "Cung đường nối những khoảng cách, mang theo sự mong chờ của ngày gặp lại.",
    Illustration: MountainPassIllustration,
  },
  {
    step: "03",
    title: "Về với Sơn La",
    desc: "Sau những chặng đường dài, Sơn La hiện ra gần hơn – nơi có gia đình, ký ức và những điều thân thuộc.",
    Illustration: SonLaHomeIllustration,
  },
  {
    step: "04",
    title: "Tiếp tục đồng hành",
    desc: "Qua mỗi mùa Quốc khánh, mỗi chuyến xe lại đưa thêm nhiều người gần hơn với quê nhà.",
    Illustration: CoachContinuingIllustration,
  },
];

export function BrandStory() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.12 });

  return (
    <section
      ref={sectionRef}
      id="hanh-trinh"
      className="relative overflow-hidden border-b border-[#EAD9C6] bg-[#FFF8EE] py-14 md:py-20"
    >
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -left-40 top-20 size-96 rounded-full bg-[#FFF0C3]/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-10 size-80 rounded-full bg-[#FBE2DE]/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* ══════════════════════════════════════════════════
              LEFT / CENTER: Title, Story Prose & 4-Stage Timeline
              ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-8">
            {/* Section Header with Golden Star */}
            <div
              className="flex items-center gap-2.5 transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : "translateY(16px)",
              }}
            >
              <h2
                className="text-2xl font-bold tracking-tight text-[#3A211B] sm:text-3xl lg:text-4xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Những chuyến xe <br className="hidden sm:inline" />
                <span className="text-[#D51F26]">của ngày trở về</span>
              </h2>
              <span
                className="text-2xl text-[#EAB83E] leading-none select-none star-twinkle"
                aria-hidden="true"
              >
                ★
              </span>
            </div>

            {/* Emotional Story Paragraphs */}
            <div
              className="mt-4 max-w-2xl space-y-3 text-sm leading-relaxed text-[#5A3828] sm:text-base transition-all duration-700 delay-100 ease-out"
              style={{
                fontFamily: "var(--font-sans)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : "translateY(16px)",
              }}
            >
              <p>
                <b className="text-[#3A211B]">Có những chuyến đi bắt đầu từ một kỳ nghỉ lễ.</b> Có
                những chuyến đi bắt đầu từ nỗi nhớ nhà.
              </p>
              <p className="text-[#795F55]">
                Mỗi dịp Quốc khánh 2/9, trên hành trình{" "}
                <b className="text-[#3A211B]">Hà Nội – Mộc Châu – Sơn La</b>, nhiều hành khách lại
                trở về với gia đình, với những cuộc gặp gỡ, với nhịp sống thân quen nơi quê nhà.
              </p>
              <p className="text-[#795F55]">
                Bắc Sơn Cường Nguyệt trân trọng được đồng hành cùng những chuyến trở về ấy – như một
                phần nhỏ trong hành trình kết nối con người với Sơn La.
              </p>
            </div>

            {/* ─── 4-Stage Horizontal Journey Timeline ─── */}
            <div className="relative mt-8 pt-4">
              {/* Connecting dashed route line with progressive draw & travelling sparkle */}
              <div
                className="pointer-events-none absolute left-8 right-8 top-8 hidden h-[2px] overflow-hidden lg:block"
                aria-hidden="true"
              >
                {/* Dashed base line */}
                <div
                  className="size-full border-t-2 border-dashed border-[#EAD9C6] transition-all duration-1000 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left center",
                  }}
                />
                {/* Travelling Golden Sparkle Light */}
                {isVisible ? (
                  <div className="absolute top-0 size-2.5 -translate-y-1/2 rounded-full bg-[#EAB83E] shadow-[0_0_8px_#EAB83E] route-sparkle" />
                ) : null}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
                {stages.map((st, idx) => (
                  <div
                    key={st.step}
                    className="group relative flex flex-col items-center rounded-xl border border-[#EAD9C6]/80 bg-white/75 p-4 text-center shadow-xs transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-md"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "none" : "translateY(20px)",
                      transitionDelay: `${200 + idx * 120}ms`,
                    }}
                  >
                    {/* Stage number with red circle + gold star */}
                    <div
                      className="relative z-10 grid size-8 place-items-center rounded-full bg-[#D51F26] text-white shadow-xs transition-transform duration-300 group-hover:scale-110"
                      aria-hidden="true"
                    >
                      <span
                        className="text-xs font-black"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {st.step}
                      </span>
                    </div>

                    {/* Stage Title */}
                    <h3
                      className="mt-3 text-sm font-bold text-[#3A211B] sm:text-base transition-colors duration-200 group-hover:text-[#D51F26]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {st.title}
                    </h3>

                    {/* Stage Description */}
                    <p
                      className="mt-1 text-xs leading-relaxed text-[#795F55]"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {st.desc}
                    </p>

                    {/* Custom SVG Line Art Illustration */}
                    <div className="mt-3 w-full pt-1 border-t border-[#EAD9C6]/50">
                      <st.Illustration />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT: Travel Scrapbook Photo Collage (Reference Style)
              ══════════════════════════════════════════════════ */}
          <div
            className="relative lg:col-span-4 transition-all duration-700 delay-300 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "none" : "translateY(24px)",
            }}
          >
            <div className="relative mx-auto max-w-sm py-4 lg:max-w-none">
              {/* Photo 1: Departure & family (Top Left, rotated -3deg with perspective tilt) */}
              <div className="relative z-10 w-[78%] rounded-lg border-4 border-white bg-white shadow-md photo-scrap-1">
                <ImmersiveImage
                  entryOrImg={image360Registry.busDeparting ?? images.busDeparting}
                  aspectRatio="4/3"
                  className="rounded-sm"
                />
              </div>

              {/* Photo 2: Coach Interior / Cabin comfort (Bottom Left, rotated +2.5deg) */}
              <div className="relative z-20 -mt-10 ml-auto w-[76%] rounded-lg border-4 border-white bg-white shadow-md photo-scrap-2">
                <ImmersiveImage
                  entryOrImg={image360Registry.interior ?? images.interior}
                  aspectRatio="4/3"
                  className="rounded-sm"
                />
              </div>

              {/* Decorative Red Heart / Reunion Badge floating between photos */}
              <div
                className="absolute left-[42%] top-[34%] z-30 grid size-9 place-items-center rounded-full bg-[#D51F26] text-white shadow-md border-2 border-white badge-float"
                aria-hidden="true"
              >
                <span className="text-sm leading-none">♥</span>
              </div>

              {/* Handwritten-style Quote Banner */}
              <div className="relative z-20 mt-4 rounded-xl border border-[#EAD9C6] bg-white/90 p-4 text-center shadow-sm backdrop-blur-xs transition-transform duration-300 hover:-translate-y-0.5">
                <p
                  className="text-base font-semibold italic text-[#D51F26] sm:text-lg"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  “Mỗi chuyến đi là một hành trình đoàn tụ.”
                </p>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[#EAB83E]">
                  <span className="star-twinkle">★</span>
                  <span className="h-[1px] w-8 bg-[#EAB83E]" />
                  <span className="star-twinkle">★</span>
                </div>
              </div>

              {/* Red Ribbon Flourish in bottom-right */}
              <RedRibbonFlourish />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
