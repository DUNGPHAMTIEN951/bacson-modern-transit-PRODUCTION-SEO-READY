import React, { useState } from "react";

interface PaymentQRProps {
  amount: number;
  bookingId: string;
  onUploadComplete?: (file: File) => void;
}

export function PaymentQR({
  amount,
  bookingId,
  onUploadComplete,
}: PaymentQRProps) {
  const [fileName, setFileName] = useState("");

  const transferContent = `BS-${bookingId}`;

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-xl">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-red-700">
          Thanh toán đặt vé
        </h3>
        <p className="mt-2 text-gray-600">
          Quét mã QR hoặc chuyển khoản trực tiếp
        </p>
      </div>

      <div className="mx-auto mt-6 flex h-52 w-52 items-center justify-center rounded-2xl bg-gray-100">
        <div className="text-center text-sm text-gray-500">
          QR THANH TOÁN
          <br />
          BẮC SƠN CƯỜNG NGUYỆT
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl bg-red-50 p-4">
        <div className="flex justify-between">
          <span>Số tiền</span>
          <strong>{amount.toLocaleString("vi-VN")}đ</strong>
        </div>

        <div className="flex justify-between">
          <span>Nội dung</span>
          <strong>{transferContent}</strong>
        </div>
      </div>

      <div className="mt-6">
        <label className="block cursor-pointer rounded-xl bg-red-700 px-4 py-3 text-center font-semibold text-white">
          Upload ảnh hóa đơn
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFileName(file.name);
              onUploadComplete?.(file);
            }}
          />
        </label>

        {fileName && (
          <p className="mt-3 text-center text-sm text-green-700">
            Đã chọn: {fileName}
          </p>
        )}
      </div>
    </div>
  );
}
