const BOOKING_API_URL = import.meta.env.VITE_BOOKING_API_URL || "";

export type SeatStatus =
  | "AVAILABLE"
  | "HOLD"
  | "BOOKED";

export async function getTrips(payload: {
  date: string;
  route: string;
}) {
  return request("GET_TRIPS", payload);
}

export async function getSeats(payload: {
  tripId: string;
}) {
  return request("GET_SEATS", payload);
}

export async function holdSeat(payload: {
  tripId: string;
  seat: string;
  phone?: string;
}) {
  return request("HOLD_SEAT", payload);
}

export async function createBooking(payload: Record<string, unknown>) {
  return request("CREATE_BOOKING", payload);
}

async function request(action: string, data: Record<string, unknown>) {
  if (!BOOKING_API_URL) {
    return {
      success: false,
      message: "Booking API chưa được cấu hình"
    };
  }

  const response = await fetch(BOOKING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action,
      ...data
    })
  });

  return response.json();
}
