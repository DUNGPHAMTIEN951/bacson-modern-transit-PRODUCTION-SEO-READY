import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import type { RouteFaqItem } from "@/data/routes";

interface Props {
  faq: RouteFaqItem[];
  title?: string;
  subtitle?: string;
}

export function RouteFAQ({
  faq,
  title = "Câu hỏi thường gặp về chuyến xe",
  subtitle = "Tổng hợp những giải đáp chi tiết và hữu ích nhất giúp quý khách chủ động cho hành trình di chuyển.",
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="mt-12 sm:mt-16 rounded-[32px] sm:rounded-[40px] border border-[#EAD9C6] bg-white p-6 sm:p-8 md:p-12 shadow-[0_12px_36px_rgba(58,33,27,0.05)]">
      <div className="border-b border-[#EAD9C6]/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D51F26]/20 bg-[#FBE2DE] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D51F26] mb-3">
            <HelpCircle className="size-3.5 text-[#D51F26]" aria-hidden="true" />
            <span>GIẢI ĐÁP THẮC MẮC HÀNH KHÁCH</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3A211B] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#795F55] max-w-2xl">{subtitle}</p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start md:self-auto text-xs font-bold text-[#8C6D58] bg-[#FFF0C3] border border-[#EAB83E]/40 px-4 py-2 rounded-full shadow-2xs">
          <Sparkles className="size-3.5 text-[#D51F26]" />
          <span>Hỗ trợ 24/7 qua Hotline</span>
        </div>
      </div>

      <div className="mt-6 divide-y divide-[#EAD9C6]/70">
        {faq.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4 sm:py-5 transition-colors">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-start justify-between gap-4 text-left font-bold text-[#3A211B] transition hover:text-[#D51F26] group py-1"
                aria-expanded={isOpen}
              >
                <span
                  className="text-base sm:text-lg md:text-xl font-bold leading-snug group-hover:text-[#D51F26] transition-colors"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {item.question}
                </span>
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen
                      ? "rotate-180 bg-[#D51F26] text-white shadow-xs"
                      : "bg-[#FFF0C3] text-[#D51F26] group-hover:bg-[#FBE2DE]"
                  }`}
                >
                  <ChevronDown className="size-4 stroke-[2.5]" aria-hidden="true" />
                </span>
              </button>

              {isOpen && (
                <div className="mt-3.5 pr-8 sm:pr-12 text-sm sm:text-base text-[#472C25] leading-relaxed animate-in fade-in duration-200">
                  <p className="rounded-2xl bg-[#FFFDF9] border border-[#EAD9C6]/60 p-4 sm:p-5">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
