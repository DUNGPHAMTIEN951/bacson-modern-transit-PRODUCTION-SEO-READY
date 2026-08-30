/** Nội dung tĩnh khác: tiện ích, lý do chọn, FAQ, quy trình gửi hàng. */

export const amenities = [
  {
    icon: "bed",
    title: "Giường nằm sạch sẽ",
    desc: "Không gian nghỉ ngơi phù hợp cho hành trình dài.",
  },
  { icon: "blanket", title: "Chăn đắp", desc: "Chăn được chuẩn bị cho khách trên mỗi chuyến." },
  { icon: "water", title: "Nước uống", desc: "Nước uống phục vụ hành khách trên xe." },
  { icon: "wifi", title: "WIFI", desc: "Kết nối WIFI phục vụ khách trong hành trình." },
  {
    icon: "curtain",
    title: "Cabin riêng tư",
    desc: "Cabin tầng trên và tầng dưới có rèm che riêng.",
  },
  {
    icon: "luggage",
    title: "Khoang hành lý",
    desc: "Khoang hành lý rộng, nhận thêm hàng gửi theo chuyến.",
  },
] as const;

export const whyUs = [
  {
    title: "Chuyên tuyến Hà Nội – Mộc Châu – Sơn La",
    desc: "Tập trung khai thác một tuyến cố định trên trục Tây Bắc.",
  },
  {
    title: "Xe giường nằm tiện nghi",
    desc: "Cabin tầng trên, tầng dưới, rèm riêng và tiện ích cơ bản trên xe.",
  },
  { title: "Nhiều chuyến trong ngày", desc: "Có chuyến từ sáng tới tối ở cả hai chiều." },
  {
    title: "Tài xế quen tuyến Tây Bắc",
    desc: "Đội ngũ tài xế chạy thường xuyên trên lộ trình Mỹ Đình – Sơn La.",
  },
  {
    title: "Hỗ trợ gửi hàng",
    desc: "Nhận giấy tờ, bưu kiện, hàng tiêu dùng và nông sản theo chuyến.",
  },
  { title: "Hotline dễ liên hệ", desc: "Gọi điện hoặc nhắn Zalo để hỏi lịch, giá và giữ chỗ." },
  {
    title: "Điểm đón trả rõ ràng",
    desc: "Bến xe Mỹ Đình ở đầu Hà Nội và bến xe khách Sơn La ở đầu Sơn La.",
  },
  {
    title: "Hỗ trợ nhanh qua Zalo",
    desc: "Gửi ảnh hàng, hỏi cước và xác nhận chuyến ngay trên Zalo.",
  },
] as const;

export const cargoSteps = [
  {
    step: "1",
    title: "Liên hệ Zalo/điện thoại",
    desc: "Chụp ảnh hàng, ghi điểm gửi – nhận và nhắn cho nhà xe.",
  },
  {
    step: "2",
    title: "Cung cấp thông tin hàng và điểm nhận",
    desc: "Nhà xe tư vấn chuyến gần nhất và báo cước trước khi gửi.",
  },
  {
    step: "3",
    title: "Gửi hàng tại văn phòng hoặc điểm hẹn",
    desc: "Mang hàng tới điểm nhận hoặc hẹn điểm giao phù hợp trên lộ trình.",
  },
  {
    step: "4",
    title: "Người nhận lấy hàng",
    desc: "Đối chiếu thông tin liên hệ khi nhận hàng tại bến.",
  },
] as const;

export const faqs = [
  {
    q: "Xe Hà Nội Sơn La đi mất bao lâu?",
    a: "Thời gian tham khảo khoảng 7 giờ cho quãng đường khoảng 320 km, có thể thay đổi tùy giao thông và điểm đón trả.",
  },
  {
    q: "Xe Bắc Sơn Cường Nguyệt đón khách ở đâu tại Hà Nội?",
    a: "Chiều Hà Nội → Sơn La khởi hành tại Bến xe Mỹ Đình. Nếu bạn ở dọc lộ trình, hãy gọi trước để nhà xe tư vấn điểm đón phù hợp.",
  },
  {
    q: "Xe có đi qua Mộc Châu không?",
    a: "Có. Tuyến Hà Nội – Sơn La đi qua Hòa Bình, Mai Châu, Mộc Châu, Yên Châu và Hát Lót trước khi tới Sơn La.",
  },
  {
    q: "Có xe chạy buổi tối không?",
    a: "Có. Theo lịch hiện tại, chiều Mỹ Đình → Sơn La có các chuyến 19h30, 21h15, 22h30, 23h00; chiều Sơn La → Mỹ Đình có 19h30, 21h30, 22h30, 23h00.",
  },
  {
    q: "Nhà xe có nhận gửi hàng Hà Nội Sơn La không?",
    a: "Có. Nhà xe nhận gửi giấy tờ, bưu kiện, hàng tiêu dùng, nông sản và một số hàng cồng kềnh theo chuyến. Cước phí được báo trước qua điện thoại hoặc Zalo.",
  },
  {
    q: "Đặt vé bằng cách nào?",
    a: "Gọi hotline 0848.755.766 - 0384.755.766 hoặc nhắn Zalo 0848.755.766 để hỏi lịch, giá vé và giữ chỗ.",
  },
  {
    q: "Có thể đón khách dọc đường không?",
    a: "Bạn nên gọi trước để nhà xe tư vấn điểm đón thuận tiện trên lộ trình Mỹ Đình – Hòa Bình – Mai Châu – Mộc Châu – Yên Châu – Sơn La.",
  },
  {
    q: "Xe Hà Nội đi Sơn La giá bao nhiêu?",
    a: "Mức niêm yết hiện tại cho chặng Hà Nội – Sơn La là 380.000đ. Giá có thể thay đổi theo thời điểm; nên gọi hotline 0848.755.766 - 0384.755.766 để xác nhận trước khi đặt.",
  },
] as const;
