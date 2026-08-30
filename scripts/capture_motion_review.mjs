import fs from "fs";
import path from "path";
import { chromium } from "playwright-core";

const BASE_URL = "http://localhost:5173";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("UI_MOTION_REVIEW");

fs.mkdirSync(OUT_DIR, { recursive: true });

async function capture() {
  console.log("Capturing visual review for Cinematic Motion & Interaction System...");
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
    await page.waitForTimeout(800);

    // Initial Hero
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-1440-hero.png") });

    // Scroll to Vehicle 360 Viewer
    const viewerEl = page.locator("#kham-pha-xe");
    if ((await viewerEl.count()) > 0) {
      await viewerEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await viewerEl.screenshot({ path: path.join(OUT_DIR, "desktop-1440-vehicle-viewer.png") });
    }

    // Scroll to Full page
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-1440-full.png"), fullPage: true });
    console.log("✓ Captured Desktop 1440");
    await context.close();
  }

  // 2. Mobile 390
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    // Initial mobile fold
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390-fold.png") });

    // Scroll down to test sticky CTA
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390-sticky-cta.png") });

    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390-full.png"), fullPage: true });
    console.log("✓ Captured Mobile 390");
    await context.close();
  }

  await browser.close();
  console.log("All visual validation screenshots saved to UI_MOTION_REVIEW/");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
