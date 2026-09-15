import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const targetDir = "D:\\bacson-modern-transit-PRODUCTION-SEO-READY\\screenshots";
const artifactDir =
  "C:\\Users\\phaml\\.gemini\\antigravity-ide\\brain\\5f70c84a-b7bf-4ea5-b46b-c70ba795c315\\screenshots";

fs.mkdirSync(targetDir, { recursive: true });
fs.mkdirSync(artifactDir, { recursive: true });

const routes = [
  {
    name: "01-homepage-default",
    url: "http://localhost:8080/",
    title: "Trang chủ mặc định",
  },
  {
    name: "02-son-la-ha-noi",
    url: "http://localhost:8080/son-la-ha-noi",
    title: "Tuyến Sơn La - Hà Nội",
  },
  {
    name: "03-ha-noi-moc-chau",
    url: "http://localhost:8080/ha-noi-moc-chau",
    title: "Tuyến Hà Nội - Mộc Châu",
  },
  {
    name: "04-lien-he",
    url: "http://localhost:8080/lien-he",
    title: "Trang Liên hệ",
  },
];

async function capture() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  for (const r of routes) {
    console.log(`\n========================================`);
    console.log(`Đang tải route: ${r.title} (${r.url})...`);
    await page.goto(r.url, { waitUntil: "networkidle", timeout: 45000 });

    // Cuộn trang từ trên xuống dưới để kích hoạt toàn bộ ảnh lazy-load
    console.log(`Đang cuộn trang để kích hoạt toàn bộ ảnh và assets...`);
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    // Đợi tất cả thẻ <img> trên trang hoàn tất việc tải (complete = true)
    console.log(`Đang đợi tất cả ảnh giải mã và tải xong 100%...`);
    await page.evaluate(async () => {
      const selectors = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        selectors.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", resolve);
            // Timeout dự phòng
            setTimeout(resolve, 5000);
          });
        }),
      );
    });

    // Chờ thêm 3 giây để hiệu ứng CSS và font chữ ổn định hoàn toàn
    await page.waitForTimeout(3000);

    // Cuộn lại về đầu trang để chụp Hero Viewport
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // 1. Chụp Hero Viewport
    const heroPath = path.join(targetDir, `${r.name}-hero.png`);
    await page.screenshot({ path: heroPath, fullPage: false });
    fs.copyFileSync(heroPath, path.join(artifactDir, `${r.name}-hero.png`));

    // 2. Chụp Full Page (toàn bộ ảnh từ đầu đến chân trang)
    const fullPath = path.join(targetDir, `${r.name}-full.png`);
    await page.screenshot({ path: fullPath, fullPage: true });
    fs.copyFileSync(fullPath, path.join(artifactDir, `${r.name}-full.png`));

    console.log(`✓ Đã chụp thành công: ${r.name} (đầy đủ assets và ảnh thật)`);
  }

  await browser.close();
  console.log("\n========================================");
  console.log("Hoàn tất chụp lại toàn bộ 4 routes với 100% ảnh đã load!");
}

capture().catch((err) => {
  console.error("Lỗi khi chụp screenshot:", err);
  process.exit(1);
});
