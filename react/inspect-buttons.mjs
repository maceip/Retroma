import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  ignoreHTTPSErrors: true,
});
const page = await context.newPage();
await page.goto("https://maceip.github.io/Retroma/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const row = await page.$('[data-component="Button"]');
await row.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const info = await row.$$eval('button', (els) =>
  els.map((el) => ({
    text: el.textContent?.trim(),
    bg: getComputedStyle(el).backgroundColor,
    color: getComputedStyle(el).color,
    border: getComputedStyle(el).borderColor,
  })),
);
console.log(JSON.stringify(info, null, 2));

await browser.close();
