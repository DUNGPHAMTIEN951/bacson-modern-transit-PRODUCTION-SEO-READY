import { routeStops } from "@/data/schedule";
import { businessInfo } from "@/data/business";
import { Section, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useMotion";

export function RouteTimeline() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <Section ref={ref} id="lo-trinh" tone="light">
      <SectionHead
        eyebrow="Cung đường Tây Bắc"
        title="Lộ trình xe Hà Nội – Mộc Châu – Sơn La"
        sub={`Tuyến chạy dọc trục Tây Bắc, ${businessInfo.distance}, thời gian dự kiến ${businessInfo.duration}.`}
      />

      {/* Desktop: Horizontal Interactive Route with Travelling Golden Highlight */}
      <div className="relative mt-12 hidden md:block">
        {/* Continuous background route track */}
        <div
          className="absolute left-[6%] right-[6%] top-2 h-1 rounded-full bg-[#EAD9C6] overflow-hidden"
          aria-hidden="true"
        >
          {/* Travelling Gold Sparkle Light */}
          {isVisible ? (
            <div className="absolute top-0 size-full bg-gradient-to-r from-transparent via-[#EAB83E] to-transparent opacity-80 route-sparkle" />
          ) : null}
        </div>

        <ol className="relative z-10 grid grid-cols-8">
          {routeStops.map((s, i) => (
            <li
              key={s.name}
              className="group relative flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : "translateY(12px)",
                transitionDelay: `${i * 70}ms`,
              }}
            >
              {/* Waypoint Dot */}
              <span
                className={cn(
                  "relative z-10 grid place-items-center rounded-full transition-transform duration-200 group-hover:scale-125",
                  s.major
                    ? "size-5 bg-[#D51F26] ring-4 ring-[#FFF0C3] shadow-xs text-white text-[0.6rem] font-bold"
                    : "size-3.5 bg-[#EAB83E] ring-4 ring-white shadow-xs",
                )}
                aria-hidden="true"
              >
                {s.major ? "★" : null}
              </span>

              {/* Waypoint Name */}
              <span
                className={cn(
                  "mt-3 block px-1 text-xs leading-snug transition-colors group-hover:text-[#D51F26]",
                  s.major ? "font-black text-[#3A211B] text-sm" : "font-semibold text-[#795F55]",
                )}
                style={{ fontFamily: s.major ? "var(--font-serif)" : "var(--font-sans)" }}
              >
                {s.name}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile: Vertical timeline */}
      <ol className="relative ml-3 mt-8 grid gap-5 border-l-2 border-[#EAD9C6] pl-6 md:hidden">
        {routeStops.map((s) => (
          <li key={s.name} className="relative">
            <span
              className={cn(
                "absolute -left-[1.95rem] top-1 rounded-full",
                s.major
                  ? "size-4 bg-[#D51F26] ring-4 ring-[#FFF0C3]"
                  : "size-3 bg-[#EAB83E] ring-4 ring-white",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "block text-sm",
                s.major ? "font-black text-[#3A211B]" : "font-medium text-[#795F55]",
              )}
            >
              {s.name}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
