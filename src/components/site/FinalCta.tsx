import { PhoneCall, MessageCircle } from "lucide-react";
import { businessInfo } from "@/data/business";

export function FinalCta() {
  return (
    <section
      id="lien-he"
      className="relative overflow-hidden border-t border-[#EAD9C6] py-14 md:py-20"
      style={{
        background: "linear-gradient(180deg, #FFF8EE 0%, #FFF3E1 100%)",
      }}
    >
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-[#FFF0C3]/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative z-10 text-center">
        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3.5 py-1"
          style={{
            background: "#FFF0C3",
            border: "1.5px solid #F0D17A",
            borderRadius: "4px",
          }}
        >
          <span className="text-[#D51F26] text-xs">★</span>
          <span
            className="text-[0.7rem] font-extrabold uppercase tracking-widest text-[#A8171D]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Nghỉ lễ Quốc khánh 2/9
          </span>
        </div>

        {/* Headline */}
        <h2
          className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-[#3A211B] sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Bạn đang chuẩn bị <br className="hidden sm:inline" />
          <span className="text-[#D51F26]">trở về Sơn La dịp 2/9?</span>
        </h2>

        {/* Subtitle */}
        <p
          className="mx-auto mt-3.5 max-w-xl text-base leading-relaxed text-[#795F55]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Liên hệ sớm để chọn chuyến phù hợp cho hành trình của bạn. Nhà xe luôn sẵn sàng giữ chỗ và
          hỗ trợ đón trả thuận tiện.
        </p>

        {/* CTA Group */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <a
            href={businessInfo.phoneTel}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#D51F26] px-8 text-base font-black text-white shadow-[0_2px_10px_rgba(213,31,38,0.28)] transition-all duration-[220ms] ease-out hover:-translate-y-0.5 hover:bg-[#A8171D] hover:shadow-[0_6px_20px_rgba(213,31,38,0.38)] active:scale-[0.98] btn-pulse sm:w-auto"
            style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}
          >
            <PhoneCall className="size-5 stroke-[2]" aria-hidden="true" />
            GỌI ĐẶT VÉ 2/9: {businessInfo.phone}
          </a>

          <a
            href={businessInfo.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-[1.5px] border-[#EAD9C6] bg-white px-8 text-base font-bold text-[#3A211B] shadow-[0_1px_3px_rgba(58,33,27,0.05)] transition-all duration-[220ms] hover:-translate-y-0.5 hover:border-[#0068FF] hover:bg-[#EEF5FF] active:scale-[0.98] sm:w-auto"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <MessageCircle className="size-5 stroke-[2] text-[#0068FF]" aria-hidden="true" />
            Nhắn Zalo: {businessInfo.zalo}
          </a>
        </div>

        {/* Secondary hotline */}
        <p className="mt-5 text-sm text-[#795F55]" style={{ fontFamily: "var(--font-sans)" }}>
          Hotline dự phòng:{" "}
          <a
            href={businessInfo.phone2Tel}
            className="font-bold text-[#D51F26] transition hover:underline"
          >
            {businessInfo.phone2}
          </a>
        </p>
      </div>
    </section>
  );
}
