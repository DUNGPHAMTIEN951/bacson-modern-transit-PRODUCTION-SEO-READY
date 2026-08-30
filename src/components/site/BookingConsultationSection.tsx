import { Check, PhoneCall, MessageCircle } from "lucide-react";
import { businessInfo } from "@/data/business";
import { Section } from "./primitives";
import { BookingConsultationForm } from "./BookingConsultationForm";

export function BookingConsultationSection() {
  return (
    <Section id="tu-van-dat-ve" tone="warm" className="border-y border-[#EAD9C6]/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* CỘT TRÁI: THÔNG TIN & LỢI ÍCH TƯ VẤN (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="eyebrow-chip-red inline-flex self-start items-center gap-1.5 mb-3">
            <span className="text-[#D51F26] text-xs">★</span> TƯ VẤN HÀNH TRÌNH
          </span>

          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2B2B2B] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Chưa biết chuyến nào phù hợp?
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#5A3828] leading-relaxed">
            Để lại số điện thoại và hành trình dự kiến. Đội ngũ điều hành nhà xe Bắc Sơn Cường
            Nguyệt sẽ liên hệ trực tiếp để hỗ trợ:
          </p>

          {/* Danh sách lợi ích */}
          <ul className="mt-6 space-y-3.5" role="list">
            {[
              {
                title: "Chọn giờ chạy phù hợp",
                desc: "10+ chuyến/ngày hai chiều Hà Nội ⇄ Sơn La sáng, chiều và đêm.",
              },
              {
                title: "Kiểm tra điểm đón thuận tiện",
                desc: "Đón trả linh hoạt tại Bến xe Mỹ Đình, Đại lộ Thăng Long, Hòa Bình, Mộc Châu, Sơn La.",
              },
              {
                title: "Tư vấn giá vé & giữ chỗ",
                desc: "Báo giá niêm yết minh bạch, hỗ trợ xếp giường nằm tầng dưới ưu tiên cho người già, trẻ nhỏ.",
              },
              {
                title: "Hỗ trợ gửi hàng kèm theo",
                desc: "Nhận hàng hóa, bưu kiện giao nhận an toàn nhanh chóng theo chuyến xe.",
              },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E8F8EE] text-[#1B8341] mt-0.5 shadow-xs">
                  <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#2B2B2B]">{item.title}</h4>
                  <p className="text-xs text-[#795F55] leading-normal">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Quick contact badge */}
          <div className="mt-8 rounded-xl border border-[#EAD9C6] bg-white/80 p-4 backdrop-blur-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8C6D58]">
              Cần đặt xe gấp trong ngày?
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              <a
                href={businessInfo.phoneTel}
                className="inline-flex items-center gap-1.5 text-sm font-black text-[#D51F26] hover:underline"
              >
                <PhoneCall className="size-4 stroke-[2]" aria-hidden="true" />
                Hotline: {businessInfo.phone}
              </a>
              <span className="text-[#D5C2AF]" aria-hidden="true">
                •
              </span>
              <a
                href={businessInfo.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0068FF] hover:underline"
              >
                <MessageCircle className="size-3.5 stroke-[2]" aria-hidden="true" />
                Zalo tư vấn
              </a>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐẶT TƯ VẤN (7 cols) */}
        <div className="lg:col-span-7">
          <BookingConsultationForm source="inline_section" />
        </div>
      </div>
    </Section>
  );
}
