/**
 * Thông tin doanh nghiệp - nguồn duy nhất cho hotline, Zalo, địa chỉ, pháp lý.
 * Sửa file này khi cần cập nhật liên hệ.
 */

export const businessInfo = {
  name: "Xe khách Bắc Sơn Cường Nguyệt",
  shortName: "Bắc Sơn Cường Nguyệt",
  tagline: "Chuyên tuyến Hà Nội – Mộc Châu – Sơn La",
  description:
    "Nhà xe chuyên tuyến Hà Nội – Mộc Châu – Sơn La, phục vụ vận chuyển hành khách bằng xe giường nằm và gửi hàng theo chuyến.",

  // Hotline chính
  phone: "0848.755.766",
  phoneTel: "tel:0848755766",
  phoneE164: "+84848755766",

  // Hotline 2
  phone2: "0384.755.766",
  phone2Tel: "tel:0384755766",
  phone2E164: "+84384755766",

  // Zalo (trùng hotline chính)
  zalo: "0848.755.766",
  zaloUrl: "https://zalo.me/0848755766",
  zaloTel: "tel:0848755766",

  route: "Hà Nội – Mộc Châu – Sơn La",
  routeShort: "Hà Nội ⇄ Sơn La",
  duration: "khoảng 7 giờ",
  distance: "khoảng 320 km",

  offices: [
    {
      city: "Hà Nội",
      title: "Đầu Hà Nội",
      address: "Bến xe Mỹ Đình, Nam Từ Liêm, Hà Nội",
      note: "Điểm xuất bến chiều Hà Nội → Sơn La.",
    },
    {
      city: "Sơn La",
      title: "Đầu Sơn La",
      address: "Số 03 đường Nguyễn Trãi, P. Quyết Thắng, TP. Sơn La",
      note: "Trụ sở công ty, điểm xuất bến chiều Sơn La → Mỹ Đình.",
    },
  ],

  areaServed: ["Hà Nội", "Hòa Bình", "Mai Châu", "Mộc Châu", "Yên Châu", "Sơn La"],
} as const;

/**
 * Trích từ Giấy phép kinh doanh vận tải bằng xe ô tô (Sở GTVT tỉnh Sơn La).
 * Chỉ giữ dữ liệu công khai — không đưa CCCD, địa chỉ cá nhân, chữ ký lên web.
 */
export const legalInfo = {
  company: "Công ty Cổ phần Thương mại và Du lịch Cường Nguyệt",
  transportLicense: "Số 14230090/GPKDVT — cấp ngày 31/10/2023",
  businessCode: "5500647436 — cấp ngày 01/8/2022",
  issuedBy: "Sở Giao thông Vận tải tỉnh Sơn La",
  headOffice: "Số 03 đường Nguyễn Trãi, Tổ 6, P. Quyết Thắng, TP. Sơn La, tỉnh Sơn La",
  scope: "vận tải hành khách theo hợp đồng và vận tải hàng hóa bằng xe ô tô",
} as const;

/** Canonical production URL - nguồn duy nhất cho SEO URL tuyệt đối. */
export const siteConfig = {
  domain: "https://xekhachbaccuongnguyet.com",
  canonical: "https://xekhachbaccuongnguyet.com/",
  title: "Xe Hà Nội Sơn La – Lịch chạy & Giá vé | Bắc Sơn Cường Nguyệt",
  description:
    "Xe Bắc Sơn Cường Nguyệt tuyến Hà Nội – Mộc Châu – Sơn La. Xem lịch xe, giá vé, điểm đón trả và dịch vụ gửi hàng. Đặt vé nhanh qua hotline 0848.755.766 - 0384.755.766.",
  /** Nguồn ảnh hiện tại của project. Có thể thay bằng /images khi đã self-host đủ WebP. */
  assetOrigin: "https://bacson-modern-transit.lovable.app",
  /** Ảnh Open Graph tự host trên domain production để tránh canonical/share phụ thuộc preview. */
  ogImage: "https://xekhachbaccuongnguyet.com/og-bac-son-cuong-nguyet.png",
} as const;
