/**
 * Capture the gallery sections that correspond to the reference image
 * stored at react/screenshots/reference/target-workspace.png.
 *
 * The reference shows a 4-pane Obsidian workspace:
 *   - AppRibbon  (top toolbar)
 *   - FileExplorer  (left sidebar)
 *   - WorkspaceTabs / Bases table  (centre)
 *   - GraphView panes (right, stacked)
 *   - StatusBar (bottom)
 *
 * For each of those components we screenshot only the demo cell in the
 * gallery so the captures can be reviewed alongside the reference.
 *
 * Output: react/screenshots/reference/current-<slug>.png
 */

import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const EXEC = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const URL = process.env.GALLERY_URL ?? "http://127.0.0.1:5173/";
const OUT = path.resolve("screenshots/reference");
const VIEWPORT = { width: 1280, height: 1100 };

const TARGETS = [
  "AppRibbon",
  "FileExplorer",
  "FileTree",
  "WorkspaceTabs",
  "BasesView",
  "PaneGroup",
  "PropertiesView",
  "StatusBar",
];

await mkdir(OUT, { recursive: true });

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const browser = await chromium.launch({ executablePath: EXEC });
try {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    ignoreHTTPSErrors: true,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });

  for (const name of TARGETS) {
    const row = page.locator(`[data-component="${name}"]`).first();
    if ((await row.count()) === 0) {
      console.warn(`! missing in gallery: ${name}`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    const demo = row.locator(".gallery-row-demo").first();
    const target = (await demo.count()) ? demo : row;
    const file = path.join(OUT, `current-${slug(name)}.png`);
    await target.screenshot({ path: file });
    console.log(`✓ ${name} -> ${file}`);
  }

  // overall page screenshot for context
  await page.screenshot({
    path: path.join(OUT, "current-gallery-full.png"),
    fullPage: true,
  });
} finally {
  await browser.close();
}
