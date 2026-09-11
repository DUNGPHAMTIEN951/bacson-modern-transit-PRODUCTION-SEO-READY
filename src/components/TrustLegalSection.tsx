import React from "react";

interface LegalDocument {
  title: string;
  image: string;
  alt: string;
}

const documents: LegalDocument[] = [
  {
    title: "Giấy chứng nhận đăng ký doanh nghiệp",
    image: "/images/trust/giay-chung-nhan-doanh-nghiep.webp",
    alt: "Giấy chứng nhận đăng ký doanh nghiệp Bắc Sơn Cường Nguyệt",
  },
  {
    title: "Giấy phép kinh doanh vận tải",
    image: "/images/trust/giay-phep-kinh-doanh-van-tai.webp",
    alt: "Giấy phép kinh doanh vận tải Bắc Sơn Cường Nguyệt",
  },
];

export default function TrustLegalSection() {
  return (
    <section id="phap-ly" className="trust-legal-section">
      <div className="trust-legal-header">
        <h2>Thông tin doanh nghiệp</h2>
        <p>
          Bắc Sơn Cường Nguyệt hoạt động trong lĩnh vực vận tải hành khách với
          thông tin doanh nghiệp minh bạch, phục vụ các tuyến Hà Nội - Mộc Châu
          - Sơn La.
        </p>
      </div>

      <div className="trust-legal-grid">
        {documents.map((document) => (
          <article key={document.title} className="trust-legal-card">
            <img
              src={document.image}
              loading="lazy"
              alt={document.alt}
            />
            <h3>{document.title}</h3>
          </article>
        ))}
      </div>

      <ul className="trust-legal-points">
        <li>Có đăng ký doanh nghiệp</li>
        <li>Có giấy phép kinh doanh vận tải</li>
        <li>Thông tin tuyến xe được cung cấp trực tiếp từ nhà xe</li>
      </ul>
    </section>
  );
}
