import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/data/business";

export const Route = createFileRoute("/ha-noi-moc-chau")({
  head: () => ({
    meta: [
      { title: "Xe khách Hà Nội đi Mộc Châu | Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Xe khách Hà Nội đi Mộc Châu. Giá vé tham khảo 300.000đ, thông tin chuyến xe và đăng ký vé với Bắc Sơn Cường Nguyệt.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.canonical}ha-noi-moc-chau` }],
  }),
  component: RoutePage,
});

function RoutePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-[#3b1f14]">
      <h1 className="text-4xl font-bold">Xe khách Hà Nội đi Mộc Châu</h1>
      <p className="mt-6 text-lg leading-8">
        Bắc Sơn Cường Nguyệt cung cấp thông tin tuyến Hà Nội – Mộc Châu, hỗ trợ
        khách đăng ký vé online qua form và được nhà xe xác nhận.
      </p>
      <h2 className="mt-10 text-2xl font-bold">Giá vé tham khảo</h2>
      <p className="mt-3">Tuyến Hà Nội – Mộc Châu: 300.000đ/vé.</p>
    </main>
  );
}
