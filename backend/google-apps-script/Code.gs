const SHEETS = {
  TRIPS: 'TRIPS',
  SEATS: 'SEATS',
  BOOKINGS: 'BOOKINGS'
};

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  let result;

  switch (body.action) {
    case 'GET_TRIPS':
      result = getTrips(body);
      break;
    case 'GET_SEATS':
      result = getSeats(body);
      break;
    case 'HOLD_SEAT':
      result = holdSeat(body);
      break;
    case 'CREATE_BOOKING':
      result = createBooking(body);
      break;
    default:
      result = { success:false, message:'INVALID_ACTION' };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTrips(data){
  return {
    success:true,
    trips:[
      {
        id:'XE_A',
        vehicle:'Xe A',
        route:data.route || 'Sơn La - Hà Nội',
        time:'13:00',
        price:380000
      },
      {
        id:'XE_B',
        vehicle:'Xe B',
        route:data.route || 'Sơn La - Hà Nội',
        time:'14:00',
        price:380000
      }
    ]
  };
}

function getSeats(data){
  const seats = {};
  for(let i=1;i<=34;i++) seats['G'+i]='AVAILABLE';
  return {success:true,seats};
}

function holdSeat(data){
  return {
    success:true,
    seat:data.seat,
    status:'HOLD',
    expireMinutes:5
  };
}

function createBooking(data){
  return {
    success:true,
    bookingId:'BS-'+Date.now(),
    status:'WAIT_PAYMENT'
  };
}
