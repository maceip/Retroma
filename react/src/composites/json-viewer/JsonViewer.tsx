import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

export interface JsonViewerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The value to inspect. */
  value: unknown;
  /** Initial depth before everything is collapsed. Default 2. */
  defaultExpandedDepth?: number;
  /** Show a copy button in the header. */
  showCopy?: boolean;
  /** Override the header label. */
  title?: React.ReactNode;
}

type JsonKind = "null" | "bool" | "num" | "str" | "arr" | "obj";

function kindOf(v: unknown): JsonKind {
  if (v === null) return "null";
  if (typeof v === "boolean") return "bool";
  if (typeof v === "number") return "num";
  if (typeof v === "string") return "str";
  if (Array.isArray(v)) return "arr";
  return "obj";
}

export const JsonViewer = forwardRef<HTMLDivElement, JsonViewerProps>(
  function JsonViewer(
    { value, defaultExpandedDepth = 2, showCopy = true, title, className, ...rest },
    ref,
  ) {
    const [copied, setCopied] = useState(false);
    const serialized = useMemo(() => {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }, [value]);

    const copy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(serialized);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      } catch {
        /* ignore */
      }
    }, [serialized]);

    return (
      <div
        ref={ref}
        data-slot="json-viewer"
        className={cn("retroma-json", className)}
        {...rest}
      >
        {(title || showCopy) && (
          <header className="retroma-json-header">
            <span className="retroma-json-title">{title ?? "json"}</span>
            {showCopy ? (
              <button
                type="button"
                data-slot="json-copy"
                className="retroma-json-copy"
                onClick={copy}
                data-copied={copied ? "true" : undefined}
              >
                {copied ? "copied" : "copy"}
              </button>
            ) : null}
          </header>
        )}
        <div className="retroma-json-body">
          <JsonNode value={value} depth={0} defaultExpandedDepth={defaultExpandedDepth} />
        </div>
      </div>
    );
  },
);

function JsonNode({
  value,
  name,
  depth,
  defaultExpandedDepth,
  isLast = true,
}: {
  value: unknown;
  name?: string;
  depth: number;
  defaultExpandedDepth: number;
  isLast?: boolean;
}) {
  const kind = kindOf(value);
  const [open, setOpen] = useState(depth < defaultExpandedDepth);

  const label = name !== undefined ? (
    <span className="retroma-json-key">"{name}"</span>
  ) : null;
  const sep = name !== undefined ? <span className="retroma-json-sep">: </span> : null;
  const tail = isLast ? null : <span className="retroma-json-comma">,</span>;

  if (kind === "obj" || kind === "arr") {
    const entries =
      kind === "arr"
        ? (value as unknown[]).map((v, i) => [String(i), v] as const)
        : Object.entries(value as Record<string, unknown>);
    const openChar = kind === "arr" ? "[" : "{";
    const closeChar = kind === "arr" ? "]" : "}";

    return (
      <div className="retroma-json-row">
        <button
          type="button"
          data-slot="json-toggle"
          className="retroma-json-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="retroma-json-caret">{open ? "▾" : "▸"}</span>
          {label}
          {sep}
          <span className="retroma-json-punct">
            {openChar}
            {!open && entries.length > 0 ? (
              <span className="retroma-json-preview">
                {" "}
                {entries.length} {entries.length === 1 ? "item" : "items"}{" "}
              </span>
            ) : null}
            {!open ? closeChar : null}
          </span>
          {!open ? tail : null}
        </button>
        {open ? (
          <>
            <div className="retroma-json-children">
              {entries.map(([k, v], i) => (
                <JsonNode
                  key={k}
                  name={kind === "obj" ? k : undefined}
                  value={v}
                  depth={depth + 1}
                  defaultExpandedDepth={defaultExpandedDepth}
                  isLast={i === entries.length - 1}
                />
              ))}
            </div>
            <div className="retroma-json-row">
              <span className="retroma-json-punct">{closeChar}</span>
              {tail}
            </div>
          </>
        ) : null}
      </div>
    );
  }

  const display =
    kind === "str"
      ? `"${String(value)}"`
      : kind === "null"
        ? "null"
        : String(value);

  return (
    <div className="retroma-json-row retroma-json-row--leaf">
      {label}
      {sep}
      <span className={cn("retroma-json-value", `retroma-json-value--${kind}`)}>
        {display}
      </span>
      {tail}
    </div>
  );
}
