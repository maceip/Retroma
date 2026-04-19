import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface TextShimmerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Seconds to complete one shimmer sweep. */
  duration?: number;
  /** Sweep width (em). */
  spread?: number;
  /** Base color (transparent by default picks up parent). */
  color?: string;
  /** Highlight color. */
  highlight?: string;
}

export const TextShimmer = forwardRef<HTMLSpanElement, TextShimmerProps>(
  function TextShimmer(
    { duration = 2.2, spread = 2, color, highlight, className, style, children, ...rest },
    ref,
  ) {
    const vars: React.CSSProperties = {
      ...style,
      ["--retroma-shimmer-duration" as string]: `${duration}s`,
      ["--retroma-shimmer-spread" as string]: `${spread}em`,
      ...(color ? { ["--retroma-shimmer-color" as string]: color } : {}),
      ...(highlight ? { ["--retroma-shimmer-highlight" as string]: highlight } : {}),
    };
    return (
      <span
        ref={ref}
        data-slot="text-shimmer"
        className={cn("retroma-text-shimmer", className)}
        style={vars}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
