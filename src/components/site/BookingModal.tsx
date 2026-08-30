import { useEffect, useRef } from "react";
import { X, PhoneCall } from "lucide-react";
import { useBookingModal } from "./BookingModalContext";
import { BookingConsultationForm } from "./BookingConsultationForm";

export function BookingModal() {
  const { isOpen, options, closeBookingModal } = useBookingModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Lưu focus element trước khi mở modal để restore khi đóng
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Lắng nghe phím ESC để đóng modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeBookingModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeBookingModal]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D190F]/65 backdrop-blur-xs transition-opacity duration-200"
        onClick={closeBookingModal}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-[#EAD9C6] bg-[#FFFDF9] shadow-[0_20px_50px_rgba(45,25,15,0.25)] overflow-hidden transition-all duration-200 animate-scale-in"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#F0E4D4] bg-[#FFF9F3] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#FFF2C9] text-[#B71F1F]">
              <PhoneCall className="size-4 text-[#D51F26] stroke-[2]" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="booking-modal-title"
                className="text-base sm:text-lg font-black text-[#2B2B2B]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Đặt tư vấn chuyến đi
              </h2>
              <p className="text-[0.72rem] text-[#8C6D58] font-medium">
                Nhà xe sẽ gọi lại xác nhận trong ít phút
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeBookingModal}
            aria-label="Đóng cửa sổ"
            className="flex size-9 items-center justify-center rounded-full text-[#8C6D58] hover:bg-[#F5E6D3] hover:text-[#2B2B2B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D51F26]"
          >
            <X className="size-5 stroke-[2]" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <BookingConsultationForm
            prefillRoute={options.prefillRoute}
            prefillDate={options.prefillDate}
            source={options.source}
            hideHeader={true}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
