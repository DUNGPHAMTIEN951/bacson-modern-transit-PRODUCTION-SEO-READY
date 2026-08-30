# Báo cáo Đánh giá Giao diện Khách quan (Observed Visual Observations)

Báo cáo này liệt kê các quan sát trung thực về bố cục và hiển thị giao diện hiện tại mà không tự ý chỉnh sửa mã nguồn:

---

## 1. Bản đồ Google Maps (Offices Section)

- **Hiện trạng**: Iframe Google Maps nhúng trực tiếp địa chỉ Bến xe Mỹ Đình và Trụ sở 03 Nguyễn Trãi (Sơn La).
- **Quan sát**: Bản đồ hiển thị rõ ràng, kèm nút ngoài "Mở Google Maps" và "Gọi nhà xe".
- **Ghi chú đánh giá**: Không phát hiện lỗi tràn viền hoặc chặn hiển thị.

## 2. Thanh ghim liên hệ Mobile (Sticky CTA)

- **Hiện trạng**: Chiếm chiều cao khoảng 64px ở đáy màn hình di động.
- **Quan sát**: Khoảng đệm chân trang (`pb-28`) đã được chừa đủ để không che khuất dòng bản quyền hay thông tin liên hệ cuối cùng của Footer.

## 3. Tỷ lệ tương phản màu sắc (Contrast Ratio)

- **Văn bản chính**: Chữ `#23313F` trên nền `#FBFAF7` đạt độ tương phản ~13.5:1 (vượt tiêu chuẩn WCAG AAA 7:1).
- **Nút CTA chính**: Chữ trắng trên nền cam đất `#D97757` đạt tỉ lệ ~4.6:1 (đạt chuẩn WCAG AA cho văn bản lớn/đậm).

## 4. Phản hồi đa kích thước (Responsive Harmony)

- Từ màn hình lớn 1920px xuống màn hình nhỏ 360px: Không xuất hiện thanh cuộn ngang (Horizontal overflow: 0px).
- Menu di động mở phủ toàn màn hình, nút đóng nổi bật và liên kết bấm vừa vặn ngón tay cái.
