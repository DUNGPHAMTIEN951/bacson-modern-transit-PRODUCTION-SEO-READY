import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/data/business";

export const Route = createFileRoute("/son-la-ha-noi")({
  head: () => ({
    meta: [
      { title: "Xe khách Sơn La đi Hà Nội | Bắc Sơn Cường Nguyệt" },
      {
        name: "description",
        content:
          "Xe khách Sơn La đi Hà Nội của Bắc Sơn Cường Nguyệt. Lịch chạy, giá vé, thông tin chuyến xe và đăng ký vé nhanh qua biểu mẫu.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.canonical}son-la-ha-noi` }],
  }),
  component: RoutePage,
});

function RoutePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-[#3b1f14]">
      <h1 className="text-4xl font-bold">Xe khách Sơn La đi Hà Nội</h1>
      <p className="mt-6 text-lg leading-8">
        Bắc Sơn Cường Nguyệt phục vụ tuyến xe khách Sơn La – Hà Nội với thông tin
        chuyến xe rõ ràng, hỗ trợ đăng ký vé qua website và tư vấn trực tiếp.
      </p>
      <h2 className="mt-10 text-2xl font-bold">Giá vé tham khảo</h2>
      <p className="mt-3">Tuyến Sơn La – Hà Nội: 380.000đ/vé.</p>
      <p className="mt-6">Khách hàng có thể gửi yêu cầu đặt vé qua form trên website để nhà xe liên hệ xác nhận.</p>
    </main>
  );
}
