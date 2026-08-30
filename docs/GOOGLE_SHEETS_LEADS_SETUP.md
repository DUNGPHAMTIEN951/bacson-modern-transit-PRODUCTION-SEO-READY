# HƯỚNG DẪN THIẾT LẬP GOOGLE SHEETS MINI CRM CHO NHÀ XE BẮC SƠN CƯỜNG NGUYỆT

Tài liệu này hướng dẫn từng bước chi tiết (dành cho người không chuyên lập trình) để kết nối form **"Yêu Cầu Gọi Lại / Đặt Tư Vấn Online"** trên website với **Google Sheets**.

---

## 📋 TỔNG QUAN HỆ THỐNG

- **Khách hàng** điền thông tin chuyến đi trên website (Họ tên, SĐT, Tuyến đi, Ngày đi, Số khách...).
- Website tự động gửi dữ liệu về **Google Apps Script Web App**.
- Google Apps Script ghi dòng mới vào sheet **`LEADS`** trong Google Sheets của bạn.
- Nhân viên điều hành mở Google Sheets, xem khách mới (trạng thái **Mới** - nền vàng), bấm gọi tư vấn và đổi trạng thái.

---

## 🚀 16 BƯỚC THIẾT LẬP CHI TIẾT

### Bước 1: Tạo Google Sheet mới

1. Truy cập [sheets.google.com](https://sheets.google.com) bằng tài khoản Google của nhà xe.
2. Tạo một bảng tính mới và đặt tên: **`Bắc Sơn Cường Nguyệt - Quản Lý Khách Hàng (LEADS CRM)`**.

---

### Bước 2: Lấy Spreadsheet ID

Nhìn lên thanh địa chỉ trình duyệt, URL có dạng:

```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0jKLMNOPQRSTUVWXYZ/edit
```

👉 Đoạn mã nằm giữa `/d/` và `/edit` chính là **Spreadsheet ID** (ví dụ: `1a2b3c4d5e6f7g8h9i0jKLMNOPQRSTUVWXYZ`). Hãy copy đoạn mã này.

---

### Bước 3: Mở trình soạn thảo Google Apps Script

1. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng** (Extensions) → **Apps Script**.
2. Một tab mới sẽ mở ra với giao diện lập trình Apps Script. Đặt tên dự án ở góc trên bên trái: **`Bac Son Cuong Nguyet - Lead API`**.

---

### Bước 4: Dán mã nguồn `Code.gs`

1. Xóa toàn bộ nội dung mặc định trong file `Code.gs`.
2. Mở file [google-apps-script/Code.gs](../google-apps-script/Code.gs) trong dự án này, copy toàn bộ nội dung và dán vào Apps Script.
3. Nhấn nút **Lưu (Save - biểu tượng đĩa mềm 💾 hoặc phím `Ctrl + S`)**.

---

### Bước 5: Cấu hình Script Properties (Spreadsheet ID)

1. Ở thanh menu bên trái của Apps Script, nhấn vào biểu tượng **Cài đặt dự án (Project Settings ⚙️)**.
2. Cuộn xuống mục **Thuộc tính tập lệnh (Script Properties)** → Nhấn **Chỉnh sửa thuộc tính tập lệnh (Edit script properties)**.
3. Nhấn **Thêm thuộc tính tập lệnh (Add script property)**:
   - **Thuộc tính (Property):** `SPREADSHEET_ID`
   - **Giá trị (Value):** Dán đoạn mã **Spreadsheet ID** đã copy ở Bước 2.
4. Nhấn **Lưu các thuộc tính tập lệnh (Save script properties)**.

---

### Bước 6: Chạy hàm `setupSheet()` để tự động tạo cấu trúc

1. Quay lại tab **Trình chỉnh sửa (Editor < >)** ở menu bên trái.
2. Ở thanh công cụ trên cùng, tại ô chọn hàm (Function dropdown), chọn hàm **`setupSheet`**.
3. Nhấn nút **Chạy (Run ▶️)**.

---

### Bước 7: Cấp quyền thực thi (Authorize Script)

1. Google sẽ hiện cửa sổ thông báo **"Cần có sự cho phép" (Authorization required)** → Nhấn **Xem lại quyền (Review permissions)**.
2. Chọn tài khoản Google của bạn.
3. Nếu thấy màn hình cảnh báo _"Google chưa xác minh ứng dụng này"_:
   - Nhấn vào chữ **Nâng cao (Advanced)** ở góc dưới.
   - Nhấn vào liên kết **Đi tới Bac Son Cuong Nguyet - Lead API (không an toàn)**.
4. Nhấn **Cho phép (Allow)**.
5. Sau khi cấp quyền xong, hàm `setupSheet` sẽ chạy xong trong vài giây.

---

### Bước 8: Kiểm tra Google Sheets

Quay lại tab Google Sheets, bạn sẽ thấy:

- Một Sheet mới tên **`LEADS`** đã được tạo tự động.
- Dòng 1 chứa 16 cột tiêu đề chuẩn với nền màu nâu sậm, chữ in đậm màu trắng.
- Cột **Trạng thái (Cột N)** đã có sẵn Dropdown chọn: `Mới`, `Đã gọi`, `Đã xác nhận`, `Hẹn gọi lại`, `Không liên hệ được`, `Hủy`.
- Cột SĐT đã được định dạng văn bản (không bị mất số 0 ở đầu).

---

### Bước 9: Triển khai Web App (Deploy)

1. Ở góc trên cùng bên phải của trang Apps Script, nhấn nút **Triển khai (Deploy)** → Chọn **Lần triển khai mới (New deployment)**.
2. Nhấn vào biểu tượng **Bánh răng (⚙️)** cạnh mục "Chọn loại" → Chọn **Ứng dụng web (Web app)**.

---

### Bước 10: Cấu hình Web App

Điền các thông tin như sau:

- **Mô tả (Description):** `Bac Son Cuong Nguyet Lead API v1`
- **Thực thi dưới dạng (Execute as):** `Tôi (your-email@gmail.com)` (Me)
- **Ai có quyền truy cập (Who has access):** 👉 **`Bất kỳ ai (Anyone)`** _(Bắt buộc chọn Anyone để website gửi được dữ liệu mà không bắt khách đăng nhập Google)_.

---

### Bước 11: Nhấn "Triển khai" (Deploy)

Nhấn nút **Triển khai (Deploy)** ở góc dưới. Chờ khoảng 5-10 giây để Google tạo URL.

---

### Bước 12: Copy Web App URL

Sau khi triển khai thành công, Google sẽ cung cấp **URL ứng dụng web (Web app URL)** có dạng:

```
https://script.google.com/macros/s/AKfycbxAbCdEfGhIjKlMnOpQrStUvWxYz1234567890/exec
```

👉 Nhấn nút **Sao chép (Copy)** để lưu URL này.

---

### Bước 13: Cấu hình biến môi trường trên Website

1. Mở file `.env` ở thư mục gốc của website (nếu chưa có, tạo mới từ `.env.example`).
2. Dán URL Web App vào biến `VITE_BOOKING_FORM_ENDPOINT`:

```bash
VITE_BOOKING_FORM_ENDPOINT=https://script.google.com/macros/s/AKfycbxAbCdEfGhIjKlMnOpQrStUvWxYz1234567890/exec
```

---

### Bước 14: Khởi động lại Website

Chạy lệnh khởi động website:

```bash
npm run dev
```

---

### Bước 15: Thử nghiệm gửi Form trên Website

1. Mở trang web tại `http://localhost:5173`.
2. Tìm đến phần **"Đặt tư vấn nhanh"** hoặc bấm nút **"Yêu cầu gọi lại"** ở thanh liên hệ nổi.
3. Điền thông tin thử nghiệm:
   - Họ tên: `Nguyễn Văn Thử Nghiệm`
   - SĐT: `0987654321`
   - Tuyến đi: `Hà Nội → Sơn La`
   - Số khách: `2`
   - Tích chọn đồng ý liên hệ.
4. Bấm **"GỬI YÊU CẦU GỌI LẠI"**.
5. Quan sát trạng thái chuyển sang **"Đã nhận yêu cầu của bạn!"** với mã yêu cầu (ví dụ: `LD-20260830-1234`).

---

### Bước 16: Kiểm tra dữ liệu trong Google Sheets

Mở Google Sheets, bạn sẽ thấy ngay một dòng mới xuất hiện với đầy đủ thông tin:

| Mã yêu cầu         | Thời gian           | Họ tên khách          | Số điện thoại | Tuyến đi        | Trạng thái           |
| :----------------- | :------------------ | :-------------------- | :------------ | :-------------- | :------------------- |
| `LD-20260830-1234` | 30/08/2026 17:35:00 | Nguyễn Văn Thử Nghiệm | 0987654321    | Hà Nội → Sơn La | **Mới** _(nền vàng)_ |

---

## 🎨 QUY TRÌNH SỬ DỤNG CHO NHÂN VIÊN ĐIỀU HÀNH

Khi có khách mới gửi form:

1. Mở file Google Sheets trên điện thoại hoặc máy tính.
2. Dòng có chữ **`Mới`** (màu vàng nhạt) là khách chưa được gọi.
3. Bấm vào số điện thoại để gọi tư vấn lịch chạy, điểm đón và giá vé.
4. Sau cuộc gọi:
   - Nếu khách chốt: Đổi trạng thái sang **`Đã xác nhận`** (chuyển sang màu xanh lá).
   - Nếu đã gọi trao đổi thông tin: Đổi sang **`Đã gọi`** (màu xanh dương).
   - Nếu khách hẹn gọi lại: Đổi sang **`Hẹn gọi lại`** (màu tím).
   - Nếu thuê bao / không nghe máy: Đổi sang **`Không liên hệ được`** (màu cam).
5. Điền tên nhân viên phụ trách vào cột **O** và ghi chú chi tiết vào cột **P**.

---

## 🔔 CẤU HÌNH THÔNG BÁO EMAIL TỰ ĐỘNG (TÙY CHỌN)

Nếu muốn nhận email mỗi khi có khách gửi yêu cầu:

1. Mở file `Code.gs` trong Google Apps Script.
2. Tại dòng 17-19:

```javascript
const CONFIG = {
  SHEET_NAME: "LEADS",
  ENABLE_EMAIL_NOTIFICATION: true, // Đổi thành true
  STAFF_EMAIL: "nhaxe.cuongnguyet@gmail.com", // Điền email của bạn
};
```

3. Nhấn **Lưu 💾** và **Triển khai lại (Deploy → Manage deployments → Edit → New version → Deploy)**.

---

## ⚠️ XỬ LÝ SỰ CỐ THƯỜNG GẶP

| Hiện tượng                               | Nguyên nhân                       | Cách khắc phục                                                                                       |
| :--------------------------------------- | :-------------------------------- | :--------------------------------------------------------------------------------------------------- |
| Báo lỗi _"Chưa cấu hình SPREADSHEET_ID"_ | Chưa cấu hình Script Property     | Kiểm tra lại Bước 5, đảm bảo tên thuộc tính là `SPREADSHEET_ID`.                                     |
| Bấm gửi form bị báo lỗi mạng / CORS      | Cấu hình quyền truy cập chưa đúng | Trong Apps Script, vào Deploy → Manage deployments → Đảm bảo mục **Who has access** là **`Anyone`**. |
| SĐT bị mất số 0 đầu tiên                 | Sheet tự format dạng số           | Chạy lại hàm `setupSheet()` trong Apps Script để áp dụng format Text `@`.                            |
| Không thấy dòng mới xuất hiện            | Chưa gán đúng URL trong `.env`    | Kiểm tra lại file `.env` và khởi động lại Vite server (`npm run dev`).                               |
