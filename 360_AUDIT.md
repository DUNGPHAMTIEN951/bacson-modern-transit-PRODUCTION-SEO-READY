# 360° Panorama Asset Audit — Bắc Sơn Cường Nguyệt

**Ngày kiểm tra:** 2026-08-28  
**Người thực hiện:** AI Agent (Antigravity)

---

## Kết quả kiểm tra từng cảnh

### Cảnh 1 — Khoang xe tổng thể

| Tiêu chí                   | Kết quả                                                    |
| -------------------------- | ---------------------------------------------------------- |
| Ảnh thực tế sẵn có         | `cabinReception` + `interior` — 2 ảnh thực tế              |
| Định dạng                  | 16:9 / 4:3 bình thường (không phải equirectangular)        |
| Tỷ lệ 2:1 equirectangular  | ❌ Không có                                                |
| Khả năng dùng làm panorama | ❌ INSUFFICIENT_SOURCE                                     |
| Kết luận                   | **AI_PANORAMA_REQUIRED** (hoặc chụp thực tế bằng Insta360) |

### Cảnh 2 — Cabin tầng trên

| Tiêu chí                  | Kết quả                      |
| ------------------------- | ---------------------------- |
| Ảnh thực tế sẵn có        | `cabinUpper` — 1 ảnh thực tế |
| Định dạng                 | Ảnh 16:9 bình thường         |
| Tỷ lệ 2:1 equirectangular | ❌ Không có                  |
| Kết luận                  | **AI_PANORAMA_REQUIRED**     |

### Cảnh 3 — Cabin tầng dưới

| Tiêu chí                  | Kết quả                      |
| ------------------------- | ---------------------------- |
| Ảnh thực tế sẵn có        | `cabinLower` — 1 ảnh thực tế |
| Định dạng                 | Ảnh 16:9 bình thường         |
| Tỷ lệ 2:1 equirectangular | ❌ Không có                  |
| Kết luận                  | **AI_PANORAMA_REQUIRED**     |

### Cảnh 4 — Giường nằm cạnh cửa sổ

| Tiêu chí                  | Kết quả                       |
| ------------------------- | ----------------------------- |
| Ảnh thực tế sẵn có        | `cabinWindow` — 1 ảnh thực tế |
| Định dạng                 | Ảnh 4:3 bình thường           |
| Tỷ lệ 2:1 equirectangular | ❌ Không có                   |
| Kết luận                  | **AI_PANORAMA_REQUIRED**      |

### Cảnh 5 — Lối đi trung tâm

| Tiêu chí                  | Kết quả                      |
| ------------------------- | ---------------------------- |
| Ảnh thực tế sẵn có        | `cabinAisle` — 1 ảnh thực tế |
| Định dạng                 | Ảnh 16:9 bình thường         |
| Tỷ lệ 2:1 equirectangular | ❌ Không có                  |
| Kết luận                  | **AI_PANORAMA_REQUIRED**     |

---

## Kết luận tổng thể

> **KHÔNG CÓ nguồn equirectangular nào sẵn có trong dự án.**

Tất cả 12 ảnh thực tế của nhà xe đều là ảnh tiêu chuẩn 4:3 hoặc 16:9. Không có ảnh nào được chụp bằng camera 360° (Insta360, Ricoh Theta, GoPro Max, v.v.).

### Lý do tại sao không thể tái tạo bằng AI Image Generation

- Engine tạo ảnh AI hiện tại chỉ xuất ảnh theo tỷ lệ tiêu chuẩn (1:1, 4:3, 3:2, 16:9, 9:16).
- Ảnh equirectangular 2:1 đúng nghĩa yêu cầu **cạnh trái và cạnh phải khớp hình học liền mạch** ở mọi vĩ độ.
- Đây là ràng buộc toán học (spherical projection), không thể đảm bảo bằng cách sinh ảnh tự do.
- Nhét ảnh không phải equirectangular vào Pannellum sẽ tạo ra đường nối rõ rệt và biến dạng cực tại đỉnh/đáy.

---

## Trạng thái triển khai

| Hạng mục                            | Trạng thái                     |
| ----------------------------------- | ------------------------------ |
| Pannellum WebGL Engine              | ✅ Đã cài đặt và tích hợp      |
| Multi-scene tour UI                 | ✅ Hoàn tất                    |
| Hotspot navigation                  | ✅ Hoàn tất                    |
| Mobile touch / Fullscreen           | ✅ Hoàn tất                    |
| Ảnh demo kỹ thuật                   | ✅ Sử dụng panorama demo chuẩn |
| Ảnh equirectangular thật của nhà xe | ⏳ Chờ nhà xe cung cấp         |

---

## Thông số kỹ thuật để bổ sung ảnh thật

Khi nhà xe sẵn sàng chụp ảnh 360°, yêu cầu kỹ thuật là:

| Thông số                 | Yêu cầu                                 |
| ------------------------ | --------------------------------------- |
| Định dạng                | JPEG hoặc WebP                          |
| Tỷ lệ                    | **2:1 chính xác**                       |
| Độ phân giải tối thiểu   | **4096 × 2048 px**                      |
| Độ phân giải khuyến nghị | 6000 × 3000 px                          |
| Projection               | **Equirectangular**                     |
| Góc ngang                | 360° đầy đủ                             |
| Góc dọc                  | ~180°                                   |
| Camera khuyến nghị       | Insta360 X4, Ricoh Theta Z1, GoPro Max  |
| Vị trí đặt camera        | Giữa lối đi khoang xe, độ cao ~1.3–1.5m |

### Thứ tự ưu tiên chụp

1. `01-khoang-chinh.jpg` — Giữa khoang xe, nhìn về phía đầu xe
2. `02-tang-tren.jpg` — Khu cabin tầng trên
3. `03-tang-duoi.jpg` — Khu cabin tầng dưới
4. `04-cua-so.jpg` — Góc giường cạnh cửa sổ
5. `05-loi-di.jpg` — Nhìn dọc lối đi về cuối xe

### Quy trình thay thế ảnh demo

```
1. Chụp ảnh bằng camera 360°
2. Xuất file JPEG/WebP equirectangular 2:1
3. Đặt vào: public/360/01-khoang-chinh.jpg, 02-tang-tren.jpg, ...
4. Cập nhật src/data/panoramas.ts → đổi imageUrl từng cảnh
5. Đổi label từ "Không gian mô phỏng 360°" thành "Ảnh 360° thực tế"
6. npm run verify
```
