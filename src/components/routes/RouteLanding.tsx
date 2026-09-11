import { Link } from "@tanstack/react-router";
import { ArrowLeft, Home, PhoneCall } from "lucide-react";
import type { TransportRoute } from "@/data/routes";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RouteHero } from "./RouteHero";
import { RouteInfoCards } from "./RouteInfoCards";
import { RouteTimeline } from "./RouteTimeline";
import { RouteGallery } from "./RouteGallery";
import { RouteTrust } from "./RouteTrust";
import { RouteBooking } from "./RouteBooking";
import { RouteFAQ } from "./RouteFAQ";
import { businessInfo } from "@/data/business";

interface Props {
  route: TransportRoute;
}

export function RouteLanding({ route }: Props) {
  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#3A211B] flex flex-col font-sans selection:bg-[#FBE2DE] selection:text-[#D51F26]">
      {/* Site Header đồng bộ với Homepage */}
      <Header />

      <main className="flex-1">
        <div className="container-page py-6 sm:py-10">
          {/* Breadcrumb điều hướng đầu trang */}
          <nav aria-label="Đường dẫn trang" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-[#795F55]">
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-semibold text-[#3A211B] hover:text-[#D51F26] transition"
            >
              <Home className="size-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#D51F26]">{route.title}</span>
          </nav>

          {/* 1. Hero Section 2 cột với ảnh xe thật */}
          <RouteHero route={route} />

          {/* 2. Thông tin nhanh 4 thẻ nổi bật */}
          <RouteInfoCards highlights={route.highlights} />

          {/* 3. Timeline Lộ trình di chuyển trực quan */}
          <RouteTimeline
            stops={route.stops}
            detailedStops={route.detailedStops}
            title={`Hành trình chuyến ${route.title}`}
          />

          {/* 4. Gallery Ảnh xe thực tế (1 lớn + 2 nhỏ) */}
          <RouteGallery
            gallery={route.gallery}
            title={`Hình ảnh dàn xe phục vụ ${route.title}`}
          />

          {/* 5. Trust Section: Uy tín & 2 ảnh giấy tờ pháp lý thật */}
          <RouteTrust />

          {/* 6. Form Giữ chỗ gửi trực tiếp về Google Sheets */}
          <RouteBooking
            routeTitle={route.title}
            defaultPickup={route.departure}
          />

          {/* 7. FAQ Accordion chuẩn SEO */}
          <RouteFAQ faq={route.faq} />

          {/* Liên kết quay lại trang chủ */}
          <div className="mt-12 flex items-center justify-between border-t border-[#EAD9C6] pt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#EAD9C6] bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#3A211B] hover:border-[#D51F26] hover:text-[#D51F26] transition shadow-2xs"
            >
              <ArrowLeft className="size-4" />
              <span>Về trang chủ Bắc Sơn Cường Nguyệt</span>
            </Link>

            <a
              href={`tel:${businessInfo.phone}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D51F26] hover:underline"
            >
              <PhoneCall className="size-4" />
              <span>Hotline 24/7: {businessInfo.phone}</span>
            </a>
          </div>
        </div>
      </main>

      {/* Site Footer đồng bộ với Homepage */}
      <Footer />
    </div>
  );
}
