import { BadgeCheck, Building2, FileCheck2, ShieldCheck } from "lucide-react";
import { legalInfo } from "@/data/business";
import { Section, SectionHead } from "./primitives";

const items = [
  { icon: Building2, label: "Đơn vị vận tải", value: legalInfo.company },
  { icon: FileCheck2, label: "Giấy phép KDVT", value: legalInfo.transportLicense },
  { icon: BadgeCheck, label: "Mã số doanh nghiệp", value: legalInfo.businessCode },
  { icon: ShieldCheck, label: "Cơ quan cấp phép", value: legalInfo.issuedBy },
];

export function Credentials() {
  return (
    <Section id="ho-so-phap-ly" tone="alt">
      <SectionHead
        eyebrow="Hồ sơ pháp lý"
        title="Nhà xe hoạt động có giấy phép đầy đủ"
        sub="Thông tin trích từ Giấy phép kinh doanh vận tải bằng xe ô tô do Sở Giao thông Vận tải tỉnh Sơn La cấp."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <article
            key={it.label}
            className="flex items-start gap-4 rounded-xl border border-[#E8DDD0] bg-white p-5 shadow-[0_1px_3px_rgba(43,43,43,0.04)]"
          >
            <span
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#FFF2C9] text-[#D62828]"
              aria-hidden="true"
            >
              <it.icon className="size-5 text-[#D62828]" />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-wider text-[#6B635B]">
                {it.label}
              </span>
              <span className="mt-1 block text-sm font-extrabold leading-relaxed text-[#2B2B2B]">
                {it.value}
              </span>
            </span>
          </article>
        ))}
      </div>

      <p className="mt-5 rounded-xl border border-[#E8DDD0] bg-white p-4 text-sm leading-relaxed text-[#6B635B] shadow-[0_1px_3px_rgba(43,43,43,0.04)]">
        Trụ sở doanh nghiệp: {legalInfo.headOffice}. Loại hình được phép khai thác:{" "}
        {legalInfo.scope}. Bản gốc giấy phép được xuất trình trực tiếp tại văn phòng nhà xe khi
        khách hàng có nhu cầu kiểm chứng.
      </p>
    </Section>
  );
}
