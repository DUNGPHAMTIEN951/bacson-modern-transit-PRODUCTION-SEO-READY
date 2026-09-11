import { createFileRoute } from "@tanstack/react-router";

import { JsonLd } from "@/components/seo/JsonLd";
import { RouteLanding } from "@/components/routes/RouteLanding";
import { transportRoutes } from "@/data/routes";
import { siteConfig } from "@/data/business";

export const Route = createFileRoute("/ha-noi-moc-chau")({
  head: () => ({
    meta: [
      { title: "Xe Hà Nội Mộc Châu | Giá vé 300.000đ | Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Xe Hà Nội đi Mộc Châu xe giường nằm 34 chỗ. Thông tin giá vé, lộ trình và đăng ký giữ chỗ với Bắc Sơn Cường Nguyệt.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.canonical}ha-noi-moc-chau` }],
  }),
  component: RoutePage,
});

function RoutePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: transportRoutes.haNoiMocChau.title,
          provider: {
            "@type": "Organization",
            name: "Bắc Sơn Cường Nguyệt",
          },
          description: transportRoutes.haNoiMocChau.description,
        }}
      />
      <RouteLanding route={transportRoutes.haNoiMocChau} />
    </>
  );
}
