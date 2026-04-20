import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface StepperStep {
  /** Stable id. */
  id: string;
  /** Label (e.g., "Install", "Configure", "Deploy"). */
  label: ReactNode;
  /** Hint shown below the label. */
  hint?: ReactNode;
  /** Optional icon to render in the bubble instead of a number. */
  icon?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: readonly StepperStep[];
  /** Index of the currently-active step (0-based). */
  current?: number;
  /** Horizontal vs vertical orientation. */
  orientation?: "horizontal" | "vertical";
  /** Render numbers starting from this value (default 1). */
  numberStart?: number;
}

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  {
    steps,
    current = 0,
    orientation = "horizontal",
    numberStart = 1,
    className,
    ...rest
  },
  ref,
) {
  return (
    <ol
      ref={ref}
      data-slot="stepper"
      data-orientation={orientation}
      className={cn(
        "retroma-stepper",
        `retroma-stepper--${orientation}`,
        className,
      )}
      {...rest}
    >
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "upcoming";
        return (
          <li
            key={s.id}
            data-state={state}
            className={cn("retroma-stepper-item", `retroma-stepper-item--${state}`)}
          >
            <span className="retroma-stepper-bubble" aria-hidden="true">
              {s.icon ?? (state === "done" ? "✓" : numberStart + i)}
            </span>
            <div className="retroma-stepper-text">
              <span className="retroma-stepper-label">{s.label}</span>
              {s.hint ? (
                <span className="retroma-stepper-hint">{s.hint}</span>
              ) : null}
            </div>
            {i < steps.length - 1 ? (
              <span className="retroma-stepper-connector" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
});
