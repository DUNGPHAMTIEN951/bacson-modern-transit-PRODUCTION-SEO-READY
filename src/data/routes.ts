export interface RouteStop {
  name: string;
  desc?: string;
  timeEstimate?: string;
}

export interface RouteHighlight {
  title: string;
  desc: string;
  sub?: string;
  iconName: "bus" | "badgeDollarSign" | "clock" | "package";
}

export interface RouteGalleryItem {
  src: string;
  alt: string;
  title: string;
  tag: string;
}

export interface RouteFaqItem {
  question: string;
  answer: string;
}

export interface TransportRoute {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  priceValue: number;
  vehicle: string;
  departure: string;
  destination: string;
  routeSummary: string;
  duration: string;
  scheduleSummary: string;
  description: string;
  stops: string[];
  detailedStops: RouteStop[];
  highlights: RouteHighlight[];
  heroImage: {
    src: string;
    alt: string;
  };
  gallery: RouteGalleryItem[];
  faq: RouteFaqItem[];
}

export interface ContactRouteData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  hotline: string;
  hotlineFormatted: string;
  hotline2: string;
  hotline2Formatted: string;
  zalo: string;
  address: string;
  offices: Array<{
    name: string;
    address: string;
    hotline: string;
    note?: string;
  }>;
  highlights: RouteHighlight[];
  faq: RouteFaqItem[];
}

export const sonLaHaNoiRoute: TransportRoute = {
  slug: "son-la-ha-noi",
  title: "Xe Sơn La Hà Nội",
  subtitle: "Hành trình kết nối Tây Bắc · An toàn - tiện nghi - đúng giờ",
  price: "380.000đ/vé",
  priceValue: 380000,
  vehicle: "Xe giường nằm 34 chỗ",
  departure: "Sơn La",
  destination: "Hà Nội",
  routeSummary: "Sơn La → Hòa Bình → Hà Nội",
  duration: "Khoảng 6 – 7 giờ",
  scheduleSummary: "10+ chuyến mỗi ngày hai chiều sáng, trưa, tối và đêm",
  description:
    "Nhà xe Bắc Sơn Cường Nguyệt phục vụ chuyên tuyến Sơn La đi Bến xe Mỹ Đình (Hà Nội) bằng dàn xe giường nằm 34 chỗ đời mới, phục vụ nước uống, khăn lạnh, wifi và chăn gối khử khuẩn chu đáo.",
  stops: ["Sơn La", "Hát Lót", "Mộc Châu", "Hòa Bình", "Hà Nội"],
  detailedStops: [
    {
      name: "Bến xe Sơn La",
      desc: "Xuất bến tại TP. Sơn La, đón khách tận tình",
      timeEstimate: "Xuất phát",
    },
    {
      name: "Hát Lót (Mai Sơn)",
      desc: "Đón trả dọc Quốc lộ 6 thuận tiện cho hành khách",
      timeEstimate: "~30 phút",
    },
    {
      name: "Thị trấn Mộc Châu",
      desc: "Dừng nghỉ, đón trả khách du lịch và bà con",
      timeEstimate: "~2.5 giờ",
    },
    {
      name: "TP. Hòa Bình",
      desc: "Dừng nghỉ kỹ thuật, tiếp nước và đón khách",
      timeEstimate: "~4.5 giờ",
    },
    {
      name: "Bến xe Mỹ Đình (Hà Nội)",
      desc: "Trả khách an toàn tại Bến xe Mỹ Đình và Đại lộ Thăng Long",
      timeEstimate: "~6.5 giờ",
    },
  ],
  highlights: [
    {
      iconName: "bus",
      title: "34 chỗ",
      desc: "Xe giường nằm",
      sub: "Khoang nằm riêng tư, đệm êm, sạch sẽ",
    },
    {
      iconName: "badgeDollarSign",
      title: "Giá vé",
      desc: "Minh bạch",
      sub: "380.000đ/vé – Không phát sinh phụ thu",
    },
    {
      iconName: "clock",
      title: "Lộ trình",
      desc: "Cố định",
      sub: "Đúng giờ cam kết, đón trả đúng quy định",
    },
    {
      iconName: "package",
      title: "Dịch vụ",
      desc: "Nhận gửi hàng",
      sub: "Giao nhận bưu kiện nhanh trong ngày",
    },
  ],
  heroImage: {
    src: "/images/actual/xe-bac-son-hero.jpg",
    alt: "Xe giường nằm 34 chỗ cao cấp Bắc Sơn Cường Nguyệt tuyến Sơn La Hà Nội",
  },
  gallery: [
    {
      src: "/images/actual/xe-bac-son-tai-ben.jpg",
      alt: "Đội ngũ xe khách Bắc Sơn Cường Nguyệt đón khách tại bến",
      title: "Đoàn xe đời mới tại bến",
      tag: "Ngoại thất",
    },
    {
      src: "/images/actual/noi-that-khoang-giuong-vip.jpg",
      alt: "Nội thất giường nằm êm ái, bọc da cao cấp của nhà xe",
      title: "Khoang giường nằm VIP",
      tag: "Nội thất",
    },
    {
      src: "/images/actual/noi-that-khoang-giuong-2.jpg",
      alt: "Khoang hành khách sạch sẽ, trang bị tiện nghi hiện đại",
      title: "Tiện nghi giường tầng",
      tag: "Trải nghiệm",
    },
  ],
  faq: [
    {
      question: "Xe Sơn La đi Hà Nội chạy mấy giờ hàng ngày?",
      answer:
        "Nhà xe Bắc Sơn Cường Nguyệt có hơn 10 chuyến xe chạy liên tục mỗi ngày từ Sơn La về Hà Nội, phân bổ đều sáng, chiều và đêm. Quý khách vui lòng liên hệ hotline 0848.755.766 để chọn khung giờ chính xác nhất.",
    },
    {
      question: "Giá vé xe Sơn La Hà Nội bao nhiêu và có phụ thu ngày lễ không?",
      answer:
        "Giá vé niêm yết hiện tại là 380.000đ/vé cho xe giường nằm 34 chỗ cao cấp. Nhà xe cam kết thu đúng giá niêm yết, không phụ thu bất hợp lý.",
    },
    {
      question: "Xe đón trả tại những điểm nào ở Hà Nội và Sơn La?",
      answer:
        "Tại Sơn La: Đón tại Bến xe TP. Sơn La, Hát Lót, Mộc Châu và dọc Quốc lộ 6. Tại Hà Nội: Đón trả tại Bến xe Mỹ Đình, nút giao Đại lộ Thăng Long và các điểm trung chuyển thuận lợi.",
    },
    {
      question: "Nhà xe có nhận gửi hàng hóa, xe máy theo xe không?",
      answer:
        "Có. Hầm hàng rộng rãi, có hỗ trợ vận chuyển xe máy, bưu phẩm, nông sản Tây Bắc và hàng hóa thiết yếu giao nhận trong ngày an toàn tuyệt đối.",
    },
  ],
};

export const haNoiMocChauRoute: TransportRoute = {
  slug: "ha-noi-moc-chau",
  title: "Xe Hà Nội Mộc Châu",
  subtitle: "Hành trình kết nối Tây Bắc · An toàn - tiện nghi - đúng giờ",
  price: "300.000đ/vé",
  priceValue: 300000,
  vehicle: "Xe giường nằm cao cấp",
  departure: "Hà Nội",
  destination: "Mộc Châu",
  routeSummary: "Hà Nội → Hòa Bình → Mai Châu → Mộc Châu",
  duration: "Khoảng 4 – 4.5 giờ",
  scheduleSummary: "Nhiều chuyến chạy hàng ngày, đón khách tận tình tại Mỹ Đình",
  description:
    "Tuyến xe chất lượng cao Hà Nội đi cao nguyên Mộc Châu phục vụ du khách và người dân bằng xe giường nằm 34 chỗ êm ái, máy lạnh hai chiều, chạy êm ái trên đèo dốc Tây Bắc.",
  stops: ["Hà Nội", "Hòa Bình", "Mai Châu", "Mộc Châu"],
  detailedStops: [
    {
      name: "Bến xe Mỹ Đình (Hà Nội)",
      desc: "Xuất phát tại cổng Bến xe Mỹ Đình & Đại lộ Thăng Long",
      timeEstimate: "Xuất phát",
    },
    {
      name: "TP. Hòa Bình",
      desc: "Qua trạm dừng chân, đón trả khách dọc Quốc lộ 6",
      timeEstimate: "~2 giờ",
    },
    {
      name: "Ngã 3 Mai Châu (Hòa Bình)",
      desc: "Dừng trả khách đi Mai Châu và trung chuyển hàng hóa",
      timeEstimate: "~3.2 giờ",
    },
    {
      name: "Thị trấn Mộc Châu (Sơn La)",
      desc: "Trả khách tại trung tâm thị trấn Mộc Châu và các khách sạn",
      timeEstimate: "~4.2 giờ",
    },
  ],
  highlights: [
    {
      iconName: "bus",
      title: "34 chỗ",
      desc: "Xe giường nằm",
      sub: "Khoang nằm riêng tư, đệm êm, sạch sẽ",
    },
    {
      iconName: "badgeDollarSign",
      title: "Giá vé",
      desc: "Minh bạch",
      sub: "300.000đ/vé – Cam kết không chèn ép giá",
    },
    {
      iconName: "clock",
      title: "Lộ trình",
      desc: "Cố định",
      sub: "Hà Nội ⇄ Mộc Châu chuẩn biểu đồ giờ",
    },
    {
      iconName: "package",
      title: "Dịch vụ",
      desc: "Nhận gửi hàng",
      sub: "Vận chuyển đặc sản Mộc Châu về Hà Nội nhanh",
    },
  ],
  heroImage: {
    src: "/images/actual/xe-bac-son-chinh-dien.jpg",
    alt: "Xe khách Bắc Sơn Cường Nguyệt đón khách tuyến Hà Nội đi Mộc Châu",
  },
  gallery: [
    {
      src: "/images/actual/xe-bac-son-than-xe.jpg",
      alt: "Toàn thân xe khách Bắc Sơn Cường Nguyệt sang trọng và hiện đại",
      title: "Thân xe cao cấp hiện đại",
      tag: "Ngoại thất",
    },
    {
      src: "/images/actual/noi-that-khoang-giuong-4.jpg",
      alt: "Giường nằm êm ái, bọc da sạch sẽ khử khuẩn",
      title: "Giường nằm êm ái",
      tag: "Nội thất",
    },
    {
      src: "/images/actual/noi-that-khoang-giuong-5.jpg",
      alt: "Khoang xe tiện nghi với cổng sạc, rèm che và đèn đọc sách",
      title: "Tiện ích cá nhân",
      tag: "Tiện nghi",
    },
  ],
  faq: [
    {
      question: "Xe Hà Nội đi Mộc Châu xuất phát từ đâu và lúc mấy giờ?",
      answer:
        "Xe xuất bến tại Bến xe Mỹ Đình (Hà Nội) với nhiều khung giờ thuận tiện từ sáng sớm đến đêm muộn. Bạn hãy bấm 'Gọi đặt vé' 0848.755.766 hoặc điền form để nhà xe giữ chỗ ưng ý.",
    },
    {
      question: "Giá vé xe Hà Nội - Mộc Châu bao nhiêu một người?",
      answer:
        "Giá vé tham khảo hiện tại là 300.000đ/vé cho 1 giường nằm 34 chỗ chất lượng cao, bao gồm bảo hiểm hành khách, nước suối và khăn lạnh.",
    },
    {
      question: "Nhà xe có trả khách tại các khách sạn hay resort ở Mộc Châu không?",
      answer:
        "Có. Xe hỗ trợ trả khách tại trung tâm thị trấn Mộc Châu, ngã ba Nông Trường Mộc Châu và các điểm dừng thuận lợi cho du khách di chuyển về homestay/khách sạn.",
    },
    {
      question: "Cách đăng ký giữ chỗ trước khi đi Mộc Châu?",
      answer:
        "Quý khách chỉ cần để lại thông tin Họ tên, SĐT và ngày đi tại form bên dưới, nhân viên điều hành sẽ gọi điện xác nhận chỗ ngồi và hướng dẫn đón xe ngay trong 5 phút.",
    },
  ],
};

export const lienHeRouteData: ContactRouteData = {
  slug: "lien-he",
  title: "Liên hệ Bắc Sơn Cường Nguyệt",
  subtitle: "Tư vấn lộ trình - Đặt vé - Gửi hàng - Hỗ trợ khách hàng",
  description:
    "Đội ngũ chăm sóc khách hàng và tổng đài điều hành nhà xe Bắc Sơn Cường Nguyệt luôn sẵn sàng lắng nghe, tư vấn lịch trình và hỗ trợ hành khách 24/7.",
  hotline: "0848755766",
  hotlineFormatted: "0848.755.766",
  hotline2: "0974004888",
  hotline2Formatted: "0974.004.888",
  zalo: "0848755766",
  address: "Số 03 đường Nguyễn Trãi, Tổ 6, Phường Quyết Thắng, TP Sơn La",
  offices: [
    {
      name: "Trụ sở & Văn phòng TP. Sơn La",
      address: "Số 03 đường Nguyễn Trãi, Tổ 6, P. Quyết Thắng, TP. Sơn La",
      hotline: "0848.755.766",
      note: "Phòng vé, nhận gửi hàng và điểm đón trung tâm TP",
    },
    {
      name: "Văn phòng Bến xe Mỹ Đình (Hà Nội)",
      address: "Bến xe Mỹ Đình, Q. Nam Từ Liêm, TP. Hà Nội",
      hotline: "0974.004.888",
      note: "Quầy vé tại bến và điểm gửi nhận hàng hai chiều",
    },
    {
      name: "Văn phòng Thị trấn Mộc Châu",
      address: "Trung tâm Thị trấn Mộc Châu, Tỉnh Sơn La",
      hotline: "0848.755.766",
      note: "Điểm đón khách du lịch và giao nhận bưu phẩm",
    },
    {
      name: "Trạm điều hành Hòa Bình",
      address: "Dọc Quốc lộ 6, TP. Hòa Bình",
      hotline: "0848.755.766",
      note: "Trạm dừng nghỉ và tiếp nhận hàng hóa trung chuyển",
    },
  ],
  highlights: [
    {
      iconName: "bus",
      title: "Tuyến cố định",
      desc: "Hà Nội ⇄ Sơn La",
      sub: "Lịch chạy chuẩn xác 10+ chuyến/ngày",
    },
    {
      iconName: "badgeDollarSign",
      title: "Giá niêm yết",
      desc: "Minh bạch công khai",
      sub: "Cam kết không thu sai quy định",
    },
    {
      iconName: "clock",
      title: "Tổng đài 24/7",
      desc: "Phản hồi nhanh chóng",
      sub: "Hỗ trợ khách hàng trước, trong và sau chuyến",
    },
    {
      iconName: "package",
      title: "Hàng hóa bưu kiện",
      desc: "Giao nhận tận tâm",
      sub: "Bảo quản an toàn, hỗ trợ giao tận nơi",
    },
  ],
  faq: [
    {
      question: "Làm thế nào để liên hệ đặt vé nhanh nhất?",
      answer:
        "Quý khách có thể gọi trực tiếp tổng đài hotline 0848.755.766 hoặc nhắn tin qua Zalo số 0848.755.766 để được nhân viên tư vấn chỗ ngồi còn trống và xác nhận nhanh nhất.",
    },
    {
      question: "Tôi muốn gửi hàng từ Hà Nội lên Sơn La thì liên hệ ở đâu?",
      answer:
        "Quý khách có thể mang hàng trực tiếp ra văn phòng Bến xe Mỹ Đình hoặc gọi hotline 0974.004.888 để được tài xế đón hàng dọc trục đường Đại lộ Thăng Long.",
    },
    {
      question: "Chính sách đổi trả hoặc hủy vé của nhà xe như thế nào?",
      answer:
        "Nhà xe luôn tạo điều kiện tối đa cho hành khách khi có việc đột xuất. Quý khách vui lòng gọi báo trước giờ xe chạy ít nhất 2–3 tiếng để được đổi sang chuyến kế tiếp hoàn toàn miễn phí.",
    },
  ],
};

export const transportRoutes: {
  sonLaHaNoi: TransportRoute;
  haNoiMocChau: TransportRoute;
  [key: string]: TransportRoute;
} = {
  sonLaHaNoi: sonLaHaNoiRoute,
  haNoiMocChau: haNoiMocChauRoute,
};
