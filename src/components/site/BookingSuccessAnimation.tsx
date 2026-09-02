import { CheckCircle2, Sparkles } from "lucide-react";

export function BookingSuccessAnimation() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF4E8] via-white to-[#FFE1E1] p-8 text-center">
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(213,31,38,0.15),transparent_55%)]" />
      <div className="relative flex size-24 items-center justify-center rounded-full bg-[#E8F8EE] shadow-[0_0_40px_rgba(27,131,65,0.25)]">
        <CheckCircle2 className="size-14 text-[#1B8341] animate-scale-in" />
      </div>
      <Sparkles className="absolute right-8 top-8 size-8 text-[#D51F26] animate-bounce" />
      <Sparkles className="absolute bottom-8 left-8 size-6 text-[#E8A317] animate-pulse" />
      <h3 className="relative mt-5 text-2xl font-black text-[#2B2B2B]">
        Gửi yêu cầu thành công!
      </h3>
      <p className="relative mt-2 text-sm text-[#5A3828]">
        Nhà xe đang tiếp nhận và giữ thông tin chuyến đi của bạn.
      </p>
    </div>
  );
}
