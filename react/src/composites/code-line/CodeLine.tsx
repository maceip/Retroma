import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

export type CodeLineKind = "normal" | "add" | "remove" | "context" | "highlight";

export interface CodeLineProps extends HTMLAttributes<HTMLDivElement> {
  /** Line number to show in the gutter. */
  number?: number | string;
  /** Diff marker / state. */
  kind?: CodeLineKind;
  /** Fixed width for the gutter (chars). */
  gutterWidth?: number;
}

export const CodeLine = forwardRef<HTMLDivElement, CodeLineProps>(
  function CodeLine(
    { number, kind = "normal", gutterWidth = 3, className, children, ...rest },
    ref,
  ) {
    const prefix = kind === "add" ? "+" : kind === "remove" ? "-" : " ";
    return (
      <div
        ref={ref}
        data-slot="code-line"
        data-kind={kind}
        className={cn("retroma-code-line", `retroma-code-line--${kind}`, className)}
        {...rest}
      >
        {number !== undefined && (
          <span
            className="retroma-code-line-number"
            style={{ minWidth: `${gutterWidth}ch` }}
          >
            {number}
          </span>
        )}
        <span className="retroma-code-line-marker" aria-hidden="true">
          {prefix}
        </span>
        <code className="retroma-code-line-content">{children}</code>
      </div>
    );
  },
);

export interface CodeBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** File name / language label. */
  title?: ReactNode;
  /** Right-aligned actions (Copy, …). */
  actions?: ReactNode;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock({ title, actions, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="code-block"
        className={cn("retroma-code-block", className)}
        {...rest}
      >
        {(title || actions) && (
          <header className="retroma-code-block-header">
            {title ? <span className="retroma-code-block-title">{title}</span> : null}
            {actions ? <span className="retroma-code-block-actions">{actions}</span> : null}
          </header>
        )}
        <div className="retroma-code-block-body">{children}</div>
      </div>
    );
  },
);

/** A span that colors a syntactic token inside a CodeLine. */
export function CodeToken({
  kind,
  className,
  children,
  ...rest
}: { kind: string } & HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span
      data-token={kind}
      className={cn(`retroma-code-token retroma-code-token--${kind}`, className)}
      {...rest}
    >
      {children}
    </span>
  );
}
