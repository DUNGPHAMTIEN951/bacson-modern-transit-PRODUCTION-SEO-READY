# Bắc Sơn Cường Nguyệt — Production Website

Website chính thức cho tuyến Hà Nội ⇄ Mộc Châu ⇄ Sơn La, xây dựng bằng TanStack Start, React, TypeScript và Tailwind CSS.

## Yêu cầu môi trường

- Node.js 22
- npm 10+

## Chạy local

```sh
npm ci
cp .env.example .env
npm run dev
```

Cấu hình `VITE_BOOKING_FORM_ENDPOINT` trong `.env` bằng URL Google Apps Script Web App dùng cho biểu mẫu yêu cầu tư vấn. Không commit `.env` hoặc các file môi trường thật vào Git.

## Kiểm tra trước khi deploy

Chạy một lệnh duy nhất:

```sh
npm run verify
```

Lệnh này thực hiện:

- TypeScript typecheck
- ESLint
- production build
- SEO verification

CI trên GitHub cũng chạy cùng gate này cho pull request và mọi push lên `main`.

## Production behavior

- SSR qua TanStack Start với fallback HTML khi SSR gặp lỗi nghiêm trọng.
- Security response headers được thêm ở server entry.
- SEO metadata, canonical URL, Open Graph, Twitter cards và JSON-LD được render từ route.
- Gallery viewer dùng `object-fit: contain` mặc định để không crop ảnh xe, hỗ trợ keyboard, swipe, zoom, focus trap và body scroll lock.
- Booking lead gửi trực tiếp tới Google Apps Script / Google Sheets; website không cần database riêng.
- Loading branding chỉ là visual overlay; nội dung chính vẫn được render phía sau.

## Environment

Mẫu cấu hình nằm tại `.env.example`:

```env
VITE_BOOKING_FORM_ENDPOINT=https://script.google.com/macros/s/XXXXX/exec
```

Biến `VITE_*` được đưa vào client bundle, vì vậy không đặt secret/private credential trong các biến này.

## Deploy checklist

1. Chạy `npm ci`.
2. Cấu hình `VITE_BOOKING_FORM_ENDPOINT` trong môi trường deploy.
3. Chạy `npm run verify`.
4. Kiểm tra responsive desktop/mobile.
5. Gửi một lead test và xác nhận Google Sheet nhận đúng dữ liệu.
6. Kiểm tra canonical/OG image trên domain production.
7. Kiểm tra HTTPS và response security headers.

## Tech stack

- TanStack Start
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query / Router
- Lucide icons
- Google Apps Script + Google Sheets

## Lovable sync

Project được kết nối với Lovable. Không force-push, rebase hoặc rewrite lịch sử commit đã publish; thay đổi nên đi qua commit/branch/PR bình thường để tránh mất lịch sử đồng bộ.
