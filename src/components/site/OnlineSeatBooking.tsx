import { useState } from "react";

const upperSeats = Array.from({ length: 17 }, (_, i) => `A${i + 1}`);
const lowerSeats = Array.from({ length: 17 }, (_, i) => `B${i + 1}`);

const trips = [
  { id: "a", vehicle: "Xe A", time: "13:00", route: "Sơn La → Hà Nội", price: 380000 },
  { id: "b", vehicle: "Xe B", time: "14:00", route: "Sơn La → Hà Nội", price: 380000 },
];

const booked = new Set(["A3", "B6"]);

export function OnlineSeatBooking() {
  const [trip, setTrip] = useState(trips[0]);
  const [selected, setSelected] = useState<string | null>(null);

  function Seat({ seat }: { seat: string }) {
    const disabled = booked.has(seat);
    return (
      <button
        disabled={disabled}
        onClick={() => setSelected(seat)}
        className={`rounded-xl border p-3 font-bold ${
          disabled
            ? "bg-red-100 text-red-600"
            : selected === seat
              ? "bg-blue-600 text-white"
              : "bg-emerald-50 text-emerald-700"
        }`}
      >
        {seat}
      </button>
    );
  }

  return (
    <section className="mx-auto my-12 max-w-6xl rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="text-3xl font-black text-red-700">Đặt vé online - chọn ghế</h2>
      <p className="mt-2 text-gray-600">Ghế được giữ tạm 5 phút trước khi nhân viên duyệt thanh toán.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {trips.map((item) => (
          <button key={item.id} onClick={() => setTrip(item)} className="rounded-xl border p-4 text-left">
            <b>{item.vehicle}</b> · {item.time}<br />
            {item.route}<br />
            {item.price.toLocaleString("vi-VN")}đ
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-bold">Tầng trên</h3>
          <div className="grid grid-cols-4 gap-2">{upperSeats.map((s) => <Seat key={s} seat={s} />)}</div>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Tầng dưới</h3>
          <div className="grid grid-cols-4 gap-2">{lowerSeats.map((s) => <Seat key={s} seat={s} />)}</div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-orange-50 p-5">
        Xe: {trip.vehicle}<br />
        Ghế: {selected ?? "chưa chọn"}<br />
        Giá: {trip.price.toLocaleString("vi-VN")}đ
      </div>

      <button className="mt-6 rounded-xl bg-red-600 px-8 py-3 font-bold text-white">
        Tiếp tục thanh toán QR
      </button>
    </section>
  );
}
