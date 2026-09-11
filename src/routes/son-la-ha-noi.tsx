import { createFileRoute } from "@tanstack/react-router";

import { JsonLd } from "@/components/seo/JsonLd";
import { RouteLanding } from "@/components/routes/RouteLanding";
import { sonLaHaNoiRoute } from "@/data/routes";
import { createFaqSchema } from "@/data/seo-schema";
import { createBreadcrumbSchema } from "@/components/seo/BreadcrumbJsonLd";
import { siteConfig } from "@/data/business";

export const Route = createFileRoute("/son-la-ha-noi")({
  head: () => ({
    meta: [
      { title: "Xe Sơn La Hà Nội | Xe giường nằm 34 chỗ | Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Xe Sơn La Hà Nội xe giường nằm 34 chỗ cao cấp, giá vé 380.000đ/vé, lộ trình chi tiết và đăng ký giữ chỗ trực tiếp cùng nhà xe Bắc Sơn Cường Nguyệt.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.canonical}son-la-ha-noi` }],
  }),
  component: SonLaHaNoiPage,
});

function SonLaHaNoiPage() {
  return (
    <>
      <JsonLd data={createFaqSchema(sonLaHaNoiRoute.faq)} />
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Trang chủ", url: siteConfig.domain },
          { name: "Tuyến xe", url: `${siteConfig.domain}/` },
          { name: sonLaHaNoiRoute.title, url: `${siteConfig.domain}/son-la-ha-noi` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: sonLaHaNoiRoute.title,
          provider: {
            "@type": "Organization",
            name: "Bắc Sơn Cường Nguyệt",
            url: siteConfig.canonical,
            telephone: "+84848755766",
          },
          areaServed: ["Sơn La", "Hát Lót", "Mộc Châu", "Hòa Bình", "Hà Nội"],
          serviceType: "Vận chuyển hành khách tuyến Sơn La - Hà Nội",
          description: sonLaHaNoiRoute.description,
        }}
      />
      <RouteLanding route={sonLaHaNoiRoute} />
    </>
  );
}
