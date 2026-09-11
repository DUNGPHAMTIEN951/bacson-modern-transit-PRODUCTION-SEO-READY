import { Link } from "@tanstack/react-router";

import type { TransportRoute } from "@/data/routes";

export function RouteLanding({ route }: { route: TransportRoute }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-[#2b1b12]">
      <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#fff7ed] via-white to-[#fef3c7] p-8 shadow-sm md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#D62828]">
              Bắc Sơn Cường Nguyệt
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">{route.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-neutral-700">{route.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="tel:"
                className="rounded-full bg-[#D62828] px-6 py-3 font-bold text-white shadow"
              >
                Gọi đặt vé
              </a>
              <a
                href="#booking"
                className="rounded-full border border-[#D62828] px-6 py-3 font-bold text-[#D62828]"
              >
                Đăng ký chuyến đi
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <div className="text-5xl">🚌</div>
            <p className="mt-4 text-xl font-bold">Xe tuyến cố định</p>
            <p className="mt-2 text-neutral-600">An toàn - tiện nghi - đúng giờ trên hành trình Tây Bắc.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">🚍 {route.vehicle}</div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">💰 {route.price}</div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">📍 {route.stops.join(" → ")}</div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Lộ trình chuyến xe</h2>
          <div className="mt-5 space-y-4">
            {route.stops.map((stop, index) => (
              <div key={stop} className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D62828] font-bold text-white">
                  {index + 1}
                </span>
                <span className="font-semibold">{stop}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="booking" className="rounded-3xl bg-[#2b1b12] p-8 text-white shadow-sm">
          <h2 className="text-2xl font-bold">Đăng ký giữ chỗ</h2>
          <p className="mt-3 text-white/80">
            Gửi yêu cầu để nhà xe liên hệ xác nhận chuyến đi.
          </p>
          <button className="mt-6 rounded-full bg-[#D62828] px-6 py-3 font-bold">
            Gửi thông tin
          </button>
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
        <div className="mt-4 space-y-5">
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
