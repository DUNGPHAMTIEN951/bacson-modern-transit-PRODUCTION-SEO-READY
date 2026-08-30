import { MessageCircle, PhoneCall } from "lucide-react";
import { businessInfo } from "@/data/business";
import { cargoSteps } from "@/data/content";
import { images } from "@/data/images";
import { Section, SectionHead, Photo } from "./primitives";

export function Cargo() {
  return (
    <Section id="gui-hang" tone="white">
      <SectionHead
        eyebrow="Kết nối gửi trao dịp 2/9"
        title="Gửi hàng Hà Nội ⇄ Sơn La theo chuyến xe"
        sub="Không chỉ chở người — những kiện hàng quà quê dịp Tết Độc lập cũng mang theo cả sự mong chờ và ân cần."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div className="grid grid-cols-2 gap-3">
          <Photo
            img={images.busFull}
            ratio="4/3"
            className="col-span-2"
            caption="Xe chạy tuyến nhận gửi hàng nhanh theo từng chuyến"
          />
          <Photo img={images.busFleetYard} ratio="4/3" caption="Đội xe chờ xuất bến" />
          <Photo img={images.busFront} ratio="4/3" caption="Nhận hàng trực tiếp tại đầu xe" />
        </div>

        <div>
          <ol className="grid gap-3">
            {cargoSteps.map((s) => (
              <li
                key={s.step}
                className="flex items-start gap-3.5 rounded-xl border border-[#E8DDD0] bg-white p-4 shadow-[0_1px_3px_rgba(43,43,43,0.04)]"
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#FFF2C9] text-sm font-black text-[#D62828]"
                  aria-hidden="true"
                >
                  {s.step}
                </span>
                <span>
                  <span className="block text-base font-extrabold text-[#2B2B2B]">{s.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-[#6B635B]">
                    {s.desc}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-5 rounded-xl border border-[#E8DDD0] bg-[#FFF4E8] p-4 text-sm leading-relaxed text-[#6B635B]">
            Nhà xe nhận giấy tờ, bưu kiện, hàng tiêu dùng, nông sản và một số hàng cồng kềnh theo
            chuyến. Trong dịp lễ 2/9, quý khách nên liên hệ trước để xác nhận vị trí khoang chứa
            hàng.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={businessInfo.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D62828] px-6 text-sm font-bold text-white shadow-[0_2px_8px_rgba(214,40,40,0.18)] transition-all duration-[220ms] hover:-translate-y-0.5 hover:bg-[#B71F1F] hover:shadow-[0_6px_18px_rgba(214,40,40,0.28)] active:scale-[0.98] sm:text-base"
            >
              <MessageCircle className="size-4 stroke-[2] text-white" aria-hidden="true" />
              <span>Gửi ảnh hàng qua Zalo</span>
            </a>
            <a
              href={businessInfo.zaloTel}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E8DDD0] bg-white px-6 text-sm font-bold text-[#2B2B2B] transition-all duration-[220ms] hover:-translate-y-0.5 hover:border-[#D62828] hover:bg-[#FFF4E8] active:scale-[0.98] sm:text-base"
            >
              <PhoneCall className="size-4 stroke-[2] text-[#D62828]" aria-hidden="true" />
              <span>Gọi hỏi cước: {businessInfo.zalo}</span>
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
