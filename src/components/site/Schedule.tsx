import { Clock, MapPin, Moon, PhoneCall, PhoneIncoming, MessageCircle } from "lucide-react";
import { schedule } from "@/data/schedule";
import { businessInfo } from "@/data/business";
import { Section, SectionHead } from "./primitives";
import { useBookingModal } from "./BookingModalContext";
import { cn } from "@/lib/utils";

export function Schedule() {
  const { openBookingModal } = useBookingModal();

  return (
    <Section id="lich-chay" tone="white">
      <SectionHead
        eyebrow="Chuyến xe dịp lễ Quốc khánh 2/9"
        title="Lịch xe Hà Nội – Sơn La hôm nay"
        sub="Các chuyến xuất bến cố định hai chiều Mỹ Đình ⇄ Sơn La"
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {schedule.map((card) => (
          <article
            key={card.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white shadow-[0_1px_3px_rgba(43,43,43,0.04),0_4px_12px_rgba(43,43,43,0.04)]"
          >
            <header className="border-b border-[#E8DDD0] bg-[#FFF4E8] px-5 py-4 sm:px-6">
              <h3 className="text-lg font-extrabold text-[#2B2B2B] sm:text-xl">{card.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#D62828]">
                <MapPin className="size-3.5 text-[#D62828] stroke-[2]" aria-hidden="true" />
                Xuất phát: {card.depart}
              </p>
            </header>

            <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
              <div>
                <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#6B635B]">
                  Các giờ xuất bến:
                </p>
                <ul className="flex flex-wrap gap-2">
                  {card.trips.map((t) => (
                    <li key={t.time}>
                      <span
                        className={cn(
                          "inline-flex min-h-9 items-center gap-1 rounded-lg px-3 text-sm font-bold tabular-nums",
                          t.night
                            ? "border border-[#F5D47A] bg-[#FFF2C9] text-[#B71F1F]"
                            : "border border-[#E8DDD0] bg-[#FFF9F3] text-[#2B2B2B]",
                        )}
                      >
                        {t.night ? (
                          <Moon className="size-3.5 text-[#D62828] stroke-[2]" aria-hidden="true" />
                        ) : null}
                        {t.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="grid gap-3 rounded-xl border border-[#E8DDD0] bg-[#FFF9F3] p-4 text-sm">
                <div>
                  <dt className="text-[0.7rem] font-bold uppercase tracking-wider text-[#6B635B]">
                    Lộ trình
                  </dt>
                  <dd className="mt-1 leading-relaxed text-[#2B2B2B]">{card.routeLine}</dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-bold uppercase tracking-wider text-[#6B635B]">
                    Thời gian dự kiến
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 font-medium text-[#2B2B2B]">
                    <Clock className="size-4 text-[#D62828] stroke-[2]" aria-hidden="true" />
                    {card.duration}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-bold uppercase tracking-wider text-[#6B635B]">
                    Lưu ý
                  </dt>
                  <dd className="mt-1 text-[#6B635B]">{card.note}</dd>
                </div>
              </dl>

              <div className="mt-auto grid gap-2.5 sm:grid-cols-3">
                <a
                  href={businessInfo.phoneTel}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#D62828] px-3 text-xs font-bold text-white shadow-[0_2px_6px_rgba(214,40,40,0.18)] transition-all duration-[220ms] hover:-translate-y-0.5 hover:bg-[#B71F1F] hover:shadow-[0_5px_14px_rgba(214,40,40,0.26)] active:scale-[0.98]"
                >
                  <PhoneCall className="size-3.5 stroke-[2]" aria-hidden="true" />
                  <span>Gọi giữ chỗ</span>
                </a>
                <button
                  type="button"
                  onClick={() =>
                    openBookingModal({
                      prefillRoute: card.title,
                      source: "schedule_card",
                    })
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-[#FFF9F3] px-3 text-xs font-bold text-[#D51F26] transition-all duration-[220ms] hover:-translate-y-0.5 hover:border-[#D51F26] hover:bg-[#FFF4E8] active:scale-[0.98]"
                >
                  <PhoneIncoming className="size-3.5 stroke-[2]" aria-hidden="true" />
                  <span>Tư vấn chuyến</span>
                </button>
                <a
                  href={businessInfo.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-white px-3 text-xs font-bold text-[#2B2B2B] transition-all duration-[220ms] hover:-translate-y-0.5 hover:border-[#0068FF] hover:bg-[#EEF5FF] active:scale-[0.98]"
                >
                  <MessageCircle
                    className="size-3.5 stroke-[2] text-[#0068FF]"
                    aria-hidden="true"
                  />
                  <span>Hỏi qua Zalo</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-[#8F857B]">
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#FFF2C9] text-[#D62828]">
          <Moon className="size-2.5" aria-hidden="true" />
        </span>
        Khung giờ nền vàng nhạt là chuyến chạy tối/đêm.
      </p>
    </Section>
  );
}
