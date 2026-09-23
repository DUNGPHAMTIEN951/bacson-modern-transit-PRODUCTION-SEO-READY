import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const baseUrl = process.argv[2] || "http://127.0.0.1:8080/";
const outputDir = resolve(process.argv[3] || "verification");
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 });

  const h1 = (await page.locator("h1").first().innerText()).replace(/\s+/g, " ").trim();
  if (!h1.includes("Xe Hà Nội – Mộc Châu") || !h1.includes("Sơn La mỗi ngày")) {
    throw new Error(`H1 chưa đúng ý định tìm kiếm: ${h1}`);
  }

  const quickForm = page.locator('form[aria-label="Chọn nhanh tuyến và ngày đi"]');
  await quickForm.waitFor({ state: "visible" });
  const formBox = await quickForm.boundingBox();
  if (!formBox || formBox.y >= 844) {
    throw new Error("Bộ chọn nhanh không nằm trong vùng đầu trang mobile.");
  }

  await page.screenshot({
    path: resolve(outputDir, "mobile-390-hero-after.png"),
    fullPage: false,
  });

  await quickForm.locator('select[name="route"]').selectOption({ label: "Hà Nội → Mộc Châu" });
  await quickForm.locator('button[type="submit"]').click();
  const modal = page.getByRole("dialog");
  await modal.waitFor({ state: "visible" });

  const requiredFields = [
    ["name", "name"],
    ["phone", "tel"],
    ["email", "email"],
    ["pickup", "street-address"],
  ];
  for (const [name, autocomplete] of requiredFields) {
    const field = modal.locator(`[name="${name}"]`);
    if ((await field.count()) !== 1) throw new Error(`Thiếu field name=${name}`);
    if ((await field.getAttribute("autocomplete")) !== autocomplete) {
      throw new Error(`Autocomplete không đúng cho ${name}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        status: "PASS",
        h1,
        quickFormTop: Math.round(formBox.y),
        modalPrefillRoute: await modal.locator('select[name="route"]').inputValue(),
        screenshot: resolve(outputDir, "mobile-390-hero-after.png"),
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
