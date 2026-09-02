// Seat locking engine for Bắc Sơn Cường Nguyệt booking system
// Status flow:
// AVAILABLE -> HOLD (5 minutes) -> BOOKED

const HOLD_MINUTES = 5;

function holdSeat(data) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('SEATS');
  const rows = sheet.getDataRange().getValues();
  const now = new Date();
  const expire = new Date(now.getTime() + HOLD_MINUTES * 60 * 1000);

  for (let i = 1; i < rows.length; i++) {
    const tripId = rows[i][0];
    const seat = rows[i][1];
    const status = rows[i][2];
    const holdUntil = rows[i][3];

    if (tripId === data.tripId && seat === data.seat) {
      if (status === 'BOOKED') {
        return { success: false, message: 'Ghế đã được đặt' };
      }

      if (status === 'HOLD' && holdUntil && new Date(holdUntil) > now) {
        return { success: false, message: 'Ghế đang được giữ' };
      }

      sheet.getRange(i + 1, 3).setValue('HOLD');
      sheet.getRange(i + 1, 4).setValue(expire);

      return {
        success: true,
        status: 'HOLD',
        holdUntil: expire
      };
    }
  }

  return { success: false, message: 'Không tìm thấy ghế' };
}

function releaseExpiredSeats() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('SEATS');
  const rows = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < rows.length; i++) {
    const status = rows[i][2];
    const holdUntil = rows[i][3];

    if (status === 'HOLD' && holdUntil && new Date(holdUntil) < now) {
      sheet.getRange(i + 1, 3).setValue('AVAILABLE');
      sheet.getRange(i + 1, 4).clearContent();
    }
  }
}

function confirmSeat(tripId, seat) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('SEATS');
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === tripId && rows[i][1] === seat) {
      sheet.getRange(i + 1, 3).setValue('BOOKED');
      sheet.getRange(i + 1, 4).clearContent();
      return true;
    }
  }

  return false;
}
