import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PhoneCall,
  MessageCircle,
  MapPin,
  Building2,
  Home,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema, organizationSchema } from "@/data/seo-schema";
import { createBreadcrumbSchema } from "@/components/seo/BreadcrumbJsonLd";
import { siteConfig } from "@/data/business";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RouteTrust } from "@/components/routes/RouteTrust";
import { RouteBooking } from "@/components/routes/RouteBooking";
import { RouteFAQ } from "@/components/routes/RouteFAQ";
import { RouteInfoCards } from "@/components/routes/RouteInfoCards";
import { lienHeRouteData } from "@/data/routes";

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ Xe khách Bắc Sơn Cường Nguyệt | Hotline 0848.755.766" },
      {
        name: "description",
        content:
          "Thông tin liên hệ nhà xe Bắc Sơn Cường Nguyệt. Tổng đài đặt vé, gửi hàng hai chiều Hà Nội - Sơn La, địa chỉ văn phòng tại Sơn La và Bến xe Mỹ Đình.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.canonical}lien-he` }],
  }),
  component: LienHePage,
});

function LienHePage() {
  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#3A211B] flex flex-col font-sans selection:bg-[#FBE2DE] selection:text-[#D51F26]">
      {/* Schemas SEO giữ nguyên 100% */}
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Trang chủ", url: siteConfig.domain },
          { name: "Liên hệ", url: `${siteConfig.domain}/lien-he` },
        ])}
      />

      {/* Header đồng bộ Homepage */}
      <Header />

      <main className="flex-1">
        <div className="container-page py-6 sm:py-10">
          {/* Breadcrumb điều hướng */}
          <nav aria-label="Đường dẫn trang" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-[#795F55]">
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-semibold text-[#3A211B] hover:text-[#D51F26] transition"
            >
              <Home className="size-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#D51F26]">Liên hệ nhà xe</span>
          </nav>

          {/* 1. HERO LIÊN HỆ & CONVERSION CAO CẤP */}
          <section className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-[#EAD9C6] bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EE] to-[#FFF4E8] p-6 sm:p-8 md:p-12 lg:p-14 shadow-[0_16px_48px_rgba(58,33,27,0.06)]">
            <div
              className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#EAB83E]/12 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-[#D51F26]/6 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ & DIRECT CTAs (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#D51F26]/20 bg-[#FBE2DE] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D51F26] shadow-2xs">
                  <Sparkles className="size-3.5 text-[#D51F26]" aria-hidden="true" />
                  <span>Tổng đài phục vụ hành khách 24/7</span>
                </div>

                <h1
                  className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#3A211B] leading-[1.15] tracking-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Liên hệ Bắc Sơn Cường Nguyệt
                </h1>

                <p className="mt-3 text-base sm:text-lg md:text-xl font-bold text-[#D51F26]">
                  Tư vấn lộ trình - Giữ chỗ chu đáo - Gửi hàng nhanh trong ngày
                </p>

                <p className="mt-4 text-sm sm:text-base text-[#472C25] leading-relaxed max-w-2xl">
                  {lienHeRouteData.description}
                </p>

                {/* Khối liên hệ nhanh: Hotline + Zalo + Địa chỉ */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card Hotline */}
                  <a
                    href={`tel:${lienHeRouteData.hotline}`}
                    className="flex items-center gap-4 rounded-2xl border-2 border-[#D51F26] bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group"
                  >
                    <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-[#D51F26] text-white shadow-xs group-hover:bg-[#A8171D] transition-colors">
                      <PhoneCall className="size-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8C6D58]">
                        Hotline đặt vé & gửi hàng
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-[#D51F26]">
                        {lienHeRouteData.hotlineFormatted}
                      </span>
                    </div>
                  </a>

                  {/* Card Zalo */}
                  <a
                    href={`https://zalo.me/${lienHeRouteData.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl border-2 border-[#0068FF]/30 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[#0068FF] hover:shadow-lg hover:-translate-y-0.5 group"
                  >
                    <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-[#0068FF] text-white shadow-xs group-hover:bg-[#0052CC] transition-colors">
                      <MessageCircle className="size-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8C6D58]">
                        Zalo chat hỗ trợ 24/7
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-[#0068FF]">
                        {lienHeRouteData.hotlineFormatted}
                      </span>
                    </div>
                  </a>
                </div>

                {/* Card Địa chỉ trụ sở chính */}
                <div className="mt-4 flex items-start gap-3.5 rounded-2xl border border-[#EAD9C6] bg-white/95 p-4 sm:p-5 shadow-2xs">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0C3] text-[#D51F26]">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#8C6D58]">
                      Trụ sở văn phòng chính
                    </span>
                    <p className="mt-0.5 text-sm sm:text-base font-bold text-[#3A211B]">
                      Số 03 Nguyễn Trãi, Tổ 6, Phường Quyết Thắng, TP Sơn La
                    </p>
                    <p className="mt-1 text-xs text-[#795F55]">
                      Mở cửa đón khách và nhận bưu phẩm từ 05:00 đến 23:00 hàng ngày
                    </p>
                  </div>
                </div>

                {/* Direct Action Link to Form */}
                <div className="mt-6 flex items-center gap-3">
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-2 rounded-full bg-[#D51F26] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#A8171D] transition-all hover:-translate-y-0.5"
                  >
                    <span>Gửi yêu cầu đặt xe trực tuyến</span>
                    <ArrowLeft className="size-4 rotate-180" />
                  </a>
                </div>
              </div>

              {/* CỘT PHẢI: ẢNH ĐOÀN XE THỰC TẾ TẠI BẾN (5 cols) */}
              <div className="lg:col-span-5 order-last">
                <div className="group overflow-hidden rounded-[28px] sm:rounded-3xl border-2 border-[#EAD9C6] bg-white p-3 shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <img
                      src="/images/actual/xe-bac-son-tai-ben.jpg"
                      alt="Đoàn xe Bắc Sơn Cường Nguyệt đón khách tại bến xe"
                      className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 rounded-full bg-[#3A211B]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-md flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-[#EAB83E]" />
                      <span>Bến xe Bắc Sơn Cường Nguyệt</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <p
                      className="text-base font-bold text-[#3A211B]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Dịch vụ vận tải uy tín hàng đầu Tây Bắc
                    </p>
                    <p className="mt-1 text-xs text-[#795F55]">
                      Cam kết không thu sai giá niêm yết, lái xe điềm đạm an toàn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. THẺ THÔNG TIN NHANH (RouteInfoCards) */}
          <RouteInfoCards
            highlights={lienHeRouteData.highlights}
            title="Cam kết phục vụ từ Bắc Sơn Cường Nguyệt"
          />

          {/* 3. MẠNG LƯỚI PHÒNG VÉ & ĐIỂM ĐÓN TRẢ TRỰC TIẾP */}
          <section className="mt-12 sm:mt-16 rounded-[32px] sm:rounded-[40px] border border-[#EAD9C6] bg-white p-6 sm:p-8 md:p-12 shadow-[0_12px_36px_rgba(58,33,27,0.05)]">
            <div className="border-b border-[#EAD9C6]/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D51F26]/20 bg-[#FBE2DE] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D51F26] mb-3">
                  <Building2 className="size-3.5 text-[#D51F26]" />
                  <span>HỆ THỐNG VĂN PHÒNG & ĐIỂM ĐÓN TRẢ</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3A211B] leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Mạng lưới văn phòng trên trục Quốc lộ 6
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#795F55] max-w-2xl">
                  Quý khách có thể mua vé trực tiếp, gửi nhận hàng hóa và đón xe tại các điểm cố định sau:
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D58] bg-[#FFF0C3] border border-[#EAB83E]/40 px-4 py-2 rounded-full shadow-2xs">
                <Clock className="size-3.5 text-[#D51F26]" />
                <span>Tiếp nhận hàng liên tục trong ngày</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {lienHeRouteData.offices.map((office, idx) => (
                <div
                  key={idx}
                  className="rounded-[24px] border border-[#EAD9C6] bg-gradient-to-b from-white to-[#FFFDF9] p-5 sm:p-6 shadow-2xs hover:border-[#D51F26]/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-lg font-bold text-[#3A211B]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {office.name}
                    </h3>
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#FFF0C3] text-xs font-black text-[#8C6D58]">
                      {idx + 1}
                    </span>
                  </div>

                  <p className="mt-2.5 flex items-start gap-2.5 text-xs sm:text-sm text-[#795F55] leading-relaxed">
                    <MapPin className="size-4 shrink-0 text-[#D51F26] mt-0.5" />
                    <span>{office.address}</span>
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-[#EAD9C6]/60 flex items-center justify-between flex-wrap gap-2">
                    <a
                      href={`tel:${office.hotline.replace(/\D/g, "")}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#FBE2DE] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#D51F26] hover:bg-[#D51F26] hover:text-white transition-colors"
                    >
                      <PhoneCall className="size-3.5" />
                      <span>{office.hotline}</span>
                    </a>
                    {office.note && (
                      <span className="text-xs text-[#8C6D58] font-medium italic">
                        {office.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. SECTION UY TÍN (RouteTrust) VỚI 2 ẢNH THẬT */}
          <RouteTrust />

          {/* 5. FORM ĐĂNG KÝ / LIÊN HỆ GỬI VỀ GOOGLE SHEETS */}
          <RouteBooking
            routeTitle="Yêu cầu tư vấn & liên hệ chung"
            defaultPickup="Sơn La / Hà Nội"
          />

          {/* 6. FAQ GIẢI ĐÁP LIÊN HỆ */}
          <RouteFAQ
            faq={lienHeRouteData.faq}
            title="Câu hỏi thường gặp khi liên hệ nhà xe"
            subtitle="Tổng hợp các thắc mắc phổ biến về giờ xe chạy, quy định gửi hàng và đặt vé giữ chỗ."
          />

          {/* Nút quay về trang chủ */}
          <div className="mt-12 flex items-center justify-between border-t border-[#EAD9C6] pt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#EAD9C6] bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#3A211B] hover:border-[#D51F26] hover:text-[#D51F26] transition shadow-2xs"
            >
              <ArrowLeft className="size-4" />
              <span>Về trang chủ Bắc Sơn Cường Nguyệt</span>
            </Link>

            <a
              href={`tel:${lienHeRouteData.hotline}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D51F26] hover:underline"
            >
              <PhoneCall className="size-4" />
              <span>Hotline 24/7: {lienHeRouteData.hotlineFormatted}</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer đồng bộ */}
      <Footer />
    </div>
  );
}
