import { MapPin, PhoneCall, ExternalLink } from "lucide-react";
import { businessInfo } from "@/data/business";
import { images } from "@/data/images";
import { Section, SectionHead, Photo } from "./primitives";

const officeMaps = [
  {
    city: "Hà Nội",
    title: "Đầu Hà Nội (Bến xe Mỹ Đình)",
    address: "Bến xe Mỹ Đình, Nam Từ Liêm, Hà Nội",
    note: "Điểm đón và xuất bến chiều Hà Nội → Mộc Châu → Sơn La.",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=B%E1%BA%BFn+xe+M%E1%BB%B9+%C4%90%C3%ACnh%2C+Nam+T%E1%BB%AB+Li%C3%AAm%2C+H%C3%A0+N%E1%BB%99i&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapExternalUrl:
      "https://www.google.com/maps/search/?api=1&query=B%E1%BA%BFn+xe+M%E1%BB%B9+%C4%90%C3%ACnh%2C+Nam+T%E1%BB%AB+Li%C3%AAm%2C+H%C3%A0+N%E1%BB%99i",
    mapTitle: "Bản đồ Bến xe Mỹ Đình",
  },
  {
    city: "Sơn La",
    title: "Đầu Sơn La (Trụ sở nhà xe)",
    address: "Số 03 đường Nguyễn Trãi, P. Quyết Thắng, TP. Sơn La",
    note: "Trụ sở công ty, điểm đón và xuất bến chiều Sơn La → Mộc Châu → Mỹ Đình.",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=S%E1%BB%91+03+%C4%91%C6%B0%E1%BB%9Dng+Nguy%E1%BB%85n+Tr%C3%A3i%2C+P.+Quy%E1%BA%BFt+Th%E1%BA%AFng%2C+TP.+S%C6%A1n+La&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapExternalUrl:
      "https://www.google.com/maps/search/?api=1&query=S%E1%BB%91+03+%C4%91%C6%B0%E1%BB%9Dng+Nguy%E1%BB%85n+Tr%C3%A3i%2C+P.+Quy%E1%BA%BFt+Th%E1%BA%AFng%2C+TP.+S%C6%A1n+La",
    mapTitle: "Bản đồ văn phòng Bắc Sơn Cường Nguyệt tại Sơn La",
  },
];

export function Offices() {
  return (
    <Section id="diem-don" tone="white">
      <SectionHead
        eyebrow="Điểm đón đưa thuận tiện"
        title="Điểm đón và văn phòng nhà xe"
        sub="Hai đầu tuyến đều xuất phát tại các vị trí quen thuộc. Trong dịp lễ 2/9, hãy gọi trước để được tư vấn điểm đón thuận tiện nhất."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {officeMaps.map((o) => (
          <article
            key={o.city}
            className="flex flex-col justify-between rounded-2xl border border-[#EAD9C6] bg-white p-5 shadow-xs transition-shadow duration-300 hover:shadow-md sm:p-6"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="eyebrow-chip">{o.city}</span>
                <span className="text-xs font-bold text-[#795F55]">Xuất bến cố định</span>
              </div>

              <h3
                className="mt-3 text-lg font-bold text-[#3A211B]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {o.title}
              </h3>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[#3A211B]">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-[#D51F26] stroke-[2]"
                  aria-hidden="true"
                />
                {o.address}
              </p>
              <p className="mt-1 text-xs text-[#795F55]">{o.note}</p>

              {/* Google Maps Embed with Lazy Loading */}
              <div className="mt-4 overflow-hidden rounded-xl border border-[#EAD9C6] bg-[#FFF8EE]">
                <iframe
                  title={o.mapTitle}
                  src={o.mapEmbedUrl}
                  loading="lazy"
                  className="aspect-[16/9] w-full border-0"
                  allowFullScreen={false}
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={o.mapExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#EAD9C6] bg-white px-4 text-xs font-bold text-[#3A211B] shadow-xs transition-all duration-[200ms] hover:-translate-y-0.5 hover:border-[#D51F26] hover:bg-[#FFF4E8] active:scale-[0.98]"
              >
                <ExternalLink className="size-3.5 text-[#D51F26] stroke-[2]" aria-hidden="true" />
                Mở Google Maps
              </a>
              <a
                href={businessInfo.phoneTel}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#D51F26] px-4 text-xs font-bold text-white shadow-[0_2px_6px_rgba(213,31,38,0.2)] transition-all duration-[200ms] hover:-translate-y-0.5 hover:bg-[#A8171D] active:scale-[0.98] btn-primary"
              >
                <PhoneCall className="size-3.5 stroke-[2]" aria-hidden="true" />
                Gọi nhà xe
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Photo img={images.busFleetYard} ratio="4/3" caption="Xe chờ khách tại bến" />
        <Photo img={images.busFleet} ratio="4/3" caption="Đội xe tại bãi đỗ" />
        <Photo img={images.busFront} ratio="4/3" caption="Nhận diện đầu xe" />
        <Photo img={images.busDeparting} ratio="4/3" caption="Xe xuất bến" />
      </div>

      <div className="mt-8 text-center">
        <a
          href={businessInfo.phoneTel}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D51F26] px-7 text-sm font-bold text-white shadow-[0_2px_8px_rgba(213,31,38,0.22)] transition-all duration-[220ms] hover:-translate-y-0.5 hover:bg-[#A8171D] hover:shadow-[0_6px_18px_rgba(213,31,38,0.3)] active:scale-[0.98] btn-primary btn-pulse sm:text-base"
        >
          <PhoneCall className="size-4 stroke-[2]" aria-hidden="true" />
          Gọi hỏi điểm đón gần nhất: {businessInfo.phone}
        </a>
      </div>
    </Section>
  );
}
