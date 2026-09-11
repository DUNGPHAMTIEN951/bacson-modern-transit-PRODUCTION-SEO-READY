export type TransportRoute = {
  slug: string;
  title: string;
  price: string;
  vehicle: string;
  departure: string;
  destination: string;
  stops: string[];
  description: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export const transportRoutes: Record<string, TransportRoute> = {
  sonLaHaNoi: {
    slug: "son-la-ha-noi",
    title: "Xe Sơn La Hà Nội",
    price: "380.000đ/vé",
    vehicle: "Xe giường nằm 34 chỗ",
    departure: "Sơn La",
    destination: "Hà Nội",
    stops: ["Sơn La", "Hòa Bình", "Hà Nội"],
    description:
      "Bắc Sơn Cường Nguyệt phục vụ tuyến xe Sơn La đi Hà Nội với xe giường nằm 34 chỗ, hỗ trợ khách hàng đăng ký giữ chỗ và xác nhận thông tin trực tiếp.",
    faq: [
      {
        question: "Xe Sơn La Hà Nội giá bao nhiêu?",
        answer: "Giá vé tham khảo tuyến Sơn La Hà Nội là 380.000đ/vé.",
      },
      {
        question: "Xe Sơn La Hà Nội có bao nhiêu chỗ?",
        answer: "Nhà xe sử dụng xe giường nằm 34 chỗ.",
      },
    ],
  },
  haNoiMocChau: {
    slug: "ha-noi-moc-chau",
    title: "Xe Hà Nội Mộc Châu",
    price: "300.000đ/vé",
    vehicle: "Xe giường nằm 34 chỗ",
    departure: "Hà Nội",
    destination: "Mộc Châu",
    stops: ["Hà Nội", "Hòa Bình", "Mai Châu", "Mộc Châu"],
    description:
      "Bắc Sơn Cường Nguyệt cung cấp thông tin tuyến xe Hà Nội đi Mộc Châu, hỗ trợ hành khách đăng ký nhu cầu di chuyển nhanh chóng.",
    faq: [
      {
        question: "Xe Hà Nội Mộc Châu giá bao nhiêu?",
        answer: "Giá vé tham khảo tuyến Hà Nội Mộc Châu là 300.000đ/vé.",
      },
      {
        question: "Làm sao để đăng ký vé?",
        answer: "Khách hàng gửi thông tin qua form và nhà xe sẽ liên hệ xác nhận.",
      },
    ],
  },
};
