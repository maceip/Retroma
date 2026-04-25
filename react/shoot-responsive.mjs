/**
 * Responsive screenshot harness.
 *
 * Captures every [data-component] row on the gallery at three viewports:
 *   - mobile    →  375 × 812 (iPhone 13 portrait)
 *   - foldable  →  717 × 768 (Galaxy Fold inner / square-ish)
 *   - desktop   → 1280 × 900
 *
 * Output:
 *   react/screenshots/responsive/<viewport>/<idx>-<slug>.png
 *   react/screenshots/responsive/_manifest.json
 *
 * Usage:
 *   GALLERY_URL=http://127.0.0.1:5186/ node shoot-responsive.mjs
 *   GALLERY_URL=https://maceip.github.io/Retroma/ node shoot-responsive.mjs
 *
 * Optional:
 *   ONLY=Button,Slider           — a comma-separated allow-list of component names
 *   VIEWPORTS=mobile,desktop     — restrict viewports to capture
 */

import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const EXEC = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const URL = process.env.GALLERY_URL ?? "http://127.0.0.1:5186/";
const ROOT = path.resolve("screenshots/responsive");
await mkdir(ROOT, { recursive: true });

const ALL_VIEWPORTS = {
  mobile:   { width: 375,  height: 812 },
  foldable: { width: 717,  height: 768 },
  desktop:  { width: 1280, height: 900 },
};
const VIEWPORTS = (process.env.VIEWPORTS?.split(",")
  .map((v) => v.trim())
  .filter(Boolean) ?? Object.keys(ALL_VIEWPORTS))
  .filter((v) => v in ALL_VIEWPORTS);

const ONLY = process.env.ONLY?.split(",").map((s) => s.trim()).filter(Boolean);

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const browser = await chromium.launch({ executablePath: EXEC });
const manifest = { url: URL, runs: [] };

try {
  for (const viewport of VIEWPORTS) {
    const dims = ALL_VIEWPORTS[viewport];
    const outDir = path.join(ROOT, viewport);
    await mkdir(outDir, { recursive: true });

    const ctx = await browser.newContext({
      viewport: dims,
      deviceScaleFactor: 2,
      ignoreHTTPSErrors: true,
    });
    const page = await ctx.newPage();
    console.log(`\n→ ${viewport} (${dims.width}×${dims.height})`);
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);

    const components = await page.$$eval("[data-component]", (els) =>
      els.map((el) => el.getAttribute("data-component")).filter(Boolean),
    );
    const targets = ONLY
      ? components.filter((n) => ONLY.includes(n))
      : components;
    console.log(`  ${targets.length} components`);

    let i = 0;
    for (const name of targets) {
      i++;
      const file = `${String(i).padStart(3, "0")}-${slug(name)}.png`;
      const out = path.join(outDir, file);
      const row = await page.$(
        `[data-component="${name.replace(/"/g, '\\"')}"]`,
      );
      if (!row) continue;
      await row.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      const demo = (await row.$(".gallery-row-demo")) ?? row;
      await demo.screenshot({ path: out });
      manifest.runs.push({ viewport, name, file });
    }

    await ctx.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(ROOT, "_manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(`\nwrote manifest with ${manifest.runs.length} captures`);
