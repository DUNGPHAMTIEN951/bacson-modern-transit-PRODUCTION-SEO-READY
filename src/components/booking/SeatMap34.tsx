import { useMemo, useState } from "react";

export type SeatStatus = "AVAILABLE" | "SELECTED" | "HELD_5_MIN" | "BOOKED";

interface SeatMap34Props {
  vehicle?: "Xe A" | "Xe B";
  bookedSeats?: string[];
  heldSeats?: string[];
  onSelect?: (seat: string) => void;
}

export function SeatMap34({
  vehicle = "Xe A",
  bookedSeats = [],
  heldSeats = [],
  onSelect,
}: SeatMap34Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const seats = useMemo(
    () => Array.from({ length: 34 }, (_, i) => `${vehicle}-${i + 1}`),
    [vehicle],
  );

  const getStatus = (seat: string): SeatStatus => {
    if (bookedSeats.includes(seat)) return "BOOKED";
    if (heldSeats.includes(seat)) return "HELD_5_MIN";
    if (selected.includes(seat)) return "SELECTED";
    return "AVAILABLE";
  };

  const toggleSeat = (seat: string) => {
    const status = getStatus(seat);
    if (status === "BOOKED" || status === "HELD_5_MIN") return;

    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((x) => x !== seat) : [...prev, seat],
    );
    onSelect?.(seat);
  };

  return (
    <div className="rounded-3xl border border-[#EAD9C6] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-black text-[#3A211B]">Sơ đồ {vehicle} - 34 chỗ</h3>
        <span className="rounded-full bg-[#FFF4E8] px-3 py-1 text-xs font-bold text-[#D51F26]">
          Tầng trên / dưới
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {seats.map((seat) => {
          const status = getStatus(seat);
          return (
            <button
              key={seat}
              type="button"
              disabled={status === "BOOKED" || status === "HELD_5_MIN"}
              onClick={() => toggleSeat(seat)}
              className={`rounded-xl border p-3 text-xs font-black transition-all ${
                status === "AVAILABLE"
                  ? "border-green-200 bg-green-50 text-green-700 hover:scale-105"
                  : status === "SELECTED"
                    ? "border-blue-500 bg-blue-500 text-white"
                    : status === "HELD_5_MIN"
                      ? "border-yellow-300 bg-yellow-100 text-yellow-700"
                      : "border-red-200 bg-red-100 text-red-700"
              }`}
            >
              Ghế {seat.split("-")[1]}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
        <span className="text-green-700">🟢 Trống</span>
        <span className="text-blue-700">🔵 Đang chọn</span>
        <span className="text-yellow-700">🟡 Giữ 5 phút</span>
        <span className="text-red-700">🔴 Đã đặt</span>
      </div>
    </div>
  );
}
