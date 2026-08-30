import { images } from "@/data/images";
import { Section } from "./primitives";

export function SonLaStory() {
  return (
    <Section id="son-la-dong-hanh" tone="warm">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Editorial Photo */}
        <div className="relative lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white p-2 shadow-[0_2px_12px_rgba(43,43,43,0.06)]">
            <img
              src={images.busDeparting.src}
              alt={images.busDeparting.alt}
              width={images.busDeparting.width}
              height={images.busDeparting.height}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          </div>
          <p className="mt-2.5 text-center text-xs text-[#8F857B]">
            Xe khách Bắc Sơn Cường Nguyệt xuất bến trên hành trình quen thuộc về Sơn La
          </p>
        </div>

        {/* Story Text */}
        <div className="lg:col-span-6 lg:pl-4">
          <span className="eyebrow-chip">Đồng hành cùng Sơn La</span>
          <h2 className="mt-4 text-2xl font-black leading-tight text-[#2B2B2B] sm:text-3xl lg:text-4xl">
            Sơn La đổi thay, những chuyến trở về vẫn đong đầy cảm xúc
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#6B635B] sm:text-base">
            <p>
              Thành phố lớn lên từng ngày. Những cung đường rộng mở hơn, nhịp sống nhanh hơn, khoảng
              cách giữa Sơn La và Hà Nội dường như cũng ngày một gần lại.
            </p>
            <p>
              Trên sự chuyển động không ngừng ấy, mỗi dịp lễ Tết hay Quốc khánh, những chuyến xe lại
              rộn ràng mang theo bao niềm mong ước:
            </p>

            <ul className="space-y-2 border-l-2 border-[#D62828] pl-4 text-sm font-medium text-[#2B2B2B] sm:text-base">
              <li>• Đưa những bạn trẻ trở về sau những tuần học tập căng thẳng,</li>
              <li>• Đưa những người lao động về sum họp bên mâm cơm gia đình,</li>
              <li>• Đón du khách về thăm những đồi chè, bản làng Mộc Châu - Sơn La,</li>
              <li>• Và chở theo biết bao kiện hàng gửi gắm tình cảm gửi về quê nhà.</li>
            </ul>

            <p className="pt-2 text-sm font-bold text-[#D62828] sm:text-base">
              Bắc Sơn Cường Nguyệt trân trọng được góp một phần nhỏ trong hành trình kết nối con
              người với Sơn La.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
