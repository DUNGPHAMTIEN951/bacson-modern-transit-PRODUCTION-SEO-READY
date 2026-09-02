import { CheckCircle2, Sparkles, Clock3, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface BookingSuccessAnimationProps {
  phone?: string;
  leadId?: string;
  route?: string;
  travelDate?: string;
  passengers?: number;
  onReset?: () => void;
}

export function BookingSuccessAnimation({
  phone,
  leadId,
  route,
  travelDate,
  passengers,
  onReset,
}: BookingSuccessAnimationProps) {
  const [seconds, setSeconds] = useState(300);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    const progress = window.setTimeout(() => setStep(1), 1500);
    const progress2 = window.setTimeout(() => setStep(2), 3500);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(progress);
      window.clearTimeout(progress2);
    };
  }, []);

  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remain = (seconds % 60).toString().padStart(2, "0");

  const steps = [
    "Đã nhận yêu cầu",
    "Đang giữ thông tin chuyến đi",
    "Nhân viên nhà xe xác nhận",
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#EAD9C6] bg-gradient-to-br from-[#FFF4E8] via-white to-[#FFE1E1] p-6 text-center shadow-xl sm:p-8">
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(213,31,38,0.18),transparent_55%)]" />

      <div className="relative mx-auto flex size-24 items-center justify-center rounded-full bg-[#E8F8EE] shadow-[0_0_45px_rgba(27,131,65,0.35)]">
        <CheckCircle2 className="size-14 animate-scale-in text-[#1B8341]" />
      </div>

      <Sparkles className="absolute right-8 top-8 size-8 animate-bounce text-[#D51F26]" />
      <Sparkles className="absolute bottom-8 left-8 size-6 animate-pulse text-[#E8A317]" />

      <h3 className="relative mt-5 text-2xl font-black text-[#2B2B2B]">
        Gửi yêu cầu thành công!
      </h3>

      <p className="relative mt-2 text-sm text-[#5A3828]">
        Hệ thống đã tiếp nhận. Vui lòng giữ trang để hoàn tất bước tiếp theo.
      </p>

      <div className="relative mx-auto mt-5 max-w-sm rounded-2xl bg-white/80 p-4 text-left shadow-sm">
        {steps.map((item, index) => (
          <div key={item} className="mb-3 flex items-center gap-3 last:mb-0">
            <span className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${index <= step ? "bg-[#D51F26] text-white" : "bg-[#EAD9C6] text-[#8C6D58]"}`}>
              {index < step ? "✓" : index + 1}
            </span>
            <span className="text-sm font-semibold text-[#3A211B]">{item}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#D51F26] px-4 py-3 text-white">
        <Clock3 className="size-5" />
        <span className="font-black">Giữ thông tin trong {minutes}:{remain}</span>
      </div>

      <div className="relative mt-4 text-left text-xs text-[#5A3828]">
        {leadId && <p>Mã yêu cầu: <b>{leadId}</b></p>}
        {route && <p>Tuyến: <b>{route}</b></p>}
        {travelDate && <p>Ngày đi: <b>{travelDate}</b></p>}
        {passengers && <p>Số khách: <b>{passengers}</b></p>}
        {phone && <p>SĐT: <b>{phone}</b></p>}
      </div>

      <div className="relative mt-5 flex items-center justify-center gap-2 text-xs font-bold text-[#1B8341]">
        <ShieldCheck className="size-4" />
        Dữ liệu đã được ghi nhận an toàn
      </div>

      {onReset && (
        <button onClick={onReset} className="relative mt-5 text-sm font-bold text-[#D51F26]">
          Gửi yêu cầu mới
        </button>
      )}
    </div>
  );
}
