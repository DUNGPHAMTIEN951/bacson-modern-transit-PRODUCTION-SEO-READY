import fs from "fs";
import path from "path";
import crypto from "crypto";
import { chromium } from "playwright-core";

const BASE_URL = "http://localhost:5173";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EXPECTED_BYTES = 18668328;
const EXPECTED_HASH = "dd9a2a095e9faa6729ecb1ded47e8849f703cb84b536c839d4c1edfa8f8e53f0";

async function testDownload() {
  console.log("Testing /ui-review-download route...");
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true,
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/ui-review-download`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Take screenshot of download page
  await page.screenshot({ path: path.resolve("UI_REVIEW/review/download-page.png") });
  console.log("Saved screenshot: UI_REVIEW/review/download-page.png");

  // Test 1: Direct link
  console.log("Testing direct download link...");
  const [directDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.click("a:has-text('Tải Trực Tiếp (Dự Phòng)')"),
  ]);
  const tempDirectPath = path.resolve("temp_direct.zip");
  await directDownload.saveAs(tempDirectPath);
  const directBuf = fs.readFileSync(tempDirectPath);
  const directHash = crypto.createHash("sha256").update(directBuf).digest("hex");
  console.log(`Direct Download Size: ${directBuf.length} bytes (expected: ${EXPECTED_BYTES})`);
  console.log(`Direct Download Hash: ${directHash}`);
  if (fs.existsSync(tempDirectPath)) fs.unlinkSync(tempDirectPath);

  // Test 2: Client reconstructed download
  console.log("Testing client-side base64 reconstructed download...");
  const [reconstructedDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.click("button:has-text('Tải Xuống UI_REVIEW_FULL.zip')"),
  ]);
  const tempClientPath = path.resolve("temp_client.zip");
  await reconstructedDownload.saveAs(tempClientPath);
  const clientBuf = fs.readFileSync(tempClientPath);
  const clientHash = crypto.createHash("sha256").update(clientBuf).digest("hex");
  console.log(
    `Reconstructed Download Size: ${clientBuf.length} bytes (expected: ${EXPECTED_BYTES})`,
  );
  console.log(`Reconstructed Download Hash: ${clientHash}`);
  if (fs.existsSync(tempClientPath)) fs.unlinkSync(tempClientPath);

  if (
    directBuf.length === EXPECTED_BYTES &&
    directHash === EXPECTED_HASH &&
    clientBuf.length === EXPECTED_BYTES &&
    clientHash === EXPECTED_HASH
  ) {
    console.log("✓ ALL DOWNLOAD VERIFICATIONS PASSED (100% byte-for-byte and SHA-256 match)!");
  } else {
    throw new Error("Mismatch in size or hash!");
  }

  await browser.close();
}

testDownload().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
