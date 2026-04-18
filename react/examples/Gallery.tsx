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

  return (
    <TooltipProvider>
      <div className="gallery">
        <div className="gallery-header">
          <h1>Retroma UI — Component Gallery</h1>
          <p>
            One row per primitive. Base layer is sourced from the COSS
            catalog and skinned with Retroma tokens.
          </p>
        </div>

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
      </div>
    </TooltipProvider>
  );
}
