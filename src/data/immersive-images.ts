/**
 * immersive-images.ts — Centralized Registry for Photo Sphere Viewer v5 & Immersive Photos
 *
 * Implements the 5-tier image experience hierarchy:
 *  - "full-sphere": True 2:1 equirectangular spherical panorama (continuous 360° yaw)
 *  - "partial-panorama": Sphere-projected partial panorama using PSV v5 panoData + strict yaw/pitch bounds
 *  - "extended-photo": Environmental / exterior view with wide explorable field & 2.5D perspective
 *  - "interactive-photo": High-resolution interactive photo with inertial pan & zoom
 *  - "static": Standard lightbox preview
 */

import { images, type Img } from "@/data/images";

export type ImmersiveMode =
  "full-sphere" | "partial-panorama" | "extended-photo" | "interactive-photo" | "static";

export interface PsvPanoData {
  fullWidth: number;
  fullHeight: number;
  croppedWidth: number;
  croppedHeight: number;
  croppedX: number;
  croppedY: number;
}

export interface ImmersiveImageEntry {
  id: string;
  sourceImage: Img;
  mode: ImmersiveMode;
  title: string;
  subtitle: string;
  caption?: string;
  modeLabel: string;
  subLabel: string;
  badgeLabel: string;
  /** Optional wider equirectangular asset if available */
  panoramaUrl?: string | null;
  /** PSV v5 Cropped Panorama configuration */
  panoData?: PsvPanoData;
  /** Rotation bounds in degrees for partial panoramas */
  minYaw?: number; // e.g. -70
  maxYaw?: number; // e.g. +70
  minPitch?: number; // e.g. -30
  maxPitch?: number; // e.g. +35
  defaultYaw?: number; // 0
  defaultPitch?: number; // 0
  defaultZoom?: number; // 0-100 (PSV default zoom level)
  /** Fallback 2D/2.5D initial zoom & offset */
  initialZoom?: number;
  initialOffset?: [number, number];
}

export const immersiveImages = {
  heroBus: {
    id: "heroBus",
    sourceImage: images.heroBus,
    mode: "partial-panorama",
    title: "Xe khách Bắc Sơn Cường Nguyệt",
    subtitle: "Dàn xe Universe Limousine tuyến Hà Nội – Mộc Châu – Sơn La",
    caption: "Xe khách giường nằm Bắc Sơn Cường Nguyệt tuyến Sơn La – Mỹ Đình mở cửa đón khách",
    modeLabel: "Ảnh chụp thực tế",
    subLabel: "Kéo để quan sát ngoại thất xe & cung đèo Tây Bắc",
    badgeLabel: "",
    panoData: {
      fullWidth: 4000,
      fullHeight: 2000,
      croppedWidth: 1600,
      croppedHeight: 1067,
      croppedX: 1200,
      croppedY: 466,
    },
    minYaw: -65,
    maxYaw: 65,
    minPitch: -25,
    maxPitch: 30,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 50,
    initialZoom: 1.15,
  },
  interior: {
    id: "interior",
    sourceImage: images.interior,
    mode: "partial-panorama",
    title: "Khoang giường nằm tổng thể",
    subtitle: "Không gian khoang xe Universe Limousine êm ái, sạch sẽ",
    caption: "Nội thất khoang giường nằm xe Bắc Sơn Cường Nguyệt sạch sẽ, đèn trần trang trí",
    modeLabel: "Ảnh chụp thực tế",
    subLabel: "Quan sát trọn vẹn khoang giường nằm & hệ thống đèn trần",
    badgeLabel: "",
    panoData: {
      fullWidth: 3200,
      fullHeight: 1600,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1000,
      croppedY: 400,
    },
    minYaw: -75,
    maxYaw: 75,
    minPitch: -30,
    maxPitch: 35,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 55,
    initialZoom: 1.25,
  },
  cabinWindow: {
    id: "cabinWindow",
    sourceImage: images.cabinWindow,
    mode: "partial-panorama",
    title: "Giường nằm cạnh cửa sổ",
    subtitle: "Vị trí ngắm trọn vẹn cảnh sắc đèo Tây Bắc dọc đường",
    caption: "Giường nằm cạnh cửa sổ có rèm che riêng trên xe Bắc Sơn Cường Nguyệt",
    modeLabel: "Ảnh chụp thực tế",
    subLabel: "Góc nhìn giường nằm panorama & rèm che riêng tư",
    badgeLabel: "",
    panoData: {
      fullWidth: 3200,
      fullHeight: 1600,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1000,
      croppedY: 400,
    },
    minYaw: -65,
    maxYaw: 65,
    minPitch: -25,
    maxPitch: 30,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 50,
    initialZoom: 1.2,
  },
  cabinUpper: {
    id: "cabinUpper",
    sourceImage: images.cabinUpper,
    mode: "partial-panorama",
    title: "Cabin giường nằm tầng trên",
    subtitle: "Không gian thoáng đãng, trần cao thoải mái",
    caption: "Cabin giường nằm tầng trên rộng rãi trên xe Bắc Sơn Cường Nguyệt",
    modeLabel: "Ảnh chụp thực tế",
    subLabel: "Góc quan sát cabin tầng trên từ ảnh chụp thực tế",
    badgeLabel: "",
    panoData: {
      fullWidth: 3400,
      fullHeight: 1700,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1100,
      croppedY: 450,
    },
    minYaw: -60,
    maxYaw: 60,
    minPitch: -25,
    maxPitch: 30,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 50,
    initialZoom: 1.2,
  },
  cabinLower: {
    id: "cabinLower",
    sourceImage: images.cabinLower,
    mode: "partial-panorama",
    title: "Cabin giường nằm tầng dưới",
    subtitle: "Vị trí êm ái, dễ lên xuống, chăn gối sạch thơm",
    caption: "Cabin giường nằm tầng dưới có chăn gối sạch trên xe Hà Nội – Sơn La",
    modeLabel: "Ảnh chụp thực tế",
    subLabel: "Góc quan sát cabin tầng dưới từ ảnh chụp thực tế",
    badgeLabel: "",
    panoData: {
      fullWidth: 3400,
      fullHeight: 1700,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1100,
      croppedY: 450,
    },
    minYaw: -60,
    maxYaw: 60,
    minPitch: -25,
    maxPitch: 30,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 50,
    initialZoom: 1.2,
  },
  cabinAisle: {
    id: "cabinAisle",
    sourceImage: images.cabinAisle,
    mode: "partial-panorama",
    title: "Lối đi khoang giường nằm",
    subtitle: "Lối đi sạch sẽ, trải thảm chống trượt êm ái",
    caption: "Lối đi giữa hai dãy giường nằm trên xe khách Bắc Sơn Cường Nguyệt",
    modeLabel: "Ảnh chụp thực tế",
    subLabel: "Góc nhìn dọc lối đi trung tâm khoang xe",
    badgeLabel: "",
    panoData: {
      fullWidth: 3000,
      fullHeight: 1500,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 900,
      croppedY: 350,
    },
    minYaw: -75,
    maxYaw: 75,
    minPitch: -30,
    maxPitch: 35,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 55,
    initialZoom: 1.25,
  },
  cabinReception: {
    id: "cabinReception",
    sourceImage: images.cabinReception,
    mode: "partial-panorama",
    title: "Khu vực Reception",
    subtitle: "Lối lên xuống và khu vực đón tiếp giữa khoang",
    caption: "Khu vực reception giữa khoang giường nằm của xe Bắc Sơn Cường Nguyệt",
    modeLabel: "Ảnh chụp thực tế",
    subLabel: "Góc quan sát khu reception từ ảnh chụp thực tế",
    badgeLabel: "",
    panoData: {
      fullWidth: 3200,
      fullHeight: 1600,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1000,
      croppedY: 400,
    },
    minYaw: -70,
    maxYaw: 70,
    minPitch: -25,
    maxPitch: 30,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 50,
    initialZoom: 1.2,
  },
  busFront: {
    id: "busFront",
    sourceImage: images.busFront,
    mode: "extended-photo",
    title: "Đầu xe Bắc Sơn Cường Nguyệt",
    subtitle: "Mặt trước xe Universe Limousine gắn bảng tuyến Sơn La – Mỹ Đình",
    caption: "Đầu xe Bắc Sơn Cường Nguyệt chính diện với bảng tuyến Sơn La – Mỹ Đình",
    modeLabel: "Ảnh tương tác chi tiết",
    subLabel: "Kéo để quan sát chi tiết mặt trước xe & biển tuyến",
    badgeLabel: "",
    panoData: {
      fullWidth: 4200,
      fullHeight: 2100,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1500,
      croppedY: 650,
    },
    minYaw: -45,
    maxYaw: 45,
    minPitch: -20,
    maxPitch: 25,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 45,
    initialZoom: 1.1,
  },
  busFull: {
    id: "busFull",
    sourceImage: images.busFull,
    mode: "extended-photo",
    title: "Toàn thân xe Universe Limousine",
    subtitle: "Dáng xe 12m dài rộng, tiện nghi cao cấp",
    caption: "Toàn thân xe giường nằm Universe Limousine của nhà xe Cường Nguyệt",
    modeLabel: "Ảnh tương tác chi tiết",
    subLabel: "Kéo để quan sát chi tiết thân xe & cửa đón khách",
    badgeLabel: "",
    panoData: {
      fullWidth: 3800,
      fullHeight: 1900,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1300,
      croppedY: 550,
    },
    minYaw: -55,
    maxYaw: 55,
    minPitch: -20,
    maxPitch: 25,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 45,
    initialZoom: 1.1,
  },
  busFleetYard: {
    id: "busFleetYard",
    sourceImage: images.busFleetYard,
    mode: "extended-photo",
    title: "Dàn xe tại Bến xe Sơn La",
    subtitle: "Đội xe xếp hàng chờ xuất bến phục vụ hành khách",
    caption: "Dàn xe Bắc Sơn Cường Nguyệt xếp hàng chờ xuất bến tại bến xe Sơn La",
    modeLabel: "Ảnh tương tác chi tiết",
    subLabel: "Kéo để quan sát chi tiết dàn xe tại bến",
    badgeLabel: "",
    panoData: {
      fullWidth: 3800,
      fullHeight: 1900,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1300,
      croppedY: 550,
    },
    minYaw: -55,
    maxYaw: 55,
    minPitch: -20,
    maxPitch: 25,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 45,
    initialZoom: 1.1,
  },
  busFleet: {
    id: "busFleet",
    sourceImage: images.busFleet,
    mode: "extended-photo",
    title: "Đội xe limousine giường nằm",
    subtitle: "Dàn phương tiện hiện đại phục vụ hành khách ngày đêm",
    caption: "Đội xe limousine giường nằm của Bắc Sơn Cường Nguyệt tại bãi đỗ",
    modeLabel: "Ảnh tương tác chi tiết",
    subLabel: "Kéo để quan sát chi tiết đội xe",
    badgeLabel: "",
    panoData: {
      fullWidth: 4000,
      fullHeight: 2000,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1400,
      croppedY: 600,
    },
    minYaw: -50,
    maxYaw: 50,
    minPitch: -20,
    maxPitch: 25,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 45,
    initialZoom: 1.1,
  },
  busDeparting: {
    id: "busDeparting",
    sourceImage: images.busDeparting,
    mode: "extended-photo",
    title: "Xe khách xuất bến đúng lịch",
    subtitle: "Hành trình khởi hành an toàn, đúng giờ quy định",
    caption: "Xe khách Bắc Sơn Cường Nguyệt xuất bến bắt đầu hành trình Sơn La – Hà Nội",
    modeLabel: "Ảnh tương tác chi tiết",
    subLabel: "Kéo để quan sát chi tiết thời điểm xuất bến",
    badgeLabel: "",
    panoData: {
      fullWidth: 3800,
      fullHeight: 1900,
      croppedWidth: 1200,
      croppedHeight: 800,
      croppedX: 1300,
      croppedY: 550,
    },
    minYaw: -55,
    maxYaw: 55,
    minPitch: -20,
    maxPitch: 25,
    defaultYaw: 0,
    defaultPitch: 0,
    defaultZoom: 45,
    initialZoom: 1.1,
  },
} satisfies Record<string, ImmersiveImageEntry>;

export type ImmersiveImageRegistry = typeof immersiveImages;

export function getImmersiveImage(keyOrUrl: string | Img): ImmersiveImageEntry | undefined {
  if (typeof keyOrUrl === "string") {
    const reg = immersiveImages as Record<string, ImmersiveImageEntry>;
    if (reg[keyOrUrl]) return reg[keyOrUrl];
    return Object.values(immersiveImages).find(
      (e) => e.sourceImage.src === keyOrUrl || e.id === keyOrUrl,
    );
  }
  return Object.values(immersiveImages).find((e) => e.sourceImage.src === keyOrUrl.src);
}
