import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  function Separator({ orientation = "horizontal", className, ...rest }, ref) {
    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "retroma-separator",
          orientation === "vertical" && "retroma-separator--vertical",
          className,
        )}
        style={{
          border: 0,
          margin: 0,
          background: "var(--hr-color)",
          width: orientation === "vertical" ? 1 : "100%",
          height: orientation === "vertical" ? "100%" : 1,
          alignSelf: "stretch",
          ...rest.style,
        }}
        {...rest}
      />
    );
  },
);
