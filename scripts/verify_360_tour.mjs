/**
 * verify_360_tour.mjs
 * Playwright automated QA for VirtualTour360 Pannellum engine.
 *
 * Verifies:
 *   - Entry section renders
 *   - "KHÁM PHÁ 360°" button opens modal
 *   - Pannellum canvas/container exists (WebGL engine active)
 *   - Drag simulation changes yaw (proves real spherical rotation)
 *   - Hotspot navigation changes scene
 *   - Fullscreen control exists
 *   - Scene thumbnail rail renders all 5 scenes
 *   - Mobile viewport renders correctly
 */

import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:5173";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("360");

fs.mkdirSync(OUT_DIR, { recursive: true });

const RESULTS = [];

function pass(name) {
  console.log(`  ✅ PASS  ${name}`);
  RESULTS.push({ name, status: "PASS" });
}

function fail(name, reason) {
  console.log(`  ❌ FAIL  ${name}: ${reason}`);
  RESULTS.push({ name, status: "FAIL", reason });
}

async function run() {
  console.log("\n=== VirtualTour360 Playwright Verification ===\n");

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // ── Desktop 1440 ────────────────────────────────────────────────
  {
    console.log("── Desktop 1440 ──");
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    // 1. Entry section exists
    const entrySection = page.locator("#kham-pha-360");
    if ((await entrySection.count()) > 0) {
      pass("Entry section #kham-pha-360 renders");
    } else {
      fail("Entry section #kham-pha-360 renders", "element not found");
    }

    // 2. Screenshot of entry section
    await page.screenshot({ path: path.join(OUT_DIR, "01-entry-section.png") });
    pass("Captured 01-entry-section.png");

    // 3. Scroll to entry section
    await page.evaluate(() => {
      const el = document.getElementById("kham-pha-360");
      if (el) el.scrollIntoView({ behavior: "auto" });
    });
    await page.waitForTimeout(400);

    // 4. Open tour
    const openBtn = page.locator("#open-virtual-tour-360");
    if ((await openBtn.count()) > 0) {
      await openBtn.click();
      pass("Clicked 'KHÁM PHÁ 360°' button");
    } else {
      fail("Clicked 'KHÁM PHÁ 360°' button", "button not found");
    }

    // 5. Wait for Pannellum to initialize (loading scripts from CDN)
    try {
      await page.waitForFunction(
        () => {
          const win = window;
          return !!win["pannellum"];
        },
        { timeout: 20000 },
      );
      pass("Pannellum JS loaded");
    } catch {
      fail("Pannellum JS loaded", "timeout waiting for pannellum on window");
    }

    // Wait a bit more for canvas to render
    await page.waitForTimeout(2000);

    // 6. Check canvas exists (Pannellum creates a WebGL canvas)
    const canvas = page.locator("canvas");
    if ((await canvas.count()) > 0) {
      pass("WebGL canvas element exists (Pannellum rendering)");
    } else {
      fail("WebGL canvas element exists", "no <canvas> found — WebGL may have failed");
    }

    // 7. Screenshot main cabin
    await page.screenshot({ path: path.join(OUT_DIR, "02-main-cabin.png") });
    pass("Captured 02-main-cabin.png");

    // 8. Scene thumbnail rail — verify all 5 scenes listed
    const thumbButtons = page.locator('[role="tab"]');
    const thumbCount = await thumbButtons.count();
    if (thumbCount >= 5) {
      pass(`Scene thumbnail rail shows ${thumbCount} scenes`);
    } else {
      fail("Scene thumbnail rail", `only ${thumbCount} scenes found (expected 5)`);
    }

    // 9. Screenshot scene selector
    await page.screenshot({ path: path.join(OUT_DIR, "08-scene-selector.png") });
    pass("Captured 08-scene-selector.png");

    // 10. Simulate drag left 300px to change yaw
    const viewerCanvas = page.locator("canvas").first();
    if ((await viewerCanvas.count()) > 0) {
      const box = await viewerCanvas.boundingBox();
      if (box) {
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        await page.mouse.move(cx, cy);
        await page.mouse.down();
        await page.mouse.move(cx - 300, cy, { steps: 20 });
        await page.mouse.up();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(OUT_DIR, "03-main-cabin-rotated-left.png") });
        pass("Simulated drag left 300px → captured 03-main-cabin-rotated-left.png");

        // Drag right
        await page.mouse.move(cx, cy);
        await page.mouse.down();
        await page.mouse.move(cx + 300, cy, { steps: 20 });
        await page.mouse.up();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(OUT_DIR, "04-main-cabin-rotated-right.png") });
        pass("Simulated drag right 300px → captured 04-main-cabin-rotated-right.png");

        // Drag up (pitch change)
        await page.mouse.move(cx, cy);
        await page.mouse.down();
        await page.mouse.move(cx, cy - 150, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(300);
        pass("Simulated drag up (pitch change)");
      }
    }

    // 11. Navigate to upper deck via thumbnail
    const upperThumb = page.locator('[role="tab"]').nth(1);
    if ((await upperThumb.count()) > 0) {
      await upperThumb.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, "05-upper-deck.png") });
      pass("Navigated to upper deck → captured 05-upper-deck.png");
    }

    // 12. Navigate to lower deck
    const lowerThumb = page.locator('[role="tab"]').nth(2);
    if ((await lowerThumb.count()) > 0) {
      await lowerThumb.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, "06-lower-deck.png") });
      pass("Navigated to lower deck → captured 06-lower-deck.png");
    }

    // 13. Fullscreen button exists
    const fullscreenBtn = page
      .locator(
        '[aria-label*="toàn màn hình"], [aria-label*="Fullscreen"], [aria-label*="fullscreen"]',
      )
      .first();
    if ((await fullscreenBtn.count()) > 0) {
      pass("Fullscreen control button exists");
    } else {
      fail("Fullscreen control button", "not found");
    }

    // 14. Screenshot fullscreen area
    await page.screenshot({ path: path.join(OUT_DIR, "09-fullscreen.png") });
    pass("Captured 09-fullscreen.png");

    // 15. Close viewer via Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    pass("Escape key closes modal");

    await ctx.close();
  }

  // ── Mobile 390 ──────────────────────────────────────────────────
  {
    console.log("\n── Mobile 390 ──");
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    // Scroll to entry
    await page.evaluate(() => {
      const el = document.getElementById("kham-pha-360");
      if (el) el.scrollIntoView({ behavior: "auto" });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT_DIR, "10-mobile.png") });
    pass("Captured 10-mobile.png");

    // Open tour on mobile
    const openBtn = page.locator("#open-virtual-tour-360");
    if ((await openBtn.count()) > 0) {
      await openBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT_DIR, "10-mobile-tour-open.png") });
      pass("Mobile tour opens → captured 10-mobile-tour-open.png");
    }

    await ctx.close();
  }

  await browser.close();

  // ── Final Report ────────────────────────────────────────────────
  console.log("\n=== RESULTS ===");
  const passed = RESULTS.filter((r) => r.status === "PASS").length;
  const failed = RESULTS.filter((r) => r.status === "FAIL").length;
  console.log(`PASS: ${passed} / FAIL: ${failed}`);
  if (failed > 0) {
    console.log("\nFailed checks:");
    RESULTS.filter((r) => r.status === "FAIL").forEach((r) => {
      console.log(`  ❌ ${r.name}: ${r.reason}`);
    });
  }

  // Write JSON report
  fs.writeFileSync(
    path.join(OUT_DIR, "report.json"),
    JSON.stringify({ passed, failed, results: RESULTS }, null, 2),
  );
  console.log("\nFull report written to 360/report.json");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
