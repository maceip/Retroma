import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface Contributor {
  /** Stable id (used for keys + deterministic hue). */
  id: string;
  /** Display name / handle. */
  name: string;
  /** Avatar image url. */
  avatarUrl?: string;
  /** Contribution count (commits). */
  contributions?: number;
  /** Optional href for the avatar link. */
  href?: string;
}

export interface ContributorGridProps extends HTMLAttributes<HTMLDivElement> {
  contributors: readonly Contributor[];
  /** Avatar size in px (default 40). */
  size?: number;
  /** Show contribution count badge on hover. */
  showCount?: boolean;
}

/* Deterministic fallback color from a string. */
function hueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}

export const ContributorGrid = forwardRef<HTMLDivElement, ContributorGridProps>(
  function ContributorGrid(
    { contributors, size = 40, showCount = true, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="contributor-grid"
        className={cn("retroma-contributor-grid", className)}
        style={{ ["--rcg-size" as string]: `${size}px` } as React.CSSProperties}
        {...rest}
      >
        {contributors.map((c) => {
          const hue = hueFromId(c.id);
          const inner = (
            <>
              {c.avatarUrl ? (
                <img
                  src={c.avatarUrl}
                  alt=""
                  loading="lazy"
                  width={size}
                  height={size}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="retroma-contributor-fallback"
                  style={{
                    background: `oklch(70% 0.14 ${hue})`,
                  }}
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              {showCount && c.contributions !== undefined ? (
                <span className="retroma-contributor-count">
                  {c.contributions.toLocaleString()}
                </span>
              ) : null}
              <span className="retroma-contributor-tooltip">
                {c.name}
                {c.contributions !== undefined
                  ? ` · ${c.contributions.toLocaleString()}`
                  : ""}
              </span>
            </>
          );
          const cls = "retroma-contributor";
          return c.href ? (
            <a key={c.id} href={c.href} className={cls} title={c.name}>
              {inner}
            </a>
          ) : (
            <div key={c.id} className={cls} title={c.name}>
              {inner}
            </div>
          );
        })}
      </div>
    );
  },
);
