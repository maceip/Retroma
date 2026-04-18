# @retroma/react

A two-tier React design system:

1. **Base UI** — a full catalog of 52 headless, accessible primitives with the
   exact folder layout, file names, and public API of the
   [COSS](https://github.com/cosscom/coss) UI package
   (`packages/ui/src/components/*.tsx`). Each primitive is built on
   [`@base-ui/react`](https://base-ui.com) and styled with Tailwind v4.
2. **Retroma composites** — higher-level workspace pieces (`AppRibbon`,
   `FileExplorer`, `WorkspaceTabs`, `EditorCanvas`, `PropertiesView`,
   `CommandPalette`, `StatusBar`, …) that reproduce the Retroma / Obsidian
   visual language by composing the base primitives.

## Install

```bash
npm install @retroma/react react react-dom
```

## Use

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

## Folder layout

Mirrors COSS's `packages/ui/src/` one-to-one, plus a `composites/` folder for
the Retroma layer:

```
react/src/
├── base-ui/            # base-ui helpers (csp, direction, merge-props, use-render)
├── components/         # ← 52 primitives, one file per component
│   ├── accordion.tsx
│   ├── alert.tsx
│   ├── alert-dialog.tsx
│   ├── autocomplete.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── calendar.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── checkbox-group.tsx
│   ├── collapsible.tsx
│   ├── combobox.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── empty.tsx
│   ├── field.tsx
│   ├── fieldset.tsx
│   ├── form.tsx
│   ├── frame.tsx
│   ├── group.tsx
│   ├── input.tsx
│   ├── input-group.tsx
│   ├── kbd.tsx
│   ├── label.tsx
│   ├── menu.tsx
│   ├── meter.tsx
│   ├── number-field.tsx
│   ├── otp-field.tsx
│   ├── pagination.tsx
│   ├── popover.tsx
│   ├── preview-card.tsx
│   ├── progress.tsx
│   ├── radio-group.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── slider.tsx
│   ├── spinner.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toggle.tsx
│   ├── toggle-group.tsx
│   ├── toolbar.tsx
│   └── tooltip.tsx
├── composites/         # Retroma-specific arrangements
│   ├── ribbon/         # AppRibbon, RibbonAction, RibbonSeparator, RibbonTooltip
│   ├── file-explorer/  # TreeRoot, TreeFolder, TreeFile, TreeItemIcon, TreeItemLabel
│   ├── workspace-tabs/ # TabList, TabTrigger, TabCloseButton, TabFavicon
│   ├── editor/         # EditorCanvas, Gutter, GutterElement, TextLine, SyntaxToken
│   ├── properties-view/# PropertyRow, PropertyKey, PropertyValue, PropertyIcon
│   ├── modal/          # ModalOverlay, ModalContent, CommandPalette, SettingsModal
│   ├── status-bar/     # StatusBar, StatusGroup, StatusItem
│   └── layout/         # RetromaApp, WorkspaceSplit, WorkspaceLeaf
├── hooks/              # use-copy-to-clipboard, use-media-query
├── lib/
│   └── utils.ts        # cn()
└── styles/
    ├── globals.css             # Tailwind v4 + COSS tokens (from COSS upstream)
    ├── retroma-skin.css        # Re-maps COSS tokens onto Retroma palette
    ├── retroma-composites.css  # Layout for the composites tier
    ├── retroma.css             # ← public entry. imports all of the above.
    └── tokens.css              # Retroma-only design tokens
```

## Import subpaths

| Subpath                     | What you get                                |
| --------------------------- | ------------------------------------------- |
| `@retroma/react`            | **Tier 1** — the entire base UI catalog.    |
| `@retroma/react/composites` | **Tier 2** — Retroma composites.            |
| `@retroma/react/styles.css` | Complete stylesheet (skin + theme + layout). |
| `@retroma/react/globals.css`| Just the COSS globals (tokens + Tailwind).  |
| `@retroma/react/theme.css`  | The raw Retroma Obsidian theme.             |
| `@retroma/react/tokens.css` | Retroma palette only, no selectors.         |
| `@retroma/react/components/<name>` | Cherry-pick a single base primitive.  |
| `@retroma/react/hooks/<name>`      | Individual hook file.                 |

## Retroma composites

Every composite renders the same Obsidian class names `theme.css` already
targets, so the visual output is byte-identical to the upstream Retroma vault:

| Composite family | Exposed parts                                                 |
| ---------------- | ------------------------------------------------------------- |
| Layout           | `RetromaApp`, `WorkspaceSplit`, `WorkspaceLeaf`               |
| App Ribbon       | `AppRibbon`, `RibbonAction`, `RibbonSeparator`, `RibbonTooltip` |
| File Explorer    | `TreeRoot`, `TreeFolder`, `TreeFile`, `TreeItemIcon`, `TreeItemLabel` |
| Workspace Tabs   | `TabList`, `TabTrigger`, `TabCloseButton`, `TabFavicon`       |
| Editor           | `EditorCanvas`, `Gutter`, `GutterElement`, `TextLine`, `SyntaxToken` |
| Properties View  | `PropertiesView`, `PropertyRow`, `PropertyKey`, `PropertyValue`, `PropertyIcon` |
| Modal family     | `ModalOverlay`, `ModalContent`, `CommandPalette`, `CommandInput`, `CommandList`, `CommandItem`, `SettingsModal` |
| Status Bar       | `StatusBar`, `StatusGroup`, `StatusItem`                      |

## Licensing

The base-UI catalog is copied from COSS and remains under
**AGPL-3.0-or-later**. The Retroma composites, theme CSS, tokens, build
configuration, and docs are **MIT**-licensed. See [`NOTICE.md`](./NOTICE.md)
for the full rundown and `LICENSE-COSS` for the AGPL text.

## Theming

Override the one driving accent and the entire palette re-flows:

```css
:root {
  --interactive-accent: #d946ef;
}
```

Because the Retroma tokens map onto the same COSS token names (`--primary`,
`--background`, `--ring`, …), changing this single variable propagates through
every base primitive (Button, Card, Dialog, Tabs, …) _and_ every composite.
