import { readFileSync } from "node:fs";

const reportPath = process.argv[2];
if (!reportPath) {
  throw new Error("Usage: node scripts/report-lighthouse.mjs <report.json>");
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));
const audits = report.audits;
const score = (name) => Math.round((report.categories[name]?.score ?? 0) * 100);
const audit = (name) => ({
  value: audits[name]?.numericValue,
  display: audits[name]?.displayValue,
  score: audits[name]?.score,
});

const opportunities = Object.values(audits)
  .filter((item) => item?.details?.type === "opportunity" && (item.numericValue ?? 0) > 0)
  .map((item) => ({
    id: item.id,
    title: item.title,
    display: item.displayValue,
    savingsMs: item.details?.overallSavingsMs ?? 0,
    savingsBytes: item.details?.overallSavingsBytes ?? 0,
  }))
  .sort((a, b) => b.savingsMs - a.savingsMs)
  .slice(0, 10);

console.log(
  JSON.stringify(
    {
      categories: {
        performance: score("performance"),
        accessibility: score("accessibility"),
        bestPractices: score("best-practices"),
        seo: score("seo"),
      },
      metrics: {
        fcp: audit("first-contentful-paint"),
        lcp: audit("largest-contentful-paint"),
        speedIndex: audit("speed-index"),
        tbt: audit("total-blocking-time"),
        cls: audit("cumulative-layout-shift"),
        tti: audit("interactive"),
      },
      diagnostics: {
        payload: audit("total-byte-weight"),
        dom: audit("dom-size"),
        mainThread: audit("mainthread-work-breakdown"),
        lcpElement: audits["largest-contentful-paint-element"]?.details?.items?.[0],
        lcpBreakdown: audits["lcp-breakdown-insight"]?.details,
        imageDelivery: audits["image-delivery-insight"]?.details,
        thirdParties: audits["third-parties-insight"]?.details,
        unusedJavaScript: audits["unused-javascript"]?.details?.items?.slice(0, 12),
      },
      opportunities,
    },
    null,
    2,
  ),
);
