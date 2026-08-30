/**
 * Gallery.tsx — Editorial Gallery with High-End Lightbox & 360° Integration
 *
 * Visual Direction:
 *  - 2-Column Asymmetric Layout: Left Hero (~63%) + Right Stacked (2 cards, ~37%).
 *  - Uniform card radius: rounded-[20px], overflow-hidden.
 *  - Clean 2-line editorial captions: Short title + subtitle on soft gradient overlay.
 *  - No eye icons, no clutter, photo-first aesthetic.
 */

import { useState } from "react";
import { Plus } from "lucide-react";
import { images, type Img } from "@/data/images";
import { getImage360 } from "@/data/image360";
import { ImmersiveImage } from "./ImmersiveImage";
import { Section, SectionHead } from "./primitives";
import type { GalleryViewerItem } from "./ImmersiveImageViewer";

export interface GalleryItem extends GalleryViewerItem {
  id: string;
  img: Img;
  title: string;
  subtitle: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "heroBus",
    img: images.heroBus,
    title: "Ngoại thất xe Universe Limousine",
    subtitle: "Xe giường nằm cao cấp tuyến Hà Nội ⇄ Sơn La",
  },
  {
    id: "interior",
    img: images.interior,
    title: "Khoang giường nằm",
    subtitle: "Không gian rộng rãi, sạch sẽ & thoáng đãng",
  },
  {
    id: "cabinWindow",
    img: images.cabinWindow,
    title: "Giường cạnh cửa sổ",
    subtitle: "Tầm nhìn ngắm cảnh đèo núi Tây Bắc",
  },
  {
    id: "cabinUpper",
    img: images.cabinUpper,
    title: "Cabin tầng trên",
    subtitle: "Trần cao thoáng mát, đèn đọc sách riêng",
  },
  {
    id: "cabinLower",
    img: images.cabinLower,
    title: "Cabin tầng dưới",
    subtitle: "Êm ái, thuận tiện cho người già và trẻ nhỏ",
  },
  {
    id: "cabinAisle",
    img: images.cabinAisle,
    title: "Lối đi giữa khoang",
    subtitle: "Thảm trải chống trượt, di chuyển dễ dàng",
  },
  {
    id: "cabinReception",
    img: images.cabinReception,
    title: "Khu vực đón tiếp",
    subtitle: "Nhân viên hỗ trợ chu đáo tại cửa lên xe",
  },
  {
    id: "busFront",
    img: images.busFront,
    title: "Đầu xe chính diện",
    subtitle: "Bảng tuyến Sơn La – Bến xe Mỹ Đình rõ ràng",
  },
  {
    id: "busFull",
    img: images.busFull,
    title: "Toàn thân xe",
    subtitle: "Dàn xe màu đỏ đô nổi bật, nhận diện dễ dàng",
  },
  {
    id: "busFleetYard",
    img: images.busFleetYard,
    title: "Đội xe tại bến",
    subtitle: "Xe sẵn sàng xuất bến đúng giờ niêm yết",
  },
  {
    id: "busFleet",
    img: images.busFleet,
    title: "Dàn xe phục vụ",
    subtitle: "Chạy liên tục ngày đêm hai chiều Hà Nội – Sơn La",
  },
  {
    id: "busDeparting",
    img: images.busDeparting,
    title: "Xe xuất bến",
    subtitle: "Khởi hành đúng giờ từ Bến xe Mỹ Đình & Sơn La",
  },
];

export function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const heroItem = galleryItems[0]!;
  const rightItem1 = galleryItems[1]!;
  const rightItem2 = galleryItems[2]!;
  const restItems = expanded ? galleryItems.slice(3) : galleryItems.slice(3, 7);

  return (
    <Section id="hinh-anh" tone="white">
      <SectionHead
        eyebrow="Hình ảnh thực tế 100%"
        title="Thư viện hình ảnh xe Bắc Sơn Cường Nguyệt"
        sub="Hình ảnh chân thực về dàn xe Universe Limousine, khoang giường nằm và các chuyến xuất bến thực tế. Nhấp vào bất kỳ ảnh nào để xem toàn cảnh chi tiết."
      />

      {/* ── 1. PRIMARY ASYMMETRIC 2-COLUMN HERO BLOCK ── */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
        {/* Left Column: Hero Image (~63% width) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ImmersiveImage
            entryOrImg={getImage360(heroItem.id) ?? heroItem.img}
            galleryList={galleryItems}
            itemIndex={0}
            caption={heroItem.title}
            className="h-[320px] sm:h-[420px] lg:h-[480px] w-full rounded-[18px] sm:rounded-[20px] border border-[#EAD9C6] bg-[#FFF8EE] shadow-xs hover:border-[#D51F26]/50 hover:shadow-lg"
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 sm:p-6 text-white">
              <p
                className="text-base sm:text-lg font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {heroItem.title}
              </p>
              <p className="mt-0.5 text-xs sm:text-sm text-white/80 leading-normal">
                {heroItem.subtitle}
              </p>
            </div>
          </ImmersiveImage>
        </div>

        {/* Right Column: 2 Stacked Images (~37% width) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5 lg:col-span-5 xl:col-span-4">
          {/* Right Card 1 */}
          <ImmersiveImage
            entryOrImg={getImage360(rightItem1.id) ?? rightItem1.img}
            galleryList={galleryItems}
            itemIndex={1}
            caption={rightItem1.title}
            className="h-[190px] sm:h-[200px] lg:h-[230px] w-full rounded-[18px] sm:rounded-[20px] border border-[#EAD9C6] bg-[#FFF8EE] shadow-xs hover:border-[#D51F26]/50 hover:shadow-lg"
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3.5 sm:p-4 text-white">
              <p className="text-sm font-bold text-white tracking-tight">{rightItem1.title}</p>
              <p className="mt-0.5 text-xs text-white/80 line-clamp-1">{rightItem1.subtitle}</p>
            </div>
          </ImmersiveImage>

          {/* Right Card 2 */}
          <ImmersiveImage
            entryOrImg={getImage360(rightItem2.id) ?? rightItem2.img}
            galleryList={galleryItems}
            itemIndex={2}
            caption={rightItem2.title}
            className="h-[190px] sm:h-[200px] lg:h-[230px] w-full rounded-[18px] sm:rounded-[20px] border border-[#EAD9C6] bg-[#FFF8EE] shadow-xs hover:border-[#D51F26]/50 hover:shadow-lg"
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3.5 sm:p-4 text-white">
              <p className="text-sm font-bold text-white tracking-tight">{rightItem2.title}</p>
              <p className="mt-0.5 text-xs text-white/80 line-clamp-1">{rightItem2.subtitle}</p>
            </div>
          </ImmersiveImage>
        </div>
      </div>

      {/* ── 2. SECONDARY BALANCED GALLERY GRID ── */}
      <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {restItems.map((item, relIdx) => {
          const globalIdx = 3 + relIdx;
          return (
            <div key={item.id} className="relative">
              <ImmersiveImage
                entryOrImg={getImage360(item.id) ?? item.img}
                galleryList={galleryItems}
                itemIndex={globalIdx}
                caption={item.title}
                className="h-[160px] sm:h-[190px] md:h-[210px] w-full rounded-[18px] sm:rounded-[20px] border border-[#EAD9C6] bg-[#FFF8EE] shadow-xs hover:border-[#D51F26]/50 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 sm:p-3.5 text-white">
                  <p className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[0.7rem] sm:text-xs text-white/80 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
              </ImmersiveImage>
            </div>
          );
        })}
      </div>

      {/* ── 3. EXPAND / VIEW MORE BUTTON ── */}
      {!expanded ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border-[1.5px] border-[#EAD9C6] bg-white px-7 text-sm font-black text-[#D51F26] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D51F26] hover:bg-[#FFF4E8] hover:shadow-md active:scale-[0.98]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <Plus className="size-4 stroke-[2.5]" aria-hidden="true" />
            Xem toàn bộ {galleryItems.length} hình ảnh thực tế
          </button>
        </div>
      ) : null}
    </Section>
  );
}
