import { BedDouble, Blinds, Droplets, Luggage, Wifi, Layers } from "lucide-react";
import { amenities } from "@/data/content";
import { Section, SectionHead } from "./primitives";

const iconMap = {
  bed: BedDouble,
  blanket: Layers,
  water: Droplets,
  wifi: Wifi,
  curtain: Blinds,
  luggage: Luggage,
} as const;

export function Amenities() {
  return (
    <Section id="tien-ich" tone="alt">
      <SectionHead
        eyebrow="Phục vụ chu đáo"
        title="Tiện ích trên mỗi chuyến xe"
        sub="Các tiện ích cơ bản được nhà xe chuẩn bị cho hành trình Hà Nội – Sơn La dịp Quốc khánh."
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((a) => {
          const Icon = iconMap[a.icon];
          return (
            <li
              key={a.title}
              className="rounded-xl border border-[#E8DDD0] bg-white p-5 shadow-[0_1px_3px_rgba(43,43,43,0.04)] transition hover:shadow-[0_6px_20px_rgba(214,40,40,0.08)]"
            >
              <span
                className="grid size-11 place-items-center rounded-xl bg-[#FFF2C9] text-[#D62828]"
                aria-hidden="true"
              >
                <Icon className="size-5 text-[#D62828]" />
              </span>
              <h3 className="mt-3.5 text-base font-extrabold text-[#2B2B2B]">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#6B635B]">{a.desc}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
