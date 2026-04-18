import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  StatusBar — the outer container (grid-area: status).                      */
/* -------------------------------------------------------------------------- */

export interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {}

export const StatusBar = forwardRef<HTMLDivElement, StatusBarProps>(
  function StatusBar({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn("status-bar", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  StatusGroup                                                               */
/* -------------------------------------------------------------------------- */

export interface StatusGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Align the group to the start/end of the bar. */
  align?: "start" | "end";
}

export const StatusGroup = forwardRef<HTMLDivElement, StatusGroupProps>(
  function StatusGroup({ align = "start", className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-align={align}
        className={cn("status-bar-group", className)}
        style={{
          marginLeft: align === "end" ? "auto" : undefined,
          ...rest.style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  StatusItem                                                                */
/* -------------------------------------------------------------------------- */

export interface StatusItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
}

export const StatusItem = forwardRef<HTMLDivElement, StatusItemProps>(
  function StatusItem({ icon, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("status-bar-item", className)}
        {...rest}
      >
        {icon}
        <span className="status-bar-item-inner">{children}</span>
      </div>
    );
  },
);
