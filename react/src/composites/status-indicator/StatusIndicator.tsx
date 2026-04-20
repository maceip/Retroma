import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export type StatusTone =
  | "ok"
  | "success"
  | "warn"
  | "pending"
  | "err"
  | "error"
  | "info"
  | "neutral"
  | "running";

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Logical state. */
  tone?: StatusTone;
  /** Visual variant: `dot` (single colored dot), `pill` (dot + label), `bar`
   * (horizontal CI-style bar). */
  variant?: "dot" | "pill" | "bar";
  /** Optional label (only rendered for `pill` and `bar`). */
  label?: ReactNode;
  /** Pulse animation (useful for live / running states). */
  pulse?: boolean;
}

const toneToCss: Record<StatusTone, string> = {
  ok: "--color-green",
  success: "--color-green",
  warn: "--color-orange",
  pending: "--color-orange",
  err: "--color-red",
  error: "--color-red",
  info: "--color-blue",
  neutral: "--text-faint",
  running: "--color-blue",
};

export const StatusIndicator = forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  function StatusIndicator(
    { tone = "neutral", variant = "dot", label, pulse, className, style, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref}
        data-slot="status-indicator"
        data-tone={tone}
        data-variant={variant}
        className={cn(
          "retroma-status-indicator",
          `retroma-status-indicator--${variant}`,
          pulse && "retroma-status-indicator--pulse",
          className,
        )}
        style={
          {
            ["--rsi-color" as string]: `var(${toneToCss[tone]}, currentColor)`,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <span className="retroma-status-indicator-dot" />
        {variant !== "dot" && label ? (
          <span className="retroma-status-indicator-label">{label}</span>
        ) : null}
      </span>
    );
  },
);
