import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface BasesViewProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional toolbar content. */
  toolbar?: ReactNode;
}

export const BasesView = forwardRef<HTMLDivElement, BasesViewProps>(
  function BasesView({ toolbar, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bases-view"
        className={cn("bases-view retroma-bases", className)}
        {...rest}
      >
        {toolbar ? <div className="retroma-bases-toolbar">{toolbar}</div> : null}
        <div className="retroma-bases-grid">{children}</div>
      </div>
    );
  },
);

/** Represents one row in a BasesView grid. */
export interface BasesRowProps extends HTMLAttributes<HTMLDivElement> {}
export const BasesRow = forwardRef<HTMLDivElement, BasesRowProps>(
  function BasesRow({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bases-row"
        className={cn("retroma-bases-row", className)}
        {...rest}
      />
    );
  },
);

/** A single cell — button-like, bordered pill. */
export interface BasesCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether this cell is the active / selected one. */
  active?: boolean;
}
export const BasesCell = forwardRef<HTMLDivElement, BasesCellProps>(
  function BasesCell({ active, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bases-cell"
        data-active={active ? "true" : undefined}
        className={cn("retroma-bases-cell", active && "is-active", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/** Header row (rendered like cells but with bold labels). */
export interface BasesHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export const BasesHeader = forwardRef<HTMLDivElement, BasesHeaderProps>(
  function BasesHeader({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bases-header"
        className={cn("retroma-bases-header", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
