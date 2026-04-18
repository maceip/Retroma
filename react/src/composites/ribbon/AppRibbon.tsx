import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/tooltip";

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
      <TooltipProvider>
        <div
          ref={ref}
          data-slot="app-ribbon"
          className={cn(
            "workspace-ribbon side-dock-ribbon",
            collapsed ? "is-collapsed" : "is-open",
            className,
          )}
          {...rest}
        >
          <div className="side-dock-ribbon-actions">{children}</div>
        </div>
      </TooltipProvider>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  RibbonAction                                                              */
/* -------------------------------------------------------------------------- */

export type RibbonTooltipSide = "top" | "right" | "bottom" | "left";

export interface RibbonActionProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "type"> {
  /** Accessible label — also the tooltip text when `tooltip` is not set. */
  label: string;
  /** Override the tooltip content. Falls back to `label`. */
  tooltip?: ReactNode;
  /** Tooltip side. */
  tooltipSide?: RibbonTooltipSide;
  /** Icon content (e.g. an SVG element). */
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
        type="button"
        aria-label={label}
        data-slot="ribbon-action"
        className={cn(
          "side-dock-ribbon-action clickable-icon",
          active && "is-active",
          className,
        )}
        {...rest}
        ref={ref}
      >
        {icon}
        {children}
      </button>
    );

    if (noTooltip) return button;

    return (
      <Tooltip>
        <TooltipTrigger render={button} />
        <TooltipPopup side={tooltipSide}>{tooltip ?? label}</TooltipPopup>
      </Tooltip>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  RibbonTooltip family — re-export of the base tooltip primitives.          */
/* -------------------------------------------------------------------------- */

export {
  Tooltip as RibbonTooltip,
  TooltipPopup as RibbonTooltipPopup,
  TooltipTrigger as RibbonTooltipTrigger,
} from "../../components/tooltip";

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
        data-slot="ribbon-separator"
        className={cn("side-dock-ribbon-separator", className)}
        {...rest}
      />
    );
  },
);
