import { BusFront, MapPin, Clock, PhoneCall, Route } from "lucide-react";
import { businessInfo, legalInfo } from "@/data/business";

const items = [
  { icon: BusFront, label: "Tuyến xe", value: "Hà Nội ⇄ Sơn La" },
  { icon: Route, label: "Hành trình", value: "Qua Mộc Châu" },
  { icon: MapPin, label: "Bến Hà Nội", value: "Bến xe Mỹ Đình" },
  { icon: Clock, label: "Thời gian", value: "Khoảng 7 giờ" },
  { icon: PhoneCall, label: "Đặt vé", value: businessInfo.phone, tel: true },
];

export function QuickBar() {
  return (
    <section
      aria-label="Thông tin nhanh"
      className="border-y border-[#E8DDD0] bg-[#FFF4E8] py-3 sm:py-6"
    >
      <div className="container-page">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-[#5A3828] sm:mb-4 sm:text-sm">
          <span>Đơn vị vận tải: {legalInfo.company}</span>
          <span>Giấy phép vận tải: {legalInfo.transportLicense}</span>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {items.map(({ icon: Icon, label, value, tel }) => (
            <li
              key={label}
              className={`rounded-xl border border-[#E8DDD0] bg-white p-3 shadow-[0_1px_3px_rgba(43,43,43,0.04)] sm:p-3.5 ${tel ? "col-span-2 md:col-span-1" : ""}`}
            >
              <span className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-[#6B635B]">
                <Icon className="size-3.5 text-[#D62828]" aria-hidden="true" />
                {label}
              </span>
              {tel ? (
                <a
                  href={businessInfo.phoneTel}
                  className="mt-1.5 block text-sm font-extrabold text-[#D62828] transition hover:text-[#B71F1F] hover:underline sm:text-base"
                >
                  {value}
                </a>
              ) : (
                <span className="mt-1.5 block text-sm font-extrabold text-[#2B2B2B] sm:text-base">
                  {value}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
