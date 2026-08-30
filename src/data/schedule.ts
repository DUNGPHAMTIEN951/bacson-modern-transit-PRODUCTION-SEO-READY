/**
 * Lịch chạy - giữ nguyên các khung giờ có trong website nguồn.
 * VERIFY BEFORE PRODUCTION - chủ nhà xe cần xác nhận lại toàn bộ giờ xuất bến.
 */

export type Trip = { time: string; night?: boolean };

export type ScheduleCard = {
  id: string;
  title: string;
  from: string;
  depart: string;
  routeLine: string;
  duration: string;
  note: string;
  trips: Trip[];
};

export const schedule: ScheduleCard[] = [
  {
    id: "son-la-my-dinh",
    title: "Sơn La → Mỹ Đình (Hà Nội)",
    from: "Sơn La",
    depart: "Bến xe khách Sơn La",
    routeLine:
      "BX Sơn La – Hát Lót – Yên Châu – Mộc Châu – Mai Châu – Hòa Bình – Đại lộ Thăng Long – BX Mỹ Đình",
    duration: "Khoảng 7 giờ cho chặng Sơn La – Mỹ Đình.",
    note: "Nên gọi xác nhận trước khi ra bến, đặc biệt vào cuối tuần hoặc dịp cao điểm.",
    trips: [
      { time: "6h15" },
      { time: "8h30" },
      { time: "10h00" },
      { time: "12h15" },
      { time: "13h30" },
      { time: "17h00" },
      { time: "19h30", night: true },
      { time: "21h30", night: true },
      { time: "22h30", night: true },
      { time: "23h00", night: true },
    ],
  },
  {
    id: "my-dinh-son-la",
    title: "Mỹ Đình (Hà Nội) → Sơn La",
    from: "Hà Nội",
    depart: "Bến xe Mỹ Đình",
    routeLine:
      "BX Mỹ Đình – Đại lộ Thăng Long – Hòa Bình – Mai Châu – Mộc Châu – Yên Châu – Hát Lót – BX Sơn La",
    duration: "Khoảng 7 giờ cho chặng Mỹ Đình – Sơn La.",
    note: "Gọi trước để được tư vấn điểm đón thuận tiện trên lộ trình.",
    trips: [
      { time: "7h45" },
      { time: "9h00" },
      { time: "10h45" },
      { time: "11h30" },
      { time: "13h00" },
      { time: "15h30" },
      { time: "17h00" },
      { time: "19h30", night: true },
      { time: "21h15", night: true },
      { time: "22h30", night: true },
      { time: "23h00", night: true },
    ],
  },
];

/** Lộ trình chính - dùng cho timeline. */
export const routeStops = [
  { name: "Bến xe Mỹ Đình", major: true },
  { name: "Đại lộ Thăng Long" },
  { name: "Hòa Bình" },
  { name: "Mai Châu" },
  { name: "Mộc Châu", major: true },
  { name: "Yên Châu" },
  { name: "Hát Lót" },
  { name: "Bến xe Sơn La", major: true },
] as { name: string; major?: boolean }[];
