import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/data/business";

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ Xe khách Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Liên hệ Bắc Sơn Cường Nguyệt để đăng ký vé xe, gửi hàng và được tư vấn tuyến Hà Nội, Mộc Châu, Sơn La.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.canonical}lien-he` }],
  }),
  component: RoutePage,
});

function RoutePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-[#3b1f14]">
      <h1 className="text-4xl font-bold">Liên hệ Bắc Sơn Cường Nguyệt</h1>
      <p className="mt-6 text-lg leading-8">
        Khách hàng có thể gửi thông tin qua biểu mẫu trên website hoặc liên hệ
        trực tiếp với nhà xe để được hỗ trợ lịch trình và đăng ký vé.
      </p>
    </main>
  );
}
