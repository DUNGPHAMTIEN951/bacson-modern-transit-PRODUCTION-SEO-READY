const PAYMENT_SHEET = 'PAYMENTS';

/**
 * Save payment verification information after customer uploads transfer proof.
 * Image upload handling can later be connected to Google Drive.
 */
function uploadPayment(data){
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(PAYMENT_SHEET);

  if (!sheet) {
    return {
      success:false,
      message:'PAYMENTS_SHEET_MISSING'
    };
  }

  sheet.appendRow([
    data.bookingId || '',
    data.amount || 0,
    data.imageUrl || '',
    'WAIT_VERIFY',
    new Date()
  ]);

  return {
    success:true,
    status:'WAIT_VERIFY'
  };
}

function getPaymentStatus(data){
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(PAYMENT_SHEET);

  if (!sheet) {
    return {
      success:false,
      message:'PAYMENTS_SHEET_MISSING'
    };
  }

  const rows = sheet.getDataRange().getValues();

  for(let i = 1; i < rows.length; i++){
    if(String(rows[i][0]) === String(data.bookingId)){
      return {
        success:true,
        status:rows[i][3]
      };
    }
  }

  return {
    success:false,
    message:'PAYMENT_NOT_FOUND'
  };
}
