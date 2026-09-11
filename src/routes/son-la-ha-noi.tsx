import { createFileRoute } from "@tanstack/react-router";

import { JsonLd } from "@/components/seo/JsonLd";
import { RouteLanding } from "@/components/routes/RouteLanding";
import { transportRoutes } from "@/data/routes";
import { createFaqSchema } from "@/data/seo-schema";
import { createBreadcrumbSchema } from "@/components/seo/BreadcrumbJsonLd";
import { siteConfig } from "@/data/business";

export const Route = createFileRoute("/son-la-ha-noi")({
  head: () => ({
    meta: [
      { title: "Xe Sơn La Hà Nội | Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Xe Sơn La Hà Nội xe giường nằm 34 chỗ, giá vé, lộ trình và đăng ký giữ chỗ cùng Bắc Sơn Cường Nguyệt.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: RoutePage,
});

function RoutePage() {
  return (
    <>
      <JsonLd data={createFaqSchema(transportRoutes.sonLaHaNoi.faq)} />
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Trang chủ", url: siteConfig.domain },
          { name: "Tuyến xe", url: `${siteConfig.domain}/` },
          { name: transportRoutes.sonLaHaNoi.title, url: `${siteConfig.domain}/son-la-ha-noi` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: transportRoutes.sonLaHaNoi.title,
          provider: {
            "@type": "Organization",
            name: "Bắc Sơn Cường Nguyệt",
          },
          description: transportRoutes.sonLaHaNoi.description,
        }}
      />
      <RouteLanding route={transportRoutes.sonLaHaNoi} />
    </>
  );
}
