import { Bus, Clock, CheckCircle2, Navigation, Sparkles } from "lucide-react";
import type { RouteStop } from "@/data/routes";

interface Props {
  stops: string[];
  detailedStops?: RouteStop[];
  title?: string;
}

export function RouteTimeline({
  stops,
  detailedStops,
  title = "Hành trình & Lộ trình di chuyển",
}: Props) {
  const items =
    detailedStops && detailedStops.length > 0
      ? detailedStops
      : stops.map((stop, i) => ({
          name: stop,
          desc:
            i === 0
              ? "Điểm xuất phát"
              : i === stops.length - 1
                ? "Điểm đến an toàn"
                : "Điểm dừng đón trả cố định",
          timeEstimate: i === 0 ? "Bắt đầu" : undefined,
        }));

  return (
    <section className="mt-12 sm:mt-16 rounded-[32px] sm:rounded-[40px] border border-[#EAD9C6] bg-gradient-to-b from-white via-[#FFFDF9] to-[#FFF8EE] p-6 sm:p-8 md:p-12 shadow-[0_12px_36px_rgba(58,33,27,0.05)]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAD9C6]/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D51F26]/20 bg-[#FBE2DE] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D51F26] mb-3">
            <Sparkles className="size-3.5 text-[#D51F26]" aria-hidden="true" />
            <span>LỘ TRÌNH CHUYÊN TUYẾN QUỐC LỘ 6</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3A211B] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#795F55] max-w-2xl">
            Di chuyển thông suốt trên trục Quốc lộ 6 huyết mạch với các điểm đón trả cố định, đúng
            giờ, an toàn và thuận tiện.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-[#FFF0C3] border border-[#EAB83E]/40 px-4 py-2 text-xs sm:text-sm font-bold text-[#8C6D58] shadow-2xs">
          <Bus className="size-4 text-[#D51F26]" aria-hidden="true" />
          <span>Hành trình {items.length} chặng chính</span>
        </div>
      </div>

      {/* 1. Desktop Horizontal Interactive Transit Roadmap */}
      <div className="mt-10 hidden lg:block">
        <div className="relative pt-6 pb-2">
          {/* Đường ray kết nối chính */}
          <div
            className="absolute top-12 left-12 right-12 h-1.5 bg-gradient-to-r from-[#D51F26] via-[#EAB83E] to-[#D51F26] rounded-full shadow-xs"
            aria-hidden="true"
          />

          <div
            className="grid gap-3 relative z-10"
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
          >
            {items.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === items.length - 1;

              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  {/* Điểm mốc tròn với Icon xe hoặc số thứ tự */}
                  <div
                    className={`relative flex size-14 items-center justify-center rounded-full border-4 border-white shadow-md transition-all duration-300 group-hover:scale-115 ${
                      isFirst || isLast
                        ? "bg-[#D51F26] text-white ring-4 ring-[#D51F26]/20"
                        : "bg-[#FFF8EE] text-[#3A211B] border-[#EAB83E] group-hover:bg-[#EAB83E] group-hover:text-white"
                    }`}
                  >
                    {isFirst || isLast ? (
                      <Bus className="size-6 stroke-[2.2]" aria-hidden="true" />
                    ) : (
                      <span className="text-base font-black">●</span>
                    )}

                    {/* Badge trạng thái xuất phát / điểm đến */}
                    {isFirst && (
                      <span className="absolute -top-6 rounded-full bg-[#1B8341] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                        Xuất phát
                      </span>
                    )}
                    {isLast && (
                      <span className="absolute -top-6 rounded-full bg-[#D51F26] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                        Điểm đến
                      </span>
                    )}
                  </div>

                  {/* Tên trạm dừng lớn font serif */}
                  <h4
                    className="mt-4 text-base sm:text-lg font-bold text-[#3A211B] leading-snug group-hover:text-[#D51F26] transition-colors"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {item.name}
                  </h4>

                  {/* Chi tiết đón trả */}
                  {item.desc && (
                    <p className="mt-1 text-xs text-[#795F55] leading-relaxed max-w-[170px]">
                      {item.desc}
                    </p>
                  )}

                  {/* Thời gian dự kiến */}
                  {item.timeEstimate && (
                    <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-[#FBE2DE] px-2.5 py-1 text-[11px] font-bold text-[#D51F26]">
                      <Clock className="size-3" aria-hidden="true" />
                      <span>{item.timeEstimate}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Mobile & Tablet Vertical Detailed Timeline */}
      <div className="mt-8 lg:hidden space-y-6 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-1.5 before:bg-gradient-to-b before:from-[#D51F26] before:via-[#EAB83E] before:to-[#D51F26] before:rounded-full">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="relative flex items-start gap-4">
              {/* Nút mốc tròn */}
              <div
                className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-md ${
                  isFirst || isLast
                    ? "bg-[#D51F26] text-white ring-2 ring-[#D51F26]/30"
                    : "bg-[#FFF8EE] text-[#3A211B] border-[#EAB83E]"
                }`}
              >
                {isFirst || isLast ? (
                  <Bus className="size-5 stroke-[2.2]" aria-hidden="true" />
                ) : (
                  <span className="text-sm font-black text-[#D51F26]">●</span>
                )}
              </div>

              {/* Hộp nội dung điểm dừng */}
              <div className="flex-1 rounded-2xl border border-[#EAD9C6] bg-white p-4 sm:p-5 shadow-2xs hover:border-[#D51F26]/40 transition">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4
                    className="text-base sm:text-lg font-bold text-[#3A211B]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {item.name}
                  </h4>
                  {item.timeEstimate && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FBE2DE] px-2.5 py-0.5 text-xs font-bold text-[#D51F26]">
                      <Clock className="size-3" aria-hidden="true" />
                      <span>{item.timeEstimate}</span>
                    </span>
                  )}
                </div>

                {item.desc && (
                  <p className="mt-1 text-xs sm:text-sm text-[#795F55] leading-relaxed">
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cam kết lộ trình chuyên tuyến */}
      <div className="mt-8 rounded-2xl bg-[#FFF8EE] border border-[#EAD9C6] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8EE] text-[#1B8341] border border-[#1B8341]/20">
            <CheckCircle2 className="size-5 stroke-[2.5]" aria-hidden="true" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#3A211B] leading-relaxed">
            Xe chạy đúng biểu đồ giờ đăng ký với Sở Giao thông Vận tải. Không dừng đón khách tùy
            tiện kéo dài thời gian di chuyển của hành khách.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-bold text-[#D51F26] shrink-0 self-end sm:self-auto">
          <Navigation className="size-3.5" />
          <span>Biểu đồ giờ chuẩn</span>
        </div>
      </div>
    </section>
  );
}
