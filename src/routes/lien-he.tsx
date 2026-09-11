import { createFileRoute } from "@tanstack/react-router";

import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/data/seo-schema";
import { siteConfig } from "@/data/business";

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ Xe khách Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Liên hệ Bắc Sơn Cường Nguyệt để đăng ký vé xe, tìm hiểu thông tin doanh nghiệp và được tư vấn tuyến Hà Nội, Mộc Châu, Sơn La.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.canonical}lien-he` }],
  }),
  component: RoutePage,
});

function RoutePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-[#3b1f14]">
      <JsonLd data={localBusinessSchema} />
      <section className="rounded-3xl bg-gradient-to-br from-[#fff7ed] to-white p-8 shadow-sm">
        <h1 className="text-4xl font-black">Liên hệ Bắc Sơn Cường Nguyệt</h1>
        <p className="mt-6 text-lg leading-8 text-neutral-700">
          Khách hàng có thể gửi thông tin qua biểu mẫu trên website hoặc liên hệ
          trực tiếp với nhà xe để được hỗ trợ lịch trình và đăng ký vé.
        </p>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Thông tin doanh nghiệp</h2>
        <p className="mt-4 text-neutral-700">
          Bắc Sơn Cường Nguyệt là đơn vị vận tải hành khách phục vụ các tuyến
          Hà Nội, Mộc Châu và Sơn La.
        </p>
      </section>
    </main>
  );
}
