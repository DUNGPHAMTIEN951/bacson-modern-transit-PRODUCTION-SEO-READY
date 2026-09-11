import { Link } from "@tanstack/react-router";

import type { RouteData } from "@/data/routes";

export function RouteLanding({ route }: { route: RouteData }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-[#2b1b12]">
      <section className="rounded-3xl bg-gradient-to-br from-[#fff7ed] to-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-[#D62828]">Bắc Sơn Cường Nguyệt</p>
        <h1 className="text-3xl font-black md:text-5xl">{route.title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-neutral-700">{route.description}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow">🚍 {route.vehicle}</div>
          <div className="rounded-2xl bg-white p-5 shadow">💰 {route.price}</div>
          <div className="rounded-2xl bg-white p-5 shadow">📍 {route.stops.join(" → ")}</div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Lộ trình</h2>
        <p className="mt-3">{route.stops.join(" → ")}</p>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
        <div className="mt-4 space-y-4">
          {route.faq.map((item) => (
            <div key={item.q}>
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-neutral-700">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <Link to="/" className="font-bold text-[#D62828]">← Về trang chủ</Link>
      </div>
    </main>
  );
}
