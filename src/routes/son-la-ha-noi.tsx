import { createFileRoute } from "@tanstack/react-router";

import { RouteLanding } from "@/components/routes/RouteLanding";
import { transportRoutes } from "@/data/routes";

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
  return <RouteLanding route={transportRoutes.sonLaHaNoi} />;
}
