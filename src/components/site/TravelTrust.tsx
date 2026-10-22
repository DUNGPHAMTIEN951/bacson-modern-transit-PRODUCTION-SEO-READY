import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { businessInfo, legalInfo } from "@/data/business";
import { images } from "@/data/images";
import { schedule } from "@/data/schedule";

const locations = [
  {
    name: "Hà Nội",
    file: "Hoan kiem lake turtle tower hanoi 2007 01.jpg",
    author: "Rolf Müller",
    license: "CC BY-SA 2.5",
  },
  {
    name: "Mộc Châu",
    file: "Mộc Châu District, Vietnam (Unsplash).jpg",
    author: "Linh Pham",
    license: "CC0",
  },
  {
    name: "Sơn La",
    file: "TP Sơn La - panoramio.jpg",
    author: "ChieuTimViet",
    license: "CC BY 3.0",
  },
] as const;

const wikimediaImage = (file: string) =>
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
  encodeURIComponent(file) +
  "?width=720";
const wikimediaSource = (file: string) =>
  "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file.replaceAll(" ", "_"));

export function TravelTrust() {
  return (
    <section id="hanh-trinh-thuc-te" className="bg-[#FFF9F3] py-7 sm:py-10">
      <div className="container-page">
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-[20px] border border-[#EADBD0] bg-white p-5 shadow-[0_10px_30px_rgba(59,32,25,.05)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#EBDDD2] pb-3">
              <h2
                className="flex items-center gap-2 text-lg font-extrabold text-[#39271F]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <CalendarClock className="size-5 text-[#B71F1F]" aria-hidden="true" /> Lịch xe trong
                ngày
              </h2>
              <a
                href="#lich-chay"
                className="shrink-0 text-xs font-bold text-[#B71F1F] underline underline-offset-2"
              >
                Xem đầy đủ
              </a>
            </div>
            <p className="mt-3 text-xs text-[#79665B]">
              Giờ tham khảo từ lịch niêm yết · Gọi nhà xe để xác nhận trước khi đi
            </p>
            <div className="mt-3 space-y-3">
              {schedule.map((item) => (
                <div key={item.id} className="rounded-xl bg-[#FFF8F2] p-3">
                  <p className="text-xs font-bold text-[#52372C]">{item.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.trips.slice(0, 4).map((trip) => (
                      <span
                        key={trip.time}
                        className="rounded-lg border border-[#E6D3C4] bg-white px-2 py-1 text-xs font-bold tabular-nums text-[#B71F1F]"
                      >
                        {trip.time}
                      </span>
                    ))}
                    <span className="self-center text-xs text-[#7A6258]">…</span>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={businessInfo.phoneTel}
              className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#B71F1F]"
            >
              <PhoneCall className="size-4" aria-hidden="true" /> Gọi xác nhận chuyến{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </article>
          <article className="rounded-[20px] border border-[#EADBD0] bg-white p-5 shadow-[0_10px_30px_rgba(59,32,25,.05)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#EBDDD2] pb-3">
              <h2
                className="flex items-center gap-2 text-lg font-extrabold text-[#39271F]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <MapPin className="size-5 text-[#B71F1F]" aria-hidden="true" /> Điểm đến trên tuyến
              </h2>
              <a
                href="#diem-don"
                className="shrink-0 text-xs font-bold text-[#B71F1F] underline underline-offset-2"
              >
                Điểm đón trả
              </a>
            </div>
            <p className="mt-3 text-xs text-[#79665B]">
              Ảnh địa danh thật, không phải vị trí đón xe.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {locations.map((location) => (
                <figure key={location.name} className="min-w-0">
                  <div className="overflow-hidden rounded-xl bg-[#F3E9DF]">
                    <img
                      src={wikimediaImage(location.file)}
                      width={230}
                      height={170}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      alt={"Ảnh chụp địa danh thực tế tại " + location.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-1.5">
                    <p className="text-center text-xs font-bold text-[#49362D]">{location.name}</p>
                    <a
                      href={wikimediaSource(location.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block truncate text-center text-[10px] text-[#887A70] underline underline-offset-2"
                      title={
                        "Ảnh " + location.author + ", " + location.license + " – Wikimedia Commons"
                      }
                    >
                      {location.author} · {location.license}
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[#EFE3D7] bg-[#FFFAF5] px-3 py-3 text-sm leading-relaxed text-[#66554B]">
              <strong className="text-[#3C2921]">Hà Nội ⇄ Mộc Châu ⇄ Sơn La</strong>
              <p className="mt-1 text-xs">Tư vấn điểm lên xuống phù hợp với hành trình.</p>
            </div>
          </article>
          <article className="rounded-[20px] border border-[#EADBD0] bg-white p-5 shadow-[0_10px_30px_rgba(59,32,25,.05)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#EBDDD2] pb-3">
              <h2
                className="flex items-center gap-2 text-lg font-extrabold text-[#39271F]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <HeartHandshake className="size-5 text-[#B71F1F]" aria-hidden="true" /> Khách đi
                khám bệnh
              </h2>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl bg-[#FFF1E9] p-4">
              <p className="text-2xl font-extrabold text-[#B71F1F]">Giảm 20% vé</p>
              <p className="mt-1 text-sm font-bold text-[#473128]">
                Hỗ trợ đưa đón bệnh viện miễn phí với vé khám bệnh khứ hồi
              </p>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#655349]">
              <li className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-[#B71F1F]"
                  aria-hidden="true"
                />{" "}
                Giảm 20% tiền vé cho tất cả hành khách, mọi chuyến.
              </li>
              <li className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-[#B71F1F]"
                  aria-hidden="true"
                />{" "}
                Phạm vi và giờ đưa đón bệnh viện được tư vấn trực tiếp.
              </li>
            </ul>
            <a
              href="/uu-dai-kham-benh"
              className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#B71F1F] underline underline-offset-2"
            >
              Xem ưu đãi khám bệnh <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </article>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <article className="relative min-h-[300px] overflow-hidden rounded-[22px] bg-[#2E211B] lg:min-h-[350px]">
            <img
              src={images.interior.src}
              width={1200}
              height={800}
              loading="lazy"
              alt="Nội thất giường nằm thật của nhà xe Bắc Sơn Cường Nguyệt"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#261A15]/90 via-[#261A15]/45 to-transparent"
              aria-hidden="true"
            />
            <div className="relative flex h-full min-h-[300px] max-w-sm flex-col justify-center px-6 py-8 text-white sm:px-9 lg:min-h-[350px]">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#FFE1B5]">
                Không gian xe thực tế
              </span>
              <h2
                className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Hành trình dễ chịu hơn với xe giường nằm
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                Khám phá ảnh khoang giường, cửa sổ và nội thất trên đoàn xe hiện có.
              </p>
              <div className="mt-5 flex gap-2">
                <img
                  src={images.cabinWindow.src}
                  width={82}
                  height={64}
                  loading="lazy"
                  alt="Giường nằm cạnh cửa sổ thực tế"
                  className="h-[58px] w-[76px] rounded-lg border border-white/50 object-cover"
                />
                <img
                  src={images.cabinLower.src}
                  width={82}
                  height={64}
                  loading="lazy"
                  alt="Giường nằm tầng dưới thực tế"
                  className="h-[58px] w-[76px] rounded-lg border border-white/50 object-cover"
                />
              </div>
            </div>
          </article>
          <article className="flex flex-col overflow-hidden rounded-[22px] border border-[#E6CFC5] bg-white shadow-[0_12px_32px_rgba(56,26,20,.08)] sm:flex-row lg:flex-col xl:flex-row">
            <div className="w-full shrink-0 overflow-hidden bg-[#F2EAE5] sm:w-[175px] lg:w-full xl:w-[175px]">
              <img
                src="/images/team/tran-anh-duc-hd-v2.webp"
                alt="Ảnh thật tư vấn viên Trần Anh Đức"
                width={420}
                height={560}
                loading="lazy"
                className="h-[220px] w-full object-cover object-center sm:h-full lg:h-[190px] xl:h-full"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center p-5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#236E40]">
                <span className="size-2 rounded-full bg-[#2FAD66]" aria-hidden="true" /> Nhân viên
                tư vấn
              </p>
              <h2
                className="mt-2 text-2xl font-bold text-[#34231C]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Trần Anh Đức
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[#6A574C]">
                Hỗ trợ hành trình, giá vé, điểm đón và ưu đãi.
              </p>
              <div className="mt-4 grid gap-2">
                <a
                  href={businessInfo.phoneTel}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C71A26] px-3 text-sm font-bold text-white hover:bg-[#A8171D]"
                >
                  <PhoneCall className="size-4" aria-hidden="true" /> Gọi tư vấn
                </a>
                <a
                  href={businessInfo.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#CBDCF3] bg-[#F5F9FF] px-3 text-sm font-bold text-[#0A5DD6] hover:bg-[#EAF2FF]"
                >
                  <MessageCircle className="size-4" aria-hidden="true" /> Nhắn Zalo
                </a>
              </div>
              <p className="mt-3 text-xs text-[#86756B]">Liên hệ qua kênh chính thức của nhà xe.</p>
            </div>
          </article>
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#7E7067]">
          <ShieldCheck className="size-4 text-[#B71F1F]" aria-hidden="true" />
          {legalInfo.company} · Giấy phép vận tải {legalInfo.transportLicense}
        </p>
      </div>
    </section>
  );
}
