import { ArrowRight, MapPin, MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";
import { businessInfo, legalInfo } from "@/data/business";

const locations = [
  {
    name: "Hà Nội",
    detail: "Hồ Hoàn Kiếm – hình ảnh địa danh",
    file: "Hoan kiem lake turtle tower hanoi 2007 01.jpg",
    author: "Rolf Müller",
    license: "CC BY-SA 2.5",
  },
  {
    name: "Mộc Châu",
    detail: "Cảnh quan Mộc Châu",
    file: "Mộc Châu District, Vietnam (Unsplash).jpg",
    author: "Linh Pham",
    license: "CC0",
  },
  {
    name: "Sơn La",
    detail: "Hình ảnh thành phố Sơn La",
    file: "TP Sơn La - panoramio.jpg",
    author: "ChieuTimViet",
    license: "CC BY 3.0",
  },
] as const;

const wikimediaImage = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=720`;

const wikimediaSource = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`;

export function TravelTrust() {
  return (
    <section
      id="hanh-trinh-thuc-te"
      className="border-b border-[#E9DAD0] bg-[#FFF7F0] py-10 sm:py-14"
    >
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#BA1C28]">
              Khám phá hành trình
            </span>
            <h2
              className="mt-2 text-2xl font-bold leading-tight text-[#382720] sm:text-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Ba điểm đến. Một hành trình thuận tiện.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#65534A]">
              Ảnh chụp địa danh thật trên tuyến Hà Nội – Mộc Châu – Sơn La; không phải ảnh điểm
              đón/trả tại bến xe.
            </p>
          </div>
          <a
            href="#lich-chay"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#B71F1F] underline underline-offset-4"
          >
            Xem lịch xe <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {locations.map((location) => (
            <figure
              key={location.name}
              className="overflow-hidden rounded-[20px] border border-[#E9DAD0] bg-white shadow-[0_8px_25px_rgba(55,30,25,0.05)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE1D7]">
                <img
                  src={wikimediaImage(location.file)}
                  width={720}
                  height={450}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  alt={`Ảnh chụp địa danh thực tế tại ${location.name}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#4A3028] shadow-sm">
                  <MapPin className="size-3.5 text-[#C11E29]" aria-hidden="true" /> {location.name}
                </span>
              </div>
              <figcaption className="px-4 py-3">
                <p className="text-sm font-bold text-[#3A211B]">{location.detail}</p>
                <a
                  href={wikimediaSource(location.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-xs text-[#76685F] underline underline-offset-2"
                >
                  Ảnh: {location.author} · {location.license} · Wikimedia Commons
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          <article className="flex flex-col gap-4 rounded-[22px] border border-[#E8D7CC] bg-white p-5 shadow-[0_8px_25px_rgba(55,30,25,0.06)] sm:flex-row sm:items-center">
            <div className="w-[170px] shrink-0 overflow-hidden rounded-[17px] border border-[#F0E0D7] bg-[#F5F0EB]">
              <img
                src="/images/team/tran-anh-duc.webp"
                width={220}
                height={284}
                alt="Ảnh thật tư vấn viên Trần Anh Đức"
                loading="lazy"
                className="h-[205px] w-full object-contain object-center"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#B71F1F]">
                Hỗ trợ đặt vé
              </p>
              <h3
                className="mt-1 text-2xl font-bold text-[#382720]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Trần Anh Đức
              </h3>
              <p className="mt-1 text-sm text-[#66554B]">
                Tư vấn tuyến, lịch xe, điểm đón trả và chính sách giảm 20%.
              </p>
              <p className="mt-1 text-xs text-[#86756B]">
                Liên hệ qua hotline/Zalo chính thức của nhà xe.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={businessInfo.phoneTel}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C71926] px-4 text-sm font-bold text-white hover:bg-[#A8171D]"
                >
                  <PhoneCall className="size-4" aria-hidden="true" /> Gọi tư vấn
                </a>
                <a
                  href={businessInfo.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#BCD2F6] bg-[#F4F8FF] px-4 text-sm font-bold text-[#0759C1] hover:bg-[#E8F2FF]"
                >
                  <MessageCircle className="size-4" aria-hidden="true" /> Nhắn Zalo
                </a>
              </div>
            </div>
          </article>
          <article className="relative overflow-hidden rounded-[22px] border border-[#E8D7CC] bg-white p-5 shadow-[0_8px_25px_rgba(55,30,25,0.06)] sm:p-6">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#B71F1F]">
              <ShieldCheck className="size-5" aria-hidden="true" /> Nhà xe có thông tin pháp lý rõ
              ràng
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#382720]">{legalInfo.company}</h3>
            <p className="mt-2 text-sm text-[#65534A]">
              Giấy phép vận tải: {legalInfo.transportLicense}
            </p>
            <p className="mt-1 text-sm text-[#65534A]">Tuyến chính: {businessInfo.route}</p>
            <p className="mt-3 text-xs leading-relaxed text-[#786A61]">
              Chúng tôi không tự động thu tiền trên website. Nhà xe liên hệ xác nhận giá, lịch xe và
              điểm đón trước chuyến đi.
            </p>
            <a
              href="#tu-van-dat-ve"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#B71F1F] underline underline-offset-4"
            >
              Nhận tư vấn đặt vé <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
