import fs from "fs";
import path from "path";
import { chromium } from "playwright-core";

const BASE_URL = "http://localhost:5173";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("UI_SEASONAL_29");

fs.mkdirSync(OUT_DIR, { recursive: true });

async function verifyVisuals() {
  console.log("Verifying 2/9 National Day Seasonal Redesign...");
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // 1. Desktop 1440
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-1440-full.png"), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-1440-hero.png") });
    console.log("Captured Desktop 1440");
    await context.close();
  }

  // 2. Mobile 390
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390-full.png"), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390-hero.png") });
    console.log("Captured Mobile 390");
    await context.close();
  }

  await browser.close();
  console.log("✓ Verification captures complete in UI_SEASONAL_29/");
}

verifyVisuals().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
