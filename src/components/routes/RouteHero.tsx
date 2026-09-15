import {
  PhoneCall,
  CalendarCheck,
  ShieldCheck,
  Bus,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { businessInfo } from "@/data/business";
import type { TransportRoute } from "@/data/routes";

interface Props {
  route: TransportRoute;
}

export function RouteHero({ route }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-[#EAD9C6] bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EE] to-[#FFF4E8] p-6 sm:p-8 md:p-12 lg:p-14 shadow-[0_16px_48px_rgba(58,33,27,0.06)]">
      {/* Decorative background glows */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#EAB83E]/12 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-[#D51F26]/6 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* CỘT TRÁI: NỘI DUNG & CTA (7 cols trên LG) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#D51F26]/20 bg-[#FBE2DE] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D51F26] shadow-2xs">
            <Sparkles className="size-3.5 text-[#D51F26]" aria-hidden="true" />
            <span>Bắc Sơn Cường Nguyệt · Tuyến xe Tây Bắc</span>
          </div>

          {/* Heading lớn font Serif Lora */}
          <h1
            className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[3.35rem] font-extrabold text-[#3A211B] leading-[1.14] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {route.title}
          </h1>

          {/* Subtitle / Thông điệp hành trình */}
          <div className="mt-3 text-base sm:text-lg md:text-xl font-medium text-[#795F55] leading-relaxed">
            <p className="font-bold text-[#D51F26]">Hành trình kết nối Tây Bắc</p>
            <p className="text-[#684C42] mt-0.5">An toàn - tiện nghi - đúng giờ</p>
          </div>

          {/* Mô tả chi tiết */}
          <p className="mt-4 text-sm sm:text-base text-[#472C25] leading-relaxed max-w-2xl">
            {route.description}
          </p>

          {/* 3 Chip thông tin nổi bật: Loại xe, Lộ trình, Giá vé */}
          <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#EAD9C6] bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#3A211B] shadow-xs hover:border-[#D51F26]/40 transition">
              <Bus className="size-4 text-[#D51F26]" aria-hidden="true" />
              <span>{route.vehicle}</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#EAD9C6] bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#3A211B] shadow-xs hover:border-[#EAB83E] transition">
              <MapPin className="size-4 text-[#EAB83E]" aria-hidden="true" />
              <span>{route.routeSummary}</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#D51F26]/30 bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-black text-[#D51F26] shadow-xs">
              <span className="size-2 rounded-full bg-[#D51F26] animate-pulse" />
              <span>{route.price}</span>
            </div>
          </div>

          {/* Nhóm nút CTA chuyển đổi cao */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4">
            <a
              href={`tel:${businessInfo.phone}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D51F26] px-8 py-3.5 text-base font-bold text-white shadow-[0_4px_18px_rgba(213,31,38,0.38)] transition-all duration-200 hover:bg-[#A8171D] hover:shadow-[0_6px_24px_rgba(213,31,38,0.48)] hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              <PhoneCall className="size-5 stroke-[2.2]" aria-hidden="true" />
              <span>Gọi đặt vé</span>
            </a>

            <a
              href="#booking"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[#D51F26] bg-white/90 px-7 py-3.5 text-base font-bold text-[#D51F26] backdrop-blur-xs transition-all duration-200 hover:bg-[#D51F26] hover:text-white hover:-translate-y-0.5 active:translate-y-0 text-center shadow-xs"
            >
              <CalendarCheck className="size-5 stroke-[2.2]" aria-hidden="true" />
              <span>Đăng ký chuyến đi</span>
            </a>
          </div>

          {/* Dòng cam kết chất lượng */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[#795F55]">
            <ShieldCheck className="size-4 text-[#1B8341] shrink-0" aria-hidden="true" />
            <span>Chuyến xe an toàn · Cam kết đón đúng giờ · Không đón khách bắt dọc đường</span>
          </div>
        </div>

        {/* CỘT PHẢI: ẢNH XE LỚN THẬT (5 cols trên LG, chuyển xuống dưới trên mobile) */}
        <div className="lg:col-span-5 order-last">
          <div className="group relative overflow-hidden rounded-[28px] sm:rounded-3xl border-2 border-[#EAD9C6] bg-white p-2.5 sm:p-3 shadow-[0_12px_36px_rgba(58,33,27,0.09)] transition-transform duration-300 hover:shadow-[0_18px_48px_rgba(58,33,27,0.14)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FFF0C3]">
              <img
                src={route.heroImage.src}
                alt={route.heroImage.alt}
                width={800}
                height={600}
                loading="eager"
                decoding="async"
                className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badge góc ảnh */}
              <div className="absolute bottom-3 left-3 rounded-full bg-[#3A211B]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-md flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-[#EAB83E]" />
                <span>Ảnh xe thực tế Bắc Sơn Cường Nguyệt</span>
              </div>
            </div>

            {/* Thông điệp bên dưới ảnh */}
            <div className="p-3 sm:p-4 text-center">
              <p
                className="text-base sm:text-lg font-bold text-[#3A211B]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Dàn xe 34 chỗ cao cấp phục vụ hàng ngày
              </p>
              <p className="mt-1 text-xs text-[#795F55]">
                Bảo dưỡng định kỳ, nội thất sạch sẽ, tài xế kinh nghiệm đèo Tây Bắc
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
