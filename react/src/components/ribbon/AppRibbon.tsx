import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Tooltip, type TooltipSide } from "../../primitives/Tooltip";

/* -------------------------------------------------------------------------- */
/*  AppRibbon                                                                 */
/* -------------------------------------------------------------------------- */

export interface AppRibbonProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the ribbon is collapsed to icons-only (default true). */
  collapsed?: boolean;
}

export const AppRibbon = forwardRef<HTMLDivElement, AppRibbonProps>(
  function AppRibbon({ collapsed = true, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "workspace-ribbon",
          "side-dock-ribbon",
          collapsed ? "is-collapsed" : "is-open",
          className,
        )}
        {...rest}
      >
        <div className="side-dock-ribbon-actions">{children}</div>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  RibbonAction                                                              */
/* -------------------------------------------------------------------------- */

export interface RibbonActionProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "type"> {
  /** Accessible label — also the tooltip text when `tooltip` is not set. */
  label: string;
  /** Override the tooltip content. Falls back to `label`. */
  tooltip?: ReactNode;
  /** Tooltip side. */
  tooltipSide?: TooltipSide;
  /** Icon content (e.g. an SVG element or lucide icon). */
  icon?: ReactNode;
  /** Whether this action is currently the active one. */
  active?: boolean;
  /** Hide the tooltip entirely. */
  noTooltip?: boolean;
}

export const RibbonAction = forwardRef<HTMLButtonElement, RibbonActionProps>(
  function RibbonAction(
    {
      label,
      tooltip,
      tooltipSide = "right",
      icon,
      active,
      noTooltip,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const button = (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(
          "side-dock-ribbon-action",
          "clickable-icon",
          active && "is-active",
          className,
        )}
        {...rest}
      >
        {icon}
        {children}
      </button>
    );

    if (noTooltip) return button;

    return (
      <Tooltip content={tooltip ?? label} side={tooltipSide}>
        {button}
      </Tooltip>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  RibbonTooltip — standalone label (rarely used alone; RibbonAction wraps    */
/*  its own tooltip). Exported for parity with the spec.                      */
/* -------------------------------------------------------------------------- */

export { Tooltip as RibbonTooltip } from "../../primitives/Tooltip";

/* -------------------------------------------------------------------------- */
/*  RibbonSeparator                                                           */
/* -------------------------------------------------------------------------- */

export interface RibbonSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export const RibbonSeparator = forwardRef<HTMLDivElement, RibbonSeparatorProps>(
  function RibbonSeparator({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn("side-dock-ribbon-separator", className)}
        style={{
          width: "60%",
          height: 1,
          margin: "6px auto",
          background: "var(--hr-color)",
          ...rest.style,
        }}
        {...rest}
      />
    );
  },
);
