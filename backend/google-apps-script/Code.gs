const SHEETS = {
  TRIPS: 'TRIPS',
  SEATS: 'SEATS',
  BOOKINGS: 'BOOKINGS',
  PAYMENTS: 'PAYMENTS'
};

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  let result;

  switch (body.action) {
    case 'GET_TRIPS': result = getTrips(body); break;
    case 'GET_SEATS': result = getSeats(body); break;
    case 'HOLD_SEAT': result = holdSeat(body); break;
    case 'CREATE_BOOKING': result = createBooking(body); break;
    case 'CONFIRM_SEAT': result = confirmSeat(body); break;
    default: result = {success:false,message:'INVALID_ACTION'};
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTrips(data){
  return {
    success:true,
    trips:[
      {id:'XE_A',vehicle:'Xe A',route:data.route || 'Sơn La - Hà Nội',time:'13:00',price:380000},
      {id:'XE_B',vehicle:'Xe B',route:data.route || 'Sơn La - Hà Nội',time:'14:00',price:380000}
    ]
  };
}

function getSeats(data){
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEETS.SEATS);
  const result = {};
  if (!sheet) return {success:false,message:'SEATS_SHEET_MISSING'};

  const rows = sheet.getDataRange().getValues();
  const now = new Date();

  for(let i=1;i<rows.length;i++){
    if(String(rows[i][0]) !== String(data.tripId)) continue;

    let status = rows[i][2];
    if(status === 'HOLD' && rows[i][3] && new Date(rows[i][3]) < now){
      status='AVAILABLE';
      sheet.getRange(i+1,3).setValue(status);
      sheet.getRange(i+1,4).clearContent();
    }
    result[rows[i][1]] = status;
  }

  return {success:true,seats:result};
}

function holdSeat(data){
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEETS.SEATS);
  if(!sheet) return {success:false,message:'SEATS_SHEET_MISSING'};

  const rows = sheet.getDataRange().getValues();
  const expire = new Date(Date.now()+300000);

  for(let i=1;i<rows.length;i++){
    if(rows[i][0]==data.tripId && rows[i][1]==data.seat){
      if(rows[i][2]=='BOOKED') return {success:false,message:'SEAT_BOOKED'};
      if(rows[i][2]=='HOLD' && new Date(rows[i][3])>new Date()) return {success:false,message:'SEAT_HELD'};

      sheet.getRange(i+1,3).setValue('HOLD');
      sheet.getRange(i+1,4).setValue(expire);
      return {success:true,status:'HOLD',expireMinutes:5};
    }
  }

  return {success:false,message:'SEAT_NOT_FOUND'};
}

function createBooking(data){
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEETS.BOOKINGS);
  const bookingId = 'BS' + Utilities.formatDate(new Date(),'GMT+7','yyyyMMddHHmmss');

  if(!sheet) return {success:false,message:'BOOKINGS_SHEET_MISSING'};

  sheet.appendRow([
    bookingId,
    data.name || '',
    data.phone || '',
    data.tripId || '',
    data.vehicle || '',
    data.seat || '',
    data.route || '',
    data.price || 0,
    'WAIT_PAYMENT',
    new Date()
  ]);

  return {
    success:true,
    bookingId:bookingId,
    status:'WAIT_PAYMENT'
  };
}

function confirmSeat(data){
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEETS.SEATS);
  const rows = sheet.getDataRange().getValues();

  for(let i=1;i<rows.length;i++){
    if(rows[i][0]==data.tripId && rows[i][1]==data.seat){
      sheet.getRange(i+1,3).setValue('BOOKED');
      sheet.getRange(i+1,4).clearContent();
      return {success:true,status:'BOOKED'};
    }
  }

  return {success:false,message:'SEAT_NOT_FOUND'};
}
