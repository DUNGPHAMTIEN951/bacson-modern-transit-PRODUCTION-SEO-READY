import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { businessInfo, siteConfig } from "../data/business";

function NotFoundComponent() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-4">
      <meta name="robots" content="noindex,nofollow" />
      <title>Không tìm thấy trang | {businessInfo.shortName}</title>
      <div className="max-w-md text-center">
        <p className="text-sm font-extrabold uppercase tracking-wider text-[#3F6670]">Lỗi 404</p>
        <h1 className="mt-3 text-3xl font-black text-[#23313F] sm:text-4xl">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5F6B76]">
          Trang bạn đang mở không tồn tại hoặc đã được chuyển. Bạn có thể quay lại trang chủ để xem
          lịch chạy, giá vé và thông tin liên hệ.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D97757] px-6 text-sm font-bold text-white shadow-[0_2px_8px_rgba(217,119,87,0.22)] transition-all duration-[220ms] hover:-translate-y-0.5 hover:bg-[#C86547] active:scale-[0.98]"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-4">
      <meta name="robots" content="noindex,nofollow" />
      <title>Không thể tải trang | {businessInfo.shortName}</title>
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-black tracking-tight text-[#23313F]">Không thể tải trang</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5F6B76]">
          Đã xảy ra lỗi tạm thời. Bạn có thể thử tải lại hoặc quay về trang chủ.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D97757] px-5 text-sm font-bold text-white shadow-[0_2px_8px_rgba(217,119,87,0.22)] transition-all duration-[220ms] hover:-translate-y-0.5 hover:bg-[#C86547] active:scale-[0.98]"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#DFE5EA] bg-white px-5 text-sm font-bold text-[#3F6670] shadow-xs transition-all duration-[220ms] hover:-translate-y-0.5 hover:border-[#3F6670] hover:bg-[#E8F2F4] active:scale-[0.98]"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: siteConfig.assetOrigin },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
