# IMAGE IMMERSIVE AUDIT — BẮC SƠN CƯỜNG NGUYỆT

Kiểm toán toàn diện hệ thống hình ảnh thực tế tích hợp Photo Sphere Viewer v5 trên website Nhà xe Bắc Sơn Cường Nguyệt.

---

## 1. Bảng Kiểm Toán Chi Tiết Toàn Bộ Hình Ảnh

| Image Key / File                                                      | Vị trí Website                 | Kích thước gốc | Chế độ (Mode)      | Horizontal FOV | Vertical FOV | Extended             | Trình hiển thị (Viewer) |
| --------------------------------------------------------------------- | ------------------------------ | -------------- | ------------------ | -------------- | ------------ | -------------------- | ----------------------- |
| `heroBus` (`xe-bac-son-cuong-nguyet-son-la-my-dinh-hero.webp`)        | **Hero Section**               | 1600 × 1067    | `PARTIAL_PANORAMA` | 130°           | 60°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `interior` (`noi-that-xe-giuong-nam-bac-son-cuong-nguyet.webp`)       | **Gallery / Brand Story**      | 1200 × 800     | `PARTIAL_PANORAMA` | 150°           | 65°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `cabinWindow` (`giuong-nam-canh-cua-so-xe-bac-son-cuong-nguyet.webp`) | **Gallery Grid**               | 1200 × 800     | `PARTIAL_PANORAMA` | 130°           | 55°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `cabinUpper` (`cabin-giuong-nam-tang-tren-bac-son-cuong-nguyet.webp`) | **Gallery Grid**               | 1200 × 800     | `PARTIAL_PANORAMA` | 120°           | 55°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `cabinLower` (`cabin-giuong-nam-tang-duoi-bac-son-cuong-nguyet.webp`) | **Gallery Grid**               | 1200 × 800     | `PARTIAL_PANORAMA` | 120°           | 55°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `cabinAisle` (`loi-di-giua-khoang-giuong-nam-tren-xe.webp`)           | **Gallery Grid**               | 1200 × 800     | `PARTIAL_PANORAMA` | 150°           | 65°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `cabinReception` (`khoang-giuong-nam-khu-reception-tren-xe.webp`)     | **Gallery Grid**               | 1200 × 800     | `PARTIAL_PANORAMA` | 140°           | 60°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `busFront` (`dau-xe-bac-son-cuong-nguyet-chinh-dien.webp`)            | **Gallery Grid**               | 1200 × 800     | `EXTENDED_PHOTO`   | 90°            | 45°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `busFull` (`xe-giuong-nam-bac-son-cuong-nguyet-toan-than.webp`)       | **Gallery Grid**               | 1200 × 800     | `EXTENDED_PHOTO`   | 110°           | 50°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `busFleetYard` (`doi-xe-bac-son-cuong-nguyet-tai-ben.webp`)           | **Gallery Grid**               | 1200 × 800     | `EXTENDED_PHOTO`   | 110°           | 50°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `busFleet` (`doi-xe-limousine-bac-son-cuong-nguyet.webp`)             | **Gallery Grid**               | 1200 × 800     | `EXTENDED_PHOTO`   | 100°           | 45°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |
| `busDeparting` (`xe-bac-son-cuong-nguyet-xuat-ben.webp`)              | **Gallery Grid / Brand Story** | 1200 × 800     | `EXTENDED_PHOTO`   | 110°           | 50°          | YES (Cropped Sphere) | Photo Sphere Viewer v5  |

---

## 2. Thống Kê Phân Loại & Chất Lượng

- **Tổng số ảnh thực tế được tích hợp:** `12` ảnh
- **Số ảnh hiển thị qua Photo Sphere Viewer v5 WebGL:** `12` ảnh (`100%`)
- **Số ảnh Partial Panorama (Nội thất khoang xe):** `7` ảnh
- **Số ảnh Extended Photo (Ngoại thất xe):** `5` ảnh
- **Số ảnh Full Sphere 360° gượng ép:** `0` _(Cam kết trung thực tuyệt đối: không tuyên bố 360 giả tạo khi nguồn ảnh là perspective photograph)_
- **Trường nhìn tối đa đạt được:** `150° Horizontal FOV` (khoang giường nằm & lối đi)

---

## 3. Quy Chuẩn Đảm Bảo Tính Chân Thực (Quality Gates)

1. **Bảo toàn hình học xe:** Không thay đổi tỷ lệ khung gầm xe Universe Limousine, số lượng cửa sổ, biển số và tem tuyến.
2. **Không tự động sinh chữ thương hiệu giả mạo:** Giữ nguyên 100% nhận diện Bắc Sơn Cường Nguyệt từ ảnh chụp thật.
3. **Giới hạn góc quay nghiêm ngặt (`minYaw`/`maxYaw`, `minPitch`/`maxPitch`):** Khóa camera khi chạm tới rìa ảnh để tránh người dùng quay vào khoảng đen vô nghĩa.
