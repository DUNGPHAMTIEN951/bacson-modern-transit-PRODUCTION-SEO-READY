import { businessInfo, legalInfo, siteConfig } from "@/data/business";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: legalInfo.company,
  brand: businessInfo.shortName,
  url: siteConfig.domain,
  logo: siteConfig.ogImage,
  description: businessInfo.description,
  telephone: businessInfo.phoneE164,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: businessInfo.phoneE164,
    contactType: "customer service",
    areaServed: "VN",
    availableLanguage: "Vietnamese",
  },
  areaServed: businessInfo.areaServed,
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: businessInfo.shortName,
  description: businessInfo.description,
  url: siteConfig.domain,
  telephone: businessInfo.phoneE164,
  areaServed: businessInfo.areaServed,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sơn La",
    streetAddress: legalInfo.headOffice,
    addressCountry: "VN",
  },
  parentOrganization: {
    "@type": "Organization",
    name: legalInfo.company,
  },
};

export function createFaqSchema(
  items: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
