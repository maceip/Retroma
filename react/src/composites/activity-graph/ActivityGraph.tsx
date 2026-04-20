import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/**
 * ActivityGraph is the "pulse" variant (month × day squares rendered as a
 * horizontal series with intensity bars underneath). Distinct from CommitGraph
 * which is the calendar-style contribution grid.
 */

export interface ActivityBucket {
  label: string;
  value: number;
}

export interface ActivityGraphProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Buckets across time. */
  buckets: readonly ActivityBucket[];
  /** Optional peak override. */
  max?: number;
  /** Show x-axis labels. */
  showLabels?: boolean;
  /** Callback when a bar is hovered / clicked. */
  onSelect?: (bucket: ActivityBucket, index: number) => void;
}

export const ActivityGraph = forwardRef<HTMLDivElement, ActivityGraphProps>(
  function ActivityGraph(
    { buckets, max, showLabels = true, onSelect, className, ...rest },
    ref,
  ) {
    const peak = useMemo(
      () => max ?? Math.max(1, ...buckets.map((b) => b.value)),
      [buckets, max],
    );

    return (
      <div
        ref={ref}
        data-slot="activity-graph"
        className={cn("retroma-activity-graph", className)}
        {...rest}
      >
        <div className="retroma-activity-bars">
          {buckets.map((b, i) => {
            const h = Math.max(4, Math.round((b.value / peak) * 100));
            return (
              <button
                key={`${b.label}-${i}`}
                type="button"
                className="retroma-activity-bar"
                style={{ height: `${h}%` }}
                title={`${b.label}: ${b.value.toLocaleString()}`}
                onClick={() => onSelect?.(b, i)}
              >
                <span className="retroma-activity-bar-value" aria-hidden="true">
                  {b.value}
                </span>
              </button>
            );
          })}
        </div>
        {showLabels ? (
          <div className="retroma-activity-labels">
            {buckets.map((b, i) => (
              <span key={`${b.label}-${i}`} className="retroma-activity-label">
                {b.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);
