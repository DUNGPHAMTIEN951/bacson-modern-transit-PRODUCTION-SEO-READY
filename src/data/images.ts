/**
 * Hệ thống ảnh - TOÀN BỘ là ảnh chụp thực tế của nhà xe Bắc Sơn Cường Nguyệt
 * (đã tối ưu WebP: hero 1600px, gallery 1200px).
 * Muốn thay ảnh: chỉ cần thay asset tương ứng, không cần sửa layout.
 */

import heroBus from "@/assets/real/xe-bac-son-cuong-nguyet-son-la-my-dinh-hero.webp.asset.json";
import busFull from "@/assets/real/xe-giuong-nam-bac-son-cuong-nguyet-toan-than.webp.asset.json";
import busFleetYard from "@/assets/real/doi-xe-bac-son-cuong-nguyet-tai-ben.webp.asset.json";
import busFront from "@/assets/real/dau-xe-bac-son-cuong-nguyet-chinh-dien.webp.asset.json";
import busDeparting from "@/assets/real/xe-bac-son-cuong-nguyet-xuat-ben.webp.asset.json";
import busFleet from "@/assets/real/doi-xe-limousine-bac-son-cuong-nguyet.webp.asset.json";
import cabinWindow from "@/assets/real/giuong-nam-canh-cua-so-xe-bac-son-cuong-nguyet.webp.asset.json";
import interior from "@/assets/real/noi-that-xe-giuong-nam-bac-son-cuong-nguyet.webp.asset.json";
import cabinLower from "@/assets/real/cabin-giuong-nam-tang-duoi-bac-son-cuong-nguyet.webp.asset.json";
import cabinUpper from "@/assets/real/cabin-giuong-nam-tang-tren-bac-son-cuong-nguyet.webp.asset.json";
import cabinReception from "@/assets/real/khoang-giuong-nam-khu-reception-tren-xe.webp.asset.json";
import cabinAisle from "@/assets/real/loi-di-giua-khoang-giuong-nam-tren-xe.webp.asset.json";
import logo from "@/assets/real/logo-bac-son-cuong-nguyet.webp.asset.json";
import { siteConfig } from "@/data/business";

export type Img = { src: string; alt: string; width: number; height: number };

const resolveAssetUrl = (url: string) =>
  url.startsWith("http://") || url.startsWith("https://") ? url : `${siteConfig.assetOrigin}${url}`;

const photo = (url: string, alt: string, width = 1200, height = 800): Img => ({
  src: resolveAssetUrl(url),
  alt,
  width,
  height,
});

export const images = {
  heroBus: photo(
    heroBus.url,
    "Xe khách giường nằm Bắc Sơn Cường Nguyệt tuyến Sơn La – Mỹ Đình mở cửa đón khách",
    1600,
    1067,
  ),
  busFull: photo(busFull.url, "Toàn thân xe giường nằm Universe Limousine của nhà xe Cường Nguyệt"),
  busFleetYard: photo(
    busFleetYard.url,
    "Dàn xe Bắc Sơn Cường Nguyệt xếp hàng chờ xuất bến tại bến xe Sơn La",
  ),
  busFront: photo(
    busFront.url,
    "Đầu xe Bắc Sơn Cường Nguyệt chính diện với bảng tuyến Sơn La – Mỹ Đình",
  ),
  busDeparting: photo(
    busDeparting.url,
    "Xe khách Bắc Sơn Cường Nguyệt xuất bến bắt đầu hành trình Sơn La – Hà Nội",
  ),
  busFleet: photo(busFleet.url, "Đội xe limousine giường nằm của Bắc Sơn Cường Nguyệt tại bãi đỗ"),
  cabinWindow: photo(
    cabinWindow.url,
    "Giường nằm cạnh cửa sổ có rèm che riêng trên xe Bắc Sơn Cường Nguyệt",
  ),
  interior: photo(
    interior.url,
    "Nội thất khoang giường nằm xe Bắc Sơn Cường Nguyệt sạch sẽ, đèn trần trang trí",
  ),
  cabinLower: photo(
    cabinLower.url,
    "Cabin giường nằm tầng dưới có chăn gối sạch trên xe Hà Nội – Sơn La",
  ),
  cabinUpper: photo(
    cabinUpper.url,
    "Cabin giường nằm tầng trên rộng rãi trên xe Bắc Sơn Cường Nguyệt",
  ),
  cabinReception: photo(
    cabinReception.url,
    "Khu vực reception giữa khoang giường nằm của xe Bắc Sơn Cường Nguyệt",
  ),
  cabinAisle: photo(
    cabinAisle.url,
    "Lối đi giữa hai dãy giường nằm trên xe khách Bắc Sơn Cường Nguyệt",
  ),
  logo: photo(logo.url, "Logo nhà xe Cường Nguyệt tuyến Sơn La – Mộc Châu – Mỹ Đình", 600, 631),
} satisfies Record<string, Img>;
