import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import { type ImmersiveImageEntry, getImmersiveImage } from "@/data/immersive-images";
import type { Img } from "@/data/images";

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

const MIN_SCALE = 1;
const MAX_SCALE = 3.5;
const SCALE_STEP = 0.25;
const SWIPE_DISTANCE = 52;
const SWIPE_DURATION = 380;

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const useImmersiveViewer = () => useContext(ImmersiveContext);

function toViewerItem(entryOrImg: ImmersiveImageEntry | Img | string): GalleryViewerItem {
  if (typeof entryOrImg === "string") {
    const entry = getImmersiveImage(entryOrImg);
    return {
      id: entry?.id ?? entryOrImg,
      img: entry?.sourceImage ?? {
        src: entryOrImg,
        alt: "Hình ảnh thực tế",
        width: 1200,
        height: 800,
      },
      title: entry?.title ?? "Hình ảnh thực tế",
      subtitle: entry?.subtitle ?? "Bắc Sơn Cường Nguyệt",
      caption: entry?.caption,
    };
  }

  if ("sourceImage" in entryOrImg) {
    return {
      id: entryOrImg.id,
      img: entryOrImg.sourceImage,
      title: entryOrImg.title,
      subtitle: entryOrImg.subtitle,
      caption: entryOrImg.caption,
    };
  }

  return {
    id: entryOrImg.src,
    img: entryOrImg,
    title: entryOrImg.alt || "Hình ảnh thực tế",
    subtitle: "Bắc Sơn Cường Nguyệt",
  };
}

export function ImmersiveViewerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<GalleryViewerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(MIN_SCALE);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const touchStart = useRef({ x: 0, y: 0, at: 0 });
  const pinchStartDistance = useRef(0);
  const pinchStartScale = useRef(1);

  const currentItem = items[currentIndex];

  const resetView = useCallback(() => {
    setScale(MIN_SCALE);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const openImmersive = useCallback(
    (
      entryOrImg: ImmersiveImageEntry | Img | string,
      galleryList?: GalleryViewerItem[],
      initialIndex?: number,
    ) => {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
      const target = toViewerItem(entryOrImg);

      if (galleryList?.length) {
        setItems(galleryList);
        const matchedIndex = galleryList.findIndex((item) => item.id === target.id);
        setCurrentIndex(
          typeof initialIndex === "number" && initialIndex >= 0 && initialIndex < galleryList.length
            ? initialIndex
            : Math.max(0, matchedIndex),
        );
      } else {
        setItems([target]);
        setCurrentIndex(0);
      }

      resetView();
      setIsOpen(true);
    },
    [resetView],
  );

  const closeImmersive = useCallback(() => {
    if (document.fullscreenElement && dialogRef.current?.contains(document.fullscreenElement)) {
      void document.exitFullscreen().catch(() => undefined);
    }

    setIsOpen(false);
    setIsFullscreen(false);
    resetView();

    requestAnimationFrame(() => {
      triggerElementRef.current?.focus();
    });
  }, [resetView]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length) return;
      setCurrentIndex(index);
      resetView();
    },
    [items.length, resetView],
  );

  const goToNext = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((index) => (index + 1) % items.length);
    resetView();
  }, [items.length, resetView]);

  const goToPrevious = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((index) => (index - 1 + items.length) % items.length);
    resetView();
  }, [items.length, resetView]);

  const zoomIn = useCallback(() => {
    setScale((value) => Math.min(MAX_SCALE, Number((value + SCALE_STEP).toFixed(2))));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((value) => {
      const next = Math.max(MIN_SCALE, Number((value - SCALE_STEP).toFixed(2)));
      if (next === MIN_SCALE) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await dialogRef.current?.requestFullscreen?.();
      }
    } catch {
      // Fullscreen is optional; the overlay remains fully usable if the API is unavailable.
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeImmersive();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        zoomOut();
        return;
      }

      if (event.key === "0") {
        event.preventDefault();
        resetView();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);

      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeImmersive, goToNext, goToPrevious, resetView, zoomIn, zoomOut]);

  useEffect(() => {
    if (!isOpen || !thumbStripRef.current) return;
    const activeThumbnail = thumbStripRef.current.children[currentIndex] as HTMLElement | undefined;
    activeThumbnail?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentIndex, isOpen]);

  const handleMouseDown = (event: ReactMouseEvent) => {
    if (scale <= MIN_SCALE) return;
    setIsDragging(true);
    dragStart.current = { x: event.clientX, y: event.clientY };
    panStart.current = pan;
  };

  const handleMouseMove = (event: ReactMouseEvent) => {
    if (!isDragging || scale <= MIN_SCALE) return;
    setPan({
      x: panStart.current.x + event.clientX - dragStart.current.x,
      y: panStart.current.y + event.clientY - dragStart.current.y,
    });
  };

  const handleWheel = (event: ReactWheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
    setScale((value) => {
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, Number((value + delta).toFixed(2))));
      if (next === MIN_SCALE) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleTouchStart = (event: ReactTouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]!;
      touchStart.current = { x: touch.clientX, y: touch.clientY, at: Date.now() };
      if (scale > MIN_SCALE) {
        setIsDragging(true);
        dragStart.current = { x: touch.clientX, y: touch.clientY };
        panStart.current = pan;
      }
      return;
    }

    if (event.touches.length === 2) {
      const first = event.touches[0]!;
      const second = event.touches[1]!;
      pinchStartDistance.current = Math.hypot(
        first.clientX - second.clientX,
        first.clientY - second.clientY,
      );
      pinchStartScale.current = scale;
    }
  };

  const handleTouchMove = (event: ReactTouchEvent) => {
    if (event.touches.length === 1 && scale > MIN_SCALE && isDragging) {
      const touch = event.touches[0]!;
      setPan({
        x: panStart.current.x + touch.clientX - dragStart.current.x,
        y: panStart.current.y + touch.clientY - dragStart.current.y,
      });
      return;
    }

    if (event.touches.length === 2 && pinchStartDistance.current > 0) {
      const first = event.touches[0]!;
      const second = event.touches[1]!;
      const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
      const next = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, pinchStartScale.current * (distance / pinchStartDistance.current)),
      );
      setScale(next);
      if (next === MIN_SCALE) setPan({ x: 0, y: 0 });
    }
  };

  const handleTouchEnd = (event: ReactTouchEvent) => {
    setIsDragging(false);
    pinchStartDistance.current = 0;

    if (scale > MIN_SCALE || event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0]!;
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const elapsed = Date.now() - touchStart.current.at;

    if (
      elapsed <= SWIPE_DURATION &&
      Math.abs(deltaX) >= SWIPE_DISTANCE &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.4
    ) {
      if (deltaX < 0) goToNext();
      else goToPrevious();
    }
  };

  const handleDoubleClick = (event: ReactMouseEvent) => {
    event.preventDefault();
    if (scale > MIN_SCALE) resetView();
    else setScale(2);
  };

  return (
    <ImmersiveContext.Provider value={{ openImmersive, closeImmersive }}>
      {children}

      {isOpen && currentItem ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="viewer-image-title"
          aria-describedby="viewer-image-description"
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex flex-col bg-[#11100F] text-white outline-none select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onWheel={handleWheel}
        >
          <header className="relative z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0F0E0D]/92 px-4 backdrop-blur-md sm:h-16 sm:px-6">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="hidden shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#EAB83E] sm:inline">
                  Bắc Sơn Cường Nguyệt
                </span>
                <span className="hidden text-white/25 sm:inline" aria-hidden="true">
                  •
                </span>
                <h2
                  id="viewer-image-title"
                  className="truncate text-sm font-semibold text-white/95"
                >
                  {currentItem.title}
                </h2>
              </div>
              <p
                id="viewer-image-description"
                className="mt-0.5 hidden truncate text-xs text-white/55 sm:block"
              >
                {currentItem.subtitle ?? "Hình ảnh thực tế"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                onClick={toggleFullscreen}
                className="hidden size-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:flex"
              >
                {isFullscreen ? (
                  <Minimize2 className="size-4" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Maximize2 className="size-4" strokeWidth={2} aria-hidden="true" />
                )}
              </button>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Đóng trình xem ảnh"
                onClick={closeImmersive}
                className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/18"
              >
                <X className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </header>

          <main
            className="relative flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden p-2 sm:p-5 md:p-6"
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Ảnh trước"
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white sm:left-5 sm:size-12"
                >
                  <ChevronLeft className="size-6" strokeWidth={2} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Ảnh tiếp theo"
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white sm:right-5 sm:size-12"
                >
                  <ChevronRight className="size-6" strokeWidth={2} aria-hidden="true" />
                </button>
              </>
            ) : null}

            <div
              className="relative flex size-full items-center justify-center will-change-transform"
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
                transition: isDragging ? "none" : "transform 180ms ease-out",
                cursor: scale > MIN_SCALE ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
            >
              <img
                key={currentItem.img.src}
                src={currentItem.img.src}
                alt={currentItem.img.alt || currentItem.title}
                width={currentItem.img.width}
                height={currentItem.img.height}
                draggable={false}
                decoding="async"
                className="max-h-full max-w-full rounded-md object-contain object-center shadow-2xl pointer-events-none"
              />
            </div>
          </main>

          <footer className="relative z-30 flex min-h-16 shrink-0 items-center gap-3 border-t border-white/10 bg-[#0F0E0D]/95 px-3 py-2 backdrop-blur-md sm:min-h-20 sm:px-6">
            <div className="w-[64px] shrink-0 text-xs font-semibold tabular-nums text-white/70 sm:w-[90px] sm:text-sm">
              {currentIndex + 1} / {items.length}
            </div>

            {items.length > 1 ? (
              <div
                ref={thumbStripRef}
                className="no-scrollbar flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto py-1 sm:gap-2.5"
              >
                {items.map((item, index) => {
                  const active = index === currentIndex;
                  return (
                    <button
                      key={item.id || index}
                      type="button"
                      aria-label={`Xem ảnh ${index + 1}: ${item.title}`}
                      aria-current={active ? "true" : undefined}
                      onClick={() => goToIndex(index)}
                      className={`relative h-11 w-[68px] shrink-0 overflow-hidden rounded-lg border transition-opacity sm:h-12 sm:w-[76px] ${
                        active
                          ? "border-[#EAB83E] opacity-100 ring-1 ring-[#EAB83E]"
                          : "border-white/10 opacity-45 hover:opacity-85"
                      }`}
                    >
                      <img
                        src={item.img.src}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1" />
            )}

            <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-white/10 bg-black/55 p-1">
              <button
                type="button"
                aria-label="Thu nhỏ"
                disabled={scale <= MIN_SCALE}
                onClick={zoomOut}
                className="flex size-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <ZoomOut className="size-4" strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Đặt lại mức thu phóng"
                onClick={resetView}
                className="min-w-[48px] px-1 text-xs font-semibold tabular-nums text-white/80 transition-colors hover:text-white"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                type="button"
                aria-label="Phóng to"
                disabled={scale >= MAX_SCALE}
                onClick={zoomIn}
                className="flex size-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <ZoomIn className="size-4" strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Đặt lại góc nhìn"
                onClick={resetView}
                className="hidden size-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:flex"
              >
                <RotateCcw className="size-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </footer>
        </div>
      ) : null}
    </ImmersiveContext.Provider>
  );
}
