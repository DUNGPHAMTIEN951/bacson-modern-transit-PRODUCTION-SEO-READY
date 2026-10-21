/**
 * Production smoke/E2E validation (read-only, except mocked booking POST).
 * Never sends a synthetic passenger to the real Google Apps Script/CRM.
 */
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";

const root = (process.env.PROD_BASE_URL || "https://xekhachbaccuongnguyet.com").replace(/\/$/, "");
const resultsDir = "qa-results";
const screenshot = async (page, label) =>
  page.screenshot({
    path: `${resultsDir}/${label}.png`,
    fullPage: true,
    animations: "disabled",
    timeout: 20000,
  });

await mkdir(resultsDir, { recursive: true });
const report = {
  target: root,
  timestamp: new Date().toISOString(),
  checks: [],
  browserErrors: [],
  mockedLead: null,
};
const check = (name, condition, detail = "") => {
  report.checks.push({ name, passed: Boolean(condition), detail: String(detail).slice(0, 600) });
  console.log(
    `${condition ? "PASS" : "FAIL"} ${name}${detail ? " | " + String(detail).slice(0, 220) : ""}`,
  );
  if (!condition) throw Error(`SMOKE FAILURE: ${name}: ${detail}`);
};
const executablePath = process.env.CHROME_BIN || "/usr/bin/google-chrome";
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  for (const item of [
    { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 },
    {
      name: "desktop",
      viewport: { width: 1440, height: 900 },
      isMobile: false,
      deviceScaleFactor: 1,
    },
  ]) {
    const ctx = await browser.newContext({
      viewport: item.viewport,
      isMobile: item.isMobile,
      deviceScaleFactor: 1,
      locale: "vi-VN",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => report.browserErrors.push(`${item.name}: ${e.message}`));
    await ctx.route("**/*", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      const target = route.request().url();
      if (target.startsWith("https://script.google.com/macros/")) {
        const post = route.request().postData() || "";
        try {
          report.mockedLead = JSON.parse(post);
        } catch {
          report.mockedLead = { parseError: true };
        }
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: { "access-control-allow-origin": "*" },
          body: JSON.stringify({
            success: true,
            leadId: "QA-TEST-NO-REAL-CONVERSION",
            conversionEligible: false,
          }),
        });
      }
      console.log("Blocked other outbound POST in QA session:", new URL(target).origin);
      return route.abort();
    });

    const home = await page.goto(root + "/", { waitUntil: "domcontentloaded", timeout: 45000 });
    check(`${item.name} homepage HTTP 200`, home?.status() === 200, home?.status());
    const content = await page.locator("body").innerText();
    check(`${item.name} banner 20%`, content.includes("GIẢM 20% GIÁ VÉ CHO TẤT CẢ HÀNH KHÁCH"));
    check(`${item.name} fare 304000`, content.includes("304.000đ"));
    check(`${item.name} fare 240000`, content.includes("240.000đ"));
    await screenshot(page, `${item.name}-homepage`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(`${item.name} no horizontal overflow`, overflow <= 5, `${overflow}px`);

    if (item.name === "mobile") {
      await page.getByRole("button", { name: /Tư vấn ưu đãi/i }).click();
      const dialog = page.getByRole("dialog");
      check("mobile promotional booking dialog appears", await dialog.isVisible());
      check("mobile form has round-trip option", (await dialog.getByText("Khứ hồi").count()) > 0);
      await dialog.getByRole("button", { name: /Đóng cửa sổ/i }).click();
    }

    const landing = await page.goto(root + "/uu-dai-kham-benh", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    check(`${item.name} medical landing HTTP 200`, landing?.status() === 200, landing?.status());
    const landingText = await page.locator("body").innerText();
    check(
      `${item.name} medical transfer offer present`,
      landingText.includes("đưa đón") && landingText.includes("miễn phí"),
    );
    check(
      `${item.name} medical CTA telephone`,
      (await page.locator('a[href^="tel:"]').count()) >= 1,
    );
    check(
      `${item.name} medical CTA Zalo`,
      (await page.locator('a[href*="zalo.me/"]').count()) >= 1,
    );
    const form = page.locator("form").first();
    const fieldLabels = await form.locator("label").allTextContents();
    const departing = fieldLabels.findIndex((label) => label.includes("Ngày đi dự kiến"));
    const returning = fieldLabels.findIndex((label) => label.includes("Ngày về dự kiến"));
    check(`${item.name} departure date before return date`, departing >= 0 && returning > departing);
    check(
      `${item.name} round-trip prefilled`,
      (await form.locator('input[type="radio"][value="roundtrip"]').count()) > 0
        ? await form.locator('input[type="radio"][value="roundtrip"]').isChecked()
        : await form.locator('input[type="radio"]').last().isChecked(),
    );
    check(
      `${item.name} hospital transfer checkbox present`,
      (await form.getByText(/bệnh viện miễn phí/i).count()) > 0,
    );
    await screenshot(page, `${item.name}-medical-landing`);
    const landingOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    );
    check(
      `${item.name} medical no horizontal overflow`,
      landingOverflow <= 5,
      `${landingOverflow}px`,
    );

    if (item.name === "desktop") {
      const date = new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10);
      await form.locator('input[name="name"]').fill("KIEM THU E2E KHONG DAT VE");
      await form.locator('input[name="phone"]').fill("0900000000");
      const dateControl = form.locator('input[name="travel_date"]');
      await dateControl.fill(date);
      const ret = form.locator('input[id$="-return-date"]');
      await ret.fill(date);
      await form.locator('input[name="contact_consent"]').check();
      await form.getByRole("button", { name: /GỬI YÊU CẦU GỌI LẠI/i }).click();
      await page.waitForTimeout(1800);
      check(
        "mocked CRM request intercepted; NO REAL LEAD CREATED",
        Boolean(report.mockedLead),
        "Google Apps Script POST trapped and mocked",
      );
      check("CRM note includes discount", String(report.mockedLead?.note).includes("giảm 20%"));
      check("CRM note includes round trip", String(report.mockedLead?.note).includes("khứ hồi"));
      check(
        "CRM note includes hospital assistance",
        String(report.mockedLead?.note).includes("bệnh viện miễn phí"),
      );
      check("CRM note includes return date", String(report.mockedLead?.note).includes("Ngày về"));
      check(
        "mocked success UI renders",
        (await page.locator("body").innerText()).includes("Đã nhận yêu cầu của bạn"),
      );
      await screenshot(page, "desktop-mocked-booking-success");
    }
    await ctx.close();
  }
  for (const [path, expected] of [
    ["/son-la-ha-noi", "304.000đ"],
    ["/ha-noi-moc-chau", "240.000đ"],
  ]) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const response = await page.goto(root + path, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    check(`route ${path} HTTP 200`, response?.status() === 200, response?.status());
    check(
      `route ${path} discounted price`,
      (await page.locator("body").innerText()).includes(expected),
      expected,
    );
    await ctx.close();
  }
  check("no client JS errors", report.browserErrors.length === 0, report.browserErrors.join("; "));
} catch (err) {
  report.error = String(err.stack || err);
  console.error(report.error);
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(`${resultsDir}/report.json`, JSON.stringify(report, null, 2), "utf8");
  console.log(
    "QA RESULT",
    JSON.stringify({
      passed: report.checks.filter((x) => x.passed).length,
      failed: report.checks.filter((x) => !x.passed).length,
      error: report.error || null,
    }),
  );
}
