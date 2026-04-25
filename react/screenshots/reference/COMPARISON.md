# Reference comparison

`target-workspace.png` is the styling target — a four-pane Obsidian workspace
in the Retroma "soap-bubble" pastel-pink/lavender skin.

The `current-*.png` files are gallery captures of the components that appear
in the reference, taken with `shoot-reference.mjs` against the local dev
gallery at 1280×1100 (DPR 2).

## Component-by-component

| Reference element | Current gallery | Match |
| --- | --- | --- |
| Top ribbon — chunky squircle buttons w/ deep purple bevel | `current-appribbon.png` | ✅ shape, bevel, divider, icon weight all match. |
| Left file tree — folder rows + indented note bubbles + count badge | `current-fileexplorer.png` | ✅ folder icon, bold title, pill-shaped note rows, badge style match. |
| Centre table view — "Note / Topic"-style columns under a `Table · N results · ⇅ · ⚙` header | `current-basesview.png` | ✅ header chrome and pill-row table style match the reference's `Untitled` table. |
| Workspace tabs — pill tabs with close `×` and active state | `current-workspacetabs.png` | ✅ active tab tint + close affordance match. |
| Multi-pane container w/ vertical dividers | `current-panegroup.png` | ⚠ functional match, but reference panes are individually framed cards (deep purple border + corner radius) whereas PaneGroup uses one outer frame and slim handles. Visually the reference reads as "stacked Frame composites side-by-side" rather than a single split. |
| Status bar | `current-statusbar.png` | ⚠ correct shape and content (`117 words · Line 1, Col 1 · Markdown · UTF-8`) but the reference status bar is in the pink hue family, current is bluer/indigo. |
| Graph view (right column, two stacked instances) | _missing_ | ❌ no `GraphView` composite in the gallery yet. The reference shows a cluster of small dots connected by lines — closest existing component is `CommitGraph`, but a true note-graph composite is not wired in. |

## Recommended follow-ups

1. **GraphView composite** — add a small `GraphView` showing nodes + edges so
   the workspace can render the right-column "Graph view" pane from the
   reference. Reuse the SVG patterns already in `WorktreeLineage`.
2. **StatusBar tone** — sample the pink-hue surface used in the reference
   (`background-color: var(--background-modifier-cover)` or a new
   `--status-bar-bg` token mapping into the accent-1 ramp) so the status bar
   blends with the workspace surface instead of contrasting with it.
3. **Workspace example** — compose `RetromaApp` + `AppRibbon` + `FileExplorer`
   + `WorkspaceTabs` + `BasesView` + (new) `GraphView` x2 + `StatusBar` into a
   single `examples/WorkspaceApp.tsx` mirroring the reference layout 1:1.
   The chat-app example proves the shell works; this would be the canonical
   "workspace" demo.
4. **PaneGroup framing** — optional: when `mode="cards"` (new prop), render
   each pane inside a `Frame` so the pane boundaries match the reference's
   individually-framed columns. Default behaviour stays as-is.

## How to regenerate

```sh
cd react
node shoot-reference.mjs                 # uses local 5173 dev gallery
GALLERY_URL=https://maceip.github.io/Retroma/ node shoot-reference.mjs
```

Output lands in `react/screenshots/reference/current-*.png` next to the
target image so they can be reviewed pairwise.
