import { useState, type ReactNode } from "react";

/* ---- Base UI primitives (the full COSS catalog) ------------------------- */
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "@retroma/react/components/accordion";
import { Alert, AlertTitle, AlertDescription } from "@retroma/react/components/alert";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogBackdrop, AlertDialogPopup,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogClose,
} from "@retroma/react/components/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@retroma/react/components/avatar";
import { Badge } from "@retroma/react/components/badge";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@retroma/react/components/breadcrumb";
import { Button } from "@retroma/react/components/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@retroma/react/components/card";
import { Checkbox } from "@retroma/react/components/checkbox";
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "@retroma/react/components/collapsible";
import {
  Dialog, DialogTrigger, DialogBackdrop, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@retroma/react/components/dialog";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@retroma/react/components/empty";
import { Field, FieldLabel, FieldDescription } from "@retroma/react/components/field";
import { Group } from "@retroma/react/components/group";
import { Input } from "@retroma/react/components/input";
import { Kbd } from "@retroma/react/components/kbd";
import { Label } from "@retroma/react/components/label";
import { Meter, MeterLabel, MeterTrack, MeterIndicator, MeterValue } from "@retroma/react/components/meter";
import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldDecrement, NumberFieldIncrement } from "@retroma/react/components/number-field";
import { Popover, PopoverTrigger, PopoverPopup, PopoverTitle, PopoverDescription } from "@retroma/react/components/popover";
import { PreviewCard, PreviewCardTrigger, PreviewCardPopup } from "@retroma/react/components/preview-card";
import { Progress, ProgressLabel, ProgressTrack, ProgressIndicator, ProgressValue } from "@retroma/react/components/progress";
import { RadioGroup, RadioGroupItem } from "@retroma/react/components/radio-group";
import { ScrollArea } from "@retroma/react/components/scroll-area";
import { Separator } from "@retroma/react/components/separator";
import { Skeleton } from "@retroma/react/components/skeleton";
import { Slider } from "@retroma/react/components/slider";
import { Spinner } from "@retroma/react/components/spinner";
import { Switch } from "@retroma/react/components/switch";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@retroma/react/components/table";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@retroma/react/components/tabs";
import { Textarea } from "@retroma/react/components/textarea";
import { Toggle } from "@retroma/react/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@retroma/react/components/toggle-group";
import { Tooltip, TooltipTrigger, TooltipPopup, TooltipProvider } from "@retroma/react/components/tooltip";

/* ---- Retroma composites (Tier 2) ---------------------------------------- */
import {
  AppRibbon, RibbonAction, RibbonSeparator,
  TreeRoot, TreeFolder, TreeFile, TreeItemIcon, TreeItemLabel,
  FileExplorerToolbar, FileExplorerToolbarAction,
  TabList, TabTrigger, TabFavicon,
  EditorCanvas, Gutter, GutterElement, TextLine, SyntaxToken,
  PropertiesView, PropertyRow, PropertyKey, PropertyValue, PropertyIcon,
  StatusBar, StatusGroup, StatusItem,
  CommandPalette, SettingsModal,
  WorkspaceSplit, WorkspaceLeaf,
  ThemeTunerProvider, ThemeTunerPanel,
  Callout, CalloutTitle, CalloutContent,
  CalendarWidget,
  BacklinksPanel, BacklinkItem, BacklinksSection,
  SearchPanel, SearchInput, SearchToolbar, SearchResult,
  TaskCard, TaskItem,
  KanbanBoard, KanbanColumn, KanbanCard,
  NotePreviewCard,
  BasesView, BasesRow, BasesCell, BasesHeader,
  type Command,
} from "@retroma/react/composites";

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

function Row({ name, file, children }: { name: string; file: string; children: ReactNode }) {
  return (
    <div className="gallery-row" data-component={name}>
      <div className="gallery-row-label">
        <span className="gallery-row-name">{name}</span>
        <span className="gallery-row-sub">{file}</span>
      </div>
      <div className="gallery-row-demo">{children}</div>
    </div>
  );
}

function Fallback({ label }: { label: string }) {
  return <span className="fallback">{label}</span>;
}

export default function Gallery() {
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("b");
  const [slider, setSlider] = useState<number[]>([40]);
  const [toggle, setToggle] = useState(false);
  const [toggleGroup, setToggleGroup] = useState<string[]>(["bold"]);
  const [textareaVal, setTextareaVal] = useState("Retroma is cozy.");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("welcome");
  const [selectedFile, setSelectedFile] = useState("welcome");

  const commands: Command[] = [
    { id: "toggle-theme", label: "Toggle theme", hotkey: "⌘T" },
    { id: "open-settings", label: "Open settings", hotkey: "⌘,", onSelect: () => setSettingsOpen(true) },
    { id: "new-note", label: "Create new note", hotkey: "⌘N" },
  ];

  return (
    <ThemeTunerProvider>
    <TooltipProvider>
      <div className="gallery">
        <div className="gallery-header">
          <h1>Retroma UI — Component Gallery</h1>
          <p>
            Top section: the Retroma composites wired up as a mini workspace.
            Below: one row per base UI primitive (COSS catalog, skinned).
          </p>
        </div>

        {/* ================================================================ */}
        {/*   RETROMA COMPOSITES — "The Lab"                                 */}
        {/* ================================================================ */}
        <div className="gallery-section-title">Retroma composites — the lab</div>
        <div className="gallery-lab">

          <Row name="ThemeTunerPanel" file="composites/theme-tuner/">
            <ThemeTunerPanel />
          </Row>

          <div className="lab-workspace is-focused">
            <AppRibbon>
              <RibbonAction label="Search" icon={icon("M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3")} onClick={() => setPaletteOpen(true)} />
              <RibbonAction label="New note" icon={icon("M12 5v14M5 12h14")} />
              <RibbonSeparator />
              <RibbonAction label="Settings" icon={icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z")} onClick={() => setSettingsOpen(true)} />
            </AppRibbon>

            <WorkspaceSplit side="left">
              <WorkspaceLeaf header={<span>Files</span>}>
                <FileExplorerToolbar>
                  <FileExplorerToolbarAction label="New note" icon={icon("M12 5v14M5 12h14")} />
                  <FileExplorerToolbarAction label="New folder" icon={icon("M3 7h5l2 2h11v11H3z")} />
                  <FileExplorerToolbarAction label="Sort" icon={icon("M3 6h18M6 12h12M10 18h4")} />
                  <FileExplorerToolbarAction label="Collapse all" icon={icon("M7 11l5-5 5 5M7 17l5-5 5 5")} />
                  <FileExplorerToolbarAction label="Change view" icon={icon("M3 6h18M3 12h18M3 18h18")} />
                </FileExplorerToolbar>
                <TreeRoot defaultOpen={["notes", "atlas", "cards"]} selectedId={selectedFile} onSelect={setSelectedFile}>
                  <TreeFolder id="encounters" label="00-encounters">
                    <TreeFile id="e1" label={<TreeItemLabel>dragons.md</TreeItemLabel>} />
                  </TreeFolder>
                  <TreeFolder id="atlas" label="01-atlas">
                    <TreeFile id="a1" label={<TreeItemLabel>regions.md</TreeItemLabel>} />
                  </TreeFolder>
                  <TreeFolder id="calendar" label="02-calendar">
                    <TreeFile id="c1" label={<TreeItemLabel>events.md</TreeItemLabel>} />
                  </TreeFolder>
                  <TreeFolder id="cards" label="03-cards">
                    <TreeFile id="d1" label={<TreeItemLabel>deck.md</TreeItemLabel>} adornment={<Badge variant="secondary">3</Badge>} />
                  </TreeFolder>
                  <TreeFolder id="notes" label="Notes">
                    <TreeFile id="welcome" label={<TreeItemLabel>Welcome.md</TreeItemLabel>} icon={<TreeItemIcon>{icon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z")}</TreeItemIcon>} />
                    <TreeFile id="todo" label={<TreeItemLabel>todo.md</TreeItemLabel>} adornment={<Badge variant="secondary">2</Badge>} />
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
                  <TabList activeId={activeTab} onActiveIdChange={setActiveTab}>
                    <TabTrigger id="welcome" label="Welcome.md">
                      <TabFavicon>{icon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z")}</TabFavicon>
                    </TabTrigger>
                    <TabTrigger id="todo" label="todo.md">
                      <TabFavicon>{icon("M9 11l3 3 8-8")}</TabFavicon>
                    </TabTrigger>
                  </TabList>
                }
              >
                <EditorCanvas>
                  <Gutter>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <GutterElement key={i}>{i + 1}</GutterElement>
                    ))}
                  </Gutter>
                  <div className="cm-scroller" style={{ overflow: "auto" }}>
                    <div className="cm-content">
                      <TextLine headerLevel={1}>Obsidian Markdown</TextLine>
                      <TextLine>
                        <SyntaxToken kind="hashtag" tag="tags">#tags</SyntaxToken>{" "}
                        <SyntaxToken kind="hashtag" tag="work">#work</SyntaxToken>{" "}
                        <SyntaxToken kind="hashtag" tag="home">#home</SyntaxToken>{" "}
                        <SyntaxToken kind="hashtag" tag="test">#test</SyntaxToken>{" "}
                        <SyntaxToken kind="hashtag" tag="todo">#todo</SyntaxToken>
                      </TextLine>
                      <TextLine>
                        <SyntaxToken kind="hashtag" tag="low">#low</SyntaxToken>{" "}
                        <SyntaxToken kind="hashtag" tag="medium">#medium</SyntaxToken>{" "}
                        <SyntaxToken kind="hashtag" tag="obsidian">#obsidian</SyntaxToken>
                      </TextLine>
                      <TextLine headerLevel={2}>Retroma Theme</TextLine>
                      <TextLine>
                        A tribute to the past with an eye toward the future —
                        try <SyntaxToken kind="strong">bold</SyntaxToken>,{" "}
                        <SyntaxToken kind="em">italic</SyntaxToken>, and{" "}
                        <SyntaxToken kind="link">[[wiki-links]]</SyntaxToken>.
                      </TextLine>
                      <TextLine><SyntaxToken kind="code">npm install @retroma/react</SyntaxToken></TextLine>
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
              </WorkspaceLeaf>
            </WorkspaceSplit>

            <StatusBar>
              <StatusItem>117 words</StatusItem>
              <StatusItem>Line 1, Col 1</StatusItem>
              <StatusGroup align="end">
                <StatusItem>Markdown</StatusItem>
                <StatusItem>UTF-8</StatusItem>
              </StatusGroup>
            </StatusBar>
          </div>

          <Row name="AppRibbon" file="composites/ribbon/">
            <AppRibbon collapsed={false}>
              <RibbonAction label="Search" icon={icon("M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3")} />
              <RibbonAction label="New" icon={icon("M12 5v14M5 12h14")} />
              <RibbonSeparator />
              <RibbonAction label="Settings" icon={icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z")} />
            </AppRibbon>
          </Row>

          <Row name="FileExplorer" file="composites/file-explorer/">
            <div style={{ width: 220 }}>
              <TreeRoot defaultOpen={["demo"]}>
                <TreeFolder id="demo" label="demo">
                  <TreeFile id="a" label={<TreeItemLabel>notes.md</TreeItemLabel>} />
                  <TreeFile id="b" label={<TreeItemLabel>todo.md</TreeItemLabel>} adornment={<Badge variant="secondary">2</Badge>} />
                </TreeFolder>
                <TreeFolder id="archive" label="archive">
                  <TreeFile id="c" label={<TreeItemLabel>old.md</TreeItemLabel>} />
                </TreeFolder>
              </TreeRoot>
            </div>
          </Row>

          <Row name="WorkspaceTabs" file="composites/workspace-tabs/">
            <TabList defaultActiveId="welcome">
              <TabTrigger id="welcome" label="Welcome.md" />
              <TabTrigger id="todo" label="todo.md" />
              <TabTrigger id="archive" label="archive.md" />
            </TabList>
          </Row>

          <Row name="EditorCanvas + Gutter + SyntaxToken" file="composites/editor/">
            <div style={{ width: 520, height: 160 }}>
              <EditorCanvas>
                <Gutter>
                  {[1, 2, 3, 4, 5].map((n) => <GutterElement key={n}>{n}</GutterElement>)}
                </Gutter>
                <div className="cm-content">
                  <TextLine headerLevel={1}><SyntaxToken kind="strong">Hello</SyntaxToken></TextLine>
                  <TextLine>Write in <SyntaxToken kind="em">style</SyntaxToken>.</TextLine>
                  <TextLine>Link: <SyntaxToken kind="link">[[Retroma]]</SyntaxToken></TextLine>
                  <TextLine>Tag: <SyntaxToken kind="hashtag" tag="todo">#todo</SyntaxToken></TextLine>
                </div>
              </EditorCanvas>
            </div>
          </Row>

          <Row name="PropertiesView" file="composites/properties-view/">
            <div style={{ width: 360 }}>
              <PropertiesView>
                <PropertyRow>
                  <PropertyKey icon={<PropertyIcon type="text" />} name="title" />
                  <PropertyValue type="text">Retroma</PropertyValue>
                </PropertyRow>
                <PropertyRow>
                  <PropertyKey icon={<PropertyIcon type="tags" />} name="tags" />
                  <PropertyValue type="multiselect">
                    <Badge variant="secondary">obsidian</Badge>
                    <Badge variant="secondary">react</Badge>
                  </PropertyValue>
                </PropertyRow>
              </PropertiesView>
            </div>
          </Row>

          <Row name="CommandPalette" file="composites/modal/">
            <Button onClick={() => setPaletteOpen(true)}>Open command palette</Button>
          </Row>

          <Row name="SettingsModal" file="composites/modal/">
            <Button variant="outline" onClick={() => setSettingsOpen(true)}>Open settings</Button>
          </Row>

          <Row name="StatusBar" file="composites/status-bar/">
            <div style={{ width: 520 }}>
              <StatusBar>
                <StatusItem>117 words</StatusItem>
                <StatusItem>Line 1, Col 1</StatusItem>
                <StatusGroup align="end">
                  <StatusItem>Markdown</StatusItem>
                  <StatusItem>UTF-8</StatusItem>
                </StatusGroup>
              </StatusBar>
            </div>
          </Row>

          <Row name="Callout" file="composites/callout/">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: 520 }}>
              <Callout variant="note">
                <CalloutTitle>Note</CalloutTitle>
                <CalloutContent>Leave a reminder for future you.</CalloutContent>
              </Callout>
              <Callout variant="warning">
                <CalloutTitle>Warning</CalloutTitle>
                <CalloutContent>Here be dragons.</CalloutContent>
              </Callout>
              <Callout variant="success">
                <CalloutTitle>Success</CalloutTitle>
                <CalloutContent>Tests passing, vibes intact.</CalloutContent>
              </Callout>
              <Callout variant="quote">
                <CalloutTitle>Quote</CalloutTitle>
                <CalloutContent>"Choose one color to rule them all."</CalloutContent>
              </Callout>
            </div>
          </Row>

          <Row name="CalendarWidget" file="composites/calendar-widget/">
            <CalendarWidget />
          </Row>

          <Row name="BacklinksPanel" file="composites/backlinks/">
            <div style={{ width: 320 }}>
              <BacklinksPanel title="Links" count={6}>
                <BacklinkItem>mark-ryan-perez</BacklinkItem>
                <BacklinkItem snippet="The way light moves through a prism…">
                  color-and-light-introduction
                </BacklinkItem>
                <BacklinkItem>how-we-perceive-colors</BacklinkItem>
                <BacklinkItem>Color — Elements of Art</BacklinkItem>
                <BacklinkItem>psychophysical-color</BacklinkItem>
                <BacklinkItem>perceived-color</BacklinkItem>
                <BacklinksSection title="Unlinked mentions">
                  <BacklinkItem snippet="At its most basic, color is a property of light.">
                    color-introduction
                  </BacklinkItem>
                </BacklinksSection>
              </BacklinksPanel>
            </div>
          </Row>

          <Row name="SearchPanel" file="composites/search-panel/">
            <div style={{ width: 320 }}>
              <SearchPanel>
                <SearchInput
                  placeholder="Search…"
                  defaultValue="tag:Art"
                  adornments={<><span title="Match case">Aa</span><span>⚙</span></>}
                />
                <SearchToolbar count="131 results" controls={<span>↕</span>} />
                <SearchResult title="art-is-a-process" meta={<span>tags: Zettels, Art</span>} />
                <SearchResult title="art-is-an-expression-of-humanness" meta={<span>tags: Zettels, Art</span>} />
                <SearchResult title="art-is-communication" meta={<span>tags: Zettels, Art</span>} />
              </SearchPanel>
            </div>
          </Row>

          <Row name="TaskCard" file="composites/task-card/">
            <TaskCard
              title="Tasks"
              controls={<span>⋯</span>}
              footer={
                <>
                  <Badge variant="secondary">#inbox</Badge>
                  <Badge variant="secondary">#today</Badge>
                </>
              }
            >
              <TaskItem>Port Retroma theme to React</TaskItem>
              <TaskItem checked>Build Tier-1 base UI</TaskItem>
              <TaskItem>Ship Kanban + Bases composites</TaskItem>
              <TaskItem>Docs and playground</TaskItem>
            </TaskCard>
          </Row>

          <Row name="KanbanBoard" file="composites/kanban/">
            <div style={{ width: 720 }}>
              <KanbanBoard>
                <KanbanColumn title="Backlog" count={3}>
                  <KanbanCard title="Dark mode lightness tuner" footer={<Badge variant="secondary">#theme</Badge>}>
                    Slider from 0.1 to 0.4.
                  </KanbanCard>
                  <KanbanCard title="Typography variants">
                    Cascadia / W95 / Excalifont.
                  </KanbanCard>
                  <KanbanCard title="Mobile polish" />
                </KanbanColumn>
                <KanbanColumn title="In Progress" count={2}>
                  <KanbanCard title="Color Scheme Tuner" footer={<><Badge variant="secondary">#theme</Badge><Badge variant="secondary">#today</Badge></>}>
                    Analogous / Split / Mono / Triadic.
                  </KanbanCard>
                  <KanbanCard title="Retro composites" />
                </KanbanColumn>
                <KanbanColumn title="Done" count={5}>
                  <KanbanCard title="Gallery page">Base + Lab sections</KanbanCard>
                  <KanbanCard title="Base UI skinning" />
                </KanbanColumn>
              </KanbanBoard>
            </div>
          </Row>

          <Row name="NotePreviewCard" file="composites/note-preview/">
            <NotePreviewCard
              path="07-zettels / what-is-color"
              controls={<><span>⤓</span><span>↗</span></>}
              title="What is Color?"
              image={
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcB77, #4d96ff, #9b5de5)",
                    width: "100%",
                    height: "100%",
                  }}
                />
              }
            >
              At its most basic, <strong>color is a property of light</strong>.
              Light is made up of different wavelengths, each corresponding to a
              different color. When light hits an object, some wavelengths are
              absorbed and others are reflected.
            </NotePreviewCard>
          </Row>

          <Row name="BasesView" file="composites/bases-view/">
            <div style={{ width: 520 }}>
              <BasesView toolbar={<span>Table · 70 results · ↕ · ⚙</span>}>
                <BasesHeader>
                  <div>Note</div>
                  <div>Topic</div>
                </BasesHeader>
                <BasesRow>
                  <BasesCell>The Three Aspe…</BasesCell>
                  <BasesCell>Turn Traditional…</BasesCell>
                </BasesRow>
                <BasesRow>
                  <BasesCell>Value Grouping</BasesCell>
                  <BasesCell>Value in Art</BasesCell>
                </BasesRow>
                <BasesRow>
                  <BasesCell>Value Keying</BasesCell>
                  <BasesCell>Value Scale</BasesCell>
                </BasesRow>
                <BasesRow>
                  <BasesCell>Vision is Subjec…</BasesCell>
                  <BasesCell active>Visual Language</BasesCell>
                </BasesRow>
              </BasesView>
            </div>
          </Row>

        </div>

        {/* ================================================================ */}
        {/*   BASE UI PRIMITIVES                                             */}
        {/* ================================================================ */}
        <div className="gallery-section-title">Base UI — 52 primitives</div>
        <div className="gallery-list">

          <Row name="Accordion" file="components/accordion.tsx">
            <Accordion className="w-full max-w-sm">
              <AccordionItem value="a">
                <AccordionTrigger>Section A</AccordionTrigger>
                <AccordionPanel>Contents of section A.</AccordionPanel>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger>Section B</AccordionTrigger>
                <AccordionPanel>Contents of section B.</AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Row>

          <Row name="Alert" file="components/alert.tsx">
            <Alert className="max-w-sm">
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>Your vault has unsaved changes.</AlertDescription>
            </Alert>
          </Row>

          <Row name="Alert Dialog" file="components/alert-dialog.tsx">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive-outline">Delete note</Button>} />
              <AlertDialogBackdrop />
              <AlertDialogPopup>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogClose render={<Button variant="outline">Cancel</Button>} />
                  <AlertDialogClose render={<Button variant="destructive">Delete</Button>} />
                </AlertDialogFooter>
              </AlertDialogPopup>
            </AlertDialog>
          </Row>

          <Row name="Autocomplete" file="components/autocomplete.tsx">
            <Fallback label="Interactive search-to-select — see Combobox row." />
          </Row>

          <Row name="Avatar" file="components/avatar.tsx">
            <Avatar>
              <AvatarImage src="https://avatars.githubusercontent.com/u/9919?s=64" alt="" />
              <AvatarFallback>RT</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>OB</AvatarFallback>
            </Avatar>
          </Row>

          <Row name="Badge" file="components/badge.tsx">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </Row>

          <Row name="Breadcrumb" file="components/breadcrumb.tsx">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Vault</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Notes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>todo.md</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Row>

          <Row name="Button" file="components/button.tsx">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </Row>

          <Row name="Calendar" file="components/calendar.tsx">
            <Fallback label="Renders a full react-day-picker calendar — mount standalone for demo." />
          </Row>

          <Row name="Card" file="components/card.tsx">
            <Card className="max-w-xs">
              <CardHeader>
                <CardTitle>Retroma</CardTitle>
                <CardDescription>Obsidian, with personality.</CardDescription>
              </CardHeader>
              <CardContent>A card renders a framed container with content.</CardContent>
            </Card>
          </Row>

          <Row name="Checkbox" file="components/checkbox.tsx">
            <Label className="flex items-center gap-2">
              <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
              Accept terms
            </Label>
          </Row>

          <Row name="Checkbox Group" file="components/checkbox-group.tsx">
            <Fallback label="Pairs with Checkbox — value array managed via Field." />
          </Row>

          <Row name="Collapsible" file="components/collapsible.tsx">
            <Collapsible className="max-w-sm">
              <CollapsibleTrigger render={<Button variant="outline" size="sm">Toggle details</Button>} />
              <CollapsiblePanel className="mt-2 text-sm text-muted-foreground">
                Hidden content appears here when expanded.
              </CollapsiblePanel>
            </Collapsible>
          </Row>

          <Row name="Combobox" file="components/combobox.tsx">
            <Fallback label="Interactive search + chips (443 LOC) — dedicated demo in /combobox." />
          </Row>

          <Row name="Command" file="components/command.tsx">
            <Fallback label="Command palette dialog — see composites/CommandPalette." />
          </Row>

          <Row name="Date Picker" file="(composed from calendar + popover)">
            <Fallback label="Built by composing Calendar inside Popover." />
          </Row>

          <Row name="Dialog" file="components/dialog.tsx">
            <Dialog>
              <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
              <DialogBackdrop />
              <DialogPopup>
                <DialogHeader>
                  <DialogTitle>Save changes?</DialogTitle>
                  <DialogDescription>You have unsaved edits to this note.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">Discard</Button>} />
                  <DialogClose render={<Button>Save</Button>} />
                </DialogFooter>
              </DialogPopup>
            </Dialog>
          </Row>

          <Row name="Drawer" file="components/drawer.tsx">
            <Fallback label="Mobile-first swipeable panel — opens from bottom / sides." />
          </Row>

          <Row name="Empty" file="components/empty.tsx">
            <Empty className="max-w-sm">
              <EmptyHeader>
                <EmptyTitle>No notes yet</EmptyTitle>
                <EmptyDescription>Start by creating your first note.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Row>

          <Row name="Field" file="components/field.tsx">
            <Field className="max-w-sm">
              <FieldLabel>Email</FieldLabel>
              <Input type="email" placeholder="you@example.com" />
              <FieldDescription>We&rsquo;ll never share your email.</FieldDescription>
            </Field>
          </Row>

          <Row name="Fieldset" file="components/fieldset.tsx">
            <Fallback label="Wraps a group of fields with a shared legend." />
          </Row>

          <Row name="Form" file="components/form.tsx">
            <Fallback label="Headless form container — works alongside Field/Fieldset." />
          </Row>

          <Row name="Frame" file="components/frame.tsx">
            <Fallback label="Layout primitive for constraining aspect ratio / viewport." />
          </Row>

          <Row name="Group" file="components/group.tsx">
            <Group>
              <Button variant="outline" size="sm">Left</Button>
              <Button variant="outline" size="sm">Middle</Button>
              <Button variant="outline" size="sm">Right</Button>
            </Group>
          </Row>

          <Row name="Input" file="components/input.tsx">
            <Input className="max-w-xs" placeholder="Filename…" />
          </Row>

          <Row name="Input Group" file="components/input-group.tsx">
            <Fallback label="Attaches an addon / button to an Input — see Field demo." />
          </Row>

          <Row name="Kbd" file="components/kbd.tsx">
            <span className="text-sm">Toggle palette: <Kbd>⌘</Kbd><Kbd>K</Kbd></span>
          </Row>

          <Row name="Label" file="components/label.tsx">
            <Label htmlFor="demo-label">Vault name</Label>
            <Input id="demo-label" defaultValue="Retroma" className="max-w-xs" />
          </Row>

          <Row name="Menu" file="components/menu.tsx">
            <Fallback label="Dropdown / context menu — use MenuTrigger + MenuPopup." />
          </Row>

          <Row name="Meter" file="components/meter.tsx">
            <Meter value={0.62} className="w-56">
              <div className="flex items-center justify-between">
                <MeterLabel>Disk</MeterLabel>
                <MeterValue />
              </div>
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
            </Meter>
          </Row>

          <Row name="Number Field" file="components/number-field.tsx">
            <NumberField defaultValue={5} min={0} max={10}>
              <NumberFieldGroup>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
          </Row>

          <Row name="OTP Field" file="components/otp-field.tsx">
            <Fallback label="One-time-password input grid — uses OTPFieldInput slots." />
          </Row>

          <Row name="Pagination" file="components/pagination.tsx">
            <Fallback label="Page list with prev/next — typically wired to router state." />
          </Row>

          <Row name="Popover" file="components/popover.tsx">
            <Popover>
              <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
              <PopoverPopup>
                <PopoverTitle>Tip</PopoverTitle>
                <PopoverDescription>Popovers are positioned via Floating UI.</PopoverDescription>
              </PopoverPopup>
            </Popover>
          </Row>

          <Row name="Preview Card" file="components/preview-card.tsx">
            <PreviewCard>
              <PreviewCardTrigger render={<a href="#" className="underline">hover me</a>} />
              <PreviewCardPopup>Preview content</PreviewCardPopup>
            </PreviewCard>
          </Row>

          <Row name="Progress" file="components/progress.tsx">
            <Progress value={42} className="w-56">
              <div className="flex items-center justify-between">
                <ProgressLabel>Indexing</ProgressLabel>
                <ProgressValue />
              </div>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
          </Row>

          <Row name="Radio Group" file="components/radio-group.tsx">
            <RadioGroup value={radio} onValueChange={(v) => setRadio(v as string)} className="flex-row gap-4">
              {["a", "b", "c"].map((v) => (
                <Label key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} />
                  Option {v.toUpperCase()}
                </Label>
              ))}
            </RadioGroup>
          </Row>

          <Row name="Scroll Area" file="components/scroll-area.tsx">
            <div style={{ height: 96, width: 224 }} className="rounded-md border">
              <ScrollArea>
                <div className="p-3 text-sm">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i}>Row #{i + 1}</div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Row>

          <Row name="Select" file="components/select.tsx">
            <Fallback label="Styled like Combobox — see dedicated /select demo." />
          </Row>

          <Row name="Separator" file="components/separator.tsx">
            <div className="flex items-center gap-3 text-sm">
              <span>Left</span>
              <Separator orientation="vertical" className="h-5" />
              <span>Middle</span>
              <Separator orientation="vertical" className="h-5" />
              <span>Right</span>
            </div>
          </Row>

          <Row name="Sheet" file="components/sheet.tsx">
            <Fallback label="Side-anchored overlay — opens from top/right/bottom/left." />
          </Row>

          <Row name="Skeleton" file="components/skeleton.tsx">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Row>

          <Row name="Slider" file="components/slider.tsx">
            <div className="w-56">
              <Slider
                value={slider}
                onValueChange={(v) => setSlider(Array.isArray(v) ? [...v] : [v])}
              />
            </div>
            <span className="text-sm text-muted-foreground">{slider[0]}</span>
          </Row>

          <Row name="Spinner" file="components/spinner.tsx">
            <Spinner />
            <Spinner className="size-6" />
          </Row>

          <Row name="Switch" file="components/switch.tsx">
            <Label className="flex items-center gap-2">
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
              {switchOn ? "On" : "Off"}
            </Label>
          </Row>

          <Row name="Table" file="components/table.tsx">
            <Table className="w-full max-w-md">
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>welcome.md</TableCell><TableCell>1.2 KB</TableCell></TableRow>
                <TableRow><TableCell>todo.md</TableCell><TableCell>324 B</TableCell></TableRow>
              </TableBody>
            </Table>
          </Row>

          <Row name="Tabs" file="components/tabs.tsx">
            <Tabs defaultValue="one" className="max-w-md">
              <TabsList>
                <TabsTab value="one">One</TabsTab>
                <TabsTab value="two">Two</TabsTab>
                <TabsTab value="three">Three</TabsTab>
              </TabsList>
              <TabsPanel value="one">First panel content.</TabsPanel>
              <TabsPanel value="two">Second panel content.</TabsPanel>
              <TabsPanel value="three">Third panel content.</TabsPanel>
            </Tabs>
          </Row>

          <Row name="Textarea" file="components/textarea.tsx">
            <Textarea
              value={textareaVal}
              onChange={(e) => setTextareaVal(e.target.value)}
              className="min-h-20 w-full max-w-md"
            />
          </Row>

          <Row name="Toast" file="components/toast.tsx">
            <Fallback label="Requires ToastProvider at app root — skipped in inline demo." />
          </Row>

          <Row name="Toggle" file="components/toggle.tsx">
            <Toggle pressed={toggle} onPressedChange={setToggle}>
              {toggle ? "On" : "Off"}
            </Toggle>
          </Row>

          <Row name="Toggle Group" file="components/toggle-group.tsx">
            <ToggleGroup multiple value={toggleGroup} onValueChange={(v) => setToggleGroup(v as string[])}>
              <ToggleGroupItem value="bold"><b>B</b></ToggleGroupItem>
              <ToggleGroupItem value="italic"><i>I</i></ToggleGroupItem>
              <ToggleGroupItem value="underline"><u>U</u></ToggleGroupItem>
            </ToggleGroup>
          </Row>

          <Row name="Toolbar" file="components/toolbar.tsx">
            <Fallback label="Arranges buttons / groups with keyboard nav — see Menu/ToggleGroup." />
          </Row>

          <Row name="Tooltip" file="components/tooltip.tsx">
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
              <TooltipPopup>Hello from Retroma</TooltipPopup>
            </Tooltip>
          </Row>

        </div>

        {/* Mounted modals used by the Lab section. */}
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
          <div style={{ padding: 16 }}>
            <p>Theme settings, plugin management, etc. would live here.</p>
          </div>
        </SettingsModal>
      </div>
    </TooltipProvider>
    </ThemeTunerProvider>
  );
}
