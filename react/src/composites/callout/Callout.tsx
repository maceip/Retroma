import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export type CalloutVariant =
  | "note"
  | "info"
  | "tip"
  | "success"
  | "warning"
  | "error"
  | "quote"
  | "example"
  | "question"
  | "abstract";

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  /** Collapsible (with <details>). */
  collapsible?: boolean;
  /** Initial open state if collapsible. */
  defaultOpen?: boolean;
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  function Callout(
    { variant = "note", collapsible, defaultOpen = true, className, children, ...rest },
    ref,
  ) {
    const body = (
      <div
        ref={ref}
        data-slot="callout"
        data-callout={variant}
        className={cn("callout", `callout-${variant}`, className)}
        {...rest}
      >
        {children}
      </div>
    );
    if (!collapsible) return body;
    return (
      <details open={defaultOpen} data-slot="callout-collapsible">
        {body}
      </details>
    );
  },
);

export interface CalloutTitleProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
}

export const CalloutTitle = forwardRef<HTMLDivElement, CalloutTitleProps>(
  function CalloutTitle({ icon, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="callout-title"
        className={cn("callout-title", className)}
        {...rest}
      >
        {icon ? <span className="callout-icon">{icon}</span> : null}
        <span className="callout-title-inner">{children}</span>
      </div>
    );
  },
);

export interface CalloutContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CalloutContent = forwardRef<HTMLDivElement, CalloutContentProps>(
  function CalloutContent({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="callout-content"
        className={cn("callout-content", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
