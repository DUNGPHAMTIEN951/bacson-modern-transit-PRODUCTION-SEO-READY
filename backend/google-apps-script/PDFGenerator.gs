const TICKET_FOLDER_NAME = 'BAC_SON_TICKETS';

function generateTicketPDF(data) {
  const bookingId = data.bookingId || ('BS' + Date.now());

  const html = `
  <html>
  <body style="font-family:Arial;padding:40px;color:#222">
    <h1 style="color:#b91c1c">BẮC SƠN CƯỜNG NGUYỆT</h1>
    <h2>VÉ XE KHÁCH</h2>
    <hr/>
    <p><b>Mã vé:</b> ${bookingId}</p>
    <p><b>Hành khách:</b> ${data.name || ''}</p>
    <p><b>Số điện thoại:</b> ${data.phone || ''}</p>
    <p><b>Xe:</b> ${data.vehicle || ''}</p>
    <p><b>Ghế:</b> ${data.seat || ''}</p>
    <p><b>Tuyến:</b> ${data.route || ''}</p>
    <p><b>Ngày đi:</b> ${data.date || ''}</p>
    <p><b>Số tiền:</b> ${(data.price || 0).toLocaleString('vi-VN')} VNĐ</p>
    <hr/>
    <p style="color:#666">Vui lòng xuất trình vé khi lên xe.</p>
  </body>
  </html>`;

  const blob = Utilities.newBlob(html, 'text/html', 'ticket.html');
  const pdf = blob.getAs('application/pdf').setName(bookingId + '.pdf');

  let folder = DriveApp.getFoldersByName(TICKET_FOLDER_NAME);
  const targetFolder = folder.hasNext() ? folder.next() : DriveApp.createFolder(TICKET_FOLDER_NAME);

  const file = targetFolder.createFile(pdf);

  return {
    success: true,
    bookingId,
    pdfUrl: file.getUrl()
  };
}
