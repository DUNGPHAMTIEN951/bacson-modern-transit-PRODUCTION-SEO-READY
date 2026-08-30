import { businessInfo, legalInfo } from "@/data/business";
import { images } from "@/data/images";

const quickLinks = [
  { href: "#lich-chay", label: "Lịch xe" },
  { href: "#gia-ve", label: "Giá vé" },
  { href: "#diem-don", label: "Điểm đón" },
  { href: "#gui-hang", label: "Gửi hàng" },
  { href: "#hinh-anh", label: "Hình ảnh xe" },
  { href: "#vi-sao", label: "Giới thiệu" },
  { href: "#faq", label: "FAQ" },
  { href: "#lien-he", label: "Liên hệ" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E8DDD0] bg-[#FFF4E8] pb-28 pt-12 text-[#6B635B] md:pb-12">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src={images.logo.src}
                alt={images.logo.alt}
                width={40}
                height={40}
                loading="lazy"
                className="size-10 rounded-xl border border-[#E8DDD0] bg-white object-contain p-0.5"
              />
              <span className="text-base font-extrabold text-[#2B2B2B]">Bắc Sơn Cường Nguyệt</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#6B635B]">
              Chuyên tuyến {businessInfo.route}. Vận chuyển hành khách và nhận gửi hàng theo chuyến
              hai chiều Mỹ Đình ⇄ Sơn La.
            </p>
          </div>

          <nav aria-label="Liên kết nhanh">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2B2B2B]">
              Truy cập nhanh
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[#2B2B2B] transition hover:text-[#D62828]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2B2B2B]">
              Thông tin liên hệ
            </h2>
            <ul className="mt-3 grid gap-2 text-sm">
              <li>
                Hotline 1:{" "}
                <a
                  href={businessInfo.phoneTel}
                  className="font-bold text-[#D62828] hover:underline"
                >
                  {businessInfo.phone}
                </a>
              </li>
              <li>
                Hotline 2:{" "}
                <a
                  href={businessInfo.phone2Tel}
                  className="font-bold text-[#C96A3D] hover:underline"
                >
                  {businessInfo.phone2}
                </a>
              </li>
              <li>
                Zalo:{" "}
                <a
                  href={businessInfo.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#C96A3D] hover:underline"
                >
                  {businessInfo.zalo}
                </a>
              </li>
              {businessInfo.offices.map((o) => (
                <li key={o.city} className="text-xs leading-relaxed text-[#6B635B]">
                  <b className="font-bold text-[#2B2B2B]">{o.city}:</b> {o.address}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-[#E8DDD0] pt-5 text-xs text-[#8F857B]">
          © {currentYear} {legalInfo.company} — GPKDVT {legalInfo.transportLicense}. MST{" "}
          {legalInfo.businessCode}.
        </p>
      </div>
    </footer>
  );
}
