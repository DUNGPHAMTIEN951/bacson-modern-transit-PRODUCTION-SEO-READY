export const bookingConfig = {
  buses: [
    { id: "XE_A", name: "Xe A", seats: 34 },
    { id: "XE_B", name: "Xe B", seats: 34 },
  ],
  fares: {
    "Sơn La - Hà Nội": 380000,
    "Hà Nội - Mộc Châu": 300000,
  },
  holdMinutes: 5,
  paymentReviewRequired: true,
  shortRoutesRequireContact: true,
};

export type SeatStatus = "AVAILABLE" | "HELD" | "PAID" | "CONFIRMED";

export interface BookingSeat {
  seatNo: number;
  status: SeatStatus;
  bookingId?: string;
}

export const createSeatMap = (): BookingSeat[] =>
  Array.from({ length: 34 }, (_, index) => ({
    seatNo: index + 1,
    status: "AVAILABLE",
  }));
