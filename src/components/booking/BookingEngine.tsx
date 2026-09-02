import { useState } from "react";
import { TripSearch } from "./TripSearch";
import { SeatMap34 } from "./SeatMap34";
import { BookingSummary } from "./BookingSummary";
import { PaymentQR } from "./PaymentQR";

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
            setStep("SUMMARY");
          }}
        />
      )}

      {step === "SUMMARY" && trip && (
        <BookingSummary
          vehicle={trip.vehicle}
          route={trip.route}
          date={trip.date}
          seat={seat}
          price={trip.price}
          onContinue={()=>setStep("PAYMENT")}
        />
      )}

      {step === "PAYMENT" && trip && (
        <PaymentQR
          amount={trip.price}
          bookingCode={`BS-${trip.vehicle}-${seat}`}
          onUploadComplete={()=>setStep("SUCCESS")}
        />
      )}

      {step === "SUCCESS" && (
        <div className="rounded-3xl bg-gradient-to-br from-red-50 to-yellow-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-4xl text-white">
            ✓
          </div>
          <h3 className="text-2xl font-black">Đã nhận thanh toán</h3>
          <p className="mt-2">Nhà xe sẽ xác nhận vé sớm nhất.</p>
        </div>
      )}
    </div>
  );
}
