import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  RetromaApp — top-level shell that lays out ribbon / sidebars / main /     */
/*  status bar using CSS grid. Expects children to render the correct class   */
/*  names (done automatically by library components).                         */
/* -------------------------------------------------------------------------- */

export interface RetromaAppProps extends HTMLAttributes<HTMLDivElement> {
  /** Theme variant: light (default) or dark. */
  theme?: "light" | "dark";
  /** Collapse the left sidebar. */
  leftCollapsed?: boolean;
  /** Collapse the right sidebar. */
  rightCollapsed?: boolean;
}

export const RetromaApp = forwardRef<HTMLDivElement, RetromaAppProps>(
  function RetromaApp(
    {
      theme = "light",
      leftCollapsed,
      rightCollapsed,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "retroma-app",
          "app-container",
          "workspace",
          theme === "dark" ? "theme-dark" : "theme-light",
          "is-focused",
          className,
        )}
        data-left-collapsed={leftCollapsed ? "true" : "false"}
        data-right-collapsed={rightCollapsed ? "true" : "false"}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  WorkspaceSplit — left / right / main split containers.                    */
/* -------------------------------------------------------------------------- */

export interface WorkspaceSplitProps extends HTMLAttributes<HTMLDivElement> {
  side: "left" | "right" | "main";
  /** Children are usually <WorkspaceLeaf/> instances. */
  children?: ReactNode;
}

export const WorkspaceSplit = forwardRef<HTMLDivElement, WorkspaceSplitProps>(
  function WorkspaceSplit({ side, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "workspace-split",
          side === "left" && "mod-left-split mod-vertical",
          side === "right" && "mod-right-split mod-vertical",
          side === "main" && "mod-root mod-vertical",
          className,
        )}
        {...rest}
      />
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  WorkspaceLeaf — a single pane (file explorer, editor, …).                 */
/* -------------------------------------------------------------------------- */

export interface WorkspaceLeafProps extends HTMLAttributes<HTMLDivElement> {
  /** Header content (tab bar or view title). */
  header?: ReactNode;
  /** Leaf body content. */
  children?: ReactNode;
  /** Whether this leaf is currently focused. */
  active?: boolean;
}

export const WorkspaceLeaf = forwardRef<HTMLDivElement, WorkspaceLeafProps>(
  function WorkspaceLeaf({ header, active, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("workspace-leaf", active && "mod-active", className)}
        {...rest}
      >
        {header ? <div className="view-header">{header}</div> : null}
        <div className="view-content">{children}</div>
      </div>
    );
  },
);
