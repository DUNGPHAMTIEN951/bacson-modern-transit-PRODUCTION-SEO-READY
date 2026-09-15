import { useState } from "react";
import { ShieldCheck, Check, FileCheck2, Building2, Eye, X, Sparkles } from "lucide-react";
import { legalInfo } from "@/data/business";

interface LegalDoc {
  title: string;
  sub: string;
  src: string;
  badge: string;
}

const legalDocs: LegalDoc[] = [
  {
    title: "Giấy chứng nhận đăng ký doanh nghiệp",
    sub: `Mã số doanh nghiệp: ${legalInfo.businessCode}`,
    src: "/images/actual/giay-dang-ky-doanh-nghiep.jpg",
    badge: "Bản chụp gốc ĐKKD",
  },
  {
    title: "Giấy phép kinh doanh vận tải",
    sub: `Số GP: ${legalInfo.transportLicense} - ${legalInfo.issuedBy}`,
    src: "/images/actual/giay-phep-kinh-doanh-van-tai.jpg",
    badge: "Bản chụp gốc Sở GTVT",
  },
];

const trustPoints = [
  {
    title: "Có đăng ký doanh nghiệp",
    desc: `${legalInfo.company} – Mã số doanh nghiệp/MST: ${legalInfo.businessCode}, hoạt động hợp pháp và minh bạch.`,
  },
  {
    title: "Có giấy phép vận tải",
    desc: `Giấy phép kinh doanh vận tải bằng xe ô tô số ${legalInfo.transportLicense} do Sở GTVT cấp, phương tiện kiểm định định kỳ.`,
  },
  {
    title: "Hoạt động tuyến cố định",
    desc: "Chuyên tuyến Sơn La ⇄ Hà Nội (Mỹ Đình) chạy theo biểu đồ giờ đã đăng ký, điểm đón trả minh bạch trên Quốc lộ 6.",
  },
  {
    title: "Hỗ trợ khách hàng 24/7",
    desc: "Đội ngũ tổng đài viên và lái xe chuyên tuyến đèo dốc Tây Bắc sẵn sàng giải đáp, xếp chỗ thuận lợi và giữ chỗ chu đáo.",
  },
];

export function RouteTrust() {
  const [selectedDoc, setSelectedDoc] = useState<LegalDoc | null>(null);

  return (
    <section className="mt-12 sm:mt-16 rounded-[32px] sm:rounded-[40px] border-2 border-[#EAD9C6] bg-gradient-to-br from-[#FFFDF9] via-[#FFF8EE] to-[#FFF4E8] p-6 sm:p-8 md:p-12 shadow-[0_16px_48px_rgba(58,33,27,0.06)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* CỘT TRÁI: TIÊU ĐỀ & 4 ĐIỂM CAM KẾT UY TÍN (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#1B8341]/20 bg-[#E8F8EE] px-3.5 py-1 text-xs font-bold text-[#1B8341] shadow-2xs">
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span>HỒ SƠ PHÁP LÝ & CAM KẾT VẬN TẢI</span>
          </div>

          <h2
            className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-black text-[#3A211B] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Uy tín Bắc Sơn Cường Nguyệt
          </h2>

          <p className="mt-2 text-base sm:text-lg font-bold text-[#D51F26]">
            Hơn cả một chuyến xe – Là sự tin cậy tuyệt đối
          </p>

          <p className="mt-3 text-sm sm:text-base text-[#795F55] leading-relaxed">
            Chúng tôi hiểu rằng sự an tâm của hành khách là ưu tiên số một. Mọi phương tiện, tuyến
            đường và lịch trình đều được đăng ký minh bạch với cơ quan quản lý nhà nước.
          </p>

          {/* 4 Tiêu chí uy tín theo đúng yêu cầu */}
          <div className="mt-6 space-y-3.5">
            {trustPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-2xl border border-[#EAD9C6] bg-white/90 p-4 shadow-2xs backdrop-blur-xs hover:border-[#D51F26]/30 transition"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E8F8EE] text-[#1B8341] border border-[#1B8341]/20 mt-0.5 shadow-2xs">
                  <Check className="size-4 stroke-[3]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#3A211B]">{point.title}</h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-[#795F55] leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Trụ sở chính */}
          <div className="mt-6 flex items-center gap-2 text-xs text-[#8C6D58]">
            <Building2 className="size-4 text-[#D51F26]" aria-hidden="true" />
            <span>Trụ sở chính: {legalInfo.headOffice}</span>
          </div>
        </div>

        {/* CỘT PHẢI: 2 THẺ THUMBNAIL ẢNH THẬT GIẤY TỜ PHÁP LÝ (6 cols) */}
        <div className="lg:col-span-6">
          <div className="rounded-[28px] sm:rounded-3xl border border-[#EAD9C6] bg-white p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-[#EAD9C6]/80 pb-3.5">
              <div className="flex items-center gap-2">
                <FileCheck2 className="size-5 text-[#D51F26]" />
                <h3 className="text-sm font-bold text-[#3A211B] uppercase tracking-wider">
                  Chứng từ gốc nhà xe
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C6D58] bg-[#FFF0C3] border border-[#EAB83E]/30 px-3 py-1 rounded-full">
                <Sparkles className="size-3 text-[#D51F26]" /> Nhấp để phóng to
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {legalDocs.map((doc, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedDoc(doc)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-[#EAD9C6] bg-[#FFFDF9] p-2.5 transition-all duration-300 hover:border-[#D51F26] hover:shadow-lg"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src={doc.src}
                      alt={doc.title}
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center backdrop-blur-2xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#3A211B] shadow-md">
                        <Eye className="size-3.5 text-[#D51F26]" /> Xem rõ
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-1">
                    <span className="inline-block rounded-md bg-[#FBE2DE] px-2 py-0.5 text-[11px] font-bold text-[#D51F26]">
                      {doc.badge}
                    </span>
                    <h4
                      className="mt-1.5 text-xs sm:text-sm font-bold text-[#3A211B] line-clamp-2 leading-snug"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {doc.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-[#795F55] line-clamp-1">{doc.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-[#FFF8EE] border border-[#EAD9C6]/60 p-3 text-center text-xs text-[#795F55]">
              🔒 Bản gốc các văn bản pháp lý được lưu trữ tại văn phòng nhà xe và xuất trình khi
              hành khách có nhu cầu kiểm tra.
            </div>
          </div>
        </div>
      </div>

      {/* Modal Phóng to tài liệu pháp lý khi click */}
      {selectedDoc && (
        <div
          onClick={() => setSelectedDoc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden rounded-[28px] sm:rounded-[32px] bg-white shadow-2xl border border-neutral-200"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 p-4 sm:p-5 bg-[#FFF8EE]">
              <div>
                <span className="inline-block rounded-md bg-[#FBE2DE] px-2.5 py-0.5 text-xs font-bold text-[#D51F26]">
                  {selectedDoc.badge}
                </span>
                <h3
                  className="mt-1 text-base sm:text-xl font-bold text-[#3A211B]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {selectedDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="flex size-10 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 hover:bg-[#D51F26] hover:text-white transition-colors"
                aria-label="Đóng xem tài liệu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-neutral-100 flex items-center justify-center">
              <img
                src={selectedDoc.src}
                alt={selectedDoc.title}
                className="max-h-[72vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
