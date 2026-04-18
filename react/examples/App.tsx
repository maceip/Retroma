import { useState } from "react";

/* ----- Tier 1 — base UI catalog (COSS-compatible) ------------------------- */
import { Badge, Button } from "@retroma/react";

/* ----- Tier 2 — Retroma composites --------------------------------------- */
import {
  AppRibbon,
  CommandPalette,
  EditorCanvas,
  Gutter,
  GutterElement,
  PropertiesView,
  PropertyIcon,
  PropertyKey,
  PropertyRow,
  PropertyValue,
  RetromaApp,
  RibbonAction,
  RibbonSeparator,
  SettingsModal,
  StatusBar,
  StatusGroup,
  StatusItem,
  SyntaxToken,
  TabFavicon,
  TabList,
  TabTrigger,
  TextLine,
  TreeFile,
  TreeFolder,
  TreeItemIcon,
  TreeItemLabel,
  TreeRoot,
  WorkspaceLeaf,
  WorkspaceSplit,
  type Command,
} from "@retroma/react/composites";

import "@retroma/react/styles.css";

const icon = (path: string) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
);

export default function ExampleApp() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState("welcome");
  const [selectedFile, setSelectedFile] = useState("welcome");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const commands: Command[] = [
    {
      id: "toggle-theme",
      label: "Toggle theme",
      hotkey: "⌘T",
      onSelect: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    },
    {
      id: "open-settings",
      label: "Open settings",
      hotkey: "⌘,",
      onSelect: () => setSettingsOpen(true),
    },
    {
      id: "new-note",
      label: "Create new note",
      hotkey: "⌘N",
      onSelect: () => {},
    },
  ];

  return (
    <RetromaApp theme={theme}>
      <AppRibbon>
        <RibbonAction
          label="Search"
          icon={icon("M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3")}
          onClick={() => setPaletteOpen(true)}
        />
        <RibbonAction
          label="New note"
          icon={icon("M12 5v14M5 12h14")}
        />
        <RibbonSeparator />
        <RibbonAction
          label="Settings"
          icon={icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z")}
          onClick={() => setSettingsOpen(true)}
        />
      </AppRibbon>

      <WorkspaceSplit side="left">
        <WorkspaceLeaf header={<span>Files</span>}>
          <TreeRoot
            defaultOpen={["notes"]}
            selectedId={selectedFile}
            onSelect={setSelectedFile}
          >
            <TreeFolder id="notes" label="Notes">
              <TreeFile
                id="welcome"
                label={<TreeItemLabel>Welcome to Retroma.md</TreeItemLabel>}
                icon={
                  <TreeItemIcon>
                    {icon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z")}
                  </TreeItemIcon>
                }
              />
              <TreeFile
                id="todo"
                label={<TreeItemLabel>todo.md</TreeItemLabel>}
                adornment={<Badge variant="secondary">3</Badge>}
              />
            </TreeFolder>
            <TreeFolder id="archive" label="Archive">
              <TreeFile id="old" label={<TreeItemLabel>old-note.md</TreeItemLabel>} />
            </TreeFolder>
          </TreeRoot>
        </WorkspaceLeaf>
      </WorkspaceSplit>

      <WorkspaceSplit side="main">
        <WorkspaceLeaf
          active
          header={
            <TabList
              activeId={activeTab}
              onActiveIdChange={setActiveTab}
              onClose={() => {}}
            >
              <TabTrigger id="welcome" label="Welcome to Retroma.md">
                <TabFavicon>
                  {icon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z")}
                </TabFavicon>
              </TabTrigger>
              <TabTrigger id="todo" label="todo.md">
                <TabFavicon>{icon("M9 11l3 3 8-8")}</TabFavicon>
              </TabTrigger>
            </TabList>
          }
        >
          <EditorCanvas>
            <Gutter>
              {Array.from({ length: 6 }).map((_, i) => (
                <GutterElement key={i}>{i + 1}</GutterElement>
              ))}
            </Gutter>
            <div className="cm-scroller" style={{ overflow: "auto" }}>
              <div className="cm-content">
                <TextLine headerLevel={1}>
                  <SyntaxToken kind="strong">Welcome to Retroma</SyntaxToken>
                </TextLine>
                <TextLine>
                  A tribute to the past with an eye toward the future.
                </TextLine>
                <TextLine>
                  Check <SyntaxToken kind="link">[[todo]]</SyntaxToken> or tag{" "}
                  <SyntaxToken kind="hashtag" tag="todo">#todo</SyntaxToken>.
                </TextLine>
                <TextLine>
                  <SyntaxToken kind="code">npm install @retroma/react</SyntaxToken>
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
              <PropertyValue type="text">Welcome to Retroma</PropertyValue>
            </PropertyRow>
            <PropertyRow>
              <PropertyKey icon={<PropertyIcon type="date" />} name="created" />
              <PropertyValue type="date">2025-10-01</PropertyValue>
            </PropertyRow>
            <PropertyRow>
              <PropertyKey icon={<PropertyIcon type="tags" />} name="tags" />
              <PropertyValue type="multiselect">
                <Badge variant="secondary">theme</Badge>
                <Badge variant="secondary">react</Badge>
              </PropertyValue>
            </PropertyRow>
          </PropertiesView>
          <div style={{ padding: 12 }}>
            <Button onClick={() => setPaletteOpen(true)}>Open palette</Button>
          </div>
        </WorkspaceLeaf>
      </WorkspaceSplit>

      <StatusBar>
        <StatusItem>117 words</StatusItem>
        <StatusItem>Line 1, Col 1</StatusItem>
        <StatusGroup align="end">
          <StatusItem>Markdown</StatusItem>
          <StatusItem>UTF-8</StatusItem>
          <StatusItem>{theme === "dark" ? "Dark" : "Light"}</StatusItem>
        </StatusGroup>
      </StatusBar>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
      >
        <div style={{ padding: 16 }}>
          <p>Theme settings, plugin management, etc. would live here.</p>
        </div>
      </SettingsModal>
    </RetromaApp>
  );
}
