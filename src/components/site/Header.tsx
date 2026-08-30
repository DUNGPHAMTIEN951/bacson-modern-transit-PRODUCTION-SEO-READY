import { useEffect, useState } from "react";
import { Menu, X, PhoneCall } from "lucide-react";
import { businessInfo } from "@/data/business";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";

export const navLinks = [
  { href: "#lich-chay", label: "Lịch chạy" },
  { href: "#gia-ve", label: "Giá vé" },
  { href: "#tu-van-dat-ve", label: "Đặt tư vấn" },
  { href: "#gui-hang", label: "Gửi hàng" },
  { href: "#hinh-anh", label: "Hình ảnh" },
  { href: "#diem-don", label: "Điểm đón" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 12);

      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        setScrollProgress(Math.min(100, (scrollY / winHeight) * 100));
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Sleek Scroll Progress Bar at very top */}
      <div
        className="fixed inset-x-0 top-0 z-[60] h-[2.5px] bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#D51F26] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2/9 Seasonal Announcement Top Bar */}
      <div
        className="relative overflow-hidden border-b border-[#A8171D] py-2 text-center text-xs font-semibold text-white intro-topbar select-none"
        style={{ background: "linear-gradient(90deg, #C41820 0%, #D51F26 45%, #C41820 100%)" }}
      >
        {/* Decorative radial firework — left */}
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-30 hidden sm:block"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="14"
              y1="14"
              x2={14 + 11 * Math.cos((deg * Math.PI) / 180)}
              y2={14 + 11 * Math.sin((deg * Math.PI) / 180)}
              stroke="#F4C84A"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
          <circle cx="14" cy="14" r="2.5" fill="#F4C84A" />
        </svg>
        {/* Decorative radial firework — right */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hidden sm:block"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="14"
              y1="14"
              x2={14 + 11 * Math.cos((deg * Math.PI) / 180)}
              y2={14 + 11 * Math.sin((deg * Math.PI) / 180)}
              stroke="#F4C84A"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
          <circle cx="14" cy="14" r="2.5" fill="#F4C84A" />
        </svg>
        <div
          className="flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <span className="text-[#F4C84A] text-base leading-none star-twinkle" aria-hidden="true">
            ★
          </span>
          <span className="tracking-wide" style={{ letterSpacing: "0.03em" }}>
            CHÀO MỪNG QUỐC KHÁNH 2/9 – ĐỒNG HÀNH CÙNG NHỮNG CHUYẾN TRỞ VỀ SƠN LA
          </span>
          <span
            className="text-[#F4C84A] text-base leading-none star-twinkle hidden sm:inline"
            aria-hidden="true"
          >
            ★
          </span>
        </div>
      </div>

      {/* Sub-topbar Contact Info */}
      <div className="hidden border-b border-[#EAD9C6] bg-[#FFF4E8] text-xs text-[#795F55] md:block intro-header">
        <div className="container-page flex items-center justify-between py-2">
          <span className="font-semibold text-[#5A3828]">{businessInfo.tagline}</span>
          <span className="flex items-center gap-1.5">
            Hotline:{" "}
            <a
              href={businessInfo.phoneTel}
              className="font-black text-[#D51F26] transition hover:text-[#A8171D] hover:underline"
            >
              {businessInfo.phone}
            </a>{" "}
            ·{" "}
            <a
              href={businessInfo.phone2Tel}
              className="font-bold text-[#C96A3D] transition hover:text-[#B55A30] hover:underline"
            >
              {businessInfo.phone2}
            </a>{" "}
            · Zalo:{" "}
            <a
              href={businessInfo.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#0068FF] transition hover:underline"
            >
              {businessInfo.zalo}
            </a>
          </span>
        </div>
      </div>

      {/* Main sticky header with smooth dynamic height & blur */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-[#EAD9C6] bg-white/95 backdrop-blur-md transition-all duration-300 ease-out",
          scrolled ? "h-14 shadow-[0_4px_20px_rgba(58,33,27,0.08)]" : "h-16 shadow-xs",
        )}
      >
        <div className="container-page flex h-full items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#top"
            className="flex items-center gap-2.5 group"
            aria-label={`${businessInfo.shortName} — về đầu trang`}
          >
            <img
              src={images.logo.src}
              alt={images.logo.alt}
              width={40}
              height={40}
              className="size-9 shrink-0 rounded-lg border border-[#EAD9C6] bg-white object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="leading-tight">
              <span className="block text-sm font-extrabold text-[#3A211B] sm:text-base">
                Bắc Sơn Cường Nguyệt
              </span>
              <span className="block text-[0.68rem] font-medium text-[#795F55]">
                Hà Nội · Mộc Châu · Sơn La
              </span>
            </span>
          </a>

          {/* Desktop nav with animated red underline */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-link-animated rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3A211B] transition-colors duration-200 hover:text-[#D51F26]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Desktop hotline CTA with phone wobble */}
            <a
              href={businessInfo.phoneTel}
              className="group hidden min-h-10 items-center gap-2 rounded-lg bg-[#D51F26] px-4 text-xs font-black text-white shadow-[0_2px_8px_rgba(213,31,38,0.22)] transition-all duration-[220ms] ease-out hover:-translate-y-0.5 hover:bg-[#A8171D] hover:shadow-[0_6px_18px_rgba(213,31,38,0.32)] active:scale-[0.98] btn-primary btn-pulse animate-cta-shimmer sm:inline-flex"
              style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}
            >
              <PhoneCall className="size-3.5 stroke-[2] phone-wobble" aria-hidden="true" />
              <span>GỌI ĐẶT VÉ: {businessInfo.phone}</span>
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg border border-[#EAD9C6] text-[#3A211B] transition hover:bg-[#FFF4E8] lg:hidden"
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="size-5 stroke-[2]" aria-hidden="true" />
              ) : (
                <Menu className="size-5 stroke-[2]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className="absolute inset-0 bg-[#3A211B]/50 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-menu"
            aria-label="Điều hướng chính trên di động"
            className="absolute inset-x-0 top-0 border-b border-[#EAD9C6] bg-[#FFFDF9] p-5 shadow-[0_8px_32px_rgba(58,33,27,0.15)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={images.logo.src}
                  alt={images.logo.alt}
                  width={32}
                  height={32}
                  className="size-8 rounded-lg border border-[#EAD9C6] object-contain p-0.5"
                />
                <span className="text-sm font-extrabold text-[#3A211B]">Bắc Sơn Cường Nguyệt</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng menu"
                className="grid size-9 place-items-center rounded-lg border border-[#EAD9C6] text-[#3A211B]"
              >
                <X className="size-5 stroke-[2]" aria-hidden="true" />
              </button>
            </div>
            <ul className="grid gap-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-base font-bold text-[#3A211B] transition hover:bg-[#FFF0C3] hover:text-[#D51F26]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={businessInfo.phoneTel}
              className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D51F26] text-sm font-black text-white shadow-[0_2px_8px_rgba(213,31,38,0.25)] transition-all duration-200 hover:bg-[#A8171D] active:scale-[0.98] btn-pulse"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <PhoneCall className="size-4 stroke-[2]" aria-hidden="true" /> GỌI ĐẶT VÉ:{" "}
              {businessInfo.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
