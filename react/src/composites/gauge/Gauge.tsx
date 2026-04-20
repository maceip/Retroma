import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { AnimatedNumber } from "../animated-number";

export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value. */
  value: number;
  /** Maximum value. */
  max?: number;
  /** Label rendered beside the dial. */
  label?: ReactNode;
  /** Size of the dial in px. */
  size?: number;
  /** Stroke thickness of the ring. */
  thickness?: number;
  /** Override ring color (defaults to the Retroma base accent). */
  color?: string;
  /** Decimal places in the readout. */
  decimals?: number;
  /** Suffix appended to the animated number. */
  suffix?: ReactNode;
  /** Hide the animated readout. */
  hideReadout?: boolean;
}

export const Gauge = forwardRef<HTMLDivElement, GaugeProps>(function Gauge(
  {
    value,
    max = 100,
    label,
    size = 64,
    thickness = 10,
    color,
    decimals = 0,
    suffix,
    hideReadout,
    className,
    ...rest
  },
  ref,
) {
  const safeMax = Math.max(1, Number(max || 1));
  const ratio = Math.max(0, Math.min(1, Number(value || 0) / safeMax));
  const r = 50 - thickness / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * ratio;

  return (
    <div
      ref={ref}
      data-slot="gauge"
      className={cn("retroma-gauge", className)}
      {...rest}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="retroma-gauge-dial"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth={thickness}
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color ?? "currentColor"}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 400ms ease" }}
        />
      </svg>
      <div className="retroma-gauge-readout">
        {label ? <div className="retroma-gauge-label">{label}</div> : null}
        {!hideReadout && (
          <div className="retroma-gauge-value">
            <AnimatedNumber value={Number(value) || 0} decimals={decimals} />
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
});
