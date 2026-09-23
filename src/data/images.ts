/**
 * Hệ thống ảnh - TOÀN BỘ là ảnh chụp thực tế của nhà xe Bắc Sơn Cường Nguyệt
 * (đã tối ưu WebP và tự lưu trữ trên tên miền production).
 * Muốn thay ảnh: chỉ cần thay asset tương ứng, không cần sửa layout.
 */

export type Img = { src: string; alt: string; width: number; height: number };

const photo = (url: string, alt: string, width = 1200, height = 800): Img => ({
  src: url,
  alt,
  width,
  height,
});

export const images = {
  heroBus: photo(
    "/images/optimized/hero-bus.webp",
    "Xe khách giường nằm Bắc Sơn Cường Nguyệt tuyến Sơn La – Mỹ Đình mở cửa đón khách",
    1200,
    800,
  ),
  busFull: photo(
    "/images/optimized/bus-full.webp",
    "Toàn thân xe giường nằm Universe Limousine của nhà xe Cường Nguyệt",
  ),
  busFleetYard: photo(
    "/images/optimized/bus-fleet-yard.webp",
    "Dàn xe Bắc Sơn Cường Nguyệt xếp hàng chờ xuất bến tại bến xe Sơn La",
  ),
  busFront: photo(
    "/images/optimized/bus-front.webp",
    "Đầu xe Bắc Sơn Cường Nguyệt chính diện với bảng tuyến Sơn La – Mỹ Đình",
  ),
  busDeparting: photo(
    "/images/optimized/bus-departing.webp",
    "Xe khách Bắc Sơn Cường Nguyệt xuất bến bắt đầu hành trình Sơn La – Hà Nội",
  ),
  busFleet: photo(
    "/images/optimized/bus-fleet.webp",
    "Đội xe limousine giường nằm của Bắc Sơn Cường Nguyệt tại bãi đỗ",
  ),
  cabinWindow: photo(
    "/images/optimized/cabin-window.webp",
    "Giường nằm cạnh cửa sổ có rèm che riêng trên xe Bắc Sơn Cường Nguyệt",
  ),
  interior: photo(
    "/images/optimized/interior.webp",
    "Nội thất khoang giường nằm xe Bắc Sơn Cường Nguyệt sạch sẽ, đèn trần trang trí",
  ),
  cabinLower: photo(
    "/images/optimized/cabin-lower.webp",
    "Cabin giường nằm tầng dưới có chăn gối sạch trên xe Hà Nội – Sơn La",
  ),
  cabinUpper: photo(
    "/images/optimized/cabin-upper.webp",
    "Cabin giường nằm tầng trên rộng rãi trên xe Bắc Sơn Cường Nguyệt",
  ),
  cabinReception: photo(
    "/images/optimized/cabin-reception.webp",
    "Khu vực reception giữa khoang giường nằm của xe Bắc Sơn Cường Nguyệt",
  ),
  cabinAisle: photo(
    "/images/optimized/cabin-aisle.webp",
    "Lối đi giữa hai dãy giường nằm trên xe khách Bắc Sơn Cường Nguyệt",
  ),
  logo: photo(
    "/images/optimized/logo.webp",
    "Logo nhà xe Cường Nguyệt tuyến Sơn La – Mộc Châu – Mỹ Đình",
    160,
    168,
  ),
} satisfies Record<string, Img>;
