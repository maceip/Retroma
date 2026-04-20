import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface SlidingNumberProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Numeric value to display. */
  value: number;
  /** Minimum digit count (left-pads with zeros). */
  minDigits?: number;
  /** Decimal places to show. */
  decimals?: number;
  /** Milliseconds of slide animation. */
  duration?: number;
}

/**
 * Each digit renders as a column of 0–9 stacked vertically; the column
 * translates so the target digit lines up with the visible window.
 * Non-digit chars (.,-) render statically.
 */
export const SlidingNumber = forwardRef<HTMLSpanElement, SlidingNumberProps>(
  function SlidingNumber(
    { value, minDigits = 1, decimals = 0, duration = 600, className, ...rest },
    ref,
  ) {
    const text = useMemo(() => {
      const s = value.toFixed(Math.max(0, decimals));
      const [intPart, fracPart] = s.split(".");
      const padded = intPart.replace("-", "").padStart(minDigits, "0");
      return (intPart.startsWith("-") ? "-" : "") + padded + (fracPart !== undefined ? `.${fracPart}` : "");
    }, [value, minDigits, decimals]);

    return (
      <span
        ref={ref}
        data-slot="sliding-number"
        className={cn("retroma-sliding-number", className)}
        aria-label={String(value)}
        style={{
          ["--retroma-sliding-duration" as string]: `${duration}ms`,
        } as React.CSSProperties}
        {...rest}
      >
        {Array.from(text).map((ch, i) => {
          if (/\d/.test(ch)) {
            const n = Number(ch);
            return (
              <span key={i} className="retroma-sliding-number-col" aria-hidden="true">
                <span
                  className="retroma-sliding-number-stack"
                  style={{ transform: `translateY(-${n * 10}%)` }}
                >
                  {Array.from({ length: 10 }).map((_, d) => (
                    <span key={d} className="retroma-sliding-number-digit">
                      {d}
                    </span>
                  ))}
                </span>
              </span>
            );
          }
          return (
            <span key={i} className="retroma-sliding-number-static" aria-hidden="true">
              {ch}
            </span>
          );
        })}
      </span>
    );
  },
);
