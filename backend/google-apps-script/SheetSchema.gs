// Google Sheet structure for Bac Son Cuong Nguyet booking system
// Create these sheets before deploying Apps Script:
//
// TRIPS
// trip_id | date | vehicle | route | time | price
//
// SEATS
// trip_id | seat | status | hold_until
//
// BOOKINGS
// booking_id | name | phone | trip_id | vehicle | seat | status | created_at
//
// PAYMENTS
// booking_id | amount | image_url | status | created_at
//
// CUSTOMERS
// phone | name | total_trips | customer_type

const SHEETS = {
  TRIPS: 'TRIPS',
  SEATS: 'SEATS',
  BOOKINGS: 'BOOKINGS',
  PAYMENTS: 'PAYMENTS',
  CUSTOMERS: 'CUSTOMERS'
};

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}
