import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Controls the tag accent color via Retroma's `--tag-color` custom property. */
  color?:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "indigo"
    | "violet"
    | "teal"
    | "purple"
    | "magenta"
    | "cyan";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { color, className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("tag", className)}
      style={
        color
          ? ({ ["--tag-color" as string]: `var(--color-${color})`, ...style } as React.CSSProperties)
          : style
      }
      {...rest}
    />
  );
});
