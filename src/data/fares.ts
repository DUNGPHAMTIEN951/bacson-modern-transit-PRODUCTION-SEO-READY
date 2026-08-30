/**
 * Giá vé - giữ nguyên theo website nguồn.
 * VERIFY BEFORE PRODUCTION - chủ nhà xe cần xác nhận giá thực tế.
 */

export type Fare = {
  id: string;
  route: string;
  price: string;
  meta: string;
  featured?: boolean;
};

export const fares: Fare[] = [
  {
    id: "hn-sl",
    route: "Hà Nội → Sơn La",
    price: "380K",
    meta: "~320 km · khoảng 7 giờ",
    featured: true,
  },
  {
    id: "hn-mc",
    route: "Hà Nội → Mộc Châu",
    price: "300K",
    meta: "~200 km · khoảng 4 giờ 30",
  },
  {
    id: "mc-sl",
    route: "Mộc Châu → Sơn La",
    price: "Liên hệ",
    meta: "Gọi để nhận giá theo chặng và thời điểm",
  },
];

export const fareDisclaimer =
  "Giá vé có thể thay đổi vào dịp lễ/Tết hoặc theo loại xe. Vui lòng liên hệ nhà xe để xác nhận giá trước khi đặt.";

/** Dùng cho JSON-LD LocalBusiness. */
export const priceRange = "300.000đ - 380.000đ";
