import { useState } from "react";
import { Camera, Eye, X, Sparkles, CheckCircle2 } from "lucide-react";
import type { RouteGalleryItem } from "@/data/routes";

interface Props {
  gallery: RouteGalleryItem[];
  title?: string;
  subtitle?: string;
}

export function RouteGallery({
  gallery,
  title = "Hình ảnh xe thực tế Bắc Sơn Cường Nguyệt",
  subtitle = "Cam kết 100% hình ảnh thật từ dàn xe giường nằm đời mới đang phục vụ hành khách trên tuyến.",
}: Props) {
  const [activeImage, setActiveImage] = useState<RouteGalleryItem | null>(null);

  if (!gallery || gallery.length === 0) return null;

  const mainImage = gallery[0];
  const subImages = gallery.slice(1);

  return (
    <section className="mt-12 sm:mt-16 rounded-[32px] sm:rounded-[40px] border border-[#EAD9C6] bg-white p-6 sm:p-8 md:p-12 shadow-[0_12px_36px_rgba(58,33,27,0.05)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAD9C6]/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D51F26]/20 bg-[#FBE2DE] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#D51F26] mb-3">
            <Camera className="size-3.5 text-[#D51F26]" aria-hidden="true" />
            <span>HÌNH ẢNH XE THỰC TẾ 100%</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3A211B] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#795F55] max-w-2xl">
            {subtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start md:self-auto text-xs font-bold text-[#8C6D58] bg-[#FFF0C3] border border-[#EAB83E]/40 px-4 py-2 rounded-full shadow-2xs">
          <Sparkles className="size-3.5 text-[#D51F26]" />
          <span>Chụp thực tế tại bến & khoang xe</span>
        </div>
      </div>

      {/* Gallery Bố cục: 1 Ảnh xe lớn (7 cols) + 2 Ảnh nội thất & trải nghiệm (5 cols) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 1. Ảnh lớn chính: Ngoại thất / Đoàn xe */}
        {mainImage && (
          <div
            onClick={() => setActiveImage(mainImage)}
            className="lg:col-span-7 group relative cursor-pointer overflow-hidden rounded-[24px] sm:rounded-[32px] border-2 border-[#EAD9C6] bg-[#FFFDF9] shadow-sm transition-all duration-300 hover:border-[#D51F26] hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
              <img
                src={mainImage.src}
                alt={mainImage.alt}
                width={900}
                height={560}
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1713]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag phân loại */}
              <div className="absolute top-4 left-4 rounded-full bg-[#D51F26] px-3.5 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                <span>{mainImage.tag}</span>
              </div>

              {/* Icon xem chi tiết */}
              <div className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-transform group-hover:scale-110 group-hover:bg-[#D51F26]">
                <Eye className="size-4" aria-hidden="true" />
              </div>

              {/* Tiêu đề ảnh */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3
                  className="text-lg sm:text-2xl font-bold"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {mainImage.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-white/90 line-clamp-1">
                  {mainImage.alt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. 2 Ảnh nhỏ: Nội thất & Trải nghiệm */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {subImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImage(img)}
              className="group relative cursor-pointer overflow-hidden rounded-[20px] sm:rounded-[24px] border-2 border-[#EAD9C6] bg-[#FFFDF9] shadow-sm transition-all duration-300 hover:border-[#D51F26] hover:shadow-md"
            >
              <div className="relative aspect-[16/9] lg:aspect-[16/8] w-full overflow-hidden bg-neutral-100">
                <img
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1713]/80 via-transparent to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

                <div className="absolute top-3 left-3 rounded-full bg-[#3A211B]/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {img.tag}
                </div>

                <div className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md group-hover:bg-[#D51F26] transition-colors">
                  <Eye className="size-3.5" aria-hidden="true" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4
                    className="text-base sm:text-lg font-bold"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {img.title}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-1">{img.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal phóng to ảnh khi khách hàng click */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full overflow-hidden rounded-[32px] bg-[#2B1713] text-white shadow-2xl border border-white/10"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-[#D51F26] transition-colors"
              aria-label="Đóng ảnh"
            >
              <X className="size-6" />
            </button>

            <div className="relative aspect-[16/10] w-full bg-black flex items-center justify-center">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="size-full object-contain max-h-[75vh]"
              />
            </div>

            <div className="p-5 sm:p-6 bg-[#2B1713] border-t border-white/10">
              <div className="inline-block rounded-full bg-[#D51F26] px-3.5 py-1 text-xs font-bold text-white mb-2">
                {activeImage.tag}
              </div>
              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {activeImage.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-300">{activeImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
