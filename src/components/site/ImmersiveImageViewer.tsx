/**
 * ImmersiveImageViewer.tsx — High-End Photo-First Gallery & Image Viewer
 *
 * Architectural Principles:
 *  - Photo-First & Clean: Default `object-fit: contain` ensures 100% of the vehicle/interior is visible.
 *  - Coherent Structure: Slim top bar, full image stage with prev/next navigation, bottom thumbnail strip & zoom toolbar.
 *  - Non-intrusive: Zero commercial CTAs floating over the photo.
 *  - Rich Navigation: Previous/Next buttons, bottom thumbnail carousel, keyboard arrows (←/→), ESC to close, touch swipe.
 *  - Zoom & Pan: Smooth 1x (Fit) to 3.5x zoom with mouse drag, wheel, pinch, and keyboard (+/-/0).
 *  - Accessibility: Full dialog ARIA roles, focus restoration, body scroll lock.
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  PhoneCall,
} from "lucide-react";
import type { Img } from "@/data/images";
import { businessInfo } from "@/data/business";
import { type ImmersiveImageEntry, getImmersiveImage } from "@/data/immersive-images";

/* ─────────────────────────────────────────────
   Types & Interfaces
───────────────────────────────────────────── */
export interface GalleryViewerItem {
  id: string;
  img: Img;
  title: string;
  subtitle?: string | undefined;
  caption?: string | undefined;
}

interface ImmersiveContextValue {
  openImmersive: (
    entryOrImg: ImmersiveImageEntry | Img | string,
    galleryList?: GalleryViewerItem[],
    initialIndex?: number,
  ) => void;
  closeImmersive: () => void;
}

const ImmersiveContext = createContext<ImmersiveContextValue>({
  openImmersive: () => {},
  closeImmersive: () => {},
});

export const useImmersiveViewer = () => useContext(ImmersiveContext);

/* ─────────────────────────────────────────────
   Provider & Modal Component
───────────────────────────────────────────── */
export function ImmersiveViewerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<GalleryViewerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Zoom & Pan State (Default: scale = 1, pan = {0, 0} => FIT TO SCREEN)
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const savedScrollY = useRef(0);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchStartTime = useRef(0);
  const pinchStartDist = useRef(0);
  const pinchStartScale = useRef(1);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Current active item
  const currentItem: GalleryViewerItem | undefined = items[currentIndex];

  /* ── Open Viewer Handler ── */
  const openImmersive = useCallback(
    (
      entryOrImg: ImmersiveImageEntry | Img | string,
      galleryList?: GalleryViewerItem[],
      initialIndex?: number,
    ) => {
      savedScrollY.current = window.scrollY;
      triggerElementRef.current = document.activeElement as HTMLElement;

      let targetItem: GalleryViewerItem;

      if (typeof entryOrImg === "string") {
        const entry = getImmersiveImage(entryOrImg);
        targetItem = {
          id: entry?.id ?? entryOrImg,
          img: entry?.sourceImage ?? {
            src: entryOrImg,
            alt: "Hình ảnh thực tế",
            width: 1200,
            height: 800,
          },
          title: entry?.title ?? "Hình ảnh thực tế",
          subtitle: entry?.subtitle ?? "Xe Bắc Sơn Cường Nguyệt",
        };
      } else if ("sourceImage" in entryOrImg) {
        targetItem = {
          id: entryOrImg.id,
          img: entryOrImg.sourceImage,
          title: entryOrImg.title,
          subtitle: entryOrImg.subtitle,
          caption: entryOrImg.caption,
        };
      } else {
        targetItem = {
          id: "img",
          img: entryOrImg,
          title: entryOrImg.alt || "Hình ảnh thực tế",
          subtitle: "Xe Bắc Sơn Cường Nguyệt",
        };
      }

      if (galleryList && galleryList.length > 0) {
        setItems(galleryList);
        const idx =
          typeof initialIndex === "number"
            ? initialIndex
            : galleryList.findIndex((item) => item.id === targetItem.id);
        setCurrentIndex(idx >= 0 ? idx : 0);
      } else {
        setItems([targetItem]);
        setCurrentIndex(0);
      }

      // Reset to 100% contain fit by default
      setScale(1);
      setPan({ x: 0, y: 0 });
      setIsDragging(false);
      setIsOpen(true);
    },
    [],
  );

  /* ── Close Viewer Handler ── */
  const closeImmersive = useCallback(() => {
    setIsOpen(false);
    setScale(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);

    // Restore scroll position
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollY.current, behavior: "instant" });
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    });
  }, []);

  /* ── Navigation Handlers ── */
  const goToNext = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setScale(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setScale(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, [items.length]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < items.length) {
        setCurrentIndex(index);
        setScale(1);
        setPan({ x: 0, y: 0 });
        setIsDragging(false);
      }
    },
    [items.length],
  );

  /* ── Zoom Handlers ── */
  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(1, Number((prev - 0.25).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleDoubleClick = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      if (scale > 1) {
        handleResetZoom();
      } else {
        setScale(2);
        setPan({ x: 0, y: 0 });
      }
    },
    [scale, handleResetZoom],
  );

  /* ── Fullscreen Browser Toggle ── */
  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  /* ── Scroll Lock & Focus Trap ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── Keyboard Shortcuts ── */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeImmersive();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeImmersive, goToNext, goToPrev, handleZoomIn, handleZoomOut, handleResetZoom]);

  /* ── Auto-scroll active thumbnail into view ── */
  useEffect(() => {
    if (isOpen && thumbStripRef.current) {
      const activeThumb = thumbStripRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentIndex, isOpen]);

  /* ── Mouse Drag (Pan when scale > 1) ── */
  const handleMouseDown = (e: ReactMouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging || scale <= 1) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /* ── Mouse Wheel Zoom ── */
  const handleWheel = (e: ReactWheelEvent) => {
    if (e.ctrlKey || Math.abs(e.deltaY) > 20) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setScale((prev) => {
        const next = Math.max(1, Math.min(3.5, Number((prev + delta).toFixed(2))));
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  /* ── Touch Handling (Swipe to navigate at scale 1, Pan/Pinch at scale > 1) ── */
  const handleTouchStart = (e: ReactTouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]!;
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      touchStartTime.current = Date.now();

      if (scale > 1) {
        setIsDragging(true);
        dragStart.current = { x: touch.clientX, y: touch.clientY };
        panStart.current = { ...pan };
      }
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0]!;
      const t2 = e.touches[1]!;
      pinchStartDist.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartScale.current = scale;
    }
  };

  const handleTouchMove = (e: ReactTouchEvent) => {
    if (e.touches.length === 1 && scale > 1 && isDragging) {
      const touch = e.touches[0]!;
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;
      setPan({
        x: panStart.current.x + dx,
        y: panStart.current.y + dy,
      });
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0]!;
      const t2 = e.touches[1]!;
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (pinchStartDist.current > 0) {
        const ratio = dist / pinchStartDist.current;
        const newScale = Math.max(1, Math.min(3.5, pinchStartScale.current * ratio));
        setScale(newScale);
        if (newScale === 1) setPan({ x: 0, y: 0 });
      }
    }
  };

  const handleTouchEnd = (e: ReactTouchEvent) => {
    setIsDragging(false);

    // Check for swipe gesture at 1x scale
    if (scale <= 1 && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0]!;
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = touch.clientY - touchStartPos.current.y;
      const elapsed = Date.now() - touchStartTime.current;

      // Fast horizontal swipe (< 350ms, > 50px, mostly horizontal)
      if (elapsed < 350 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    }
  };

  return (
    <ImmersiveContext.Provider value={{ openImmersive, closeImmersive }}>
      {children}

      {/* ── FULLSCREEN GALLERY VIEWER OVERLAY ── */}
      {isOpen && currentItem && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="viewer-image-title"
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex flex-col bg-[#11100F] text-white select-none outline-none animate-fade-in"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* 1. TOP BAR — SLIM & CLEAN (56–64px) */}
          <header className="relative z-30 flex h-14 sm:h-16 shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-[#0F0E0D]/90 px-4 sm:px-6 backdrop-blur-md">
            {/* Left: Brand & Photo Title */}
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#EAB83E]">
                Bắc Sơn Cường Nguyệt
              </span>
              <span className="hidden sm:inline-block text-white/30" aria-hidden="true">
                •
              </span>
              <h2
                id="viewer-image-title"
                className="truncate text-xs sm:text-sm font-semibold text-white/95"
              >
                {currentItem.title}
              </h2>
            </div>

            {/* Right: Controls & Close */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                aria-label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                onClick={handleFullscreen}
                className="hidden sm:flex size-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {isFullscreen ? (
                  <Minimize2 className="size-4 stroke-[2]" />
                ) : (
                  <Maximize2 className="size-4 stroke-[2]" />
                )}
              </button>

              <button
                type="button"
                id="close-gallery-viewer"
                aria-label="Đóng trình xem ảnh"
                onClick={closeImmersive}
                className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-[#D9232E] active:scale-95"
              >
                <X className="size-5 stroke-[2]" />
              </button>
            </div>
          </header>

          {/* 2. MAIN IMAGE STAGE — CONTAINED FIT & NO COMMERCIAL CTAs */}
          <main
            className="relative min-h-0 flex-1 overflow-hidden flex items-center justify-center p-3 sm:p-5 md:p-6"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
          >
            {/* Left Prev Navigation Button */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Ảnh trước"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 size-11 sm:size-12 rounded-full bg-black/55 border border-white/10 text-white/80 hover:text-white hover:bg-black/85 hover:scale-105 flex items-center justify-center transition-all shadow-lg backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-[#D9232E]"
              >
                <ChevronLeft className="size-6 stroke-[2]" />
              </button>
            )}

            {/* Right Next Navigation Button */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={goToNext}
                aria-label="Ảnh tiếp theo"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 size-11 sm:size-12 rounded-full bg-black/55 border border-white/10 text-white/80 hover:text-white hover:bg-black/85 hover:scale-105 flex items-center justify-center transition-all shadow-lg backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-[#D9232E]"
              >
                <ChevronRight className="size-6 stroke-[2]" />
              </button>
            )}

            {/* Primary Visual Canvas */}
            <div
              className="relative size-full flex items-center justify-center transition-transform ease-out will-change-transform"
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
                transitionDuration: isDragging ? "0ms" : "180ms",
                cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
            >
              <img
                key={currentItem.img.src}
                src={currentItem.img.src}
                alt={currentItem.img.alt || currentItem.title}
                width={currentItem.img.width}
                height={currentItem.img.height}
                draggable={false}
                className="max-h-full max-w-full object-contain object-center rounded-lg select-none shadow-2xl pointer-events-none transition-opacity duration-200"
              />
            </div>
          </main>

          {/* 3. BOTTOM TOOLBAR & THUMBNAIL STRIP (72–80px) */}
          <footer className="relative z-30 flex h-18 sm:h-20 shrink-0 items-center justify-between gap-3 border-t border-white/8 bg-[#0F0E0D]/95 px-3 sm:px-6 backdrop-blur-md">
            {/* Left: Image Counter */}
            <div className="flex items-center gap-2 min-w-[70px] sm:min-w-[120px]">
              <span className="text-xs sm:text-sm font-bold text-white/75 tabular-nums">
                {currentIndex + 1} / {items.length}
              </span>
              <a
                href={businessInfo.phoneTel}
                className="hidden xl:inline-flex items-center gap-1.5 text-xs text-[#EAB83E] hover:underline font-semibold ml-3 pl-3 border-l border-white/15"
              >
                <PhoneCall className="size-3 stroke-[2]" aria-hidden="true" />
                <span>{businessInfo.phone}</span>
              </a>
            </div>

            {/* Center: Thumbnail Strip */}
            {items.length > 1 && (
              <div
                ref={thumbStripRef}
                className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 max-w-[50vw] sm:max-w-[58vw] md:max-w-[62vw]"
              >
                {items.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => goToIndex(idx)}
                      aria-label={`Xem ảnh ${idx + 1}: ${item.title}`}
                      className={`relative shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                        isActive
                          ? "ring-2 ring-[#D9232E] scale-105 opacity-100 shadow-md"
                          : "opacity-45 hover:opacity-85"
                      }`}
                      style={{
                        width: "68px",
                        height: "44px",
                      }}
                    >
                      <img
                        src={item.img.src}
                        alt={item.img.alt}
                        className="size-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Right: Integrated Zoom Controls */}
            <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-xl p-1 shrink-0">
              <button
                type="button"
                aria-label="Thu nhỏ"
                disabled={scale <= 1}
                onClick={handleZoomOut}
                className="flex size-7 sm:size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ZoomOut className="size-4 stroke-[2]" />
              </button>

              <button
                type="button"
                aria-label="Đặt lại mức thu phóng"
                onClick={handleResetZoom}
                className="px-1.5 sm:px-2 text-[0.72rem] sm:text-xs font-semibold text-white/80 hover:text-white tabular-nums transition-colors"
              >
                {Math.round(scale * 100)}%
              </button>

              <button
                type="button"
                aria-label="Phóng to"
                disabled={scale >= 3.5}
                onClick={handleZoomIn}
                className="flex size-7 sm:size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ZoomIn className="size-4 stroke-[2]" />
              </button>

              <button
                type="button"
                aria-label="Đặt lại góc nhìn"
                onClick={handleResetZoom}
                className="flex size-7 sm:size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition-colors"
              >
                <RotateCcw className="size-3.5 stroke-[2]" />
              </button>
            </div>
          </footer>
        </div>
      )}
      {/* Global CSS overrides for Photo Sphere Viewer container */}
      <style>{`
        .psv-container {
          background-color: #120B08 !important;
        }
        .psv-canvas-container {
          cursor: grab !important;
        }
        .psv-canvas-container:active {
          cursor: grabbing !important;
        }
      `}</style>
    </ImmersiveContext.Provider>
  );
}
