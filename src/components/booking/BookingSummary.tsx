import React from "react";

type BookingSummaryProps = {
  vehicle?: string;
  route?: string;
  date?: string;
  seat?: string;
  price?: number;
  onContinue?: () => void;
};

export function BookingSummary({
  vehicle = "Xe A",
  route = "Sơn La → Hà Nội",
  date = "",
  seat = "",
  price = 380000,
  onContinue,
}: BookingSummaryProps) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-xl">
      <h3 className="mb-5 text-xl font-bold text-red-800">
        Xác nhận đặt vé
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Xe</span>
          <strong>{vehicle}</strong>
        </div>

        <div className="flex justify-between">
          <span>Tuyến</span>
          <strong>{route}</strong>
        </div>

        <div className="flex justify-between">
          <span>Ngày đi</span>
          <strong>{date || "Chưa chọn"}</strong>
        </div>

        <div className="flex justify-between">
          <span>Ghế</span>
          <strong>{seat || "Chưa chọn"}</strong>
        </div>

        <div className="mt-4 flex justify-between border-t pt-4 text-lg">
          <span>Tổng tiền</span>
          <strong className="text-red-700">
            {price.toLocaleString("vi-VN")}đ
          </strong>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-6 w-full rounded-2xl bg-red-700 py-3 font-semibold text-white transition hover:bg-red-800"
      >
        Tiếp tục thanh toán
      </button>
    </div>
  );
}
