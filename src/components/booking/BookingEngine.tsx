import { useState } from "react";
import { TripSearch } from "./TripSearch";
import { SeatMap34 } from "./SeatMap34";

export function BookingEngine(){
  const [step,setStep] = useState("SEARCH");
  const [trip,setTrip] = useState<any>(null);
  const [seat,setSeat] = useState<string>("");

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl">
      {step === "SEARCH" && (
        <TripSearch
          onSelectTrip={(selected)=>{
            setTrip(selected);
            setStep("SEAT");
          }}
        />
      )}

      {step === "SEAT" && trip && (
        <SeatMap34
          vehicle={trip.vehicle}
          onSelect={(selectedSeat)=>{
            setSeat(selectedSeat);
            setStep("CUSTOMER");
          }}
        />
      )}

      {step === "CUSTOMER" && (
        <div className="space-y-4">
          <h3 className="text-xl font-black">
            Thông tin hành khách
          </h3>

          <div className="rounded-xl bg-[#FFF4E8] p-4">
            <p>Xe: {trip?.vehicle}</p>
            <p>Ghế: {seat}</p>
            <p>Giá vé: {trip?.price?.toLocaleString()}đ</p>
          </div>

          <button
            className="rounded-xl bg-[#D51F26] px-5 py-3 font-bold text-white"
            onClick={()=>setStep("PAYMENT")}
          >
            Tiếp tục thanh toán
          </button>
        </div>
      )}

      {step === "PAYMENT" && (
        <div className="space-y-4 text-center">
          <h3 className="text-xl font-black">
            Thanh toán
          </h3>
          <p>Quét QR để chuyển khoản</p>
        </div>
      )}
    </div>
  );
}
