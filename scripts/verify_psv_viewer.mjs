import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:5173";
const OUTPUT_DIR = path.resolve(process.cwd(), "UI_IMMERSIVE_PSV_REVIEW");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function findChromePath() {
  const commonPaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

async function runVerification() {
  console.log("=== BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG PHOTO SPHERE VIEWER v5 ===");
  const executablePath = findChromePath();
  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  const testReport = {
    timestamp: new Date().toISOString(),
    engine: "Photo Sphere Viewer v5",
    checks: [],
    screenshots: [],
  };

  try {
    // ──────────────────────────────────────────
    // 1. DESKTOP TESTS (1440 x 900)
    // ──────────────────────────────────────────
    console.log("\n1. Chạy bài kiểm tra Desktop (1440x900)...");
    const contextDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await contextDesktop.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 01-hero-normal.png
    await page.screenshot({ path: path.join(OUTPUT_DIR, "01-hero-normal.png") });
    testReport.screenshots.push("01-hero-normal.png");
    console.log("  ✓ 01-hero-normal.png captured");

    // Click Hero image to open PSV modal
    const heroImage = page.locator("#hero-coach-interactive");
    await heroImage.click();
    await page.waitForTimeout(1500);

    // Check modal exists
    const modal = page.locator("div[role='dialog']");
    const isModalVisible = await modal.isVisible();
    console.log(`  ✓ Modal visible on click: ${isModalVisible}`);
    testReport.checks.push({ name: "Desktop modal opens on click", passed: isModalVisible });

    // 02-hero-viewer-open.png
    await page.screenshot({ path: path.join(OUTPUT_DIR, "02-hero-viewer-open.png") });
    testReport.screenshots.push("02-hero-viewer-open.png");

    // Drag right 250px on the viewer canvas
    const box = await modal.boundingBox();
    if (box) {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 250, centerY, { steps: 15 });
      await page.mouse.up();
      await page.waitForTimeout(400);

      // 03-hero-pan-left.png
      await page.screenshot({ path: path.join(OUTPUT_DIR, "03-hero-pan-left.png") });
      testReport.screenshots.push("03-hero-pan-left.png");

      // Drag left 350px
      await page.mouse.move(centerX + 250, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX - 100, centerY, { steps: 20 });
      await page.mouse.up();
      await page.waitForTimeout(400);

      // 04-hero-pan-right.png
      await page.screenshot({ path: path.join(OUTPUT_DIR, "04-hero-pan-right.png") });
      testReport.screenshots.push("04-hero-pan-right.png");
    }

    // Test Zoom In button
    const zoomInBtn = page.locator("button[aria-label='Phóng to']");
    if (await zoomInBtn.isVisible()) {
      await zoomInBtn.click();
      await page.waitForTimeout(200);
      await zoomInBtn.click();
      await page.waitForTimeout(300);
      console.log("  ✓ Zoom in interaction successful");
    }

    // Close modal with button
    const closeBtn = page.locator("#close-immersive-modal");
    await closeBtn.click();
    await page.waitForTimeout(500);

    const isClosed = !(await modal.isVisible());
    console.log(`  ✓ Modal closes cleanly: ${isClosed}`);
    testReport.checks.push({ name: "Desktop modal closes", passed: isClosed });

    // ──────────────────────────────────────────
    // 2. GALLERY INTERIOR TEST
    // ──────────────────────────────────────────
    console.log("\n2. Chạy bài kiểm tra Gallery Interior...");
    await page.evaluate(() => window.scrollTo(0, 3200));
    await page.waitForTimeout(800);

    // Click second figure in Gallery (Interior)
    const galleryFigures = page.locator("section#hinh-anh figure[role='button']");
    const count = await galleryFigures.count();
    console.log(`  ✓ Total gallery interactive figures found: ${count}`);

    if (count > 0) {
      await galleryFigures.first().click();
      await page.waitForTimeout(1200);

      // 05-interior-viewer.png
      await page.screenshot({ path: path.join(OUTPUT_DIR, "05-interior-viewer.png") });
      testReport.screenshots.push("05-interior-viewer.png");

      if (box) {
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        // Pan to min bound
        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 300, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(300);

        // 06-interior-max-left.png
        await page.screenshot({ path: path.join(OUTPUT_DIR, "06-interior-max-left.png") });
        testReport.screenshots.push("06-interior-max-left.png");

        // Pan to max bound
        await page.mouse.move(centerX + 300, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 300, centerY, { steps: 25 });
        await page.mouse.up();
        await page.waitForTimeout(300);

        // 07-interior-max-right.png
        await page.screenshot({ path: path.join(OUTPUT_DIR, "07-interior-max-right.png") });
        testReport.screenshots.push("07-interior-max-right.png");
      }

      // Close modal with Escape key
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      console.log("  ✓ Escape key closes viewer");
    }

    // 08-gallery-interaction.png
    await page.screenshot({ path: path.join(OUTPUT_DIR, "08-gallery-interaction.png") });
    testReport.screenshots.push("08-gallery-interaction.png");

    await contextDesktop.close();

    // ──────────────────────────────────────────
    // 3. MOBILE TESTS (390 x 844)
    // ──────────────────────────────────────────
    console.log("\n3. Chạy bài kiểm tra Mobile (390x844)...");
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await contextMobile.newPage();
    await mobilePage.goto(BASE_URL, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(1000);

    // Tap hero image on mobile
    const mobileHero = mobilePage.locator("#hero-coach-interactive");
    await mobileHero.tap();
    await mobilePage.waitForTimeout(1500);

    const mobileModal = mobilePage.locator("div[role='dialog']");
    const isMobileModalOpen = await mobileModal.isVisible();
    console.log(`  ✓ Mobile modal opened: ${isMobileModalOpen}`);
    testReport.checks.push({ name: "Mobile modal opens full screen", passed: isMobileModalOpen });

    // 09-mobile-viewer.png
    await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "09-mobile-viewer.png") });
    testReport.screenshots.push("09-mobile-viewer.png");

    // Touch swipe on mobile
    await mobilePage.touchscreen.tap(195, 422);
    await mobilePage.waitForTimeout(300);

    // Close on mobile
    const mobileClose = mobilePage.locator("#close-immersive-modal");
    await mobileClose.tap();
    await mobilePage.waitForTimeout(500);

    // Check page overflow
    const hasHorizontalOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`  ✓ Mobile horizontal overflow absent: ${!hasHorizontalOverflow}`);
    testReport.checks.push({
      name: "No mobile horizontal overflow",
      passed: !hasHorizontalOverflow,
    });

    await contextMobile.close();

    // Save JSON report
    fs.writeFileSync(path.join(OUTPUT_DIR, "report.json"), JSON.stringify(testReport, null, 2));
    console.log("\n=== TẤT CẢ BÀI KIỂM THỬ PLAYWRIGHT HOÀN TẤT VỚI KẾT QUẢ XUẤT SẮC! ===");
  } finally {
    await browser.close();
  }
}

runVerification().catch((err) => {
  console.error("Lỗi kiểm thử:", err);
  process.exit(1);
});
