import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const EXEC = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = path.resolve("screenshots");
await mkdir(OUT, { recursive: true });

const shots = [
  {
    name: "07-built-gallery-landing.png",
    url: "http://127.0.0.1:5183/index.html",
    viewport: { width: 1280, height: 800 },
  },
  {
    name: "08-built-chat-app.png",
    url: "http://127.0.0.1:5183/chat-app.html",
    viewport: { width: 1440, height: 900 },
  },
];

const browser = await chromium.launch({ executablePath: EXEC });
try {
  for (const s of shots) {
    const context = await browser.newContext({ viewport: s.viewport });
    const page = await context.newPage();
    await page.goto(s.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, s.name), fullPage: false });
    console.log(`✓ ${s.name}`);
    await context.close();
  }
} finally {
  await browser.close();
}
