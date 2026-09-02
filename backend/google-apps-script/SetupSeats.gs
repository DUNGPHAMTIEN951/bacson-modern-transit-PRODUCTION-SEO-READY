const VEHICLES = [
  'XE_A',
  'XE_B'
];

const SEAT_LAYOUT = Array.from({ length: 34 }, (_, index) => `G${index + 1}`);

/**
 * Run once to initialize 2 vehicles with 34 seats each.
 * Creates AVAILABLE rows in SEATS sheet.
 */
function setupVehicleSeats() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('SEATS') || ss.insertSheet('SEATS');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['trip_id', 'vehicle', 'seat', 'status', 'hold_until']);
  }

  const rows = [];

  VEHICLES.forEach(vehicle => {
    SEAT_LAYOUT.forEach(seat => {
      rows.push([
        '',
        vehicle,
        seat,
        'AVAILABLE',
        ''
      ]);
    });
  });

  if (rows.length) {
    sheet
      .getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
      .setValues(rows);
  }
}

function resetAllSeatsAvailable() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('SEATS');
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const range = sheet.getRange(2, 4, lastRow - 1, 2);
  const values = range.getValues().map(() => ['AVAILABLE', '']);
  range.setValues(values);
}
