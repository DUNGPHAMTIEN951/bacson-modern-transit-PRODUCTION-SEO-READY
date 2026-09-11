import { Link } from "@tanstack/react-router";

import type { TransportRoute } from "@/data/routes";

export function RouteLanding({ route }: { route: TransportRoute }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-[#2b1b12]">
      <section className="rounded-[40px] bg-[#fff7ed] p-6 shadow-sm md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D62828]">Bắc Sơn Cường Nguyệt</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{route.title}</h1>
            <p className="mt-5 text-xl text-neutral-700">{route.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:" className="rounded-full bg-[#D62828] px-7 py-3 font-bold text-white">Gọi đặt vé</a>
              <a href="#booking" className="rounded-full border-2 border-[#D62828] px-7 py-3 font-bold text-[#D62828]">Đăng ký chuyến đi</a>
            </div>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-lg">
            <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-gradient-to-br from-[#fef3c7] to-[#fff7ed] text-7xl">🚌</div>
            <p className="mt-5 text-xl font-black">Xe tuyến cố định Tây Bắc</p>
            <p className="mt-2 text-neutral-600">An toàn - tiện nghi - đúng giờ.</p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-4">
        {[["🚍", route.vehicle], ["💰", route.price], ["📍", route.stops.join(" → ")], ["📦", "Nhận gửi hàng cùng xe"]].map(([icon, text]) => (
          <div key={text} className="rounded-3xl bg-white p-6 shadow-sm"><div className="text-3xl">{icon}</div><p className="mt-4 font-bold">{text}</p></div>
        ))}
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black">Hành trình chuyến xe</h2>
          <div className="mt-6 space-y-5">{route.stops.map((stop,index)=>(<div key={stop} className="flex gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D62828] text-white">{index+1}</span><span className="pt-2 font-semibold">{stop}</span></div>))}</div>
        </div>
        <div id="booking" className="rounded-[32px] bg-[#2b1b12] p-8 text-white">
          <h2 className="text-3xl font-black">Đăng ký giữ chỗ</h2>
          <p className="mt-4 text-white/80">Gửi thông tin, nhà xe liên hệ xác nhận chuyến đi.</p>
          <button className="mt-8 rounded-full bg-[#D62828] px-7 py-3 font-bold">Gửi yêu cầu</button>
        </div>
      </section>

      <section className="mt-10 rounded-[32px] bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-black">Hình ảnh nhà xe</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="flex h-48 items-center justify-center rounded-3xl bg-[#fff7ed] text-5xl">🚌</div>
          <div className="flex h-48 items-center justify-center rounded-3xl bg-[#fff7ed] text-5xl">🛏️</div>
          <div className="flex h-48 items-center justify-center rounded-3xl bg-[#fff7ed] text-5xl">📋</div>
        </div>
      </section>

      <section className="mt-10 rounded-[32px] bg-[#fff7ed] p-8">
        <h2 className="text-3xl font-black">Uy tín Bắc Sơn Cường Nguyệt</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5">✓ Doanh nghiệp vận tải thực tế</div>
          <div className="rounded-2xl bg-white p-5">✓ Tuyến xe cố định</div>
          <div className="rounded-2xl bg-white p-5">✓ Hỗ trợ khách hàng trước chuyến</div>
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-black">Câu hỏi thường gặp</h2>
        {route.faq.map((item)=>(<div key={item.question} className="mt-5"><h3 className="font-bold">{item.question}</h3><p className="text-neutral-700">{item.answer}</p></div>))}
      </section>

      <Link to="/" className="mt-8 inline-block font-bold text-[#D62828]">← Về trang chủ</Link>
    </main>
  );
}
