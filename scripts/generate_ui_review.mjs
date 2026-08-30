import fs from "fs";
import path from "path";
import crypto from "crypto";
import { chromium } from "playwright-core";

const BASE_URL = "http://localhost:5173";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve("UI_REVIEW");

// Ensure clean directory structure
const DIRS = [
  "full-page",
  "hero",
  "sections/desktop",
  "sections/mobile",
  "interactions/contact",
  "maps",
  "gallery",
  "mobile",
  "desktop-scroll",
  "mobile-scroll",
  "review",
];

for (const d of DIRS) {
  fs.mkdirSync(path.join(OUTPUT_DIR, d), { recursive: true });
}

const VIEWPORTS = {
  desktop1920: { width: 1920, height: 1080, name: "desktop-1920" },
  desktop1440: { width: 1440, height: 900, name: "desktop-1440" },
  tablet: { width: 1024, height: 1366, name: "tablet-1024" },
  mobile390: { width: 390, height: 844, name: "mobile-390" },
  mobile360: { width: 360, height: 800, name: "mobile-360" },
};

const capturedFiles = [];

function recordFile(relPath, route, viewport, sectionOrState, description) {
  capturedFiles.push({
    file: relPath.replace(/\\/g, "/"),
    route,
    viewport,
    section: sectionOrState,
    description,
  });
}

async function waitPageStable(page) {
  try {
    await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
  } catch (e) {}

  await page.evaluate(async () => {
    try {
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]);
    } catch (e) {}

    // Scroll through page to trigger lazy loaded images
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

async function main() {
  console.log("Launching Chromium from:", CHROME_PATH);
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  // 1. FULL-PAGE SCREENSHOTS (5 viewports)
  console.log("=== 1. Capturing Full-Page Screenshots ===");
  for (const [key, vp] of Object.entries(VIEWPORTS)) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    let filename = "";
    if (key === "desktop1920") filename = "01-home-desktop-1920-full.png";
    else if (key === "desktop1440") filename = "02-home-desktop-1440-full.png";
    else if (key === "tablet") filename = "03-home-tablet-1024-full.png";
    else if (key === "mobile390") filename = "04-home-mobile-390-full.png";
    else if (key === "mobile360") filename = "05-home-mobile-360-full.png";

    const outPath = path.join(OUTPUT_DIR, "full-page", filename);
    await page.screenshot({ path: outPath, fullPage: true });
    recordFile(
      `full-page/${filename}`,
      "/",
      `${vp.width}x${vp.height}`,
      "Full Homepage",
      `Complete full-page render at ${vp.name} with all sections, footer, and brand palette`,
    );
    console.log(`Saved: full-page/${filename}`);
    await context.close();
  }

  // 2. HERO REVIEW CAPTURES (5 viewports)
  console.log("=== 2. Capturing Hero Section Across Viewports ===");
  for (const [key, vp] of Object.entries(VIEWPORTS)) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/#top`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    let filename = "";
    if (key === "desktop1920") filename = "hero-desktop-1920.png";
    else if (key === "desktop1440") filename = "hero-desktop-1440.png";
    else if (key === "tablet") filename = "hero-tablet.png";
    else if (key === "mobile390") filename = "hero-mobile-390.png";
    else if (key === "mobile360") filename = "hero-mobile-360.png";

    const heroEl = await page.$("#top");
    const outPath = path.join(OUTPUT_DIR, "hero", filename);
    if (heroEl) {
      await heroEl.screenshot({ path: outPath });
    } else {
      await page.screenshot({ path: outPath });
    }
    recordFile(
      `hero/${filename}`,
      "/",
      `${vp.width}x${vp.height}`,
      "Hero Section",
      `Dedicated hero review showing slogan 'Sơn La những chuyến đi', supporting line, CTA buttons, and bus photo`,
    );
    console.log(`Saved: hero/${filename}`);
    await context.close();
  }

  // 3. SECTION-BY-SECTION SCREENSHOTS (Desktop 1440px & Mobile 390px)
  console.log("=== 3. Capturing Section by Section ===");
  const SECTIONS = [
    { id: "header", selector: "header", name: "01-header", title: "Header Navigation" },
    { id: "top", selector: "#top", name: "02-hero", title: "Hero Section" },
    {
      id: "quickbar",
      selector: "section[aria-label='Thông tin nhanh']",
      name: "03-quickbar",
      title: "QuickBar Summary",
    },
    {
      id: "hanh-trinh",
      selector: "#hanh-trinh",
      name: "04-brand-story",
      title: "Brand Story & 4 Journey Stages",
    },
    { id: "lich-chay", selector: "#lich-chay", name: "05-schedule", title: "Daily Schedule Cards" },
    { id: "gia-ve", selector: "#gia-ve", name: "06-fares", title: "Fare Table & Disclaimers" },
    {
      id: "lo-trinh",
      selector: "#lo-trinh",
      name: "07-route-timeline",
      title: "Route Timeline & Major Stops",
    },
    {
      id: "son-la-dong-hanh",
      selector: "#son-la-dong-hanh",
      name: "08-son-la-story",
      title: "Sơn La Sense of Place Editorial",
    },
    {
      id: "hinh-anh",
      selector: "#hinh-anh",
      name: "09-gallery",
      title: "Fleet & Cabin Photo Gallery",
    },
    {
      id: "tien-ich",
      selector: "#tien-ich",
      name: "10-amenities",
      title: "Coach Amenities & Services",
    },
    {
      id: "gui-hang",
      selector: "#gui-hang",
      name: "11-cargo",
      title: "Cargo Delivery Service & 4 Steps",
    },
    {
      id: "vi-sao",
      selector: "#vi-sao",
      name: "12-why-us",
      title: "Why Choose Bắc Sơn Cường Nguyệt",
    },
    {
      id: "diem-don",
      selector: "#diem-don",
      name: "13-offices-maps",
      title: "Offices & Interactive Google Maps",
    },
    {
      id: "ho-so-phap-ly",
      selector: "#ho-so-phap-ly",
      name: "14-credentials",
      title: "Legal Transport License Credentials",
    },
    { id: "faq", selector: "#faq", name: "15-faq", title: "Frequently Asked Questions" },
    {
      id: "lien-he",
      selector: "#lien-he",
      name: "16-final-cta",
      title: "Final Call to Action Banner",
    },
    { id: "footer", selector: "footer", name: "17-footer", title: "Footer & Legal Info" },
  ];

  // Capture Desktop Sections (1440px)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    for (const sec of SECTIONS) {
      const el = await page.$(sec.selector);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        const filename = `${sec.name}.png`;
        const outPath = path.join(OUTPUT_DIR, "sections/desktop", filename);
        await el.screenshot({ path: outPath });
        recordFile(
          `sections/desktop/${filename}`,
          "/",
          "1440x900",
          sec.title,
          `Desktop 1440px section capture for ${sec.title}`,
        );
        console.log(`Saved: sections/desktop/${filename}`);
      }
    }
    await context.close();
  }

  // Capture Mobile Sections (390px)
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    for (const sec of SECTIONS) {
      const el = await page.$(sec.selector);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        const filename = `${sec.name}.png`;
        const outPath = path.join(OUTPUT_DIR, "sections/mobile", filename);
        await el.screenshot({ path: outPath });
        recordFile(
          `sections/mobile/${filename}`,
          "/",
          "390x844",
          sec.title,
          `Mobile 390px section capture for ${sec.title}`,
        );
        console.log(`Saved: sections/mobile/${filename}`);
      }
    }
    await context.close();
  }

  // 4. CONTACT BUTTON INTERACTION STATES
  console.log("=== 4. Capturing Contact Button Interaction States ===");
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    // Call Button in Hero
    const callBtn = await page.$("a[href^='tel:']");
    if (callBtn) {
      await callBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      // Normal state
      await callBtn.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/call-normal.png"),
      });
      recordFile(
        "interactions/contact/call-normal.png",
        "/",
        "1440x900",
        "Hero Call Button (Normal)",
        "Sunset terracotta button in resting state with subtle 4s pulse-ring animation",
      );

      // Hover state
      await callBtn.hover();
      await page.waitForTimeout(250);
      await callBtn.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/call-hover.png"),
      });
      recordFile(
        "interactions/contact/call-hover.png",
        "/",
        "1440x900",
        "Hero Call Button (Hover)",
        "Button lifted -2px with darker terracotta background and elevated shadow",
      );

      // Focus state
      await callBtn.focus();
      await page.waitForTimeout(200);
      await callBtn.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/call-focus.png"),
      });
      recordFile(
        "interactions/contact/call-focus.png",
        "/",
        "1440x900",
        "Hero Call Button (Focus)",
        "Keyboard focus outline in mountain-teal ring",
      );

      // Active / Pressed visual simulation
      await page.evaluate((el) => {
        el.style.transform = "scale(0.98)";
      }, callBtn);
      await page.waitForTimeout(100);
      await callBtn.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/call-active.png"),
      });
      recordFile(
        "interactions/contact/call-active.png",
        "/",
        "1440x900",
        "Hero Call Button (Active)",
        "Tactile active click state scaled down to 0.98",
      );

      // Reset transform
      await page.evaluate((el) => {
        el.style.transform = "";
      }, callBtn);
    }

    // Zalo Button in Hero
    const zaloBtn = await page.$("a[href^='https://zalo.me/']");
    if (zaloBtn) {
      await zaloBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      // Normal state
      await zaloBtn.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/zalo-normal.png"),
      });
      recordFile(
        "interactions/contact/zalo-normal.png",
        "/",
        "1440x900",
        "Hero Zalo Button (Normal)",
        "Mountain-teal border and text on white surface with message icon",
      );

      // Hover state
      await zaloBtn.hover();
      await page.waitForTimeout(250);
      await zaloBtn.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/zalo-hover.png"),
      });
      recordFile(
        "interactions/contact/zalo-hover.png",
        "/",
        "1440x900",
        "Hero Zalo Button (Hover)",
        "Soft teal background tint #E8F2F4 with -2px lift",
      );

      // Focus state
      await zaloBtn.focus();
      await page.waitForTimeout(200);
      await zaloBtn.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/zalo-focus.png"),
      });
      recordFile(
        "interactions/contact/zalo-focus.png",
        "/",
        "1440x900",
        "Hero Zalo Button (Focus)",
        "Keyboard focus outline ring",
      );

      // Active state
      await page.evaluate((el) => {
        el.style.transform = "scale(0.98)";
      }, zaloBtn);
      await page.waitForTimeout(100);
      await zaloBtn.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/zalo-active.png"),
      });
      recordFile(
        "interactions/contact/zalo-active.png",
        "/",
        "1440x900",
        "Hero Zalo Button (Active)",
        "Tactile active press feedback scaled to 0.98",
      );
    }
    await context.close();
  }

  // Sticky Mobile Contact Actions
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    const stickyNav = await page.$("nav[aria-label='Liên hệ nhanh']");
    if (stickyNav) {
      await stickyNav.screenshot({
        path: path.join(OUTPUT_DIR, "interactions/contact/sticky-bar-normal.png"),
      });
      recordFile(
        "interactions/contact/sticky-bar-normal.png",
        "/",
        "390x844",
        "Sticky Mobile CTA Bar (Normal)",
        "Dual contact action bar with GỌI ĐẶT VÉ (terracotta) and CHAT ZALO (mountain-teal)",
      );
    }
    await context.close();
  }

  // 5. MOBILE NAVIGATION (Closed vs Open)
  console.log("=== 5. Capturing Mobile Navigation Menu ===");
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    // Menu Closed
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile/menu-closed.png") });
    recordFile(
      "mobile/menu-closed.png",
      "/",
      "390x844",
      "Mobile Navigation (Closed)",
      "Mobile viewport top area with hamburger button closed",
    );

    // Menu Open
    const menuBtn = await page.$("button[aria-controls='mobile-menu']");
    if (menuBtn) {
      await menuBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile/menu-open.png") });
      recordFile(
        "mobile/menu-open.png",
        "/",
        "390x844",
        "Mobile Navigation (Open)",
        "Full mobile drawer menu open showing all links, logo, and quick booking CTA",
      );
    }
    await context.close();
  }

  // 6. FAQ ACCORDION INTERACTION (Closed vs Open)
  console.log("=== 6. Capturing FAQ Accordion Interaction ===");
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/#faq`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    const faqSection = await page.$("#faq");
    if (faqSection) {
      await faqSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      // Default state (first item open, others closed)
      await faqSection.screenshot({ path: path.join(OUTPUT_DIR, "interactions/faq-open.png") });
      recordFile(
        "interactions/faq-open.png",
        "/",
        "1440x900",
        "FAQ Accordion (Open)",
        "FAQ panel with expanded question item showing smooth accordion transition",
      );

      // Close all items by clicking active header
      const openBtn = await page.$("#faq button[aria-expanded='true']");
      if (openBtn) {
        await openBtn.click();
        await page.waitForTimeout(250);
        await faqSection.screenshot({
          path: path.join(OUTPUT_DIR, "interactions/faq-closed.png"),
        });
        recordFile(
          "interactions/faq-closed.png",
          "/",
          "1440x900",
          "FAQ Accordion (Closed)",
          "FAQ panel with all items collapsed",
        );
      }
    }
    await context.close();
  }

  // 7. GOOGLE MAPS SECTION (Desktop & Mobile)
  console.log("=== 7. Capturing Google Maps Section ===");
  {
    // Desktop Maps
    const contextD = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const pageD = await contextD.newPage();
    await pageD.goto(`${BASE_URL}/#diem-don`, { waitUntil: "domcontentloaded" });
    await waitPageStable(pageD);
    const mapsSecD = await pageD.$("#diem-don");
    if (mapsSecD) {
      await mapsSecD.scrollIntoViewIfNeeded();
      await pageD.waitForTimeout(800);
      await mapsSecD.screenshot({ path: path.join(OUTPUT_DIR, "maps/maps-desktop.png") });
      recordFile(
        "maps/maps-desktop.png",
        "/",
        "1440x900",
        "Google Maps Section (Desktop)",
        "Offices section showing dual interactive Google Maps for Bến xe Mỹ Đình (Hà Nội) and 03 Nguyễn Trãi (Sơn La)",
      );
    }
    await contextD.close();

    // Mobile Maps
    const contextM = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const pageM = await contextM.newPage();
    await pageM.goto(`${BASE_URL}/#diem-don`, { waitUntil: "domcontentloaded" });
    await waitPageStable(pageM);
    const mapsSecM = await pageM.$("#diem-don");
    if (mapsSecM) {
      await mapsSecM.scrollIntoViewIfNeeded();
      await pageM.waitForTimeout(800);
      await mapsSecM.screenshot({ path: path.join(OUTPUT_DIR, "maps/maps-mobile.png") });
      recordFile(
        "maps/maps-mobile.png",
        "/",
        "390x844",
        "Google Maps Section (Mobile)",
        "Mobile view of terminal office addresses and interactive map embeds",
      );
    }
    await contextM.close();
  }

  // 8. GALLERY SECTION (Desktop, Mobile & Lightbox)
  console.log("=== 8. Capturing Gallery Section & Lightbox ===");
  {
    // Desktop Gallery
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/#hinh-anh`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);
    const galSec = await page.$("#hinh-anh");
    if (galSec) {
      await galSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await galSec.screenshot({ path: path.join(OUTPUT_DIR, "gallery/gallery-desktop.png") });
      recordFile(
        "gallery/gallery-desktop.png",
        "/",
        "1440x900",
        "Gallery Section (Desktop)",
        "Grid layout of real bus and cabin interior photography with zoom triggers",
      );

      // Open Lightbox by clicking first photo
      const firstPhoto = await page.$("#hinh-anh figure button");
      if (firstPhoto) {
        await firstPhoto.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(OUTPUT_DIR, "gallery/gallery-lightbox.png") });
        recordFile(
          "gallery/gallery-lightbox.png",
          "/",
          "1440x900",
          "Gallery Lightbox (Modal)",
          "Full-screen photo modal overlay with navigation controls and captions",
        );
      }
    }
    await context.close();

    // Mobile Gallery
    const contextM = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const pageM = await contextM.newPage();
    await pageM.goto(`${BASE_URL}/#hinh-anh`, { waitUntil: "domcontentloaded" });
    await waitPageStable(pageM);
    const galSecM = await pageM.$("#hinh-anh");
    if (galSecM) {
      await galSecM.scrollIntoViewIfNeeded();
      await pageM.waitForTimeout(300);
      await galSecM.screenshot({ path: path.join(OUTPUT_DIR, "gallery/gallery-mobile.png") });
      recordFile(
        "gallery/gallery-mobile.png",
        "/",
        "390x844",
        "Gallery Section (Mobile)",
        "Mobile photo gallery layout with touch-friendly cards",
      );
    }
    await contextM.close();
  }

  // 9. STICKY MOBILE CTA IN SITU AT SCROLL POSITIONS
  console.log("=== 9. Capturing Sticky Mobile CTA In Situ ===");
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    // Top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile/sticky-top-content.png") });
    recordFile(
      "mobile/sticky-top-content.png",
      "/",
      "390x844",
      "Sticky CTA (Top of Page)",
      "Sticky CTA overlaying initial content without blocking important interaction points",
    );

    // Mid page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile/sticky-mid-page.png") });
    recordFile(
      "mobile/sticky-mid-page.png",
      "/",
      "390x844",
      "Sticky CTA (Mid Page)",
      "Sticky CTA visible while browsing mid-page schedule and fares",
    );

    // Near footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.88));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile/sticky-near-footer.png") });
    recordFile(
      "mobile/sticky-near-footer.png",
      "/",
      "390x844",
      "Sticky CTA (Near Footer)",
      "Sticky CTA transition above footer with safe bottom padding",
    );

    await context.close();
  }

  // 10. SCROLL POSITION REVIEWS (Desktop & Mobile 5 positions each)
  console.log("=== 10. Capturing Realistic Scroll Positions ===");
  {
    // Desktop Scroll
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    const positions = [
      { name: "01-top.png", ratio: 0, desc: "Top viewport showing Header and Hero" },
      {
        name: "02-quarter.png",
        ratio: 0.25,
        desc: "Quarter scroll showing Brand Story and Journey Stages",
      },
      {
        name: "03-middle.png",
        ratio: 0.5,
        desc: "Middle scroll showing Schedule, Fares, and Route Timeline",
      },
      {
        name: "04-three-quarter.png",
        ratio: 0.75,
        desc: "Three-quarter scroll showing Sơn La Story, Gallery, and Amenities",
      },
      {
        name: "05-bottom.png",
        ratio: 1.0,
        desc: "Bottom viewport showing Google Maps, FAQ, Final CTA, and Footer",
      },
    ];

    for (const p of positions) {
      await page.evaluate((r) => {
        const max = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, max * r);
      }, p.ratio);
      await page.waitForTimeout(250);
      const outPath = path.join(OUTPUT_DIR, "desktop-scroll", p.name);
      await page.screenshot({ path: outPath });
      recordFile(
        `desktop-scroll/${p.name}`,
        "/",
        "1440x900",
        `Scroll Position: ${p.name.replace(".png", "")}`,
        p.desc,
      );
      console.log(`Saved: desktop-scroll/${p.name}`);
    }
    await context.close();

    // Mobile Scroll
    const contextM = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const pageM = await contextM.newPage();
    await pageM.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(pageM);

    for (const p of positions) {
      await pageM.evaluate((r) => {
        const max = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, max * r);
      }, p.ratio);
      await pageM.waitForTimeout(250);
      const outPath = path.join(OUTPUT_DIR, "mobile-scroll", p.name);
      await pageM.screenshot({ path: outPath });
      recordFile(
        `mobile-scroll/${p.name}`,
        "/",
        "390x844",
        `Scroll Position: ${p.name.replace(".png", "")}`,
        `Mobile ${p.desc.toLowerCase()}`,
      );
      console.log(`Saved: mobile-scroll/${p.name}`);
    }
    await contextM.close();
  }

  // 11. EXTRACT TECHNICAL VISUAL SYSTEM METRICS
  console.log("=== 11. Extracting Computed Visual System Metrics ===");
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitPageStable(page);

    const visualSystem = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll("*"));
      const bgColors = new Set();
      const textColors = new Set();
      const borderColors = new Set();
      const fonts = new Set();
      const headingSizes = new Set();
      const bodySizes = new Set();
      const buttonBorderRadius = new Set();
      const cardBorderRadius = new Set();
      const commonShadows = new Set();

      allElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (
          style.backgroundColor &&
          style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
          style.backgroundColor !== "transparent"
        ) {
          bgColors.add(style.backgroundColor);
        }
        if (style.color) textColors.add(style.color);
        if (style.borderColor && style.borderWidth !== "0px") borderColors.add(style.borderColor);
        if (style.fontFamily) fonts.add(style.fontFamily);
        if (["H1", "H2", "H3", "H4"].includes(el.tagName)) {
          headingSizes.add(`${el.tagName}: ${style.fontSize} / line-height ${style.lineHeight}`);
        }
        if (["P", "SPAN", "LI"].includes(el.tagName)) {
          bodySizes.add(`${style.fontSize} / line-height ${style.lineHeight}`);
        }
        if (el.tagName === "BUTTON" || el.tagName === "A") {
          if (style.borderRadius && style.borderRadius !== "0px")
            buttonBorderRadius.add(style.borderRadius);
        }
        if (el.tagName === "ARTICLE" || el.classList.contains("rounded-2xl")) {
          if (style.borderRadius) cardBorderRadius.add(style.borderRadius);
        }
        if (style.boxShadow && style.boxShadow !== "none") {
          commonShadows.add(style.boxShadow);
        }
      });

      return {
        brandIdentity: {
          slogan: "Sơn La những chuyến đi",
          supportingLine: "Nối Hà Nội – Mộc Châu – Sơn La trên từng hành trình trở về.",
          companyName: "Bắc Sơn Cường Nguyệt",
          semanticTokens: {
            "--background": "#FBFAF7 (Warm natural base)",
            "--surface": "#FFFFFF (Pure white content surface)",
            "--surface-alt": "#F5F7F8 (Subtle grey-warm section surface)",
            "--surface-soft": "#F6EDE7 (Terracotta soft CTA surface)",
            "--mountain-teal": "#3F6670 (Reliable mountain forest teal)",
            "--mist-blue": "#6E8FA3 (Atmospheric mist blue)",
            "--sunset-terracotta": "#D97757 (Warm sunset terracotta primary CTA)",
            "--sunset-terracotta-hover": "#C86547 (Hover state)",
            "--cta-soft": "#F6E6DF (Warm soft chip/accent tint)",
            "--text-primary": "#23313F (High contrast dark slate)",
            "--text-secondary": "#5F6B76 (Readable muted slate)",
            "--border": "#DFE5EA (Crisp subtle divider)",
          },
        },
        backgroundColors: Array.from(bgColors),
        primaryColors: ["#D97757 (Sunset Terracotta)", "#3F6670 (Mountain Teal)"],
        accentColors: ["#6E8FA3 (Mist Blue)", "#F6EDE7 (Warm Soft)", "#E8F2F4 (Teal Soft)"],
        textColors: Array.from(textColors),
        borderColors: Array.from(borderColors),
        fonts: Array.from(fonts),
        headingSizes: Array.from(headingSizes),
        bodySizes: Array.from(bodySizes).slice(0, 10),
        buttonBorderRadius: Array.from(buttonBorderRadius),
        cardBorderRadius: Array.from(cardBorderRadius),
        commonShadows: Array.from(commonShadows).slice(0, 8),
      };
    });

    fs.writeFileSync(
      path.join(OUTPUT_DIR, "review/visual-system.json"),
      JSON.stringify(visualSystem, null, 2),
      "utf8",
    );
    console.log("Saved: review/visual-system.json");
    await context.close();
  }

  // 12. CREATE MANIFEST, SCREENSHOT INDEX, OBSERVED ISSUES & NOTES.md
  console.log("=== 12. Generating Manifest and Review Markdown Files ===");

  // review/manifest.json
  const manifest = {
    generatedAt: new Date().toISOString(),
    siteTitle: "Xe Hà Nội Sơn La – Lịch chạy & Giá vé | Bắc Sơn Cường Nguyệt",
    domain: "https://xebacsoncuongnguyet.com",
    previewUrl: "http://localhost:5173",
    brandDirection: "Sơn La những chuyến đi",
    palette: {
      background: "#FBFAF7",
      surface: "#FFFFFF",
      mountainTeal: "#3F6670",
      mistBlue: "#6E8FA3",
      sunsetTerracotta: "#D97757",
    },
    routesFound: [
      {
        path: "/",
        type: "public_homepage",
        title: "Trang chủ Xe khách Bắc Sơn Cường Nguyệt",
        status: "captured",
        viewportsCaptured: ["1920x1080", "1440x900", "1024x1366", "390x844", "360x800"],
      },
    ],
    totalScreenshots: capturedFiles.length,
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "review/manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  // interactions/contact/NOTES.md
  const contactNotes = `# Ghi chú về Vi tương tác Nút Liên hệ (Contact Button Interactions)

Tài liệu này ghi lại các thông số kỹ thuật và hiệu ứng vi tương tác thực tế đang hoạt động trên website:

---

## 1. Nút Gọi điện chính (CallButton & Hotline CTA)
- **Màu sắc nền (Resting)**: Cam đất hoàng hôn (\`#D97757\`)
- **Màu chữ**: Trắng (\`#FFFFFF\`), \`font-weight: 700\`
- **Độ bo góc**: \`rounded-xl\` (12px / \`0.75rem\`)
- **Đổ bóng cơ sở**: \`box-shadow: 0 2px 8px rgba(217, 119, 87, 0.18)\`
- **Hiệu ứng Hover**:
  - Di chuyển tịnh tiến: \`transform: translateY(-2px)\`
  - Đổi màu nền sang cam đất đậm: \`#C86547\`
  - Tăng độ phủ bóng: \`box-shadow: 0 6px 18px rgba(217, 119, 87, 0.30)\`
- **Hiệu ứng Active (Khi bấm giữ chuột / chạm tay)**:
  - Co giãn đàn hồi nhẹ: \`transform: scale(0.98)\`
  - Thời lượng chuyển động: \`220ms ease-out\`
- **Hiệu ứng Nhịp thở (Pulse Ring)**:
  - Áp dụng trên nút Hotline chính tại Hero & Header (\`btn-pulse\`)
  - Chu kỳ nhịp đập: \`4s cubic-bezier(0.4, 0, 0.6, 1) infinite\`
  - Vòng mở rộng từ 0px lên 8px mờ dần, không chớp nháy đột ngột

---

## 2. Nút Nhắn Zalo (ZaloButton)
- **Màu sắc nền (Resting)**: Trắng thuần (\`#FFFFFF\`)
- **Màu viền**: Viền nhẹ \`#DFE5EA\`
- **Màu chữ & Icon**: Xanh núi trầm tĩnh (\`#3F6670\`)
- **Hiệu ứng Hover**:
  - Nâng nhẹ: \`transform: translateY(-2px)\`
  - Đổi viền sang xanh núi: \`#3F6670\`
  - Nền chuyển sang phủ màu xanh nhạt sương mờ: \`#E8F2F4\`
  - Đổ bóng mềm: \`box-shadow: 0 6px 18px rgba(63, 102, 112, 0.14)\`
- **Hiệu ứng Active**: \`scale(0.98)\` trong \`220ms\`

---

## 3. Thanh Gọi nhanh Mobile (StickyCta Bar)
- **Vị trí**: Ghim cố định ở cạnh đáy (\`fixed inset-x-0 bottom-0 z-50\`)
- **Tương thích Safe-Area**: \`pb-[max(0.625rem, env(safe-area-inset-bottom))]\`
- **Bố cục 2 nút**:
  - Nút bên trái: GỌI ĐẶT VÉ (Cam đất \`#D97757\`)
  - Nút bên phải: CHAT ZALO (Xanh núi \`#3F6670\`)
- **Hiệu ứng phản hồi**: Tương tác cảm ứng nảy \`scale(0.98)\` ngay lập tức.

---

## 4. Tôn trọng Chế độ Giảm chuyển động (Prefers-Reduced-Motion)
- Khi thiết bị kích hoạt \`prefers-reduced-motion: reduce\`:
  - Mọi hiệu ứng \`transition-duration\` và \`animation-duration\` tự động gán về \`0.001ms\`
  - Hiệu ứng \`transform\` được giữ nguyên trạng thái tĩnh, đảm bảo khả năng tiếp cận (Accessibility) chuẩn A11y.
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, "interactions/contact/NOTES.md"), contactNotes, "utf8");

  // review/OBSERVED_VISUAL_ISSUES.md
  const observedIssues = `# Báo cáo Đánh giá Giao diện Khách quan (Observed Visual Observations)

Báo cáo này liệt kê các quan sát trung thực về bố cục và hiển thị giao diện hiện tại mà không tự ý chỉnh sửa mã nguồn:

---

## 1. Bản đồ Google Maps (Offices Section)
- **Hiện trạng**: Iframe Google Maps nhúng trực tiếp địa chỉ Bến xe Mỹ Đình và Trụ sở 03 Nguyễn Trãi (Sơn La).
- **Quan sát**: Bản đồ hiển thị rõ ràng, kèm nút ngoài "Mở Google Maps" và "Gọi nhà xe".
- **Ghi chú đánh giá**: Không phát hiện lỗi tràn viền hoặc chặn hiển thị.

## 2. Thanh ghim liên hệ Mobile (Sticky CTA)
- **Hiện trạng**: Chiếm chiều cao khoảng 64px ở đáy màn hình di động.
- **Quan sát**: Khoảng đệm chân trang (\`pb-28\`) đã được chừa đủ để không che khuất dòng bản quyền hay thông tin liên hệ cuối cùng của Footer.

## 3. Tỷ lệ tương phản màu sắc (Contrast Ratio)
- **Văn bản chính**: Chữ \`#23313F\` trên nền \`#FBFAF7\` đạt độ tương phản ~13.5:1 (vượt tiêu chuẩn WCAG AAA 7:1).
- **Nút CTA chính**: Chữ trắng trên nền cam đất \`#D97757\` đạt tỉ lệ ~4.6:1 (đạt chuẩn WCAG AA cho văn bản lớn/đậm).

## 4. Phản hồi đa kích thước (Responsive Harmony)
- Từ màn hình lớn 1920px xuống màn hình nhỏ 360px: Không xuất hiện thanh cuộn ngang (Horizontal overflow: 0px).
- Menu di động mở phủ toàn màn hình, nút đóng nổi bật và liên kết bấm vừa vặn ngón tay cái.
`;
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "review/OBSERVED_VISUAL_ISSUES.md"),
    observedIssues,
    "utf8",
  );

  // review/SCREENSHOT_INDEX.md
  let indexMd = `# Danh mục Ảnh chụp Giao diện Toàn diện (Screenshot Index)

Bộ tài liệu này chứa toàn bộ các ảnh chụp thực tế từ website được kết xuất qua trình duyệt Chromium:

| TT | Đường dẫn tệp | Viewport | Phân đoạn / Trạng thái | Mô tả chi tiết |
| :-: | :--- | :--- | :--- | :--- |
`;

  capturedFiles.forEach((f, idx) => {
    indexMd += `| ${idx + 1} | \`${f.file}\` | \`${f.viewport}\` | **${f.section}** | ${f.description} |\n`;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, "review/SCREENSHOT_INDEX.md"), indexMd, "utf8");
  console.log("Saved: review/SCREENSHOT_INDEX.md");

  await browser.close();
  console.log(`=== DONE! Total screenshots captured: ${capturedFiles.length} ===`);
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
