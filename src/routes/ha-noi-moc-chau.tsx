import { createFileRoute } from "@tanstack/react-router";

import { JsonLd } from "@/components/seo/JsonLd";
import { RouteLanding } from "@/components/routes/RouteLanding";
import { haNoiMocChauRoute } from "@/data/routes";
import { createFaqSchema } from "@/data/seo-schema";
import { createBreadcrumbSchema } from "@/components/seo/BreadcrumbJsonLd";
import { siteConfig } from "@/data/business";

export const Route = createFileRoute("/ha-noi-moc-chau")({
  head: () => ({
    meta: [
      { title: "Xe Hà Nội Mộc Châu | Giá vé 300.000đ | Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Xe Hà Nội đi Mộc Châu xe giường nằm 34 chỗ cao cấp. Thông tin giá vé 300.000đ, lộ trình và đăng ký giữ chỗ uy tín cùng nhà xe Bắc Sơn Cường Nguyệt.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.canonical}ha-noi-moc-chau` }],
  }),
  component: HaNoiMocChauPage,
});

function HaNoiMocChauPage() {
  return (
    <>
      <JsonLd data={createFaqSchema(haNoiMocChauRoute.faq)} />
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Trang chủ", url: siteConfig.domain },
          { name: "Tuyến xe", url: `${siteConfig.domain}/` },
          { name: haNoiMocChauRoute.title, url: `${siteConfig.domain}/ha-noi-moc-chau` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: haNoiMocChauRoute.title,
          provider: {
            "@type": "Organization",
            name: "Bắc Sơn Cường Nguyệt",
            url: siteConfig.canonical,
            telephone: "+84848755766",
          },
          areaServed: ["Hà Nội", "Hòa Bình", "Mai Châu", "Mộc Châu"],
          serviceType: "Vận chuyển hành khách tuyến Hà Nội - Mộc Châu",
          description: haNoiMocChauRoute.description,
        }}
      />
      <RouteLanding route={haNoiMocChauRoute} />
    </>
  );
}
