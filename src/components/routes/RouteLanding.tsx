import { Link } from "@tanstack/react-router";

import type { TransportRoute } from "@/data/routes";

export function RouteLanding({ route }: { route: TransportRoute }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-[#2b1b12]">
      <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#fff7ed] via-[#fffaf3] to-white p-8 shadow-lg md:p-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#D62828]">
          Bắc Sơn Cường Nguyệt
        </p>
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">{route.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-neutral-700">
              {route.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="tel:0987000000" className="rounded-full bg-[#D62828] px-6 py-3 font-bold text-white">
                Gọi đặt vé
              </a>
              <a href="#dang-ky" className="rounded-full border border-[#D62828] px-6 py-3 font-bold text-[#D62828]">
                Đăng ký chuyến đi
              </a>
            </div>
          </div>
          <div className="rounded-3xl bg-[#D62828]/10 p-8 text-center">
            <div className="text-6xl">🚌</div>
            <p className="mt-4 text-xl font-bold">{route.vehicle}</p>
            <p className="mt-2 text-2xl font-black text-[#D62828]">{route.price}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">🚍<br />Xe chất lượng cao</div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">💰<br />Giá vé minh bạch</div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">📍<br />Đúng tuyến đường</div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">📦<br />Nhận gửi hàng</div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Lộ trình chuyến xe</h2>
        <div className="mt-5 space-y-3">
          {route.stops.map((stop, index) => (
            <div key={stop} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D62828] font-bold text-white">
                {index + 1}
              </span>
              <span className="font-semibold">{stop}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="dang-ky" className="mt-8 rounded-3xl bg-[#fff7ed] p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Đăng ký xe</h2>
        <p className="mt-3 text-neutral-700">
          Gửi thông tin chuyến đi, nhà xe sẽ liên hệ xác nhận.
        </p>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
        <div className="mt-4 space-y-4">
          {route.faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold">{item.question}</h3>
              <p className="text-neutral-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <Link to="/" className="mt-8 inline-block font-bold text-[#D62828]">
        ← Về trang chủ
      </Link>
    </main>
  );
}
