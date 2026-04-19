import { forwardRef, type SVGProps } from "react";
import { cn } from "../../lib/utils";

export interface SparklineProps
  extends Omit<SVGProps<SVGSVGElement>, "ref" | "points" | "fill" | "values"> {
  /** Data series. */
  values: readonly number[];
  /** Stroke color. Defaults to the Retroma base accent. */
  stroke?: string;
  /** Stroke width. */
  strokeWidth?: number;
  /** Fill the area under the line (boolean, not the SVG fill attribute). */
  fill?: boolean;
  /** Render a final dot marker. */
  showEndDot?: boolean;
}

export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  function Sparkline(
    {
      values,
      stroke,
      strokeWidth = 4,
      fill,
      showEndDot,
      className,
      ...rest
    },
    ref,
  ) {
    const data = (values.length ? values : [1, 2, 1, 3, 2, 4]).map((n) =>
      Number(n || 0),
    );
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const points = data
      .map((v, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * 100;
        const y = 100 - ((v - min) / Math.max(max - min, 1)) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    const last = data[data.length - 1];
    const lastX = ((data.length - 1) / Math.max(data.length - 1, 1)) * 100;
    const lastY = 100 - ((last - min) / Math.max(max - min, 1)) * 100;

    return (
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        data-slot="sparkline"
        className={cn("retroma-sparkline", className)}
        {...rest}
      >
        {fill ? (
          <polygon
            fill="currentColor"
            fillOpacity="0.15"
            points={`0,100 ${points} 100,100`}
          />
        ) : null}
        <polyline
          fill="none"
          stroke={stroke ?? "currentColor"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {showEndDot ? (
          <circle
            cx={lastX}
            cy={lastY}
            r={strokeWidth * 1.1}
            fill={stroke ?? "currentColor"}
          />
        ) : null}
      </svg>
    );
  },
);
