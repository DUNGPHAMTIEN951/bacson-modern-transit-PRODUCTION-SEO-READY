import { Bus, BadgeDollarSign, MapPin, PackageCheck, LucideIcon, Sparkles } from "lucide-react";
import type { RouteHighlight } from "@/data/routes";

interface Props {
  highlights: RouteHighlight[];
  title?: string;
}

const iconMap: Record<string, LucideIcon> = {
  bus: Bus,
  badgeDollarSign: BadgeDollarSign,
  clock: MapPin,
  package: PackageCheck,
};

export function RouteInfoCards({ highlights, title = "Thông tin nhanh chuyến xe" }: Props) {
  return (
    <section className="mt-8 sm:mt-12" aria-label={title}>
      {/* 4 Cards thông tin nhanh chuẩn hóa */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, index) => {
          const Icon = iconMap[item.iconName] || Bus;
          return (
            <div
              key={index}
              className="group relative flex flex-col justify-between rounded-[28px] border border-[#EAD9C6] bg-gradient-to-b from-white to-[#FFFDF9] p-6 sm:p-7 shadow-[0_4px_20px_rgba(58,33,27,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D51F26]/50 hover:shadow-[0_16px_32px_rgba(213,31,38,0.1)]"
            >
              {/* Subtle gold badge in top-right */}
              <div className="absolute top-5 right-5 text-[#EAB83E]/40 group-hover:text-[#EAB83E] transition-colors">
                <Sparkles className="size-4" aria-hidden="true" />
              </div>

              <div>
                {/* Icon box với hiệu ứng nền đỏ mềm cao cấp */}
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#FBE2DE] text-[#D51F26] border border-[#D51F26]/15 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#D51F26] group-hover:text-white">
                  <Icon className="size-7 stroke-[2.2]" aria-hidden="true" />
                </div>

                {/* Tiêu đề chính (Serif Lora) */}
                <h3
                  className="mt-5 text-2xl sm:text-[1.75rem] font-black text-[#3A211B] tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {item.title}
                </h3>

                {/* Mô tả nổi bật màu đỏ thương hiệu */}
                <p className="mt-2 text-base sm:text-lg font-bold text-[#D51F26] leading-snug">
                  {item.desc}
                </p>

                {/* Subtext giải thích */}
                {item.sub && (
                  <p className="mt-2 text-xs sm:text-sm text-[#795F55] leading-relaxed">
                    {item.sub}
                  </p>
                )}
              </div>

              {/* Bottom assurance pill */}
              <div className="mt-6 pt-3.5 border-t border-[#EAD9C6]/50 flex items-center justify-between text-xs font-semibold text-[#8C6D58]">
                <span className="flex items-center gap-1">
                  <span className="text-[#1B8341]">✓</span> Tiêu chuẩn chuẩn hãng
                </span>
                <span className="text-[11px] font-bold text-[#EAB83E] uppercase tracking-wider">
                  Bắc Sơn
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Re-export as alias for compatibility
export { RouteInfoCards as RouteHighlights };
