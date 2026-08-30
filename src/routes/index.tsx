import { createFileRoute } from "@tanstack/react-router";

import { businessInfo, legalInfo, siteConfig } from "@/data/business";
import { priceRange } from "@/data/fares";
import { faqs } from "@/data/content";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { QuickBar } from "@/components/site/QuickBar";
import { BrandStory } from "@/components/site/BrandStory";
import { Schedule } from "@/components/site/Schedule";
import { Fares } from "@/components/site/Fares";
import { RouteTimeline } from "@/components/site/RouteTimeline";
import { SonLaStory } from "@/components/site/SonLaStory";
import { Gallery } from "@/components/site/Gallery";
import { ImmersiveViewerProvider } from "@/components/site/ImmersiveImageViewer";
import { ContactDock } from "@/components/site/ContactDock";
import { Amenities } from "@/components/site/Amenities";
import { Cargo } from "@/components/site/Cargo";
import { WhyUs } from "@/components/site/WhyUs";
import { Offices } from "@/components/site/Offices";
import { Credentials } from "@/components/site/Credentials";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";
import { StickyCta } from "@/components/site/StickyCta";
import { VietnamLoadingScreen } from "@/components/site/VietnamLoadingScreen";
import { BookingModalProvider } from "@/components/site/BookingModalContext";
import { BookingConsultationSection } from "@/components/site/BookingConsultationSection";
import { BookingModal } from "@/components/site/BookingModal";

const businessId = `${siteConfig.domain}/#business`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": businessId,
      name: businessInfo.name,
      legalName: legalInfo.company,
      taxID: "5500647436",
      url: siteConfig.canonical,
      image: siteConfig.ogImage,
      logo: `${siteConfig.domain}/favicon.png`,
      telephone: businessInfo.phoneE164,
      description: businessInfo.description,
      priceRange,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: businessInfo.phoneE164,
          contactType: "customer service",
          areaServed: "VN",
          availableLanguage: ["vi"],
        },
        {
          "@type": "ContactPoint",
          telephone: businessInfo.phone2E164,
          contactType: "reservations",
          areaServed: "VN",
          availableLanguage: ["vi"],
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Số 03 đường Nguyễn Trãi, Tổ 6, P. Quyết Thắng",
        addressLocality: "TP. Sơn La",
        addressRegion: "Sơn La",
        addressCountry: "VN",
      },
      areaServed: businessInfo.areaServed,
    },
    {
      "@type": "Service",
      "@id": `${siteConfig.canonical}#service-hanh-khach`,
      name: "Xe khách Hà Nội – Sơn La",
      provider: { "@id": businessId },
      areaServed: ["Hà Nội", "Mộc Châu", "Sơn La"],
      serviceType: "Vận chuyển hành khách tuyến Hà Nội – Mộc Châu – Sơn La bằng xe giường nằm",
    },
    {
      "@type": "Service",
      "@id": `${siteConfig.canonical}#service-gui-hang`,
      name: "Gửi hàng Hà Nội – Sơn La",
      provider: { "@id": businessId },
      areaServed: ["Hà Nội", "Mộc Châu", "Sơn La"],
      serviceType: "Nhận gửi hàng hóa theo chuyến xe tuyến Hà Nội – Sơn La",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: siteConfig.canonical,
        },
      ],
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: siteConfig.title },
      { name: "description", content: siteConfig.description },
      {
        name: "robots",
        content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
      },
      { name: "author", content: businessInfo.shortName },
      { name: "theme-color", content: "#FFF9F3" },
      { property: "og:locale", content: "vi_VN" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: businessInfo.name },
      { property: "og:title", content: siteConfig.title },
      { property: "og:description", content: siteConfig.description },
      { property: "og:url", content: siteConfig.canonical },
      { property: "og:image", content: siteConfig.ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Bắc Sơn Cường Nguyệt – tuyến Hà Nội, Mộc Châu, Sơn La",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteConfig.title },
      { name: "twitter:description", content: siteConfig.description },
      { name: "twitter:image", content: siteConfig.ogImage },
      {
        name: "twitter:image:alt",
        content: "Bắc Sơn Cường Nguyệt – tuyến Hà Nội, Mộc Châu, Sơn La",
      },
    ],
    links: [
      { rel: "canonical", href: siteConfig.canonical },
      {
        rel: "preload",
        href: "/images/vietnamese-crane-loading.webp",
        as: "image",
        type: "image/webp",
      },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Index,
});

function Index() {
  return (
    <ImmersiveViewerProvider>
      <BookingModalProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-xl focus:bg-[#D62828] focus:px-5 focus:py-3 focus:font-bold focus:text-white focus:shadow-[0_4px_16px_rgba(214,40,40,0.3)]"
        >
          Bỏ qua tới nội dung chính
        </a>
        <Header />
        <main id="main">
          <Hero />
          <QuickBar />
          <BrandStory />
          <Schedule />
          <Fares />
          <BookingConsultationSection />
          <RouteTimeline />
          <SonLaStory />
          <Gallery />
          <Amenities />
          <Cargo />
          <WhyUs />
          <Offices />
          <Credentials />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <ContactDock />
        <StickyCta />
        <BookingModal />
        <VietnamLoadingScreen />
      </BookingModalProvider>
    </ImmersiveViewerProvider>
  );
}
