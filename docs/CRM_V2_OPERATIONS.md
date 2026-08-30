# BSCN CRM v2 — Anti-spam, khách quen, kế toán, dashboard và backup

Hệ thống v2 biến Google Sheets thành mini CRM vận hành cho nhà xe. Mã Apps Script được chia thành các file trong `google-apps-script/`:

- `Code.gs` — Web App API, validation và điều phối.
- `AntiSpam.gs` — chấm điểm rủi ro, rate-limit, blacklist và `PHONE_REGISTRY`.
- `SheetsCRM.gs` — schema CRM, bảng hiển thị, booking, payment và audit.
- `AccountingDashboard.gs` — tổng hợp kế toán theo ngày và biểu đồ.
- `BackupArchive.gs` — backup hằng ngày, kiểm tra dung lượng, rollover database và triggers.

> GitHub và Google Apps Script không tự đồng bộ với nhau trong project hiện tại. Sau khi mã trên GitHub thay đổi, cần tạo/cập nhật các file `.gs` tương ứng trong Apps Script project và triển khai một version Web App mới.

## 1. Script Properties bắt buộc

Trong **Apps Script → Project Settings → Script Properties**:

```text
SPREADSHEET_ID = 12l0E7L-HZX6eQTEKuRqPJQBW8HwpXzCgUjZ8B5g74U8
```

Sau lần đầu chạy `setupSystem()`, script tự tạo thêm:

```text
ACTIVE_SPREADSHEET_ID
BACKUP_FOLDER_ID
LAST_BACKUP_DATE
LAST_BACKUP_FILE_ID
```

`ACTIVE_SPREADSHEET_ID` luôn được ưu tiên. Khi database rollover, script tự đổi property này sang spreadsheet mới nên Web App không phải đổi URL.

## 2. Cài mã lên Apps Script

Trong project Apps Script hiện tại, tạo/cập nhật đúng 5 file:

```text
Code.gs
AntiSpam.gs
SheetsCRM.gs
AccountingDashboard.gs
BackupArchive.gs
```

Copy nội dung tương ứng từ thư mục `google-apps-script/` của repository.

Lưu toàn bộ project.

## 3. Chạy khởi tạo

Chọn hàm:

```text
setupSystem
```

và nhấn **Run** một lần. Cấp các quyền Google Sheets/Drive/Mail/Triggers khi Google yêu cầu.

Hệ thống sẽ tạo:

```text
LEADS_RAW
LEADS_VIEW
PHONE_REGISTRY
SPAM_QUARANTINE
REQUEST_LOG
BOOKINGS
PAYMENTS
ACCOUNTING_DAILY
DASHBOARD
AUDIT_LOG
ARCHIVE_INDEX
CONFIG
```

### LEADS_RAW

Nguồn dữ liệu lead chính. Nhân viên có thể thay đổi trạng thái và ghi chú ở đây.

### LEADS_VIEW

Bảng chỉ để xem, tự động sort theo `Thời gian` mới nhất trước bằng QUERY. Không sửa dữ liệu trực tiếp tại sheet này.

### PHONE_REGISTRY

Mỗi số điện thoại có một hồ sơ lâu dài. Các giá trị `Phân loại`:

```text
MỚI
KHÁCH_QUEN
VIP
SUSPECT
SPAM
BLOCKED
```

Các giá trị `Xác minh`:

```text
CHƯA_XÁC_MINH
ĐÃ_XÁC_MINH
SAI_SỐ
KHÔNG_NGHE
BỠN_CỢT
```

Nếu nhân viên gọi xác minh và phát hiện số dùng để phá form, đặt:

```text
Phân loại = SPAM
```

hoặc:

```text
Xác minh = BỠN_CỢT
```

Những lần gửi tiếp theo từ số đó sẽ bị chặn mềm và đưa sang `SPAM_QUARANTINE`.

Đối với khách quen, đặt:

```text
Phân loại = KHÁCH_QUEN
Xác minh = ĐÃ_XÁC_MINH
```

### SPAM_QUARANTINE

Request có risk score cao không đi vào danh sách gọi chính. Chúng được giữ riêng để kiểm tra thủ công, tránh mất dấu trường hợp false positive.

### REQUEST_LOG

Ghi dấu request để tính rate-limit và spam rate. Không dùng sheet này làm danh sách khách.

## 4. Anti-spam nhiều lớp

Apps Script hiện kiểm tra:

- honeypot;
- định dạng số điện thoại Việt Nam;
- blacklist và trạng thái xác minh cũ trong `PHONE_REGISTRY`;
- nhiều request cùng số trong 15 phút;
- quá nhiều request cùng số trong ngày;
- payload trùng lặp;
- tên có pattern bất thường / test / spam / chuỗi lặp;
- nội dung chứa URL/script hoặc chuỗi có dấu hiệu phá;
- nguồn gửi không thuộc các source hợp lệ;
- client request metadata khi có.

Hệ thống dùng `spam score` thay vì chỉ TRUE/FALSE:

```text
0–49   → nhận bình thường
50–84  → SPAM_QUARANTINE
85–100 → chặn mềm
```

Request bị chặn vẫn nhận phản hồi chung chung để người phá không biết rule nào đã bắt họ.

### Lưu ý

Không nên coi IP là tiêu chí chặn duy nhất. Một Wi-Fi gia đình, trường học hoặc bến xe có thể phục vụ nhiều khách thật. Nếu sau này thêm Cloudflare Turnstile/Worker, IP chỉ nên là một tín hiệu trong risk score.

## 5. Quy trình Booking và kế toán

Khi một Lead được đổi trạng thái trong `LEADS_RAW` thành:

```text
Đã xác nhận
```

hệ thống tự tạo một dòng ở `BOOKINGS`.

Các cột tiền chính:

```text
Giá/người
Tổng tiền trước giảm
Giảm giá
Thành tiền
Đã thu
Còn phải thu
Trạng thái thanh toán
```

`Đã thu` được tính từ `PAYMENTS`, không nhập tay.

Để ghi giao dịch:

1. Chọn dòng booking trong `BOOKINGS`.
2. Menu **🚍 BSCN CRM**.
3. Chọn **Ghi khoản thu cho Booking đang chọn**.
4. Nhập số tiền.
5. Chọn `PAYMENT` hoặc `REFUND`.
6. Chọn phương thức thanh toán.

Doanh thu dashboard **không lấy từ LEADS**. Chỉ dữ liệu trong `PAYMENTS` mới được coi là tiền thực thu.

## 6. Dashboard

`DASHBOARD` hiển thị các KPI:

- Thu ròng hôm nay.
- Thu ròng tháng này.
- Booking hôm nay.
- Số tiền còn phải thu.
- Spam rate tháng.
- Tỷ lệ Lead → Booking.
- Khách mới.
- Khách quen/VIP.

Biểu đồ tự tạo:

- Thu ròng theo ngày — 31 ngày gần nhất.
- Spam rate theo ngày.
- Lead → Booking theo ngày.
- Lead hợp lệ vs spam/cách ly.
- Khách mới vs khách quen/VIP.

`ACCOUNTING_DAILY` là bảng dữ liệu nguồn cho biểu đồ và luôn sort theo ngày tăng dần; Dashboard dùng 31 ngày gần nhất cho biểu đồ trend.

## 7. Backup tự động

Chạy một lần:

```text
installMaintenanceTriggers
```

Hệ thống cài:

```text
maintenanceHourly  → refresh kế toán + dashboard mỗi giờ
maintenanceDaily   → backup + dọn backup cũ + kiểm tra rollover + refresh report
```

Daily backup được tạo trong thư mục Drive:

```text
BSCN_DATABASE_BACKUPS
```

Mặc định giữ 30 ngày daily backup gần nhất.

Có thể backup thủ công từ menu **🚍 BSCN CRM → Backup ngay**.

## 8. Rollover database khi gần đầy

Google Sheets có giới hạn cell. Script theo dõi tổng `maxRows × maxColumns` của toàn workbook.

Mặc định khi đạt khoảng 72% giới hạn cấu hình, script:

1. Tạo backup của database hiện tại.
2. Đổi tên database cũ thành `..._ARCHIVE_YYYYMMDD_HHmmss`.
3. Tạo spreadsheet active mới.
4. Khởi tạo schema CRM mới.
5. Copy `PHONE_REGISTRY`, `ACCOUNTING_DAILY`, `ARCHIVE_INDEX`, `CONFIG` sang database mới.
6. Ghi database cũ vào `ARCHIVE_INDEX`.
7. Cập nhật `ACTIVE_SPREADSHEET_ID`.
8. Các request mới tự chuyển sang database active mới mà không cần đổi Web App URL.

Có thể kiểm tra thủ công bằng menu:

```text
🚍 BSCN CRM → Kiểm tra dung lượng / rollover
```

## 9. Audit

Khi nhân viên sửa các trường quan trọng như:

- trạng thái Lead;
- nhân viên/ghi chú tư vấn;
- phân loại/xác minh số điện thoại;
- booking;
- payment;

hệ thống ghi lịch sử vào `AUDIT_LOG` gồm thời gian, sheet, ô, giá trị cũ, giá trị mới và hành động.

Địa chỉ email người sửa có thể trống/`unknown` tùy loại tài khoản Google và chính sách Workspace; đây là giới hạn của Apps Script, không phải lỗi hệ thống.

## 10. Deploy Web App lại

Sau khi cập nhật 5 file `.gs`:

1. **Deploy → Manage deployments**.
2. Edit deployment hiện tại.
3. Chọn **New version**.
4. Execute as: **Me**.
5. Who has access: **Anyone**.
6. Deploy.

URL `/exec` có thể giữ nguyên nếu bạn cập nhật deployment hiện tại.

Website Cloudflare vẫn sử dụng:

```text
VITE_BOOKING_FORM_ENDPOINT=https://script.google.com/macros/s/.../exec
```

Sau khi biến build đã đúng, không cần thay đổi nó mỗi lần chỉ cập nhật version của cùng Apps Script Web App deployment.

## 11. Checklist test production

Test theo thứ tự:

1. Mở `/exec` trực tiếp, kiểm tra JSON `status: active`, `version: 2.0.0`.
2. Gửi một form khách hợp lệ → phải vào `LEADS_RAW` và xuất hiện đầu `LEADS_VIEW`.
3. Gửi cùng payload liên tục → spam score tăng và cuối cùng vào quarantine.
4. Đánh dấu số test là `SPAM` → gửi lại → không vào `LEADS_RAW`.
5. Đánh dấu một số khác `KHÁCH_QUEN` + `ĐÃ_XÁC_MINH` → Lead tiếp theo phải mang phân loại khách quen.
6. Đổi Lead thành `Đã xác nhận` → phải xuất hiện Booking.
7. Ghi `PAYMENT` cho Booking → `Đã thu` và Dashboard cập nhật.
8. Ghi `REFUND` → thu ròng giảm.
9. Chạy `forceBackupNow()` → phải có file mới trong thư mục backup Drive.
10. Chạy `refreshAllReports()` → Dashboard và ACCOUNTING_DAILY được làm mới.
