/**
 * Re-shoot only the components touched by the 1–6 batch fix, plus a
 * couple of "should-be-unchanged" controls (Switch, Tabs) so we can
 * confirm we didn't regress them.
 *
 *     GALLERY_URL=http://127.0.0.1:5184/ node shoot-fixed.mjs
 *
 * Output:  screenshots/components-fixed/<idx>-<slug>.png
 */

import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const EXEC = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const URL = process.env.GALLERY_URL ?? "http://127.0.0.1:5184/";
const OUT = path.resolve("screenshots/components-fixed");
await mkdir(OUT, { recursive: true });

const TARGETS = [
  "CommitGraph",      // #1
  "Button",           // #2
  "Thread",           // #3
  "ModelSelector",    // #3 (was being overlapped by Thread)
  "SearchPanel",      // #4
  "BacklinksPanel",   // #4
  "AppRibbon",        // #5
  "Message family",   // #6
  // unchanged controls — should still look fine
  "Switch",
  "Tabs",
  "Sparkline",
];

const browser = await chromium.launch({ executablePath: EXEC });
try {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 1100 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  for (const name of TARGETS) {
    const row = await page.$(`[data-component="${name.replace(/"/g, '\\"')}"]`);
    if (!row) {
      console.log(`✗ ${name}  (not found)`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    const demo = (await row.$(".gallery-row-demo")) ?? row;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const out = path.join(OUT, `${slug}.png`);
    await demo.screenshot({ path: out });
    console.log(`✓ ${slug}.png`);
  }
} finally {
  await browser.close();
}
