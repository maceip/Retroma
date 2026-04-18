/**
 * @retroma/react
 *
 * Two-tier component library:
 *
 * 1. **Base layer** — a full catalog of headless, accessible primitives
 *    with the same layout, naming, and public API as the COSS UI package
 *    (<https://github.com/cosscom/coss>). This tier is installable /
 *    importable on its own and skinned with the Retroma design tokens.
 *
 * 2. **Retroma composites** — higher-level arrangements (AppRibbon,
 *    FileExplorer, WorkspaceTabs, EditorCanvas, PropertiesView,
 *    CommandPalette, StatusBar, …) that reproduce the Retroma /
 *    Obsidian visual language by composing the base primitives.
 *
 * Example:
 *
 * ```tsx
 * import "@retroma/react/styles.css";
 * import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@retroma/react";
 * import { AppRibbon, RibbonAction } from "@retroma/react/composites";
 * ```
 *
 * The base-tier catalog mirrors COSS exactly: Accordion, Alert,
 * AlertDialog, Autocomplete, Avatar, Badge, Breadcrumb, Button, Calendar,
 * Card, Checkbox, CheckboxGroup, Collapsible, Combobox, Command, Dialog,
 * Drawer, Empty, Field, Fieldset, Form, Frame, Group, Input, InputGroup,
 * Kbd, Label, Menu, Meter, NumberField, OTPField, Pagination, Popover,
 * PreviewCard, Progress, RadioGroup, ScrollArea, Select, Separator,
 * Sheet, Sidebar, Skeleton, Slider, Spinner, Switch, Table, Tabs,
 * Textarea, Toast, Toggle, ToggleGroup, Toolbar, Tooltip.
 */

/* -------------------------------------------------------------------------- */
/*  Tier 1 — Base UI catalog (COSS-compatible).                                */
/* -------------------------------------------------------------------------- */

export * from "./components/accordion";
export * from "./components/alert";
export * from "./components/alert-dialog";
export * from "./components/autocomplete";
export * from "./components/avatar";
export * from "./components/badge";
export * from "./components/breadcrumb";
export * from "./components/button";
export * from "./components/calendar";
export * from "./components/card";
export * from "./components/checkbox";
export * from "./components/checkbox-group";
export * from "./components/collapsible";
export * from "./components/combobox";
export * from "./components/command";
export * from "./components/dialog";
export * from "./components/drawer";
export * from "./components/empty";
export * from "./components/field";
export * from "./components/fieldset";
export * from "./components/form";
export * from "./components/frame";
export * from "./components/group";
export * from "./components/input";
export * from "./components/input-group";
export * from "./components/kbd";
export * from "./components/label";
export * from "./components/menu";
export * from "./components/meter";
export * from "./components/number-field";
export * from "./components/otp-field";
export * from "./components/pagination";
export * from "./components/popover";
export * from "./components/preview-card";
export * from "./components/progress";
export * from "./components/radio-group";
export * from "./components/scroll-area";
export * from "./components/select";
export * from "./components/separator";
export * from "./components/sheet";
export * from "./components/sidebar";
export * from "./components/skeleton";
export * from "./components/slider";
export * from "./components/spinner";
export * from "./components/switch";
export * from "./components/table";
export * from "./components/tabs";
export * from "./components/textarea";
export * from "./components/toast";
export * from "./components/toggle";
export * from "./components/toggle-group";
export * from "./components/toolbar";
export * from "./components/tooltip";

/* -------------------------------------------------------------------------- */
/*  Utilities                                                                 */
/* -------------------------------------------------------------------------- */

export { cn } from "./lib/utils";
