/** Chương trình ưu đãi được chủ nhà xe xác nhận ngày 21/10/2026.
 * Giảm 20% cho mọi hành khách trên mọi chuyến. Chưa có ngày kết thúc.
 */
export const DISCOUNT_PERCENT = 20;
export const discountedPriceVnd = (original: number): number =>
  Math.round((original * (100 - DISCOUNT_PERCENT)) / 100);
export const formatPriceVnd = (value: number): string =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export type Fare = {
  id: string;
  route: string;
  originalPriceVnd?: number;
  price: string;
  meta: string;
  featured?: boolean;
};

export const fares: Fare[] = [
  {
    id: "hn-sl",
    route: "Hà Nội → Sơn La",
    originalPriceVnd: 380000,
    price: formatPriceVnd(discountedPriceVnd(380000)),
    meta: "~320 km · khoảng 7 giờ",
    featured: true,
  },
  {
    id: "hn-mc",
    route: "Hà Nội → Mộc Châu",
    originalPriceVnd: 300000,
    price: formatPriceVnd(discountedPriceVnd(300000)),
    meta: "~200 km · khoảng 4 giờ 30",
  },
  {
    id: "mc-sl",
    route: "Mộc Châu → Sơn La",
    price: "Giảm 20% giá báo",
    meta: "Liên hệ để được báo giá gốc và giá ưu đãi theo chặng",
  },
];

export const fareDisclaimer =
  "Giảm 20% cho mọi hành khách, mọi chuyến xe, chưa ấn định ngày kết thúc. Giá hiển thị là giá tham khảo cho các tuyến đã niêm yết; vui lòng liên hệ nhà xe xác nhận giá, điểm đón và chỗ trống trước khi đi.";

export const priceRange =
  formatPriceVnd(discountedPriceVnd(300000)) + " - " + formatPriceVnd(discountedPriceVnd(380000));
