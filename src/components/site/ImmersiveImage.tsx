/**
 * ImmersiveImage.tsx — Reusable Image with Contextual Immersive Interaction
 *
 * Renders a clean photograph on the page with smooth hover effect & zoom-in cursor.
 * On click: triggers the global photo viewer modal.
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type ImmersiveImageEntry, getImmersiveImage } from "@/data/immersive-images";
import { useImmersiveViewer, type GalleryViewerItem } from "./ImmersiveImageViewer";
import type { Img } from "@/data/images";

interface ImmersiveImageProps {
  /** Can be an ImmersiveImageEntry, a registry key string, or an Img object */
  entryOrImg: ImmersiveImageEntry | Img | string;
  galleryList?: GalleryViewerItem[];
  itemIndex?: number;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
  alt?: string;
  caption?: string;
  badgePosition?: "bottom-right" | "top-right" | "bottom-left" | "top-left";
  children?: ReactNode;
}

export function ImmersiveImage({
  entryOrImg,
  galleryList,
  itemIndex,
  className,
  aspectRatio,
  priority = false,
  alt,
  caption,
  badgePosition = "bottom-right",
  children,
}: ImmersiveImageProps) {
  const { openImmersive } = useImmersiveViewer();

  let entry: ImmersiveImageEntry | undefined;
  if (typeof entryOrImg === "string") {
    entry = getImmersiveImage(entryOrImg);
  } else if ("mode" in entryOrImg) {
    entry = entryOrImg;
  } else {
    entry = getImmersiveImage(entryOrImg);
  }

  const src = entry ? entry.sourceImage.src : (entryOrImg as Img).src;
  const imageAlt = alt ?? (entry ? entry.sourceImage.alt : (entryOrImg as Img).alt);
  const width = entry ? entry.sourceImage.width : (entryOrImg as Img).width;
  const height = entry ? entry.sourceImage.height : (entryOrImg as Img).height;

  const handleClick = () => {
    if (entry) {
      openImmersive(entry, galleryList, itemIndex);
    } else {
      openImmersive(
        {
          id: "generic",
          sourceImage: {
            src,
            alt: imageAlt,
            width: width ?? 1200,
            height: height ?? 800,
          },
          mode: "interactive-photo",
          title: caption ?? imageAlt ?? "Hình ảnh thực tế",
          subtitle: "Bắc Sơn Cường Nguyệt",
          caption: caption ?? imageAlt,
          modeLabel: "Ảnh thực tế",
          subLabel: "Quan sát chi tiết",
          badgeLabel: "",
          initialZoom: 1,
        },
        galleryList,
        itemIndex,
      );
    }
  };

  const is360 = entry?.mode === "full-sphere";

  return (
    <figure
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={is360 ? `Xem 360°: ${entry?.title}` : `Xem chi tiết: ${entry?.title ?? imageAlt}`}
      className={cn(
        "group relative cursor-zoom-in overflow-hidden rounded-[18px] sm:rounded-[20px] bg-black/5 transition-all duration-300 ease-out select-none",
        className,
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Underlying Image with subtle, quiet scale on hover (1.02) */}
      <img
        src={src}
        alt={imageAlt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className="size-full object-cover object-center transition-transform duration-[320ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.025]"
      />

      {/* Subtle Dark Gradient Overlay on Hover */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />

      {/* Only display 360° badge for true spherical panoramas */}
      {is360 && (
        <div
          className={cn(
            "pointer-events-none absolute z-10 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/70 px-2.5 py-1 text-[0.7rem] font-bold text-white shadow-md backdrop-blur-md transition-all duration-300 group-hover:border-[#EAB83E]/70 group-hover:bg-black/85",
            badgePosition === "bottom-right" && "bottom-3 right-3",
            badgePosition === "top-right" && "top-3 right-3",
            badgePosition === "bottom-left" && "bottom-3 left-3",
            badgePosition === "top-left" && "top-3 left-3",
          )}
        >
          <span
            className="text-[#EAB83E] transition-transform duration-400 group-hover:rotate-[25deg]"
            aria-hidden="true"
          >
            ↻
          </span>
          <span>360°</span>
        </div>
      )}

      {children}
    </figure>
  );
}
