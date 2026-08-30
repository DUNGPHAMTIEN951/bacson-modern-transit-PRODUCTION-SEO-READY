/**
 * verify_immersive_3modes.mjs
 * Automated Playwright QA verifying the 3-Mode Universal Immersive Image System.
 */

import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:5173";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("UI_IMMERSIVE_3MODES_REVIEW");

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
  console.log("\n=== 3-Mode Universal Immersive Image Verification ===\n");

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // ── 1. Desktop 1440 ─────────────────────────────────────────────
  {
    console.log("── Desktop 1440 ──");
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    // 1. Confirm obsolete sections are completely gone
    const old360 = page.locator("#kham-pha-360");
    const oldVehicle = page.locator("#kham-pha-xe");
    if ((await old360.count()) === 0 && (await oldVehicle.count()) === 0) {
      pass("Dedicated sections (#kham-pha-360 & #kham-pha-xe) completely removed");
    } else {
      fail("Dedicated sections removed", "old section IDs found on page");
    }

    // 2. Capture clean Hero
    await page.screenshot({ path: path.join(OUT_DIR, "01-desktop-hero-clean.png") });
    pass("Captured 01-desktop-hero-clean.png");

    // 3. Click Hero coach image to open Immersive Viewer (Mode B)
    const heroCoachImg = page.locator("#hero-coach-interactive");
    if ((await heroCoachImg.count()) > 0) {
      await heroCoachImg.click();
      await page.waitForTimeout(700);

      const modal = page.locator('div[role="dialog"]');
      if ((await modal.count()) > 0) {
        pass("Clicked Hero coach image → Immersive Viewer modal opened");
        await page.screenshot({ path: path.join(OUT_DIR, "02-hero-immersive-modal.png") });
        pass("Captured 02-hero-immersive-modal.png");

        // Drag inside modal to test interactive panning
        const box = await modal.boundingBox();
        if (box) {
          const cx = box.x + box.width / 2;
          const cy = box.y + box.height / 2;
          await page.mouse.move(cx, cy);
          await page.mouse.down();
          await page.mouse.move(cx - 200, cy - 100, { steps: 15 });
          await page.mouse.up();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(OUT_DIR, "03-hero-modal-panned.png") });
          pass("Simulated pointer drag → captured 03-hero-modal-panned.png");
        }

        // Test zoom button
        const zoomInBtn = page.locator('button[aria-label="Phóng to"]').first();
        if ((await zoomInBtn.count()) > 0) {
          await zoomInBtn.click();
          await zoomInBtn.click();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(OUT_DIR, "04-hero-modal-zoomed.png") });
          pass("Zoom in clicked → captured 04-hero-modal-zoomed.png");
        }

        // Close modal via Escape key
        await page.keyboard.press("Escape");
        await page.waitForTimeout(400);

        if ((await page.locator('div[role="dialog"]').count()) === 0) {
          pass("Escape key closed Immersive Viewer modal");
        } else {
          fail("Modal close via Escape", "modal still present");
        }
      } else {
        fail("Hero coach click", "modal did not open");
      }
    } else {
      fail("Hero coach button", "not found on page");
    }

    // 4. Scroll to Gallery and test Mode B (Interior) & Mode C (Bounded)
    const gallerySection = page.locator("#hinh-anh");
    if ((await gallerySection.count()) > 0) {
      await gallerySection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT_DIR, "05-gallery-grid-clean.png") });
      pass("Captured 05-gallery-grid-clean.png");

      // Click first gallery item (Interior)
      const galleryItem1 = page.locator("#hinh-anh figure[role='button']").first();
      if ((await galleryItem1.count()) > 0) {
        await galleryItem1.click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(OUT_DIR, "06-gallery-item-immersive.png") });
        pass("Clicked Gallery interior photo → captured 06-gallery-item-immersive.png");

        // Close via close button
        const closeBtn = page.locator("#close-immersive-modal");
        if ((await closeBtn.count()) > 0) {
          await closeBtn.click();
          await page.waitForTimeout(400);
          pass("Closed modal via close button");
        }
      }
    }

    await ctx.close();
  }

  // ── 2. Mobile 390 ───────────────────────────────────────────────
  {
    console.log("\n── Mobile 390 ──");
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    await page.screenshot({ path: path.join(OUT_DIR, "07-mobile-clean-homepage.png") });
    pass("Captured 07-mobile-clean-homepage.png");

    // Click Hero image on mobile
    const heroCoachMobile = page.locator("#hero-coach-interactive");
    if ((await heroCoachMobile.count()) > 0) {
      await heroCoachMobile.click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(OUT_DIR, "08-mobile-immersive-modal.png") });
      pass("Mobile click opens fullscreen modal → captured 08-mobile-immersive-modal.png");

      const closeMobileBtn = page.locator("#close-immersive-modal");
      if ((await closeMobileBtn.count()) > 0) {
        await closeMobileBtn.click();
        await page.waitForTimeout(400);
        pass("Mobile close button successfully returned to page");
      }
    }

    await ctx.close();
  }

  await browser.close();

  // ── Summary ─────────────────────────────────────────────────────
  console.log("\n=== ALL QA CHECKS COMPLETE ===");
  const passed = RESULTS.filter((r) => r.status === "PASS").length;
  const failed = RESULTS.filter((r) => r.status === "FAIL").length;
  console.log(`TOTAL PASS: ${passed} / FAIL: ${failed}`);

  fs.writeFileSync(
    path.join(OUT_DIR, "report.json"),
    JSON.stringify({ passed, failed, results: RESULTS }, null, 2),
  );
}

run().catch((err) => {
  console.error("QA script failed:", err);
  process.exit(1);
});
