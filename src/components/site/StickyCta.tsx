import { useState, useEffect } from "react";
import { PhoneCall, MessageCircle, MapPin } from "lucide-react";
import { businessInfo } from "@/data/business";

/** Smart mobile contact bar with scroll detection & context-aware labeling */
export function StickyCta() {
  const [isVisible, setIsVisible] = useState(false);
  const [contextAction, setContextAction] = useState<"book" | "reserve" | "directions">("book");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show only after scrolling past hero (~350px)
      setIsVisible(scrollY > 350);

      // Context detection based on visible sections
      const scheduleEl = document.getElementById("lich-chay");
      const faresEl = document.getElementById("gia-ve");
      const officesEl = document.getElementById("diem-don");

      if (officesEl) {
        const rect = officesEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.7 && rect.bottom >= 100) {
          setContextAction("directions");
          return;
        }
      }

      if (scheduleEl || faresEl) {
        const sRect = scheduleEl?.getBoundingClientRect();
        const fRect = faresEl?.getBoundingClientRect();
        const inSchedule = sRect && sRect.top <= window.innerHeight * 0.7 && sRect.bottom >= 100;
        const inFares = fRect && fRect.top <= window.innerHeight * 0.7 && fRect.bottom >= 100;
        if (inSchedule || inFares) {
          setContextAction("reserve");
          return;
        }
      }

      setContextAction("book");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Liên hệ nhanh di động"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2.5 border-t border-[#EAD9C6] bg-white/95 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(58,33,27,0.12)] backdrop-blur-md transition-all duration-350 ease-out md:hidden"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(110%)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Primary Action */}
      <a
        href={businessInfo.phoneTel}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D51F26] px-3 text-xs font-black text-white shadow-[0_2px_8px_rgba(213,31,38,0.25)] transition-all duration-200 active:scale-[0.98] btn-pulse animate-cta-shimmer"
        style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}
      >
        <PhoneCall className="size-4 shrink-0 stroke-[2] text-white" aria-hidden="true" />
        <span>
          {contextAction === "reserve"
            ? "GỌI GIỮ CHỖ 2/9"
            : contextAction === "directions"
              ? "GỌI NHÀ XE"
              : "GỌI ĐẶT VÉ 2/9"}
        </span>
      </a>

      {/* Secondary Action: Zalo or Directions */}
      {contextAction === "directions" ? (
        <a
          href="#diem-don"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#EAD9C6] bg-[#FFF8EE] px-3 text-xs font-bold text-[#3A211B] shadow-xs transition-all duration-200 active:scale-[0.98]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <MapPin className="size-4 shrink-0 stroke-[2] text-[#D51F26]" aria-hidden="true" />
          <span>CHỈ ĐƯỜNG ĐÓN</span>
        </a>
      ) : (
        <a
          href={businessInfo.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#3A211B] px-3 text-xs font-black text-white shadow-xs transition-all duration-200 active:scale-[0.98]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <MessageCircle className="size-4 shrink-0 stroke-[2] text-white" aria-hidden="true" />
          <span>CHAT ZALO</span>
        </a>
      )}
    </nav>
  );
}
