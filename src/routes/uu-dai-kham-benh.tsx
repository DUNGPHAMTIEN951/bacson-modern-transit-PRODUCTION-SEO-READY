import { createFileRoute } from "@tanstack/react-router";
import { businessInfo, siteConfig } from "@/data/business";
import { formatPriceVnd, discountedPriceVnd } from "@/data/fares";
import { BookingConsultationForm } from "@/components/site/BookingConsultationForm";
import {
  PhoneCall,
  MessageCircle,
  HeartHandshake,
  BadgePercent,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { images } from "@/data/images";

export const Route = createFileRoute("/uu-dai-kham-benh")({
  head: () => ({
    meta: [
      { title: "Vé xe đi khám bệnh giảm 20% & đưa đón bệnh viện | Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Bắc Sơn Cường Nguyệt giảm 20% vé mọi chuyến. Khách đi khám bệnh mua vé khứ hồi được hỗ trợ xe đưa đón bệnh viện miễn phí. Gọi hoặc Zalo để xác nhận.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Vé khám bệnh khứ hồi giảm 20% | Bắc Sơn Cường Nguyệt" },
      {
        property: "og:description",
        content:
          "Mọi chuyến giảm 20%. Khách đi khám bệnh mua vé khứ hồi được hỗ trợ đưa đón bệnh viện miễn phí, liên hệ nhà xe để xác nhận.",
      },
      { property: "og:url", content: siteConfig.domain + "/uu-dai-kham-benh" },
    ],
    links: [{ rel: "canonical", href: siteConfig.domain + "/uu-dai-kham-benh" }],
  }),
  component: MedicalOfferLanding,
});

function MedicalOfferLanding() {
  return (
    <main id="main" className="min-h-screen bg-[#FFF9F3] text-[#2B2B2B]">
      <header className="border-b border-[#EAD9C6] bg-white">
        <div className="container-page flex items-center justify-between gap-3 py-3 sm:py-4">
          <a
            href="/"
            className="inline-flex min-w-0 items-center gap-2.5 text-[#3A211B]"
            aria-label="Bắc Sơn Cường Nguyệt - Về trang chủ"
          >
            <ArrowLeft className="size-4 shrink-0 text-[#D62828]" aria-hidden="true" />
            <img
              src={images.logo.src}
              width="40"
              height="42"
              alt=""
              className="size-10 shrink-0 rounded-lg border border-[#EAD9C6] object-contain"
            />
            <span className="min-w-0">
              <span className="block text-sm font-black leading-snug sm:text-base">
                Bắc Sơn Cường Nguyệt
              </span>
              <span className="block text-xs font-medium text-[#795F55]">
                Hà Nội · Mộc Châu · Sơn La
              </span>
            </span>
          </a>
          <a
            href={businessInfo.phoneTel}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-[#D62828] px-3 text-sm font-bold text-white sm:px-4"
          >
            <PhoneCall className="size-4" aria-hidden="true" />{" "}
            <span className="hidden sm:inline">Gọi tư vấn:</span> {businessInfo.phone}
          </a>
        </div>
      </header>
      <div className="container-page grid gap-7 py-7 lg:grid-cols-2 lg:items-start lg:gap-10 lg:py-14">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFE7E7] px-3 py-1.5 text-sm font-bold text-[#B71F1F]">
            <HeartHandshake className="size-4" /> ĐỒNG HÀNH CÙNG HÀNH TRÌNH CHĂM SÓC SỨC KHỎE
          </span>
          <h1 className="mt-4 text-[1.85rem] font-black leading-tight sm:text-5xl">
            Đi khám bệnh khứ hồi giảm 20% vé, hỗ trợ đưa đón bệnh viện miễn phí
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#5A3828]">
            Mọi hành khách, mọi chuyến đều được giảm 20% giá vé. Khách đi khám bệnh mua vé khứ hồi
            còn được hỗ trợ xe đưa đón bệnh viện miễn phí. Nhà xe xác nhận điểm đón, phạm vi và giờ
            phục vụ trực tiếp qua điện thoại hoặc Zalo.
          </p>
          <a
            href="#dang-ky-uu-dai"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#D62828] px-4 text-sm font-bold text-white shadow-sm sm:w-auto"
          >
            Đăng ký tư vấn vé ưu đãi{" "}
            <span className="ml-2" aria-hidden="true">
              ↓
            </span>
          </a>
          <figure className="mt-5 overflow-hidden rounded-2xl border border-[#EAD9C6] bg-white shadow-sm">
            <img
              src={images.heroBus.src}
              srcSet="/images/optimized/hero-bus-480.webp 480w, /images/optimized/hero-bus-800.webp 800w, /images/optimized/hero-bus.webp 1200w"
              sizes="(max-width: 640px) calc(100vw - 32px), 560px"
              alt="Xe giường nằm thực tế của nhà xe Bắc Sơn Cường Nguyệt"
              width={1200}
              height={800}
              loading="eager"
              className="aspect-[16/8] w-full object-cover object-center"
            />
            <figcaption className="px-3 py-2 text-xs font-medium text-[#795F55]">
              Hình ảnh xe thực tế · Tuyến Hà Nội – Mộc Châu – Sơn La
            </figcaption>
          </figure>
          <div className="mt-5 rounded-2xl border border-[#EAD9C6] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#A8171D]">
              <BadgePercent className="size-5" /> ƯU ĐÃI ĐANG ÁP DỤNG
            </div>
            <p className="mt-3 text-sm text-[#795F55]">Vé Hà Nội – Sơn La (một chiều, một khách)</p>
            <p className="mt-1 text-4xl font-black text-[#D62828]">
              {formatPriceVnd(discountedPriceVnd(380000))}{" "}
              <s className="text-lg font-semibold text-[#795F55]">{formatPriceVnd(380000)}</s>
            </p>
            <p className="mt-3 text-sm text-[#5A3828]">
              Không phân biệt đối tượng khách, áp dụng toàn bộ chuyến xe. Chưa ấn định ngày kết thúc
              chương trình.
            </p>
          </div>
          <div className="mt-6 rounded-2xl bg-[#FFF0D5] p-5">
            <h2 className="text-lg font-extrabold">
              Quyền lợi thêm cho khách đi khám bệnh khứ hồi
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Giảm 20% tiền vé và hỗ trợ xe đưa đón bệnh viện miễn phí. Điều kiện cụ thể về địa
              điểm, phạm vi, thời gian và cách nhận hỗ trợ cần được nhân viên xác nhận trước chuyến
              đi.
            </p>
            <p className="mt-2 text-sm font-medium">
              Không cần khai thông tin sức khỏe hoặc bệnh án trên biểu mẫu.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={businessInfo.phoneTel}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#D62828] px-5 font-bold text-white"
            >
              <PhoneCall className="size-4" /> Gọi tư vấn ngay
            </a>
            <a
              href={businessInfo.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#EAD9C6] bg-white px-5 font-bold text-[#0068FF]"
            >
              <MessageCircle className="size-4" /> Nhắn Zalo
            </a>
          </div>
        </section>
        <section aria-label="Đăng ký tư vấn ưu đãi" className="space-y-4">
          <div className="rounded-2xl border border-[#EAD9C6] bg-white px-5 py-4">
            <h2 className="text-base font-extrabold text-[#3A211B]">Đặt vé như thế nào?</h2>
            <ol className="mt-3 grid gap-2.5 text-sm text-[#5A3828]">
              {[
                "Chọn tuyến, ngày đi và để lại số điện thoại",
                "Nhà xe gọi xác nhận chỗ, giá ưu đãi và điểm đón",
                "Khách đi khám bệnh khứ hồi được tư vấn xe đưa đón bệnh viện",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-[#21834B]"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Bước {i + 1}:</strong> {step}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-[#795F55]">
              Không thanh toán trên website. Thông tin đưa đón bệnh viện sẽ được xác nhận qua điện
              thoại/Zalo trước chuyến đi.
            </p>
          </div>
          <div id="dang-ky-uu-dai" className="scroll-mt-4">
            <BookingConsultationForm
              source="promo_healthcare"
              prefillRoundTrip
              prefillHospitalShuttle
            />
          </div>
        </section>
      </div>
      <footer className="border-t border-[#EAD9C6] py-6 text-center text-xs text-[#795F55]">
        © Bắc Sơn Cường Nguyệt · Giá vé được nhân viên xác nhận khi liên hệ
      </footer>
    </main>
  );
}
