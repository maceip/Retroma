# @retroma/react

The [Retroma](https://github.com/emarpiee/Retroma) Obsidian theme, refactored
into a **composable React component library**. Every component renders the same
DOM structure and class names that Retroma's `theme.css` already targets, so
the look is pixel-identical to the original Obsidian experience — no re-writing
of styles, no design drift.

> **Why?** Retroma was originally a single `theme.css` file plus Obsidian's
> built-in DOM. This package decomposes the DOM into reusable React primitives
> (`RibbonAction`, `TabTrigger`, `TreeFolder`, …) so you can build pages and
> tools that reuse Retroma's aesthetic outside Obsidian.

## Install

```bash
npm install @retroma/react clsx react react-dom
```

## Use

```tsx
import "@retroma/react/styles.css";

import {
  RetromaApp, WorkspaceSplit, WorkspaceLeaf,
  AppRibbon, RibbonAction, RibbonSeparator,
  TreeRoot, TreeFolder, TreeFile, TreeItemIcon, TreeItemLabel,
  TabList, TabTrigger, TabFavicon,
  EditorCanvas, Gutter, GutterElement, TextLine, SyntaxToken,
  PropertiesView, PropertyRow, PropertyKey, PropertyValue, PropertyIcon,
  CommandPalette, SettingsModal,
  StatusBar, StatusGroup, StatusItem,
  Button, Badge, Tooltip,
} from "@retroma/react";

export function App() {
  return (
    <RetromaApp theme="light">
      <AppRibbon>
        <RibbonAction label="Open file" icon={<FileIcon />} />
        <RibbonSeparator />
        <RibbonAction label="Settings" icon={<GearIcon />} />
      </AppRibbon>

      <WorkspaceSplit side="left">
        <WorkspaceLeaf header={<span>Files</span>}>
          <TreeRoot defaultOpen={["notes"]}>
            <TreeFolder id="notes" label="Notes">
              <TreeFile id="todo" label={<TreeItemLabel>todo.md</TreeItemLabel>} />
            </TreeFolder>
          </TreeRoot>
        </WorkspaceLeaf>
      </WorkspaceSplit>

      <WorkspaceSplit side="main">
        <WorkspaceLeaf
          header={
            <TabList defaultActiveId="todo">
              <TabTrigger id="todo" label="todo.md">
                <TabFavicon />
              </TabTrigger>
            </TabList>
          }
        >
          <EditorCanvas>
            <Gutter>
              <GutterElement>1</GutterElement>
              <GutterElement>2</GutterElement>
            </Gutter>
            <div className="cm-scroller">
              <div className="cm-content">
                <TextLine headerLevel={1}>
                  <SyntaxToken kind="strong">Today</SyntaxToken>
                </TextLine>
                <TextLine>
                  Try <SyntaxToken kind="link">[[Retroma]]</SyntaxToken>
                  &nbsp;with <SyntaxToken kind="hashtag" tag="todo">#todo</SyntaxToken>
                </TextLine>
              </div>
            </div>
          </EditorCanvas>
        </WorkspaceLeaf>
      </WorkspaceSplit>

      <WorkspaceSplit side="right">
        <WorkspaceLeaf header={<span>Properties</span>}>
          <PropertiesView>
            <PropertyRow>
              <PropertyKey icon={<PropertyIcon type="text" />} name="title" />
              <PropertyValue type="text">Retroma</PropertyValue>
            </PropertyRow>
          </PropertiesView>
        </WorkspaceLeaf>
      </WorkspaceSplit>

      <StatusBar>
        <StatusItem>117 words</StatusItem>
        <StatusGroup align="end">
          <StatusItem>Markdown</StatusItem>
          <StatusItem>UTF-8</StatusItem>
        </StatusGroup>
      </StatusBar>
    </RetromaApp>
  );
}
```

## Component map

The library decomposes Retroma into the following surfaces. Each component
renders the Obsidian class names the theme already targets.

### Layout

| Component        | Class names applied                   |
| ---------------- | ------------------------------------- |
| `RetromaApp`     | `.app-container .workspace`           |
| `WorkspaceSplit` | `.workspace-split .mod-left-split` …  |
| `WorkspaceLeaf`  | `.workspace-leaf` + `.view-header`    |

### AppRibbon

| Component         | Class names                                    |
| ----------------- | ---------------------------------------------- |
| `AppRibbon`       | `.workspace-ribbon .side-dock-ribbon`          |
| `RibbonAction`    | `.side-dock-ribbon-action .clickable-icon`     |
| `RibbonTooltip`   | (re-export of shared `Tooltip`)                |
| `RibbonSeparator` | `.side-dock-ribbon-separator`                  |

### FileExplorer

| Component       | Class names                                     |
| --------------- | ----------------------------------------------- |
| `TreeRoot`      | `.nav-files-container`                          |
| `TreeFolder`    | `.nav-folder` (+ `.is-collapsed` / `.mod-root`) |
| `TreeFile`      | `.nav-file`                                     |
| `TreeItemIcon`  | `.nav-file-icon`                                |
| `TreeItemLabel` | `.nav-file-title-content`                       |

### WorkspaceTabs

| Component        | Class names                        |
| ---------------- | ---------------------------------- |
| `TabList`        | `.workspace-tab-container`         |
| `TabTrigger`     | `.workspace-tab-header`            |
| `TabCloseButton` | `.workspace-tab-header-close`      |
| `TabFavicon`     | `.workspace-tab-header-inner-icon` |

### Editor

| Component       | Class names                                       |
| --------------- | ------------------------------------------------- |
| `EditorCanvas`  | `.markdown-source-view .cm-s-obsidian`            |
| `Gutter`        | `.cm-gutters .cm-gutter .cm-lineNumbers`          |
| `GutterElement` | `.cm-gutterElement`                               |
| `TextLine`      | `.cm-line` (`HyperMD-header-N`, `cm-active`, …)   |
| `SyntaxToken`   | `.cm-strong`, `.cm-em`, `.cm-link`, `.cm-hashtag` |

### PropertiesView

| Component       | Class names              |
| --------------- | ------------------------ |
| `PropertyRow`   | `.metadata-property`     |
| `PropertyKey`   | `.metadata-property-key` |
| `PropertyValue` | `.metadata-property-value` |
| `PropertyIcon`  | `.metadata-property-icon` |

### Modal / CommandPalette / SettingsModal

| Component        | Class names                 |
| ---------------- | --------------------------- |
| `ModalOverlay`   | `.modal-bg + .modal-container` |
| `ModalContent`   | `.modal` / `.prompt`        |
| `CommandInput`   | `.prompt-input-container`   |
| `CommandList`    | `.prompt-results`           |
| `CommandItem`    | `.suggestion-item`          |
| `SettingsModal`  | `.modal` variant of the above |

### StatusBar

| Component     | Class names         |
| ------------- | ------------------- |
| `StatusBar`   | `.status-bar`       |
| `StatusGroup` | `.status-bar-group` |
| `StatusItem`  | `.status-bar-item`  |

### Shared atomic ("Shadcn") layer

| Component    | Notes                                              |
| ------------ | -------------------------------------------------- |
| `Button`     | Supports `primary`, `ghost`, `warning`, `outline`. |
| `Input`      | Baseline styled input.                             |
| `Textarea`   | Baseline styled textarea.                          |
| `ScrollArea` | Vertical/horizontal scroll container.              |
| `Badge`      | Tag / pill with accent color prop.                 |
| `Separator`  | Horizontal or vertical divider.                    |
| `Tooltip`    | Hover/focus tooltip with side + delay.             |

## Theming

`@retroma/react/styles.css` imports the original `theme.css` from this repo
plus a small base reset. Override the driving accent with one CSS variable:

```css
:root {
  --interactive-accent: #d946ef;
}
```

That single variable powers the oklch algorithm for the entire palette.

### Tokens-only mode

If you want just the Retroma tokens (no Obsidian-specific selectors), import
`@retroma/react/tokens.css` instead and style your own primitives.

## License

MIT — same as the upstream Retroma theme.
