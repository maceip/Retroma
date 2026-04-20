import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { AnimatedNumber } from "../animated-number";

/* -------------------------------------------------------------------------- */
/*  GithubButtonGroup — a row of attached pill buttons (Watch · Star · Fork)  */
/* -------------------------------------------------------------------------- */

export interface GithubButtonGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const GithubButtonGroup = forwardRef<HTMLDivElement, GithubButtonGroupProps>(
  function GithubButtonGroup({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        data-slot="gh-button-group"
        className={cn("retroma-gh-button-group", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  GithubButton — primary pill used inside a group, or standalone.          */
/* -------------------------------------------------------------------------- */

export interface GithubButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Optional trailing right-edge count (e.g. split Star · 1.2k). */
  count?: number | string;
  /** Active / pressed visual. */
  active?: boolean;
}

export const GithubButton = forwardRef<HTMLButtonElement, GithubButtonProps>(
  function GithubButton({ icon, count, active, className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        data-slot="gh-button"
        data-active={active ? "true" : undefined}
        className={cn("retroma-gh-button", className)}
        {...rest}
      >
        {icon ? <span className="retroma-gh-button-icon">{icon}</span> : null}
        <span className="retroma-gh-button-label">{children}</span>
        {count !== undefined ? (
          <span className="retroma-gh-button-count">{count}</span>
        ) : null}
      </button>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  GithubStarsButton — star button + animated count (like repo headers).     */
/* -------------------------------------------------------------------------- */

export interface GithubStarsButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** Current star count. */
  stars: number;
  /** Has the viewer already starred? */
  starred?: boolean;
  /** Override label (default "Star"/"Starred"). */
  label?: ReactNode;
}

export const GithubStarsButton = forwardRef<HTMLButtonElement, GithubStarsButtonProps>(
  function GithubStarsButton(
    { stars, starred, label, className, onClick, ...rest },
    ref,
  ) {
    const display =
      stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString();
    return (
      <button
        ref={ref}
        type="button"
        data-slot="gh-stars-button"
        data-starred={starred ? "true" : undefined}
        className={cn("retroma-gh-stars", className)}
        onClick={onClick}
        {...rest}
      >
        <span className="retroma-gh-stars-icon" aria-hidden="true">
          {starred ? "★" : "☆"}
        </span>
        <span className="retroma-gh-stars-label">
          {label ?? (starred ? "Starred" : "Star")}
        </span>
        <span className="retroma-gh-stars-count" title={stars.toLocaleString()}>
          {stars >= 1000 ? display : <AnimatedNumber value={stars} />}
        </span>
      </button>
    );
  },
);
