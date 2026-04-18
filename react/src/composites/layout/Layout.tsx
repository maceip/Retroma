import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface RetromaAppProps extends HTMLAttributes<HTMLDivElement> {
  /** Theme variant. */
  theme?: "light" | "dark";
  /** Collapse the left sidebar. */
  leftCollapsed?: boolean;
  /** Collapse the right sidebar. */
  rightCollapsed?: boolean;
}

export const RetromaApp = forwardRef<HTMLDivElement, RetromaAppProps>(
  function RetromaApp(
    { theme = "light", leftCollapsed, rightCollapsed, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="retroma-app"
        data-left-collapsed={leftCollapsed ? "true" : "false"}
        data-right-collapsed={rightCollapsed ? "true" : "false"}
        className={cn(
          "retroma-app app-container workspace is-focused",
          theme === "dark" ? "theme-dark dark" : "theme-light",
          className,
        )}
        {...rest}
      />
    );
  },
);

export interface WorkspaceSplitProps extends HTMLAttributes<HTMLDivElement> {
  side: "left" | "right" | "main";
}

export const WorkspaceSplit = forwardRef<HTMLDivElement, WorkspaceSplitProps>(
  function WorkspaceSplit({ side, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="workspace-split"
        className={cn(
          "workspace-split mod-vertical",
          side === "left" && "mod-left-split",
          side === "right" && "mod-right-split",
          side === "main" && "mod-root",
          className,
        )}
        {...rest}
      />
    );
  },
);

export interface WorkspaceLeafProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  active?: boolean;
}

export const WorkspaceLeaf = forwardRef<HTMLDivElement, WorkspaceLeafProps>(
  function WorkspaceLeaf({ header, active, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="workspace-leaf"
        className={cn("workspace-leaf", active && "mod-active", className)}
        {...rest}
      >
        {header ? <div className="view-header">{header}</div> : null}
        <div className="view-content">{children}</div>
      </div>
    );
  },
);
