/**
 * ContactDock.tsx — Unified Enterprise Contact Dock
 *
 * Art & UX Direction:
 *  - Buttons: 52px desktop / 48px mobile, rounded-full (999px)
 *  - Neutral Buttons: rgba(255,255,255,.96), border 1px rgba(70,40,25,.10), shadow 0 6px 18px rgba(45,25,15,.10)
 *  - Primary Phone: #D9232E, white icon, pseudo-element pulse ring
 *  - Icons: Lucide 21px, stroke-width 1.9, rounded linecaps
 *  - Animations: Applied to button containers only (no icon distortion)
 *  - Desktop Tooltips: #3B2922 background, white text, 8px rounded corners
 */

import { useState, useEffect, useRef } from "react";
import { PhoneCall, PhoneIncoming, MessageCircle, MapPin, CalendarDays } from "lucide-react";
import { businessInfo } from "@/data/business";
import { useBookingModal } from "./BookingModalContext";

export function ContactDock() {
  const { openBookingModal } = useBookingModal();
  const [activeAnim, setActiveAnim] = useState<
    "phone" | "callback" | "zalo" | "calendar" | "location" | null
  >(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check interaction history from sessionStorage
  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        sessionStorage.getItem("contact-interacted") === "true"
      ) {
        setHasInteracted(true);
      }
    } catch {
      // Safe fallback if sessionStorage is restricted
    }
  }, []);

  // Asynchronous Staggered Micro-Animation Scheduler
  useEffect(() => {
    if (isHovered) return;

    let isMounted = true;
    const sequence = ["phone", "callback", "zalo", "calendar", "location"] as const;
    let step = 0;

    const scheduleNext = () => {
      const baseDelay = hasInteracted ? 26000 : 7500;
      const jitter = Math.random() * 2000 - 1000;
      const delay = Math.max(4000, baseDelay + jitter);

      timerRef.current = setTimeout(() => {
        if (!isMounted || isHovered) return;

        const nextAction = sequence[step % sequence.length]!;
        step++;
        setActiveAnim(nextAction);

        setTimeout(() => {
          if (isMounted) setActiveAnim(null);
        }, 650);

        scheduleNext();
      }, delay);
    };

    timerRef.current = setTimeout(() => {
      if (!isMounted || isHovered) return;
      setActiveAnim("phone");
      setTimeout(() => {
        if (isMounted) setActiveAnim(null);
      }, 650);
      scheduleNext();
    }, 3500);

    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasInteracted, isHovered]);

  const handleInteract = () => {
    setHasInteracted(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("contact-interacted", "true");
      }
    } catch {
      // Ignore
    }
  };

  return (
    <aside
      aria-label="Liên hệ nhanh nổi bên phải màn hình"
      className="fixed right-3 sm:right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-3 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── ACTION 1: GỌI ĐẶT VÉ (HOTLINE PRIMARY) ── */}
      <div className="relative flex items-center justify-end">
        {/* Tooltip on Desktop Hover */}
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#3B2922] px-2.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-200 ease-out opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 md:group-hover:block"
        >
          Gọi đặt vé
        </span>

        {/* Pulse ring on container */}
        {activeAnim === "phone" && !isHovered && (
          <span
            className="absolute inset-0 rounded-full bg-[#D9232E] animate-pulse-ring-urgent pointer-events-none"
            aria-hidden="true"
          />
        )}

        <a
          href={businessInfo.phoneTel}
          onClick={handleInteract}
          className={`group relative flex size-12 md:size-[52px] items-center justify-center rounded-full bg-[#D9232E] text-white shadow-[0_6px_18px_rgba(217,35,46,0.35)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(217,35,46,0.45)] active:scale-[0.98] ${
            activeAnim === "phone" && !isHovered ? "animate-phone-shake" : ""
          }`}
          aria-label={`Gọi đặt vé: ${businessInfo.phone}`}
        >
          {/* Tooltip embedded for group hover */}
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#3B2922] px-2.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-200 ease-out opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 md:group-hover:block"
          >
            Gọi đặt vé
          </span>
          <PhoneCall className="size-[21px] stroke-[1.9] text-white" aria-hidden="true" />
        </a>
      </div>

      {/* ── ACTION 2: YÊU CẦU GỌI LẠI (TƯ VẤN) ── */}
      <div className="relative flex items-center justify-end">
        <button
          type="button"
          onClick={() => {
            handleInteract();
            openBookingModal({ source: "contact_dock" });
          }}
          className={`group relative flex size-12 md:size-[52px] items-center justify-center rounded-full border border-[rgba(70,40,25,0.10)] bg-white/96 text-[#D9232E] shadow-[0_6px_18px_rgba(45,25,15,0.10)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#D9232E]/30 hover:bg-[#FFF4E8] hover:shadow-[0_8px_22px_rgba(217,35,46,0.18)] active:scale-[0.98] ${
            activeAnim === "callback" && !isHovered ? "animate-phone-shake" : ""
          }`}
          aria-label="Yêu cầu gọi lại tư vấn chuyến đi"
        >
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#3B2922] px-2.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-200 ease-out opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 md:group-hover:block"
          >
            Yêu cầu gọi lại
          </span>
          <PhoneIncoming className="size-[21px] stroke-[1.9] text-[#D9232E]" aria-hidden="true" />
        </button>
      </div>

      {/* ── ACTION 3: CHAT ZALO ── */}
      <div className="relative flex items-center justify-end">
        <a
          href={businessInfo.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInteract}
          className={`group relative flex size-12 md:size-[52px] items-center justify-center rounded-full border border-[rgba(70,40,25,0.10)] bg-white/96 text-[#0068FF] shadow-[0_6px_18px_rgba(45,25,15,0.10)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#0068FF]/30 hover:bg-[#EEF5FF] hover:shadow-[0_8px_22px_rgba(0,104,255,0.20)] active:scale-[0.98] ${
            activeAnim === "zalo" && !isHovered ? "animate-zalo-bounce" : ""
          }`}
          aria-label={`Chat Zalo: ${businessInfo.zalo}`}
        >
          {/* Subtle Notification Dot */}
          <span
            className="absolute top-0 right-0 size-3 rounded-full bg-[#D9232E] ring-2 ring-white animate-dot-pulse pointer-events-none"
            aria-hidden="true"
          />

          <span
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#3B2922] px-2.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-200 ease-out opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 md:group-hover:block"
          >
            Chat Zalo
          </span>
          <MessageCircle className="size-[21px] stroke-[1.9] text-[#0068FF]" aria-hidden="true" />
        </a>
      </div>

      {/* ── ACTION 4: LỊCH CHẠY ── */}
      <div className="relative flex items-center justify-end">
        <a
          href="#lich-chay"
          onClick={handleInteract}
          className={`group relative flex size-12 md:size-[52px] items-center justify-center rounded-full border border-[rgba(70,40,25,0.10)] bg-white/96 text-[#3B2922] shadow-[0_6px_18px_rgba(45,25,15,0.10)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#D9232E]/30 hover:bg-[#FFF4E8] hover:text-[#D9232E] hover:shadow-[0_8px_22px_rgba(217,35,46,0.15)] active:scale-[0.98] ${
            activeAnim === "calendar" && !isHovered ? "animate-calendar-attention" : ""
          }`}
          aria-label="Xem lịch chạy xe hôm nay"
        >
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#3B2922] px-2.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-200 ease-out opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 md:group-hover:block"
          >
            Xem lịch chạy
          </span>
          <CalendarDays
            className="size-[21px] stroke-[1.9] text-[#3B2922] group-hover:text-[#D9232E] transition-colors"
            aria-hidden="true"
          />
        </a>
      </div>

      {/* ── ACTION 5: ĐIỂM ĐÓN ── */}
      <div className="relative flex items-center justify-end">
        <a
          href="#diem-don"
          onClick={handleInteract}
          className={`group relative flex size-12 md:size-[52px] items-center justify-center rounded-full border border-[rgba(70,40,25,0.10)] bg-white/96 text-[#3B2922] shadow-[0_6px_18px_rgba(45,25,15,0.10)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#D9A441]/40 hover:bg-[#FFF9EE] hover:text-[#D9A441] hover:shadow-[0_8px_22px_rgba(217,164,65,0.20)] active:scale-[0.98] ${
            activeAnim === "location" && !isHovered ? "animate-pin-jump" : ""
          }`}
          aria-label="Xem điểm đón bến xe Mỹ Đình và Sơn La"
        >
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#3B2922] px-2.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-200 ease-out opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 md:group-hover:block"
          >
            Xem điểm đón
          </span>
          <MapPin
            className="size-[21px] stroke-[1.9] text-[#3B2922] group-hover:text-[#D9232E] transition-colors"
            aria-hidden="true"
          />
        </a>
      </div>
    </aside>
  );
}
