# Ghi chú về Vi tương tác Nút Liên hệ (Contact Button Interactions)

Tài liệu này ghi lại các thông số kỹ thuật và hiệu ứng vi tương tác thực tế đang hoạt động trên website:

---

## 1. Nút Gọi điện chính (CallButton & Hotline CTA)

- **Màu sắc nền (Resting)**: Cam đất hoàng hôn (`#D97757`)
- **Màu chữ**: Trắng (`#FFFFFF`), `font-weight: 700`
- **Độ bo góc**: `rounded-xl` (12px / `0.75rem`)
- **Đổ bóng cơ sở**: `box-shadow: 0 2px 8px rgba(217, 119, 87, 0.18)`
- **Hiệu ứng Hover**:
  - Di chuyển tịnh tiến: `transform: translateY(-2px)`
  - Đổi màu nền sang cam đất đậm: `#C86547`
  - Tăng độ phủ bóng: `box-shadow: 0 6px 18px rgba(217, 119, 87, 0.30)`
- **Hiệu ứng Active (Khi bấm giữ chuột / chạm tay)**:
  - Co giãn đàn hồi nhẹ: `transform: scale(0.98)`
  - Thời lượng chuyển động: `220ms ease-out`
- **Hiệu ứng Nhịp thở (Pulse Ring)**:
  - Áp dụng trên nút Hotline chính tại Hero & Header (`btn-pulse`)
  - Chu kỳ nhịp đập: `4s cubic-bezier(0.4, 0, 0.6, 1) infinite`
  - Vòng mở rộng từ 0px lên 8px mờ dần, không chớp nháy đột ngột

---

## 2. Nút Nhắn Zalo (ZaloButton)

- **Màu sắc nền (Resting)**: Trắng thuần (`#FFFFFF`)
- **Màu viền**: Viền nhẹ `#DFE5EA`
- **Màu chữ & Icon**: Xanh núi trầm tĩnh (`#3F6670`)
- **Hiệu ứng Hover**:
  - Nâng nhẹ: `transform: translateY(-2px)`
  - Đổi viền sang xanh núi: `#3F6670`
  - Nền chuyển sang phủ màu xanh nhạt sương mờ: `#E8F2F4`
  - Đổ bóng mềm: `box-shadow: 0 6px 18px rgba(63, 102, 112, 0.14)`
- **Hiệu ứng Active**: `scale(0.98)` trong `220ms`

---

## 3. Thanh Gọi nhanh Mobile (StickyCta Bar)

- **Vị trí**: Ghim cố định ở cạnh đáy (`fixed inset-x-0 bottom-0 z-50`)
- **Tương thích Safe-Area**: `pb-[max(0.625rem, env(safe-area-inset-bottom))]`
- **Bố cục 2 nút**:
  - Nút bên trái: GỌI ĐẶT VÉ (Cam đất `#D97757`)
  - Nút bên phải: CHAT ZALO (Xanh núi `#3F6670`)
- **Hiệu ứng phản hồi**: Tương tác cảm ứng nảy `scale(0.98)` ngay lập tức.

---

## 4. Tôn trọng Chế độ Giảm chuyển động (Prefers-Reduced-Motion)

- Khi thiết bị kích hoạt `prefers-reduced-motion: reduce`:
  - Mọi hiệu ứng `transition-duration` và `animation-duration` tự động gán về `0.001ms`
  - Hiệu ứng `transform` được giữ nguyên trạng thái tĩnh, đảm bảo khả năng tiếp cận (Accessibility) chuẩn A11y.
