/**
 * VietnamLoadingScreen.tsx — Premium Vietnamese Cultural Loading Screen
 *
 * Art Direction & Cultural Motifs:
 *  - Background: Translucent warm bronze veil (rgba(45, 25, 15, 0.48)) with 3px backdrop blur
 *  - Focal 1: Trống đồng Đông Sơn (Bronze Drum) in golden line-art vector with slow 22s rotation & breathing glow
 *  - Focal 2: Con hạc Việt Nam (Traditional Crane) in ivory & gold with red crest and graceful floating animation
 *  - Focal 3: Mây truyền thống (Vietnamese traditional spiral clouds) drifting gently
 *  - Focal 4: Orbital golden rings & floating glowing light particles (#FFD36A, #F6C76A, #D82027)
 *  - Typography: Serif "Đang tải hành trình..." with animated gold-red-gold dots
 *  - Exit Transition: 800ms smooth unmount sequence (drum scale -> crane fade -> overlay fade -> unmount)
 */

import { useState, useEffect, useId, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   1. TRỐNG ĐỒNG ĐÔNG SƠN (ĐÔNG SƠN BRONZE DRUM SVG)
   High-detail concentric vector ornament with 14-pointed sun star
───────────────────────────────────────────────────────────── */
function DongSonDrum() {
  const maskId = useId();
  const gradId = useId();

  return (
    <svg
      viewBox="0 0 400 400"
      className="size-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE8A3" />
          <stop offset="35%" stopColor="#EAB83E" />
          <stop offset="70%" stopColor="#C99218" />
          <stop offset="100%" stopColor="#87570D" />
        </linearGradient>

        <radialGradient id={`${gradId}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(234, 184, 62, 0.25)" />
          <stop offset="60%" stopColor="rgba(234, 184, 62, 0.08)" />
          <stop offset="100%" stopColor="rgba(234, 184, 62, 0)" />
        </radialGradient>
      </defs>

      {/* Central Soft Glow Ambient */}
      <circle cx="200" cy="200" r="190" fill={`url(#${gradId}-glow)`} />

      {/* Outer Rim Bands */}
      <circle
        cx="200"
        cy="200"
        r="192"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        opacity="0.45"
      />
      <circle
        cx="200"
        cy="200"
        r="185"
        stroke={`url(#${gradId})`}
        strokeWidth="2.5"
        opacity="0.85"
      />
      <circle
        cx="200"
        cy="200"
        r="177"
        stroke={`url(#${gradId})`}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.75"
      />

      {/* Ring 1: Outer Tangential Spikes / Sawtooth Teeth (Vành răng cưa ngoài) */}
      <g stroke={`url(#${gradId})`} strokeWidth="1.2" opacity="0.7">
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 360) / 48;
          return (
            <line
              key={`tooth-${i}`}
              x1="200"
              y1="25"
              x2="200"
              y2="31"
              transform={`rotate(${angle} 200 200)`}
            />
          );
        })}
      </g>

      <circle
        cx="200"
        cy="200"
        r="168"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Ring 2: Flying Birds Band (Vành chim Lạc bay ngược chiều kim đồng hồ) */}
      <g opacity="0.85">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <g key={`bird-${i}`} transform={`rotate(${angle} 200 200)`}>
              {/* Stylized Lac Bird Silhouette */}
              <path
                d="M 188 44 Q 200 38 214 43 Q 206 46 198 48 Q 192 51 184 53 Q 186 48 188 44 Z"
                fill={`url(#${gradId})`}
                opacity="0.85"
              />
              <circle cx="213" cy="42.5" r="1" fill="#FFE8A3" />
            </g>
          );
        })}
      </g>

      <circle
        cx="200"
        cy="200"
        r="150"
        stroke={`url(#${gradId})`}
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.65"
      />
      <circle cx="200" cy="200" r="144" stroke={`url(#${gradId})`} strokeWidth="2" opacity="0.9" />

      {/* Ring 3: Concentric Circles with Dots (Vành vòng tròn có chấm giữa) */}
      <g stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.75">
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i * 360) / 32;
          return (
            <circle
              key={`dotring-${i}`}
              cx="200"
              cy="65"
              r="2"
              transform={`rotate(${angle} 200 200)`}
            />
          );
        })}
      </g>

      <circle
        cx="200"
        cy="200"
        r="130"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        opacity="0.85"
      />
      <circle
        cx="200"
        cy="200"
        r="120"
        stroke={`url(#${gradId})`}
        strokeWidth="1"
        strokeDasharray="4 2"
        opacity="0.6"
      />

      {/* Ring 4: Traditional Diamond / Chevron Band (Họa tiết hình thoi gãy khúc) */}
      <g stroke={`url(#${gradId})`} strokeWidth="1.2" opacity="0.8">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <path
              key={`diamond-${i}`}
              d="M 197 86 L 200 81 L 203 86 L 200 91 Z"
              fill="none"
              transform={`rotate(${angle} 200 200)`}
            />
          );
        })}
      </g>

      <circle cx="200" cy="200" r="105" stroke={`url(#${gradId})`} strokeWidth="2" opacity="0.9" />
      <circle cx="200" cy="200" r="92" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.7" />

      {/* Ring 5: Inner Sun Ray Band / 14-Pointed Star (Ngôi sao 14 cánh biểu tượng Mặt Trời) */}
      <g fill={`url(#${gradId})`} opacity="0.95">
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * 360) / 14;
          return (
            <polygon
              key={`sunray-${i}`}
              points="196,115 200,98 204,115 200,111"
              transform={`rotate(${angle} 200 200)`}
            />
          );
        })}
      </g>

      <circle
        cx="200"
        cy="200"
        r="82"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        opacity="0.85"
      />
      <circle cx="200" cy="200" r="70" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />

      {/* Inner Central Sun Core */}
      <circle cx="200" cy="200" r="28" fill={`url(#${gradId})`} opacity="0.2" />
      <circle cx="200" cy="200" r="14" fill={`url(#${gradId})`} opacity="0.55" />
      <circle cx="200" cy="200" r="4" fill="#FFF4D0" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. MÂY TRUYỀN THỐNG VIỆT NAM (TRADITIONAL CLOUD MOTIFS)
   Spiral cloud clusters with delicate golden outlines
───────────────────────────────────────────────────────────── */
function VietnameseCloud({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 90"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cloudGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#EAB83E" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#C99218" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="cloudFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 245, 227, 0.45)" />
          <stop offset="70%" stopColor="rgba(234, 184, 62, 0.15)" />
          <stop offset="100%" stopColor="rgba(234, 184, 62, 0)" />
        </radialGradient>
      </defs>

      {/* Cloud Ambient Soft Fill */}
      <path
        d="M 30 65 Q 15 65 15 50 Q 15 35 32 32 Q 38 15 60 15 Q 75 15 84 25 Q 95 10 120 12 Q 145 15 145 40 Q 152 48 150 58 Q 146 68 132 68 Q 120 68 110 65 Q 98 75 80 75 Q 55 75 45 68 Z"
        fill="url(#cloudFill)"
      />

      {/* Outer Traditional Cloud Spirals */}
      <path
        d="M 22 55 C 14 55 10 46 14 38 C 18 30 28 28 35 32 C 40 18 56 12 70 16 C 80 20 86 28 88 34 C 96 22 114 18 128 24 C 142 30 146 44 140 54 C 148 58 150 68 144 74 C 136 82 122 80 114 74 C 104 84 86 86 74 80 C 62 84 48 82 40 74 C 30 76 22 68 22 55 Z"
        stroke="url(#cloudGold)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Inner Decorative Spiral Curls */}
      <path
        d="M 28 46 C 32 40 40 40 44 45 C 48 50 46 56 40 58 C 34 60 28 54 30 48"
        stroke="url(#cloudGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 72 32 C 78 26 88 28 92 34 C 96 42 90 50 82 50 C 74 50 70 42 74 36"
        stroke="url(#cloudGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 124 42 C 128 36 136 38 138 44 C 140 50 134 56 128 54"
        stroke="url(#cloudGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN VIETNAM LOADING SCREEN OVERLAY
───────────────────────────────────────────────────────────── */
const MIN_LOADING_TIME = 600; // ms (minimum visible branding time to avoid flashing)
const EXIT_DURATION = 300; // ms (smooth exit timeline: 0-120ms crane rise, 100-250ms fade, 300ms unmount)
const MAX_FAILSAFE = 4500; // ms (hard fallback safety cap if network/events hang)

export function VietnamLoadingScreen() {
  const [phase, setPhase] = useState<"loading" | "exiting" | "unmounted">("loading");
  const [imgFailed, setImgFailed] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const startedAt = performance.now();
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    let unmountTimer: ReturnType<typeof setTimeout> | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let isCompleted = false;

    const startExitSequence = () => {
      if (isCompleted || !isMountedRef.current) return;
      isCompleted = true;

      setPhase("exiting");
      unmountTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setPhase("unmounted");
        }
      }, EXIT_DURATION);
    };

    const triggerFinish = () => {
      if (isCompleted || !isMountedRef.current) return;

      // If document is hidden in background tab, finish immediately without waiting
      if (typeof document !== "undefined" && document.hidden) {
        startExitSequence();
        return;
      }

      const elapsed = performance.now() - startedAt;
      if (elapsed < MIN_LOADING_TIME) {
        exitTimer = setTimeout(startExitSequence, MIN_LOADING_TIME - elapsed);
      } else {
        startExitSequence();
      }
    };

    // 1. Document Readiness Check
    const checkDocumentReady = new Promise<void>((resolve) => {
      if (typeof document === "undefined" || document.readyState === "complete") {
        resolve();
      } else {
        const onLoad = () => resolve();
        window.addEventListener("load", onLoad, { once: true });
        document.addEventListener(
          "readystatechange",
          () => {
            if (document.readyState === "complete") resolve();
          },
          { once: true },
        );
      }
    });

    // 2. Critical WebFonts Ready Check (max 350ms cap so slow fonts never block loader)
    const checkFontsReady = new Promise<void>((resolve) => {
      if (typeof document !== "undefined" && "fonts" in document) {
        const fontTimeout = setTimeout(() => resolve(), 350);
        document.fonts.ready
          .then(() => {
            clearTimeout(fontTimeout);
            resolve();
          })
          .catch(() => resolve());
      } else {
        resolve();
      }
    });

    // 3. Critical Crane Asset Preload/Decode Check
    const checkCraneAsset = new Promise<void>((resolve) => {
      if (typeof window === "undefined") {
        resolve();
        return;
      }
      const img = new Image();
      img.src = "/images/vietnamese-crane-loading.webp";
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Fail-safe: don't hang if image fails
      }
    });

    // Run combined readiness
    Promise.all([checkDocumentReady, checkFontsReady, checkCraneAsset])
      .then(() => {
        triggerFinish();
      })
      .catch(() => {
        triggerFinish();
      });

    // 4. Hard safety fallback timer (max 4.5s)
    fallbackTimer = setTimeout(startExitSequence, MAX_FAILSAFE);

    return () => {
      isMountedRef.current = false;
      if (exitTimer) clearTimeout(exitTimer);
      if (unmountTimer) clearTimeout(unmountTimer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  if (phase === "unmounted") return null;

  const isExiting = phase === "exiting";

  return (
    <aside
      aria-label="Màn hình tải văn hóa Việt Nam"
      aria-live="polite"
      aria-hidden={isExiting}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        backgroundColor: isExiting ? "rgba(45, 25, 15, 0)" : "rgba(45, 25, 15, 0.48)",
        backdropFilter: isExiting ? "blur(0px)" : "blur(3px)",
        WebkitBackdropFilter: isExiting ? "blur(0px)" : "blur(3px)",
        opacity: isExiting ? 0 : 1,
        transition:
          "opacity 300ms ease-out, background-color 300ms ease-out, backdrop-filter 300ms ease-out, -webkit-backdrop-filter 300ms ease-out",
        pointerEvents: isExiting ? "none" : "auto",
        willChange: "opacity, backdrop-filter",
      }}
    >
      {/* ── CENTRAL COMPOSITION: DRUM + CRANE + CLOUDS + ORBITS ── */}
      <div
        className="relative flex items-center justify-center will-change-transform"
        style={{
          width: "min(380px, 86vw)",
          height: "min(380px, 86vw)",
          transform: isExiting ? "scale(1.02)" : "scale(1)",
          opacity: isExiting ? 0 : 1,
          transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease-out",
        }}
      >
        {/* Layer 0: Central Diffuse Ambient Glow (No harsh circular hotspot) */}
        <div
          className="pointer-events-none absolute -inset-6 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 215, 130, 0.18) 0%, rgba(255, 200, 80, 0.06) 45%, transparent 72%)",
            filter: "blur(16px)",
            opacity: isExiting ? 0 : 1,
            transition: "opacity 200ms ease-out",
          }}
        />

        {/* Layer 1: Orbital Thin Golden Rings (Đường viền quỹ đạo mảnh) */}
        <div
          className="absolute inset-[-14px] rounded-full border border-[#EAB83E]/20 animate-orbit-spin pointer-events-none"
          style={{
            animationDuration: "24s",
            opacity: isExiting ? 0 : 1,
            transition: "opacity 180ms ease-out",
          }}
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-[#FFE58F] shadow-[0_0_8px_#FFE58F]" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-[#D51F26] shadow-[0_0_6px_#D51F26]" />
        </div>

        <div
          className="absolute inset-[-28px] rounded-full border border-[#EAB83E]/12 animate-orbit-spin pointer-events-none"
          style={{
            animationDuration: "36s",
            animationDirection: "reverse",
            opacity: isExiting ? 0 : 1,
            transition: "opacity 180ms ease-out",
          }}
        >
          <span className="absolute top-1/4 -right-1 size-1.5 rounded-full bg-[#F4C84A] shadow-[0_0_6px_#F4C84A]" />
        </div>

        {/* Layer 2: Trống Đồng Đông Sơn (Rotating 22s, behind crane) */}
        <div
          className="absolute inset-2 animate-dongson-spin pointer-events-none will-change-transform"
          style={{
            opacity: isExiting ? 0 : 0.42,
            transform: isExiting ? "scale(1.025)" : "scale(1)",
            transition: "transform 140ms ease-out, opacity 240ms ease-out",
          }}
        >
          <DongSonDrum />
        </div>

        {/* Layer 3: Floating Clouds (Mây truyền thống — hạc là focal point) */}
        {/* Cloud 1: Top Right */}
        <div
          className="absolute -top-6 -right-8 w-32 md:w-40 animate-cloud-drift-right pointer-events-none"
          style={{
            animationDuration: "7s",
            opacity: isExiting ? 0 : 0.68,
            transition: "opacity 180ms ease-out",
          }}
        >
          <VietnameseCloud />
        </div>

        {/* Cloud 2: Bottom Left */}
        <div
          className="absolute -bottom-4 -left-10 w-36 md:w-44 animate-cloud-drift-left pointer-events-none"
          style={{
            animationDuration: "6.5s",
            opacity: isExiting ? 0 : 0.72,
            transition: "opacity 180ms ease-out",
          }}
        >
          <VietnameseCloud />
        </div>

        {/* Cloud 3: Mid Left subtle */}
        <div
          className="absolute top-1/4 -left-12 w-24 md:w-28 animate-cloud-drift-left pointer-events-none"
          style={{
            animationDuration: "8.5s",
            opacity: isExiting ? 0 : 0.52,
            transition: "opacity 180ms ease-out",
          }}
        >
          <VietnameseCloud />
        </div>

        {/* Cloud 4: Mid Right subtle */}
        <div
          className="absolute bottom-1/4 -right-10 w-26 md:w-32 animate-cloud-drift-right pointer-events-none"
          style={{
            animationDuration: "9s",
            opacity: isExiting ? 0 : 0.52,
            transition: "opacity 180ms ease-out",
          }}
        >
          <VietnameseCloud />
        </div>

        {/* Layer 4: Con Hạc Việt Nam — Asset-based Illustrated Crane Artwork */}
        <div
          className={`relative z-20 select-none pointer-events-none flex items-center justify-center will-change-transform ${
            isExiting ? "" : "animate-crane-float"
          }`}
          style={{
            width: "clamp(150px, 48vw, 270px)",
            aspectRatio: "600 / 767",
            filter:
              "drop-shadow(0 3px 5px rgba(45, 25, 15, 0.16)) drop-shadow(0 0 12px rgba(238, 183, 76, 0.24))",
            transform: isExiting ? "translateY(-6px) scale(1.015)" : "translateY(0) scale(1)",
            opacity: isExiting ? 0 : imgFailed ? 0 : 1,
            transition: "transform 180ms ease-out, opacity 220ms ease-out",
          }}
        >
          {!imgFailed && (
            <picture className="block size-full select-none pointer-events-none">
              <source srcSet="/images/vietnamese-crane-loading.webp" type="image/webp" />
              <img
                src="/images/vietnamese-crane-loading.png"
                alt=""
                aria-hidden="true"
                width={600}
                height={767}
                className="vietnam-loading-crane size-full object-contain"
                draggable="false"
                onError={() => setImgFailed(true)}
              />
            </picture>
          )}
        </div>

        {/* Layer 5: Sparkling Gold Particles (12 Hạt ánh sáng bay lơ lửng) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const positions = [
            { top: "12%", left: "20%", delay: "0s", dur: "2.8s", color: "#FFD36A", size: "3px" },
            { top: "18%", right: "18%", delay: "0.4s", dur: "3.2s", color: "#F6C76A", size: "4px" },
            {
              bottom: "16%",
              left: "22%",
              delay: "0.8s",
              dur: "2.6s",
              color: "#D82027",
              size: "3px",
            },
            {
              bottom: "22%",
              right: "20%",
              delay: "1.2s",
              dur: "3.5s",
              color: "#FFE8A3",
              size: "3.5px",
            },
            { top: "45%", left: "6%", delay: "0.3s", dur: "3s", color: "#FFD36A", size: "2.5px" },
            { top: "48%", right: "8%", delay: "0.9s", dur: "2.9s", color: "#F4C84A", size: "4px" },
            { top: "6%", left: "52%", delay: "1.5s", dur: "3.4s", color: "#FFE58F", size: "3px" },
            {
              bottom: "8%",
              left: "48%",
              delay: "0.6s",
              dur: "3.1s",
              color: "#D82027",
              size: "3px",
            },
            { top: "28%", left: "14%", delay: "1.1s", dur: "2.7s", color: "#F6C76A", size: "2px" },
            { top: "32%", right: "12%", delay: "1.7s", dur: "3.3s", color: "#FFD36A", size: "3px" },
            {
              bottom: "30%",
              left: "12%",
              delay: "0.2s",
              dur: "3.6s",
              color: "#FFE8A3",
              size: "3px",
            },
            {
              bottom: "35%",
              right: "14%",
              delay: "1.4s",
              dur: "2.5s",
              color: "#F4C84A",
              size: "2.5px",
            },
          ];
          const p = positions[i]!;
          return (
            <span
              key={`sparkle-${i}`}
              className="absolute rounded-full animate-particle-float pointer-events-none"
              style={{
                top: p.top,
                bottom: p.bottom,
                left: p.left,
                right: p.right,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                animationDelay: p.delay,
                animationDuration: p.dur,
                opacity: isExiting ? 0 : undefined,
                transition: isExiting ? "opacity 160ms ease-out" : undefined,
              }}
            />
          );
        })}
      </div>

      {/* ── BOTTOM: ELEGANT SERIF LOADING TEXT & SEQUENTIAL DOTS ── */}
      <div
        className={`mt-4 flex flex-col items-center gap-2.5 transition-all duration-200 ${
          isExiting ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        <p
          className="text-lg md:text-xl font-bold tracking-wide text-[#FFF5E3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          style={{
            fontFamily: "var(--font-serif)",
            letterSpacing: "0.02em",
            opacity: 0.95,
          }}
        >
          Đang tải hành trình...
        </p>

        {/* Three sequential scaling dots: Gold – Red – Gold */}
        <div className="flex items-center gap-2" aria-hidden="true">
          <span
            className="size-2 rounded-full bg-[#F4C84A] shadow-[0_0_6px_#F4C84A] animate-dot-scale"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="size-2 rounded-full bg-[#D51F26] shadow-[0_0_6px_#D51F26] animate-dot-scale"
            style={{ animationDelay: "160ms" }}
          />
          <span
            className="size-2 rounded-full bg-[#F4C84A] shadow-[0_0_6px_#F4C84A] animate-dot-scale"
            style={{ animationDelay: "320ms" }}
          />
        </div>
      </div>
    </aside>
  );
}
