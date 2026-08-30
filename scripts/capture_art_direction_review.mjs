import fs from "fs";
import path from "path";
import { chromium } from "playwright-core";

const BASE_URL = "http://localhost:5173";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("UI_ART_DIRECTION_REVIEW");

fs.mkdirSync(OUT_DIR, { recursive: true });

const viewports = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-1024", width: 1024, height: 1366 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-360", width: 360, height: 800 },
];

async function captureAll() {
  console.log("Starting visual validation captures...");
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // Full page
    await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}-full.png`), fullPage: true });

    // Viewport fold
    await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}-fold.png`) });

    // Hero section specifically
    const heroEl = page.locator("#top");
    if ((await heroEl.count()) > 0) {
      await heroEl.screenshot({ path: path.join(OUT_DIR, `${vp.name}-hero.png`) });
    }

    // Story section specifically
    const storyEl = page.locator("#hanh-trinh");
    if ((await storyEl.count()) > 0) {
      await storyEl.screenshot({ path: path.join(OUT_DIR, `${vp.name}-story.png`) });
    }

    console.log(`✓ Captured ${vp.name}`);
    await context.close();
  }

  await browser.close();
  console.log("\nAll art direction review captures saved to UI_ART_DIRECTION_REVIEW/");
}

captureAll().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
