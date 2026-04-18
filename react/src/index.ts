/**
 * @retroma/react
 *
 * The Retroma Obsidian theme, refactored into a composable React component
 * library. Each component renders the same DOM structure & class names that
 * Retroma's `theme.css` already targets, so the look is byte-identical to
 * the original Obsidian experience.
 *
 * ```tsx
 * import "@retroma/react/styles.css";
 * import {
 *   RetromaApp,
 *   AppRibbon, RibbonAction, RibbonSeparator,
 *   TreeRoot, TreeFolder, TreeFile,
 *   TabList, TabTrigger,
 *   EditorCanvas, Gutter, GutterElement, TextLine, SyntaxToken,
 *   StatusBar, StatusGroup, StatusItem,
 * } from "@retroma/react";
 * ```
 */

/* ----- Shared atomic "shadcn" layer ---------------------------------------- */
export * from "./primitives";

/* ----- High-level components ----------------------------------------------- */
export * from "./components/layout";
export * from "./components/ribbon";
export * from "./components/file-explorer";
export * from "./components/workspace-tabs";
export * from "./components/editor";
export * from "./components/properties-view";
export * from "./components/modal";
export * from "./components/status-bar";

/* ----- Utilities ----------------------------------------------------------- */
export { cn } from "./lib/cn";
