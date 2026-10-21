import { ArrowRight, BadgePercent, HeartHandshake, MessageCircle, PhoneCall } from "lucide-react";
import { businessInfo } from "@/data/business";
import { useBookingModal } from "./BookingModalContext";

export function PromotionBanner() {
  const { openBookingModal } = useBookingModal();
  return (
    <section aria-label="Chương trình ưu đãi vé xe" className="border-b border-[#E6C28A] bg-[#FFF0D5]">
      <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-[#D62828] p-2 text-white"><BadgePercent className="size-6" aria-hidden="true" /></span>
          <div>
            <p className="text-lg font-black leading-tight text-[#A8171D] sm:text-xl">GIẢM 20% GIÁ VÉ CHO TẤT CẢ HÀNH KHÁCH</p>
            <p className="mt-1 text-sm text-[#5A3828]">
              Áp dụng mọi chuyến xe · Hà Nội – Sơn La chỉ còn <strong>304.000đ</strong> thay vì <s>380.000đ</s>
            </p>
            <p className="mt-1 text-xs text-[#795F55]">Chương trình đang áp dụng, chưa ấn định ngày kết thúc. Liên hệ nhà xe để xác nhận chỗ.</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" onClick={() => openBookingModal({ source: "promo_general" })}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D62828] px-4 text-sm font-bold text-white transition hover:bg-[#A8171D]">
            Tư vấn ưu đãi <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          <a href="/uu-dai-kham-benh" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#D62828] bg-white px-4 text-sm font-bold text-[#A8171D] hover:bg-[#FFF9F3]">
            Ưu đãi khám bệnh
          </a>
        </div>
      </div>
    </section>
  );
}

export function MedicalTransferOffer() {
  const { openBookingModal } = useBookingModal();
  return (
    <section id="uu-dai-kham-benh" className="scroll-mt-24 border-y border-[#EAD9C6] bg-[#FFF9F3] py-10 sm:py-14">
      <div className="container-page">
        <div className="grid gap-7 rounded-3xl border border-[#EAD9C6] bg-white p-6 shadow-sm md:grid-cols-[1.3fr_1fr] md:items-center md:p-9">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFE7E7] px-3 py-1 text-xs font-extrabold text-[#A8171D]">
              <HeartHandshake className="size-4" aria-hidden="true" /> ĐỒNG HÀNH CÙNG NGƯỜI ĐI KHÁM BỆNH
            </span>
            <h2 className="mt-4 text-2xl font-black text-[#2B2B2B] sm:text-3xl">
              Đi khám bệnh khứ hồi: giảm 20% vé và hỗ trợ xe đưa đón bệnh viện miễn phí
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5A3828]">
              Ưu đãi giảm 20% áp dụng cho mọi hành khách, mọi chuyến. Riêng khách đi khám bệnh mua vé khứ hồi được hỗ trợ thêm dịch vụ xe đưa đón tới bệnh viện miễn phí.
            </p>
            <p className="mt-3 text-sm font-medium text-[#795F55]">
              Địa điểm bệnh viện, phạm vi đưa đón và giờ phục vụ sẽ được nhà xe tư vấn, xác nhận trực tiếp qua điện thoại hoặc Zalo trước chuyến đi.
            </p>
            <a href="/uu-dai-kham-benh" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#B71F1F] underline underline-offset-4">
              Xem thông tin chương trình <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <div className="rounded-2xl bg-[#FFF3DF] p-5">
            <p className="text-sm font-black text-[#A8171D]">Đăng ký tư vấn trực tiếp</p>
            <p className="mt-2 text-sm text-[#5A3828]">Không cần cung cấp thông tin bệnh án. Chỉ cần để lại hành trình và số điện thoại để nhà xe liên hệ.</p>
            <button type="button" onClick={() => openBookingModal({ source: "promo_healthcare", prefillRoundTrip: true, prefillHospitalShuttle: true })}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D62828] px-4 text-sm font-bold text-white hover:bg-[#A8171D]">
              <PhoneCall className="size-4" aria-hidden="true" /> Nhận tư vấn đưa đón
            </button>
            <a href={businessInfo.zaloUrl} target="_blank" rel="noopener noreferrer"
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#EAD9C6] bg-white px-4 text-sm font-bold text-[#0068FF] hover:border-[#0068FF]">
              <MessageCircle className="size-4" aria-hidden="true" /> Nhắn Zalo hỏi điểm đón
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
