import { createFileRoute } from "@tanstack/react-router";
import { businessInfo, siteConfig } from "@/data/business";
import { formatPriceVnd, discountedPriceVnd } from "@/data/fares";
import { BookingConsultationForm } from "@/components/site/BookingConsultationForm";
import { PhoneCall, MessageCircle, HeartHandshake, BadgePercent } from "lucide-react";

export const Route = createFileRoute("/uu-dai-kham-benh")({
  head: () => ({
    meta: [
      { title: "Giảm 20% vé xe & hỗ trợ đưa đón bệnh viện | Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Bắc Sơn Cường Nguyệt giảm 20% vé mọi chuyến. Khách đi khám bệnh mua vé khứ hồi được hỗ trợ xe đưa đón bệnh viện miễn phí. Gọi hoặc Zalo để xác nhận.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Ưu đãi 20% vé xe | Bắc Sơn Cường Nguyệt" },
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
      <div className="border-b border-[#EAD9C6] bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
          <a href="/" className="text-lg font-black text-[#B71F1F]">
            ← Bắc Sơn Cường Nguyệt
          </a>
          <a
            href={businessInfo.phoneTel}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#D62828] px-4 font-bold text-white"
          >
            <PhoneCall className="size-4" /> {businessInfo.phone}
          </a>
        </div>
      </div>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-2 lg:items-start lg:py-16">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFE7E7] px-3 py-1.5 text-sm font-bold text-[#B71F1F]">
            <HeartHandshake className="size-4" /> ĐỒNG HÀNH CÙNG HÀNH TRÌNH CHĂM SÓC SỨC KHỎE
          </span>
          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
            Giảm 20% vé xe cho tất cả khách hàng, mọi chuyến
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#5A3828]">
            Mua vé đi khám bệnh khứ hồi còn được hỗ trợ xe đưa đón tới bệnh viện miễn phí. Hãy liên
            hệ nhà xe để xác nhận địa điểm, phạm vi và khung giờ đưa đón.
          </p>
          <div className="mt-7 rounded-2xl border border-[#EAD9C6] bg-white p-6">
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
        <section aria-label="Đăng ký tư vấn ưu đãi">
          <BookingConsultationForm
            source="promo_healthcare"
            prefillRoundTrip
            prefillHospitalShuttle
          />
        </section>
      </div>
      <footer className="border-t border-[#EAD9C6] py-6 text-center text-xs text-[#795F55]">
        © Bắc Sơn Cường Nguyệt · Giá vé được nhân viên xác nhận khi liên hệ
      </footer>
    </main>
  );
}
