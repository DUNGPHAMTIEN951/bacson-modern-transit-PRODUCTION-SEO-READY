import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const checks = [];
const check = (name, ok, detail = "") => checks.push({ name, ok, detail });

const business = read("src/data/business.ts");
const index = read("src/routes/index.tsx");
const robots = read("public/robots.txt");
const sitemap = read("public/sitemap.xml");

const domain = "https://xebacsoncuongnguyet.com";
const canonical = `${domain}/`;

check("canonical is production root", business.includes(`canonical: "${canonical}"`));
check("index emits canonical", index.includes('rel: "canonical"'));
check("index emits meta description", index.includes('name: "description"'));
check("index emits index/follow robots", index.includes("index,follow"));
check(
  "Open Graph image is production-hosted",
  business.includes(`${domain}/og-bac-son-cuong-nguyet.png`),
);
check("OG image file exists", existsSync(resolve(root, "public/og-bac-son-cuong-nguyet.png")));
check("robots references sitemap", robots.includes(`${domain}/sitemap.xml`));
check(
  "sitemap contains root only",
  sitemap.includes(`<loc>${canonical}</loc>`) &&
    !sitemap.includes("xe-khach-ha-noi-son-la-bac-son"),
);
check("web manifest exists", existsSync(resolve(root, "public/site.webmanifest")));
check("security headers file exists", existsSync(resolve(root, "public/_headers")));
check(
  "JSON-LD present",
  index.includes("application/ld+json") && index.includes('"@type": "LocalBusiness"'),
);
check("legacy green/gold canonical absent", !business.includes("/xe-khach-ha-noi-son-la-bac-son/"));

let failed = 0;
for (const c of checks) {
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.name}${c.detail ? ` — ${c.detail}` : ""}`);
  if (!c.ok) failed++;
}
if (failed) {
  console.error(`\n${failed} SEO verification check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} SEO verification checks passed.`);
