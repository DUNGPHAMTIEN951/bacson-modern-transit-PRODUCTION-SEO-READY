import { useState } from "react";

interface TripSearchProps {
  onSelectTrip?: (trip: Trip) => void;
}

export interface Trip {
  id: string;
  vehicle: "Xe A" | "Xe B";
  route: string;
  time: string;
  price: number;
}

const trips: Trip[] = [
  {
    id: "xe-a-sl-hn",
    vehicle: "Xe A",
    route: "Sơn La → Hà Nội",
    time: "13:00",
    price: 380000,
  },
  {
    id: "xe-b-sl-hn",
    vehicle: "Xe B",
    route: "Sơn La → Hà Nội",
    time: "14:00",
    price: 380000,
  },
  {
    id: "xe-a-hn-mc",
    vehicle: "Xe A",
    route: "Hà Nội → Mộc Châu",
    time: "08:00",
    price: 300000,
  },
  {
    id: "xe-b-hn-mc",
    vehicle: "Xe B",
    route: "Hà Nội → Mộc Châu",
    time: "09:00",
    price: 300000,
  },
];

export function TripSearch({ onSelectTrip }: TripSearchProps) {
  const [date, setDate] = useState("");
  const [route, setRoute] = useState("Sơn La → Hà Nội");

  const results = trips.filter((trip) => trip.route === route);

  return (
    <section className="rounded-3xl border border-[#EAD9C6] bg-white p-6 shadow-lg">
      <h2 className="text-xl font-black text-[#2B2B2B]">
        Tìm chuyến xe
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <select
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option>Sơn La → Hà Nội</option>
          <option>Hà Nội → Mộc Châu</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border p-3"
        />
      </div>

      <div className="mt-6 space-y-3">
        {results.map((trip) => (
          <button
            key={trip.id}
            onClick={() => onSelectTrip?.(trip)}
            className="flex w-full items-center justify-between rounded-2xl border p-4 text-left transition hover:border-[#D51F26]"
          >
            <div>
              <div className="font-black">{trip.vehicle}</div>
              <div className="text-sm text-gray-600">{trip.route}</div>
              <div className="text-sm">Giờ chạy: {trip.time}</div>
            </div>
            <div className="font-black text-[#D51F26]">
              {trip.price.toLocaleString("vi-VN")}đ
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
