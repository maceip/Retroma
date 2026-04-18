# @retroma/react

A standalone React project with a two-tier design system:

1. **Base UI** — a full catalog of 52 headless, accessible primitives with the
   layout, file names, and public API of the
   [COSS](https://github.com/cosscom/coss) UI package. Built on
   [`@base-ui/react`](https://base-ui.com) and styled with Tailwind v4.
2. **Retroma composites** — higher-level workspace pieces (`AppRibbon`,
   `FileExplorer`, `WorkspaceTabs`, `EditorCanvas`, `PropertiesView`,
   `CommandPalette`, `StatusBar`, …) that reproduce the Retroma / Obsidian
   visual language by composing the base primitives.

## Quickstart

```
npm install
npm run dev
```

That's it. Open [http://127.0.0.1:5173](http://127.0.0.1:5173) and you get the
interactive component gallery (one component per row).

All other scripts:

| Script                | What it does                                             |
| --------------------- | -------------------------------------------------------- |
| `npm run dev`         | Vite dev server for the gallery in `examples/`           |
| `npm run build`       | `tsup` — builds the publishable library to `dist/`       |
| `npm run build:gallery` | Vite production build of the gallery to `dist-gallery/` |
| `npm run typecheck`   | `tsc --noEmit` across library + gallery                  |

## Layout

```
react/
├── package.json         # single package, single install
├── vite.config.ts       # Vite dev server (root = examples/)
├── tsup.config.ts       # library build
├── tsconfig.json        # shared tsconfig for lib + gallery
│
├── src/                 # the library
│   ├── index.ts              → tier-1 catalog barrel
│   ├── composites/index.ts   → tier-2 Retroma composites barrel
│   ├── base-ui/              → base-ui helpers (csp, direction, merge-props, use-render)
│   ├── components/           → 52 primitives, one file per component
│   ├── composites/           → Retroma-specific arrangements
│   ├── hooks/                → use-copy-to-clipboard, use-media-query
│   ├── lib/utils.ts          → cn()
│   └── styles/
│       ├── retroma.css             # public entry — imports all of the below
│       ├── globals.css             # Tailwind v4 + COSS tokens
│       ├── retroma-skin.css        # maps COSS tokens onto Retroma palette
│       ├── retroma-composites.css  # layout for the composites tier
│       ├── theme.css               # the original Retroma Obsidian theme
│       └── tokens.css              # Retroma palette only, no selectors
│
└── examples/            # the gallery app
    ├── index.html
    ├── main.tsx
    ├── Gallery.tsx      # one row per component, live demos
    └── gallery.css
```

Everything lives under one `package.json` — no symlinks, no workspaces, no
`file:..` self-references.

## Use as a library

```tsx
/* Tier 1 — base UI (same API as @coss/ui) */
import { Button, Tooltip, TooltipPopup, TooltipTrigger } from "@retroma/react";

/* Tier 2 — Retroma composites */
import {
  RetromaApp, WorkspaceSplit, WorkspaceLeaf,
  AppRibbon, RibbonAction, RibbonSeparator,
  TabList, TabTrigger,
  EditorCanvas, Gutter, GutterElement, TextLine, SyntaxToken,
  StatusBar, StatusGroup, StatusItem,
} from "@retroma/react/composites";

import "@retroma/react/styles.css";
```

Import subpaths:

| Subpath                     | What you get                                |
| --------------------------- | ------------------------------------------- |
| `@retroma/react`            | Tier 1 — the entire base UI catalog.        |
| `@retroma/react/composites` | Tier 2 — Retroma composites.                |
| `@retroma/react/styles.css` | Complete stylesheet (skin + theme + layout). |
| `@retroma/react/globals.css`| Just the COSS globals (tokens + Tailwind).  |
| `@retroma/react/theme.css`  | The raw Retroma Obsidian theme.             |
| `@retroma/react/tokens.css` | Retroma palette only, no selectors.         |
| `@retroma/react/components/<name>` | Cherry-pick a single base primitive.  |
| `@retroma/react/hooks/<name>`      | Individual hook file.                 |

## Theming

Override the one driving accent and the entire palette re-flows:

```css
:root {
  --interactive-accent: #d946ef;
}
```

Because the Retroma tokens map onto the COSS token names (`--primary`,
`--background`, `--ring`, …), changing this single variable propagates through
every base primitive _and_ every composite.

## Licensing

The base-UI catalog is derived from COSS and remains under
**AGPL-3.0-or-later**. The Retroma composites, theme CSS, tokens, build
configuration, and docs are **MIT**-licensed. See [`NOTICE.md`](./NOTICE.md)
and [`LICENSE-COSS`](./LICENSE-COSS).
