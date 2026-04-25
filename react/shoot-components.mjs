/**
 * Capture one screenshot per component on the Retroma gallery.
 *
 * - Reads `[data-component]` rows from the live gallery.
 * - For each row, screenshots only the demo cell (`.gallery-row-demo`)
 *   so the captures isolate the Retroma component itself, not the
 *   surrounding label column.
 * - Writes to react/screenshots/components/<slug>.png plus a JSON
 *   manifest with viewport + bounding-box metadata.
 *
 * Usage:
 *
 *     # default — local dev server already running on 5173
 *     node shoot-components.mjs
 *
 *     # or against the deployed Pages site
 *     GALLERY_URL=https://maceip.github.io/Retroma/ node shoot-components.mjs
 */

import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const EXEC = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const URL = process.env.GALLERY_URL ?? "http://127.0.0.1:5173/";
const OUT = path.resolve("screenshots/components");
const VIEWPORT = { width: 1280, height: 1100 };

await mkdir(OUT, { recursive: true });

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const browser = await chromium.launch({ executablePath: EXEC });
const errors = [];
const manifest = [];

try {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    ignoreHTTPSErrors: true,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });

  console.log(`→ ${URL}`);
  await page.goto(URL, { waitUntil: "networkidle" });
  // Let async demo widgets settle (gauge fills, animated numbers, etc.).
  await page.waitForTimeout(1200);

  const components = await page.$$eval("[data-component]", (els) =>
    els.map((el) => el.getAttribute("data-component")).filter(Boolean),
  );

  console.log(`found ${components.length} components`);

  for (const name of components) {
    const file = `${String(manifest.length + 1).padStart(3, "0")}-${slug(name)}.png`;
    const out = path.join(OUT, file);

    const row = await page.$(`[data-component="${cssEscape(name)}"]`);
    if (!row) {
      errors.push(`missing row: ${name}`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    // Allow any IntersectionObserver-driven animations to start/finish.
    await page.waitForTimeout(150);

    // Prefer screenshotting just the demo cell — that's the actual
    // component. If the row has no demo cell (rare), fall back to the
    // whole row.
    const demo = await row.$(".gallery-row-demo");
    const target = demo ?? row;

    const box = await target.boundingBox();
    await target.screenshot({ path: out });
    console.log(`✓ ${file}  ${name}`);
    manifest.push({
      name,
      file,
      box,
    });
  }

  await context.close();
} finally {
  await browser.close();
}

await writeFile(
  path.join(OUT, "_manifest.json"),
  JSON.stringify({ url: URL, viewport: VIEWPORT, components: manifest }, null, 2),
);

if (errors.length) {
  console.log("\n--- non-fatal page errors ---");
  for (const e of errors.slice(0, 30)) console.log(e);
  if (errors.length > 30) console.log(`(+${errors.length - 30} more)`);
}

/* CSS.escape polyfill for attribute selectors with special chars. */
function cssEscape(s) {
  return s.replace(/(["\\])/g, "\\$1");
}
