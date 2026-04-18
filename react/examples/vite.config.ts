import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = (p: string) => path.resolve(here, "..", "src", p);

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    /* Order matters — put the more specific aliases before the catch-all. */
    alias: [
      { find: /^@retroma\/react\/styles\.css$/, replacement: src("styles/retroma.css") },
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
  },
});
