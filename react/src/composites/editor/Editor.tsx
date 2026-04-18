import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  EditorCanvas                                                              */
/* -------------------------------------------------------------------------- */

export interface EditorCanvasProps extends HTMLAttributes<HTMLDivElement> {
  /** Render mode — source or reading view. */
  mode?: "source" | "reading";
}

export const EditorCanvas = forwardRef<HTMLDivElement, EditorCanvasProps>(
  function EditorCanvas({ mode = "source", className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          mode === "source"
            ? "markdown-source-view mod-cm6 is-live-preview"
            : "markdown-reading-view",
          "cm-s-obsidian",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Gutter + GutterElement                                                    */
/* -------------------------------------------------------------------------- */

export interface GutterProps extends HTMLAttributes<HTMLDivElement> {
  /** Semantic label for screen readers. */
  label?: string;
}

export const Gutter = forwardRef<HTMLDivElement, GutterProps>(function Gutter(
  { label = "Line numbers", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-label={label}
      className={cn("cm-gutters", className)}
      {...rest}
    >
      <div className="cm-gutter cm-lineNumbers">{children}</div>
    </div>
  );
});

export interface GutterElementProps extends HTMLAttributes<HTMLDivElement> {
  /** Line number, fold icon, diagnostic marker, etc. */
  children?: ReactNode;
}

export const GutterElement = forwardRef<HTMLDivElement, GutterElementProps>(
  function GutterElement({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("cm-gutterElement", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  TextLine                                                                  */
/* -------------------------------------------------------------------------- */

export interface TextLineProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional header level (renders HyperMD header class). */
  headerLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Active line highlight. */
  active?: boolean;
}

export const TextLine = forwardRef<HTMLDivElement, TextLineProps>(
  function TextLine({ headerLevel, active, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "cm-line",
          headerLevel && `HyperMD-header HyperMD-header-${headerLevel}`,
          active && "cm-active",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  SyntaxToken                                                               */
/* -------------------------------------------------------------------------- */

export type SyntaxKind =
  | "strong"
  | "em"
  | "strikethrough"
  | "link"
  | "link-internal"
  | "link-external"
  | "hashtag"
  | "code"
  | "code-block"
  | "header"
  | "quote"
  | "list"
  | "comment"
  | "keyword"
  | "string"
  | "number";

const kindClass: Record<SyntaxKind, string> = {
  strong: "cm-strong",
  em: "cm-em",
  strikethrough: "cm-strikethrough",
  link: "cm-link cm-hmd-internal-link",
  "link-internal": "cm-link cm-hmd-internal-link",
  "link-external": "cm-link cm-url",
  hashtag: "cm-hashtag cm-hashtag-begin",
  code: "cm-inline-code",
  "code-block": "HyperMD-codeblock",
  header: "cm-header",
  quote: "HyperMD-quote cm-quote",
  list: "HyperMD-list",
  comment: "cm-comment",
  keyword: "cm-keyword",
  string: "cm-string",
  number: "cm-number",
};

export interface SyntaxTokenProps extends HTMLAttributes<HTMLSpanElement> {
  kind: SyntaxKind;
  /** For hashtags: the tag name (without #) — gives `cm-tag-<name>` styling. */
  tag?: string;
}

export const SyntaxToken = forwardRef<HTMLSpanElement, SyntaxTokenProps>(
  function SyntaxToken({ kind, tag, className, children, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cn(kindClass[kind], tag && `cm-tag-${tag}`, className)}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
