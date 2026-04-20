import { forwardRef, useMemo, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface EnvEntry {
  key: string;
  value: string;
  /** Mark the value as sensitive — renders masked until toggled. */
  secret?: boolean;
  /** Optional description / source (.env file, Vercel, …). */
  hint?: string;
}

export interface EnvTableProps extends HTMLAttributes<HTMLDivElement> {
  entries: readonly EnvEntry[];
  /** Show a global reveal-all button in the header. */
  showRevealAll?: boolean;
}

function mask(value: string): string {
  if (!value) return "";
  const visible = value.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(3, value.length - 2))}`;
}

export const EnvTable = forwardRef<HTMLDivElement, EnvTableProps>(function EnvTable(
  { entries, showRevealAll = true, className, ...rest },
  ref,
) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const allRevealed = useMemo(
    () => entries.every((e) => !e.secret || revealed.has(e.key)),
    [entries, revealed],
  );

  const toggle = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (allRevealed) setRevealed(new Set());
    else setRevealed(new Set(entries.filter((e) => e.secret).map((e) => e.key)));
  };

  return (
    <div
      ref={ref}
      data-slot="env-table"
      className={cn("retroma-env", className)}
      {...rest}
    >
      <header className="retroma-env-header">
        <span>name</span>
        <span>value</span>
        {showRevealAll && entries.some((e) => e.secret) ? (
          <button
            type="button"
            className="retroma-env-reveal-all"
            onClick={toggleAll}
          >
            {allRevealed ? "hide all" : "reveal all"}
          </button>
        ) : (
          <span />
        )}
      </header>
      <div className="retroma-env-body">
        {entries.map((e) => {
          const shown = !e.secret || revealed.has(e.key);
          return (
            <div key={e.key} className="retroma-env-row">
              <div className="retroma-env-key">
                <code>{e.key}</code>
                {e.hint ? <span className="retroma-env-hint">{e.hint}</span> : null}
              </div>
              <code className="retroma-env-value" data-secret={e.secret ? "true" : undefined}>
                {shown ? e.value : mask(e.value)}
              </code>
              {e.secret ? (
                <button
                  type="button"
                  className="retroma-env-reveal"
                  onClick={() => toggle(e.key)}
                >
                  {shown ? "hide" : "reveal"}
                </button>
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
