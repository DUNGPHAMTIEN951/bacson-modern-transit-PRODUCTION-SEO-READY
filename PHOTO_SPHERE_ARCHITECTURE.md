# Photo Sphere Viewer v5 Architectural Reference & Implementation

## 1. Context & Architectural Study

Dựa trên phân tích đối chiếu trực tiếp từ tài liệu kỹ thuật Photo Sphere Viewer v5 và 2 mẫu ảnh thực tế từ dự án mẫu Hotel Manager:

1. **Ảnh phòng thông thường (Perspective / Rectangular):** Khung nhìn hữu hạn, chụp góc đơn, phù hợp hiển thị trực quan trên website và mở rộng trường nhìn tương tác có giới hạn (`bounded_interactive` / `extended-photo`).
2. **Ảnh toàn cảnh hình cầu (Equirectangular 360° Panorama):** Tỷ lệ chuẩn 2:1 với độ cong sàn/trần và 360 độ góc nhìn bao quát toàn bộ không gian phòng và cửa sổ đêm (`full-sphere`).

---

## 2. Core Architecture: Photo Sphere Viewer v5

### Khởi tạo On-Demand (Lazy Loading)

Trang chủ không chịu bất kỳ chi phí WebGL / Three.js nào khi tải ban đầu. Thư viện `@photo-sphere-viewer/core` và `three` chỉ được nạp động khi người dùng nhấp vào ảnh:

```typescript
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";

const viewer = new Viewer({
  container: containerElement,
  panorama: imageUrl,
  adapter: undefined, // default EquirectangularAdapter
  panoData: isPartial
    ? {
        fullWidth: fullW,
        fullHeight: Math.round(fullW / 2),
        croppedWidth: actualW,
        croppedHeight: actualH,
        croppedX: Math.round((fullW - actualW) / 2),
        croppedY: Math.round((fullW / 2 - actualH) / 2),
      }
    : undefined,
  defaultYaw: "0deg",
  defaultPitch: "0deg",
  defaultZoomLvl: 50,
  minFov: 30,
  maxFov: 90,
  moveInertia: 0.8,
  mousewheel: true,
  mousemove: true,
  keyboard: "always",
  navbar: false, // Sử dụng custom header UI của dự án
});
```

---

## 3. Quản lý Không Gian Ảnh Thực Tế (Cropped Panoramas & Bounded Rotation)

Đối với các ảnh thực tế hiện có của nhà xe Bắc Sơn Cường Nguyệt:

- **Nguyên tắc cốt lõi:** Tuyệt đối KHÔNG kéo dãn ảnh thông thường ra toàn bộ hình cầu 360° khiến ảnh bị méo mó hoặc tạo ra vùng đen giả tạo.
- **Giải pháp Photo Sphere Viewer `panoData`:** Định nghĩa chính xác hình học cắt (`croppedWidth`, `croppedHeight`, `croppedX`, `croppedY`) trên hình cầu bán phần, đồng thời giới hạn góc quay `minYaw` / `maxYaw` và `minPitch` / `maxPitch` theo đúng trường nhìn thực của ảnh.

---

## 4. Single Global Viewer Lifecycle (Singleton Pattern)

- Chỉ có duy nhất 1 WebGL canvas / Three.js scene hoạt động tại một thời điểm.
- Khi người dùng đóng modal: Gọi ngay `viewer.destroy()`, giải phóng WebGL context, textures và event listeners.
- Khôi phục chính xác vị trí cuộn trang ban đầu (`window.scrollTo({ top: savedScrollY })`).

---

## 5. Những điểm kế thừa và những điểm KHÔNG kế thừa

### Kế thừa:

- Engine WebGL trung thực Photo Sphere Viewer v5 với chuyển động mượt mà, quán tính tự nhiên.
- Hỗ trợ đầy đủ cử chỉ Desktop (kéo chuột, cuộn bánh xe, phím mũi tên) và Mobile (vuốt 1 ngón, chụm 2 ngón zoom, 100dvh).
- Khả năng tích hợp liền mạch ảnh toàn cảnh hình cầu thật khi nhà xe bổ sung camera 360.

### Chủ động KHÔNG kế thừa / Cải tiến vượt trội:

- **KHÔNG tạo khu vực Tour 360 riêng biệt:** Mọi ảnh trên toàn website đều tự động mang hành vi tương tác khi click.
- **KHÔNG dùng backend PHP/MySQL cồng kềnh:** Kiến trúc SPA / SSR thuần TypeScript & React hiện đại.
- **KHÔNG tự động quay chóng mặt:** Mặc định người dùng chủ động khám phá góc nhìn theo ý muốn.
