import { Children, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface InfiniteSliderProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds to complete one full loop. */
  duration?: number;
  /** Gap between items (CSS length). */
  gap?: string;
  /** Direction of travel. */
  direction?: "left" | "right";
  /** Pause on hover. */
  pauseOnHover?: boolean;
}

/**
 * Infinite horizontal marquee. Renders children twice and animates a
 * -50% translateX so the sequence wraps seamlessly.
 */
export const InfiniteSlider = forwardRef<HTMLDivElement, InfiniteSliderProps>(
  function InfiniteSlider(
    {
      duration = 30,
      gap = "24px",
      direction = "left",
      pauseOnHover = true,
      className,
      children,
      style,
      ...rest
    },
    ref,
  ) {
    const items = Children.toArray(children);
    const row: ReactNode = (
      <div className="retroma-infinite-slider-row" style={{ gap }}>
        {items.map((c, i) => (
          <div key={i} className="retroma-infinite-slider-item">
            {c}
          </div>
        ))}
      </div>
    );
    const vars: React.CSSProperties = {
      ...style,
      ["--retroma-infinite-duration" as string]: `${duration}s`,
      ["--retroma-infinite-direction" as string]:
        direction === "left" ? "normal" : "reverse",
    };
    return (
      <div
        ref={ref}
        data-slot="infinite-slider"
        data-pause-on-hover={pauseOnHover ? "true" : undefined}
        className={cn("retroma-infinite-slider", className)}
        style={vars}
        {...rest}
      >
        <div className="retroma-infinite-slider-track">
          {row}
          <div aria-hidden="true">{row}</div>
        </div>
      </div>
    );
  },
);
