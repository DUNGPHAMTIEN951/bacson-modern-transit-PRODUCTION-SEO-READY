# Online Booking Architecture

## Customer flow
1. Select travel date.
2. Select route and bus (Xe A / Xe B).
3. Load 34-seat map.
4. Select available seat.
5. Create temporary HOLD for 5 minutes.
6. Show bank QR payment.
7. Upload payment receipt.
8. Staff approves payment.
9. Seat becomes CONFIRMED.
10. Generate PDF ticket.

## Google Sheet tables

BOOKINGS
- bookingId
- customerName
- phone
- route
- travelDate
- busId
- seatNumbers
- status

SEATS
- tripId
- busId
- seatNo
- status
- holdUntil

PAYMENTS
- bookingId
- amount
- receiptUrl
- reviewStatus

ACCOUNTING_DAILY
- date
- confirmedRevenue
- pendingRevenue
- spamRate

## Status lifecycle
AVAILABLE -> HELD -> PAID_PENDING -> CONFIRMED
