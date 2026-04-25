import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface CommitGraphDay {
  /** ISO date (yyyy-mm-dd). */
  date: string;
  /** Commit count for that day. */
  count: number;
}

export interface CommitGraphProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of daily commit counts. 53 weeks = 371 days max. */
  days: readonly CommitGraphDay[];
  /** Number of intensity buckets (default: 5 → 0 + 4 filled). */
  buckets?: number;
  /** Optional month labels row (default: true). */
  showMonths?: boolean;
  /** Optional weekday labels column (default: true). */
  showWeekdays?: boolean;
  /** Callback when a cell is hovered/clicked. */
  onCellSelect?: (day: CommitGraphDay) => void;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function bucketFor(count: number, max: number, buckets: number) {
  if (count === 0 || max === 0) return 0;
  const step = max / (buckets - 1);
  return Math.min(buckets - 1, Math.max(1, Math.ceil(count / step)));
}

export const CommitGraph = forwardRef<HTMLDivElement, CommitGraphProps>(
  function CommitGraph(
    {
      days,
      buckets = 5,
      showMonths = true,
      showWeekdays = true,
      onCellSelect,
      className,
      ...rest
    },
    ref,
  ) {
    const { weeks, max, monthLabels } = useMemo(() => {
      // Group sequential days into 7-row columns (one column per week).
      const cols: CommitGraphDay[][] = [];
      let cur: CommitGraphDay[] = [];
      let curMax = 0;
      const months: { col: number; label: string }[] = [];
      let lastMonth = -1;

      for (let i = 0; i < days.length; i++) {
        const d = days[i];
        cur.push(d);
        curMax = Math.max(curMax, d.count);
        if (cur.length === 7) {
          cols.push(cur);
          const firstDate = new Date(cur[0].date);
          if (firstDate.getMonth() !== lastMonth) {
            months.push({ col: cols.length - 1, label: MONTHS[firstDate.getMonth()] });
            lastMonth = firstDate.getMonth();
          }
          cur = [];
        }
      }
      if (cur.length) cols.push(cur);
      return { weeks: cols, max: curMax, monthLabels: months };
    }, [days]);

    const total = days.reduce((s, d) => s + d.count, 0);

    return (
      <div
        ref={ref}
        data-slot="commit-graph"
        className={cn("retroma-commit-graph", className)}
        {...rest}
      >
        {showMonths && (
          <div className="retroma-commit-graph-months">
            {monthLabels.map((m) => (
              <span
                key={`${m.col}-${m.label}`}
                className="retroma-commit-graph-month"
                style={{ gridColumnStart: m.col + 2 }}
              >
                {m.label}
              </span>
            ))}
          </div>
        )}
        <div className="retroma-commit-graph-body">
          {showWeekdays && (
            <div className="retroma-commit-graph-weekdays">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
          )}
          <div className="retroma-commit-graph-grid">
            {weeks.map((col, cIdx) => (
              <div key={cIdx} className="retroma-commit-graph-week">
                {col.map((d) => {
                  const lvl = bucketFor(d.count, max, buckets);
                  return (
                    <button
                      key={d.date}
                      type="button"
                      data-slot="commit-graph-cell"
                      data-level={lvl}
                      title={`${d.count} commit${d.count === 1 ? "" : "s"} on ${d.date}`}
                      aria-label={`${d.count} commits on ${d.date}`}
                      className={cn(
                        "retroma-commit-graph-cell",
                        `retroma-commit-graph-cell--${lvl}`,
                      )}
                      onClick={() => onCellSelect?.(d)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="retroma-commit-graph-legend">
          <span className="retroma-commit-graph-total">
            {total.toLocaleString()} contributions
          </span>
          <span className="retroma-commit-graph-scale">
            <span>Less</span>
            {Array.from({ length: buckets }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "retroma-commit-graph-cell",
                  `retroma-commit-graph-cell--${i}`,
                )}
              />
            ))}
            <span>More</span>
          </span>
        </div>
      </div>
    );
  },
);

/** Helper: deterministic fake contributions for demos. */
export function generateDemoCommits(weeks = 26, seed = 7): CommitGraphDay[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out: CommitGraphDay[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - weeks * 7);
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const r = rand();
    const count = r < 0.45 ? 0 : Math.floor(r * 14);
    out.push({ date: d.toISOString().slice(0, 10), count });
  }
  return out;
}
