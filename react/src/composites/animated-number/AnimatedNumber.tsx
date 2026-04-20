import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

export interface AnimatedNumberProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Target value. */
  value: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Decimal places. */
  decimals?: number;
  /** Locale used by Intl.NumberFormat. */
  locale?: string;
  /** Extra number-formatting options. */
  format?: Intl.NumberFormatOptions;
  /** Easing — default: easeOutCubic. */
  easing?: (t: number) => number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const AnimatedNumber = forwardRef<HTMLSpanElement, AnimatedNumberProps>(
  function AnimatedNumber(
    { value, duration = 800, decimals = 0, locale, format, easing = easeOutCubic, className, ...rest },
    ref,
  ) {
    const [display, setDisplay] = useState(value);
    const startRef = useRef<number | null>(null);
    const fromRef = useRef(value);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
      const to = value;
      const from = fromRef.current;
      startRef.current = null;

      const tick = (now: number) => {
        if (startRef.current === null) startRef.current = now;
        const elapsed = now - startRef.current;
        const t = Math.min(1, duration <= 0 ? 1 : elapsed / duration);
        const eased = easing(t);
        const next = from + (to - from) * eased;
        setDisplay(next);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
        else fromRef.current = to;
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [value, duration, easing]);

    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...format,
    });

    return (
      <span
        ref={ref}
        data-slot="animated-number"
        className={cn("retroma-animated-number", className)}
        {...rest}
      >
        {formatter.format(display)}
      </span>
    );
  },
);
