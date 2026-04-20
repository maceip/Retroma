import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface TerminalFrameProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Title text shown in the title bar. */
  title?: ReactNode;
  /** Accent hue — influences the border accent. */
  tone?: "default" | "mint" | "amber" | "magenta" | "mono";
  /** Hide the macOS-style traffic lights. */
  hideControls?: boolean;
}

export const TerminalFrame = forwardRef<HTMLDivElement, TerminalFrameProps>(
  function TerminalFrame(
    { title, tone = "default", hideControls, className, children, ...rest },
    ref,
  ) {
    return (
      <section
        ref={ref}
        data-slot="terminal-frame"
        data-tone={tone}
        className={cn("retroma-terminal", className)}
        {...rest}
      >
        <header className="retroma-terminal-titlebar">
          {!hideControls && (
            <div className="retroma-terminal-controls" aria-hidden="true">
              <span className="retroma-terminal-dot retroma-terminal-dot--close" />
              <span className="retroma-terminal-dot retroma-terminal-dot--min" />
              <span className="retroma-terminal-dot retroma-terminal-dot--max" />
            </div>
          )}
          <span className="retroma-terminal-title">{title ?? "retroma"}</span>
        </header>
        <div className="retroma-terminal-body">{children}</div>
      </section>
    );
  },
);

export interface TerminalLineProps extends HTMLAttributes<HTMLDivElement> {
  /** Prompt prefix (e.g., "$", ">"). */
  prompt?: ReactNode;
  /** Kind of output — colors the line. */
  kind?: "cmd" | "out" | "ok" | "warn" | "err";
}

export const TerminalLine = forwardRef<HTMLDivElement, TerminalLineProps>(
  function TerminalLine({ prompt, kind = "cmd", className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="terminal-line"
        data-kind={kind}
        className={cn("retroma-terminal-line", `retroma-terminal-line--${kind}`, className)}
        {...rest}
      >
        {prompt !== undefined ? (
          <span className="retroma-terminal-prompt">{prompt}</span>
        ) : null}
        <span className="retroma-terminal-content">{children}</span>
      </div>
    );
  },
);

export interface TerminalCursorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Character to blink. Defaults to "█". */
  char?: string;
}

export const TerminalCursor = forwardRef<HTMLSpanElement, TerminalCursorProps>(
  function TerminalCursor({ char = "█", className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn("retroma-terminal-cursor", className)}
        {...rest}
      >
        {char}
      </span>
    );
  },
);
