# Universal Image & Immersive Experience Mapping — Bắc Sơn Cường Nguyệt

**Architecture:** 3-Mode Progressive Universal Image Interaction  
**Philosophy:** 360° / Interactive viewing is a contextual interaction directly on existing photographs, NOT a standalone website section.  
**Honesty Gate:** No fake 360 claims. Honest classification across 3 distinct experience modes using existing project assets.

---

## 1. The 3 Experience Modes

| Mode       | Identifier            | Source Data                        | Viewer Behavior                                                                           | User-Facing Mode Label                       |
| ---------- | --------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------- |
| **MODE A** | `true_360`            | Valid 2:1 Equirectangular capture  | Spherical WebGL panorama with full pitch/yaw rotation                                     | `360°`                                       |
| **MODE B** | `extended_immersive`  | Real coach interior/exterior photo | High-resolution canvas with 2.5D perspective tilt, smooth inertial panning, and wide zoom | `Không gian mở rộng từ ảnh thực tế`          |
| **MODE C** | `bounded_interactive` | Real fleet photography             | High-resolution interactive photo with inertial drag/pan & pinch/wheel zoom within canvas | `Ảnh tương tác` _(Kéo để quan sát chi tiết)_ |

---

## 2. Complete Asset Classification & Mapping Table

| #   | Image Asset                          | Location in Website        | Experience Mode                | Mode Label                          | Interaction Verified                                    |
| --- | ------------------------------------ | -------------------------- | ------------------------------ | ----------------------------------- | ------------------------------------------------------- |
| 1   | **Hero Bus** (`heroBus`)             | Hero Section               | `extended_immersive` (Mode B)  | _Không gian mở rộng từ ảnh thực tế_ | ✅ PASS — Click mở modal, kéo đa hướng, zoom 1x–3.2x    |
| 2   | **Nội thất tổng quan** (`interior`)  | Gallery Hero / Brand Story | `extended_immersive` (Mode B)  | _Không gian mở rộng từ ảnh thực tế_ | ✅ PASS — Kéo quan sát khoang xe & đèn trần             |
| 3   | **Giường cửa sổ** (`cabinWindow`)    | Gallery Grid               | `extended_immersive` (Mode B)  | _Không gian mở rộng từ ảnh thực tế_ | ✅ PASS — Kéo quan sát rèm che & góc nhìn đèo           |
| 4   | **Cabin tầng trên** (`cabinUpper`)   | Gallery Grid               | `extended_immersive` (Mode B)  | _Không gian mở rộng từ ảnh thực tế_ | ✅ PASS — Kéo quan sát đệm da & trần cao                |
| 5   | **Cabin tầng dưới** (`cabinLower`)   | Gallery Grid               | `extended_immersive` (Mode B)  | _Không gian mở rộng từ ảnh thực tế_ | ✅ PASS — Kéo quan sát chăn gối & lối lên               |
| 6   | **Lối đi trung tâm** (`cabinAisle`)  | Gallery Grid               | `extended_immersive` (Mode B)  | _Không gian mở rộng từ ảnh thực tế_ | ✅ PASS — Kéo quan sát thảm sàn & lối di chuyển         |
| 7   | **Khu Reception** (`cabinReception`) | Gallery Grid               | `extended_immersive` (Mode B)  | _Không gian mở rộng từ ảnh thực tế_ | ✅ PASS — Kéo quan sát quầy reception giữa xe           |
| 8   | **Đầu xe chính diện** (`busFront`)   | Gallery Grid               | `bounded_interactive` (Mode C) | _Ảnh tương tác_                     | ✅ PASS — Phóng to quan sát biển tuyến Sơn La – Mỹ Đình |
| 9   | **Toàn thân xe** (`busFull`)         | Gallery Grid               | `bounded_interactive` (Mode C) | _Ảnh tương tác_                     | ✅ PASS — Phóng to chi tiết thân xe Universe 12m        |
| 10  | **Dàn xe tại bến** (`busFleetYard`)  | Gallery Grid               | `bounded_interactive` (Mode C) | _Ảnh tương tác_                     | ✅ PASS — Phóng to quan sát đội xe chờ xuất bến         |
| 11  | **Đội xe Limousine** (`busFleet`)    | Gallery Grid               | `bounded_interactive` (Mode C) | _Ảnh tương tác_                     | ✅ PASS — Phóng to quan sát dàn phương tiện             |
| 12  | **Xe xuất bến** (`busDeparting`)     | Gallery Grid / Brand Story | `bounded_interactive` (Mode C) | _Ảnh tương tác_                     | ✅ PASS — Phóng to chi tiết xe lăn bánh                 |

---

## 3. Key Architecture & Performance Highlights

1. **No Standalone 360 / Vehicle Section:**
   - Dedicated `#kham-pha-360` and `#kham-pha-xe` sections have been removed.
   - Obsolete `"Khám phá xe"` navigation link removed from Header.
   - Homepage is significantly cleaner, shorter, and faster.

2. **0ms Initial WebGL Overhead:**
   - On page load, only normal lightweight responsive web images are displayed.
   - Heavy modal components are initialized strictly on-demand after user click.
   - Only 1 modal instance exists at any time; all state and listeners are cleanly disposed of on close.

3. **Scroll Position Retention:**
   - When modal opens: records `window.scrollY`.
   - When modal closes (via X button, ESC key, or backdrop): immediately restores exact scroll position without page jumping.

4. **Multi-Platform Support:**
   - Desktop: Smooth cursor grab, mouse wheel zoom, 2.5D perspective tilt, keyboard controls (Arrow keys, `+`, `-`, `Esc`).
   - Mobile: 100vw/100dvh fullscreen, smooth touch drag, pinch zoom, double-tap zoom toggle.
