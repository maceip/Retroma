import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const EXEC = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = path.resolve("screenshots");
await mkdir(OUT, { recursive: true });

const shots = [
  {
    name: "09-live-pages-gallery.png",
    url: "https://maceip.github.io/Retroma/",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "10-live-pages-chat-app.png",
    url: "https://maceip.github.io/Retroma/chat-app.html",
    viewport: { width: 1440, height: 900 },
  },
];

const browser = await chromium.launch({ executablePath: EXEC });
try {
  for (const s of shots) {
    const context = await browser.newContext({
      viewport: s.viewport,
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    await page.goto(s.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, s.name), fullPage: false });
    console.log(`✓ ${s.name}`);
    await context.close();
  }
} finally {
  await browser.close();
}
