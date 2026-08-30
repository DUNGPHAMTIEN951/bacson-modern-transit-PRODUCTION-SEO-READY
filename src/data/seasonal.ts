/**
 * Cấu hình chủ đề theo mùa (Seasonal Theme Configuration)
 * Có thể bật/tắt dễ dàng sau dịp lễ Quốc khánh 2/9 mà không ảnh hưởng đến dữ liệu gốc.
 */
export const seasonalConfig = {
  active: true,
  themeId: "national-day-2-9",
  themeName: "Chào mừng Quốc khánh 2/9 – Sơn La những chuyến đi",
  themeConcept: "Chuyến trở về mùa Quốc khánh",
  slogan: "Sơn La những chuyến đi",
  subtitle: "Chào mừng Quốc khánh 2/9 – đồng hành cùng những hành trình trở về quê nhà.",
} as const;
