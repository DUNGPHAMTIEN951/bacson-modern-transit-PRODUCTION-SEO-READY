import { Check } from "lucide-react";
import { whyUs } from "@/data/content";
import { images } from "@/data/images";
import { Section, SectionHead, Photo } from "./primitives";

export function WhyUs() {
  return (
    <Section id="vi-sao" tone="alt">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <SectionHead
            eyebrow="Tận tâm trên từng cây số"
            title="Vì sao khách hàng chọn Bắc Sơn Cường Nguyệt?"
            sub="Nhà xe tập trung khai thác chuyên tuyến Tây Bắc, ưu tiên sự an toàn, chu đáo và thuận tiện khi đặt vé dịp Quốc khánh."
          />
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {whyUs.map((w) => (
              <li
                key={w.title}
                className="rounded-xl border border-[#E8DDD0] bg-white p-4 shadow-[0_1px_3px_rgba(43,43,43,0.04)]"
              >
                <span className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#FFF2C9] text-[#D62828]"
                    aria-hidden="true"
                  >
                    <Check className="size-3.5 stroke-[3]" />
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-[#2B2B2B]">{w.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-[#6B635B]">
                      {w.desc}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <Photo img={images.busDeparting} ratio="3/4" caption="Xe xuất bến đúng giờ" />
          <Photo
            img={images.interior}
            ratio="3/4"
            caption="Khoang giường nằm sạch sẽ, thoáng mát"
          />
        </div>
      </div>
    </Section>
  );
}
