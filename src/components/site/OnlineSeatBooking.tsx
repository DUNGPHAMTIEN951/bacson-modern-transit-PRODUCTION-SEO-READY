import { useMemo, useState } from "react";

const seats = Array.from({ length: 34 }, (_, i) => `G${i + 1}`);

const trips = [
  { id: "A", vehicle: "Xe A", time: "13:00", route: "Sơn La → Hà Nội", price: 380000 },
  { id: "B", vehicle: "Xe B", time: "14:00", route: "Sơn La → Hà Nội", price: 380000 },
];

export function OnlineSeatBooking() {
  const [trip, setTrip] = useState(trips[0]);
  const [selected, setSelected] = useState<string[]>([]);
  const [heldAt] = useState(Date.now());

  const remaining = useMemo(() => Math.max(0, 5 * 60 - Math.floor((Date.now() - heldAt) / 1000)), [heldAt]);

  return (
    <section className="mx-auto my-12 max-w-6xl rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="text-3xl font-black text-red-700">Đặt vé online - chọn vị trí ghế</h2>
      <p className="mt-2 text-gray-600">Ghế được giữ tạm 5 phút để khách hoàn tất thanh toán.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {trips.map((item) => (
          <button key={item.id} onClick={() => setTrip(item)} className="rounded-xl border p-4 text-left hover:border-red-500">
            <b>{item.vehicle}</b> · {item.time}<br />{item.route}<br />{item.price.toLocaleString("vi-VN")}đ
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-4 gap-2 md:grid-cols-7">
        {seats.map((seat) => {
          const active = selected.includes(seat);
          return (
            <button key={seat} onClick={() => setSelected(active ? selected.filter((s) => s !== seat) : [...selected, seat])} className={`rounded-lg border p-3 ${active ? "bg-pink-500 text-white" : "bg-green-50"}`}>
              {seat}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <b>{trip.vehicle}</b> - {trip.route}<br />
        Ghế chọn: {selected.join(", ") || "chưa chọn"}<br />
        Giữ ghế còn: {remaining}s
      </div>

      <button className="mt-6 rounded-xl bg-red-600 px-8 py-3 font-bold text-white">
        Tiếp tục thanh toán QR
      </button>
    </section>
  );
}
