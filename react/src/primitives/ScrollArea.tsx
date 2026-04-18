import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation of the scroll area. */
  orientation?: "vertical" | "horizontal" | "both";
}

/**
 * Thin wrapper applying Retroma's scrollbar shadow styling.
 * The theme already styles `::-webkit-scrollbar-thumb`; this component
 * gives you a container whose overflow is consistent across views.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea({ orientation = "vertical", className, children, ...rest }, ref) {
    const overflowClass =
      orientation === "horizontal"
        ? "retroma-scroll-x"
        : orientation === "both"
          ? "retroma-scroll-both"
          : "retroma-scroll-y";
    return (
      <div
        ref={ref}
        className={cn("retroma-scroll-area", overflowClass, className)}
        style={{
          overflowY:
            orientation === "horizontal" ? "hidden" : "auto",
          overflowX:
            orientation === "vertical" ? "hidden" : "auto",
          ...rest.style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
