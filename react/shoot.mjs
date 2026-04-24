import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const EXEC = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = path.resolve("screenshots");
await mkdir(OUT, { recursive: true });

const shots = [
  {
    name: "01-chat-app-overview.png",
    url: "http://127.0.0.1:5173/chat-app.html",
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    wait: 600,
  },
  {
    name: "02-chat-app-full.png",
    url: "http://127.0.0.1:5173/chat-app.html",
    viewport: { width: 1440, height: 1100 },
    fullPage: true,
    wait: 600,
  },
  {
    name: "03-chat-app-mobile.png",
    url: "http://127.0.0.1:5173/chat-app.html",
    viewport: { width: 420, height: 900 },
    fullPage: false,
    wait: 600,
  },
  {
    name: "04-gallery-chat-composites.png",
    url: "http://127.0.0.1:5173/",
    viewport: { width: 1280, height: 900 },
    fullPage: false,
    wait: 1000,
    afterLoad: async (page) => {
      // Scroll to the Chat row
      await page.evaluate(() => {
        const el = document.querySelector('[data-component="Chat"]');
        if (el) el.scrollIntoView({ block: "start" });
      });
      await page.waitForTimeout(500);
    },
  },
  {
    name: "05-gallery-model-selector.png",
    url: "http://127.0.0.1:5173/",
    viewport: { width: 1280, height: 700 },
    fullPage: false,
    wait: 1000,
    afterLoad: async (page) => {
      await page.evaluate(() => {
        const el = document.querySelector('[data-component="ModelSelector"]');
        if (el) el.scrollIntoView({ block: "center" });
      });
      await page.waitForTimeout(500);
    },
  },
  {
    name: "06-gallery-prompt-input.png",
    url: "http://127.0.0.1:5173/",
    viewport: { width: 1280, height: 700 },
    fullPage: false,
    wait: 1000,
    afterLoad: async (page) => {
      await page.evaluate(() => {
        const el = document.querySelector('[data-component="PromptInput"]');
        if (el) el.scrollIntoView({ block: "center" });
      });
      await page.waitForTimeout(500);
    },
  },
];

const browser = await chromium.launch({ executablePath: EXEC });
const pageErrors = [];
try {
  for (const s of shots) {
    const context = await browser.newContext({ viewport: s.viewport });
    const page = await context.newPage();
    page.on("pageerror", (e) => pageErrors.push(`[${s.name}] ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") pageErrors.push(`[${s.name}][console] ${m.text()}`);
    });
    await page.goto(s.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(s.wait ?? 500);
    if (s.afterLoad) await s.afterLoad(page);
    const outPath = path.join(OUT, s.name);
    await page.screenshot({ path: outPath, fullPage: s.fullPage });
    console.log(`✓ ${s.name}`);
    await context.close();
  }
} finally {
  await browser.close();
}

if (pageErrors.length) {
  console.log("\n--- Errors captured during screenshotting ---");
  for (const e of pageErrors) console.log(e);
  process.exit(1);
}
