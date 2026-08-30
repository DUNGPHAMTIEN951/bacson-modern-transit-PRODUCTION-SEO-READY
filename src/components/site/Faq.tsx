import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/content";
import { Section, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" tone="white">
      <SectionHead
        eyebrow="Câu hỏi thường gặp"
        title="Đi xe Hà Nội – Sơn La dịp 2/9 cần biết gì?"
        sub="Những câu hỏi khách hay gọi hỏi nhà xe nhất trước khi đặt vé và gửi hàng."
      />

      <ul className="mt-8 grid gap-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li
              key={f.q}
              className="overflow-hidden rounded-xl border border-[#E8DDD0] bg-white shadow-[0_1px_3px_rgba(43,43,43,0.04)] transition"
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.95rem] font-bold text-[#2B2B2B] transition hover:bg-[#FFF4E8]"
                >
                  {f.q}
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-[#D62828] transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                hidden={!isOpen}
                className="px-5 pb-5 text-sm leading-relaxed text-[#6B635B]"
              >
                {f.a}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
