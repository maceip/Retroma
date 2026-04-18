import {
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

export type TooltipSide = "top" | "right" | "bottom" | "left";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** The trigger element. Must accept ref + event handlers (a single ReactElement). */
  children: ReactElement;
  /** Content rendered inside the tooltip body. */
  content: ReactNode;
  /** Side relative to the trigger. */
  side?: TooltipSide;
  /** Delay before opening (ms). */
  delay?: number;
  /** Disable the tooltip (useful for mobile). */
  disabled?: boolean;
}

/**
 * Minimal dependency-free tooltip. Uses the `tooltip` / `.is-mobile` class
 * names Obsidian users recognize, with CSS fallbacks defined in base.css.
 */
export function Tooltip({
  children,
  content,
  side = "top",
  delay = 150,
  disabled = false,
  className,
  ...rest
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const id = useId();

  const show = useCallback(() => {
    if (disabled) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  }, [delay, disabled]);

  const hide = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }, []);

  if (!isValidElement(children)) return children;

  const trigger = cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      (children.props as { onMouseEnter?: (e: React.MouseEvent) => void }).onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (children.props as { onMouseLeave?: (e: React.MouseEvent) => void }).onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      (children.props as { onFocus?: (e: React.FocusEvent) => void }).onFocus?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      (children.props as { onBlur?: (e: React.FocusEvent) => void }).onBlur?.(e);
      hide();
    },
    "aria-describedby": open ? id : undefined,
  } as Record<string, unknown>);

  return (
    <span className="retroma-tooltip-anchor" style={{ position: "relative", display: "inline-flex" }}>
      {trigger}
      {open ? (
        <div
          id={id}
          role="tooltip"
          className={cn("tooltip", `tooltip-${side}`, className)}
          {...rest}
        >
          <div className="tooltip-arrow" />
          <div className="tooltip-content">{content}</div>
        </div>
      ) : null}
    </span>
  );
}
