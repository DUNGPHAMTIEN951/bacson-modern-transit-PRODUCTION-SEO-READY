import { Info, PhoneIncoming } from "lucide-react";
import { fares, fareDisclaimer } from "@/data/fares";
import { Section, SectionHead, CallButton, ZaloButton } from "./primitives";
import { useBookingModal } from "./BookingModalContext";
import { cn } from "@/lib/utils";

export function Fares() {
  const { openBookingModal } = useBookingModal();

  return (
    <Section id="gia-ve" tone="alt">
      <SectionHead
        eyebrow="Bảng giá niêm yết"
        title="Giá vé xe Hà Nội – Sơn La"
        sub="Mức giá dưới đây theo nội dung niêm yết hiện tại của nhà xe. Gọi trước để xác nhận giá, chỗ trống và chính sách dịp Quốc khánh 2/9."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {fares.map((f) => (
          <article
            key={f.id}
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(43,43,43,0.04),0_4px_12px_rgba(43,43,43,0.04)] transition",
              f.featured ? "border-2 border-[#D62828]" : "border border-[#E8DDD0]",
            )}
          >
            <div
              className={cn(
                "border-b px-5 py-3 text-sm font-extrabold",
                f.featured
                  ? "border-[#F5D47A] bg-[#FFF2C9] text-[#B71F1F]"
                  : "border-[#E8DDD0] bg-[#FFF4E8] text-[#2B2B2B]",
              )}
            >
              {f.route}
            </div>
            <div className="flex flex-1 flex-col justify-between gap-3 p-5">
              <div>
                <p
                  className={cn(
                    "text-3xl font-black tracking-tight sm:text-4xl",
                    f.featured ? "text-[#D62828]" : "text-[#2B2B2B]",
                  )}
                >
                  {f.price}
                </p>
                <p className="mt-1.5 text-sm text-[#6B635B]">{f.meta}</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  openBookingModal({
                    prefillRoute: f.route,
                    source: "fares_callback",
                  })
                }
                className="mt-2 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#E8DDD0] bg-[#FFF9F3] px-3 text-xs font-bold text-[#D51F26] transition-all hover:bg-[#D51F26] hover:text-white"
              >
                <PhoneIncoming className="size-3.5 stroke-[2]" aria-hidden="true" />
                <span>Tư vấn tuyến này</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#E8DDD0] bg-[#FFF4E8] p-4 text-sm leading-relaxed text-[#2B2B2B]">
        <Info className="mt-0.5 size-4 shrink-0 text-[#D62828] stroke-[2]" aria-hidden="true" />
        {fareDisclaimer}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <CallButton label="Kiểm tra giá & giữ chỗ dịp 2/9" />
        <button
          type="button"
          onClick={() => openBookingModal({ source: "fares_callback" })}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E8DDD0] bg-white px-6 text-sm font-bold text-[#D51F26] shadow-[0_2px_8px_rgba(43,43,43,0.04)] transition-all duration-[220ms] ease-out hover:-translate-y-0.5 hover:border-[#D51F26] hover:bg-[#FFF4E8] hover:shadow-[0_6px_18px_rgba(214,40,40,0.12)] active:scale-[0.98]"
        >
          <PhoneIncoming className="size-4 shrink-0 stroke-[2] text-[#D51F26]" aria-hidden="true" />
          <span>Yêu cầu tư vấn giá vé</span>
        </button>
        <ZaloButton />
      </div>
    </Section>
  );
}
