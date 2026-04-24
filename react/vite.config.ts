import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = (p: string) => path.resolve(here, "src", p);
const examples = (p: string) => path.resolve(here, "examples", p);

/**
 * `base` controls the public path prefix for the built static site.
 *
 *   - Local dev / preview  → `/`
 *   - GitHub Pages         → `/<repo-name>/` (passed via VITE_BASE in CI)
 *
 * We default to `/` so `npm run build:gallery` without env flags still
 * produces a locally-servable bundle.
 */
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  /* index.html lives in examples/; src/ and node_modules/ sit alongside this
   * config so the whole project is one self-contained package. */
  root: path.resolve(here, "examples"),
  base,
  plugins: [react(), tailwind()],
  resolve: {
    /* Order matters — put the more specific aliases before the catch-all. */
    alias: [
      { find: /^@retroma\/react\/styles\.css$/, replacement: src("styles/retroma.css") },
      { find: /^@retroma\/react\/globals\.css$/, replacement: src("styles/globals.css") },
      { find: /^@retroma\/react\/tokens\.css$/, replacement: src("styles/tokens.css") },
      { find: /^@retroma\/react\/composites$/, replacement: src("composites/index.ts") },
      { find: /^@retroma\/react\/components\/(.*)$/, replacement: src("components/$1.tsx") },
      { find: /^@retroma\/react\/base-ui\/(.*)$/, replacement: src("base-ui/$1.ts") },
      { find: /^@retroma\/react\/hooks\/(.*)$/, replacement: src("hooks/$1.ts") },
      { find: /^@retroma\/react\/lib\/(.*)$/, replacement: src("lib/$1.ts") },
      { find: /^@retroma\/react$/, replacement: src("index.ts") },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    strictPort: false,
    host: "127.0.0.1",
    fs: {
      /* Allow Vite to serve files from src/ (one level up from root). */
      allow: [path.resolve(here)],
    },
  },
  build: {
    outDir: path.resolve(here, "dist-gallery"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        /* Landing page with links to the showcases. */
        main: examples("index.html"),
        /* The single-page Retroma Chat app. */
        "chat-app": examples("chat-app.html"),
      },
    },
  },
});
