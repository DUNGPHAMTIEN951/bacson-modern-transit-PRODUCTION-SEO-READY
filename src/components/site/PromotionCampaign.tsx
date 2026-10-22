import { ArrowRight, BadgePercent, HeartHandshake, MessageCircle, PhoneCall } from "lucide-react";
import { businessInfo } from "@/data/business";
import { useBookingModal } from "./BookingModalContext";

export function PromotionBanner() {
  return (
    <section aria-label="Chương trình ưu đãi vé xe" className="bg-[#FFF9F3] pb-2">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-[18px] border border-[#EDDBCF] bg-white shadow-[0_9px_32px_rgba(57,28,20,.07)] sm:grid-cols-[250px_1fr] lg:grid-cols-[255px_1fr_1fr]">
          <div className="flex items-center gap-3 bg-[#C41926] px-5 py-4 text-white">
            <BadgePercent className="size-8 shrink-0 text-white" aria-hidden="true" />
            <div>
              <p className="text-xl font-black leading-none">GIẢM 20%</p>
              <p className="mt-1 text-xs font-semibold text-white/95">
                GIẢM 20% GIÁ VÉ CHO TẤT CẢ HÀNH KHÁCH
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold text-[#81675C]">Hà Nội – Sơn La · Một chiều</p>
              <p className="mt-0.5 text-[1.8rem] font-black leading-tight text-[#B71F1F]">
                304.000đ <s className="ml-2 text-base font-semibold text-[#93877D]">380.000đ</s>
              </p>
            </div>
            <a
              href="#hero-quick-booking"
              className="inline-flex min-h-10 items-center gap-1 whitespace-nowrap rounded-xl bg-[#C41926] px-3 text-xs font-bold text-white hover:bg-[#9F1520]"
            >
              Chọn chuyến <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-[#F0E3D9] bg-[#FFFCF9] px-5 py-3 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#523B31]">Tất cả khách · Mọi chuyến xe</p>
              <p className="mt-1 text-xs leading-relaxed text-[#826E62]">
                Chưa ấn định ngày kết thúc · Xác nhận chỗ qua hotline
              </p>
            </div>
            <a
              href="/uu-dai-kham-benh"
              className="shrink-0 text-xs font-bold text-[#B71F1F] underline underline-offset-2"
            >
              Khám bệnh
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MedicalTransferOffer() {
  const { openBookingModal } = useBookingModal();
  return (
    <section
      id="uu-dai-kham-benh"
      className="scroll-mt-24 border-y border-[#EAD9C6] bg-[#FFF9F3] py-10 sm:py-14"
    >
      <div className="container-page">
        <div className="grid gap-7 rounded-3xl border border-[#EAD9C6] bg-white p-6 shadow-sm md:grid-cols-[1.3fr_1fr] md:items-center md:p-9">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFE7E7] px-3 py-1 text-xs font-extrabold text-[#A8171D]">
              <HeartHandshake className="size-4" aria-hidden="true" /> ĐỒNG HÀNH CÙNG NGƯỜI ĐI KHÁM
              BỆNH
            </span>
            <h2 className="mt-4 text-2xl font-black text-[#2B2B2B] sm:text-3xl">
              Đi khám bệnh khứ hồi: giảm 20% vé và hỗ trợ xe đưa đón bệnh viện miễn phí
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5A3828]">
              Ưu đãi giảm 20% áp dụng cho mọi hành khách, mọi chuyến. Riêng khách đi khám bệnh mua
              vé khứ hồi được hỗ trợ thêm dịch vụ xe đưa đón tới bệnh viện miễn phí.
            </p>
            <p className="mt-3 text-sm font-medium text-[#795F55]">
              Địa điểm bệnh viện, phạm vi đưa đón và giờ phục vụ sẽ được nhà xe tư vấn, xác nhận
              trực tiếp qua điện thoại hoặc Zalo trước chuyến đi.
            </p>
            <a
              href="/uu-dai-kham-benh"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#B71F1F] underline underline-offset-4"
            >
              Xem thông tin chương trình <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <div className="rounded-2xl bg-[#FFF3DF] p-5">
            <p className="text-sm font-black text-[#A8171D]">Đăng ký tư vấn trực tiếp</p>
            <p className="mt-2 text-sm text-[#5A3828]">
              Không cần cung cấp thông tin bệnh án. Chỉ cần để lại hành trình và số điện thoại để
              nhà xe liên hệ.
            </p>
            <button
              type="button"
              onClick={() =>
                openBookingModal({
                  source: "promo_healthcare",
                  prefillRoundTrip: true,
                  prefillHospitalShuttle: true,
                })
              }
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D62828] px-4 text-sm font-bold text-white hover:bg-[#A8171D]"
            >
              <PhoneCall className="size-4" aria-hidden="true" /> Nhận tư vấn đưa đón
            </button>
            <a
              href={businessInfo.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#EAD9C6] bg-white px-4 text-sm font-bold text-[#0068FF] hover:border-[#0068FF]"
            >
              <MessageCircle className="size-4" aria-hidden="true" /> Nhắn Zalo hỏi điểm đón
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
