import type { ReactNode } from "react";
import { PhoneCall, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { businessInfo } from "@/data/business";
import type { Img } from "@/data/images";

export function Section({
  id,
  children,
  className,
  tone = "white",
  ref,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "white" | "alt" | "blue" | "light" | "ice" | "navy" | "warm" | "soft";
  ref?: React.Ref<HTMLElement>;
}) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "section-pad scroll-mt-24",
        tone === "white" && "bg-white",
        (tone === "light" || tone === "alt" || tone === "ice") && "bg-[#FFF4E8]",
        (tone === "blue" || tone === "navy") && "bg-[#FFF4E8]",
        tone === "warm" && "bg-[#FFF9F3]",
        tone === "soft" && "bg-[#FFF2C9]",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "left",
  warm,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  invert?: boolean;
  align?: "left" | "center";
  warm?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <span className={warm ? "eyebrow-chip-red" : "eyebrow-chip"}>
          <span className="text-[#D62828] text-xs">★</span> {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-3 text-2xl font-extrabold text-[#2B2B2B] sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {sub ? <p className="mt-2.5 text-[0.975rem] leading-relaxed text-[#6B635B]">{sub}</p> : null}
    </div>
  );
}

type CtaProps = { className?: string; label?: string; pulse?: boolean };

/** Primary CTA — festive red #D62828 with micro-interaction */
export function CallButton({ className, label, pulse }: CtaProps) {
  return (
    <a
      href={businessInfo.phoneTel}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D62828] px-6 text-sm font-bold text-white transition-all duration-[220ms] ease-out",
        "hover:-translate-y-0.5 hover:bg-[#B71F1F] hover:shadow-[0_6px_18px_rgba(214,40,40,0.32)]",
        "active:scale-[0.98]",
        "shadow-[0_2px_8px_rgba(214,40,40,0.22)]",
        pulse && "btn-pulse",
        className,
      )}
      aria-label={`Gọi đặt vé ${businessInfo.phone}`}
    >
      <PhoneCall className="size-4 shrink-0 stroke-[2] text-white" aria-hidden="true" />
      {label ?? `Gọi đặt vé: ${businessInfo.phone}`}
    </a>
  );
}

/** Secondary CTA — clean white card with warm border #E8DDD0 & red/earthy hover */
export function ZaloButton({ className, label }: CtaProps) {
  return (
    <a
      href={businessInfo.zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E8DDD0] bg-white px-6 text-sm font-bold text-[#2B2B2B] transition-all duration-[220ms] ease-out",
        "hover:-translate-y-0.5 hover:border-[#D62828] hover:bg-[#FFF4E8] hover:shadow-[0_6px_18px_rgba(214,40,40,0.12)]",
        "active:scale-[0.98]",
        "shadow-[0_2px_8px_rgba(43,43,43,0.04)]",
        className,
      )}
      aria-label={`Nhắn Zalo ${businessInfo.zalo}`}
    >
      <MessageCircle className="size-4 shrink-0 stroke-[2] text-[#D62828]" aria-hidden="true" />
      {label ?? `Nhắn Zalo: ${businessInfo.zalo}`}
    </a>
  );
}

export function Photo({
  img,
  className,
  imgClassName,
  priority,
  ratio = "4/3",
  onClick,
  caption,
}: {
  img: Img;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  ratio?: string;
  onClick?: () => void;
  caption?: string;
}) {
  const media = (
    <img
      src={img.src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      className={cn("size-full object-cover", imgClassName)}
      style={{ aspectRatio: ratio }}
    />
  );

  const body = (
    <>
      <div
        className="overflow-hidden rounded-xl border border-[#E8DDD0] bg-[#FFF4E8]"
        style={{ aspectRatio: ratio }}
      >
        {media}
      </div>
      {caption ? (
        <figcaption className="mt-1.5 text-xs font-medium text-[#8F857B]">{caption}</figcaption>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <figure className={className}>
        <button
          type="button"
          onClick={onClick}
          aria-label={`Xem ảnh lớn: ${img.alt}`}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-xl transition hover:opacity-95"
        >
          <div
            className="overflow-hidden rounded-xl border border-[#E8DDD0] bg-[#FFF4E8]"
            style={{ aspectRatio: ratio }}
          >
            <img
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading="lazy"
              decoding="async"
              className={cn(
                "size-full object-cover transition duration-300 group-hover:scale-[1.02]",
                imgClassName,
              )}
              style={{ aspectRatio: ratio }}
            />
          </div>
        </button>
        {caption ? (
          <figcaption className="mt-1.5 text-xs font-medium text-[#8F857B]">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return <figure className={className}>{body}</figure>;
}
