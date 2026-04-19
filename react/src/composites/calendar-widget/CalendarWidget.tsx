import { forwardRef, useMemo, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface CalendarWidgetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Current month anchor (defaults to today). */
  value?: Date;
  /** Selected date (highlighted). */
  selected?: Date;
  /** Fires when the user picks a day. */
  onSelect?: (date: Date) => void;
  /** Fires when the user changes month via prev/next. */
  onMonthChange?: (anchor: Date) => void;
  /** First day of the week (0 = Sunday, 1 = Monday). Default: 1. */
  weekStartsOn?: 0 | 1;
}

const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const CalendarWidget = forwardRef<HTMLDivElement, CalendarWidgetProps>(
  function CalendarWidget(
    { value, selected, onSelect, onMonthChange, weekStartsOn = 1, className, ...rest },
    ref,
  ) {
    const today = useMemo(() => new Date(), []);
    const [anchor, setAnchor] = useState<Date>(() => startOfMonth(value ?? today));

    const year = anchor.getFullYear();
    const month = anchor.getMonth();
    const days = daysInMonth(year, month);
    const firstWeekday = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
    const weekdays = [...WEEKDAYS_SHORT.slice(weekStartsOn), ...WEEKDAYS_SHORT.slice(0, weekStartsOn)];

    const cells: Array<number | null> = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const nav = (delta: number) => {
      const next = new Date(year, month + delta, 1);
      setAnchor(next);
      onMonthChange?.(next);
    };

    return (
      <div
        ref={ref}
        data-slot="calendar-widget"
        className={cn("retroma-calendar", className)}
        {...rest}
      >
        <div className="retroma-calendar-header">
          <span className="retroma-calendar-title">
            <span className="retroma-calendar-month">{MONTHS[month]}</span>
            <span className="retroma-calendar-year">{year}</span>
          </span>
          <div className="retroma-calendar-nav">
            <button
              type="button"
              aria-label="Previous month"
              className="nav-action-button"
              onClick={() => nav(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="nav-action-button"
              onClick={() => {
                const n = new Date();
                setAnchor(startOfMonth(n));
                onSelect?.(n);
              }}
            >
              Today
            </button>
            <button
              type="button"
              aria-label="Next month"
              className="nav-action-button"
              onClick={() => nav(1)}
            >
              ›
            </button>
          </div>
        </div>
        <div className="retroma-calendar-grid">
          {weekdays.map((w, i) => (
            <div key={`h-${i}`} className="retroma-calendar-wkday">{w}</div>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="retroma-calendar-cell is-empty" />;
            const date = new Date(year, month, d);
            const isToday = isSameDay(date, today);
            const isSelected = selected && isSameDay(date, selected);
            return (
              <button
                key={i}
                type="button"
                className={cn(
                  "retroma-calendar-cell",
                  isToday && "is-today",
                  isSelected && "is-selected",
                )}
                onClick={() => onSelect?.(date)}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
