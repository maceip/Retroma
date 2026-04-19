import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface BacklinksPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Heading text (e.g., "Linked mentions"). */
  title?: ReactNode;
  /** Count badge text / number. */
  count?: number | string;
}

export const BacklinksPanel = forwardRef<HTMLDivElement, BacklinksPanelProps>(
  function BacklinksPanel({ title = "Links", count, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="backlinks-panel"
        className={cn("backlink-pane", "retroma-backlinks", className)}
        {...rest}
      >
        <div className="tree-item-self is-clickable">
          <span className="tree-item-inner">{title}</span>
          {count !== undefined ? (
            <span className="retroma-backlinks-count">{count}</span>
          ) : null}
        </div>
        <div className="search-result-container">{children}</div>
      </div>
    );
  },
);

export interface BacklinkItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Note path / title. */
  href?: string;
  /** Optional preview snippet. */
  snippet?: ReactNode;
  /** Optional icon. */
  icon?: ReactNode;
}

export const BacklinkItem = forwardRef<HTMLDivElement, BacklinkItemProps>(
  function BacklinkItem({ href, snippet, icon, className, children, ...rest }, ref) {
    const Wrapper = href ? "a" : "div";
    return (
      <div
        ref={ref}
        data-slot="backlink-item"
        className={cn("search-result", "retroma-backlink-item", className)}
        {...rest}
      >
        <Wrapper
          {...(href ? { href } : {})}
          className="search-result-file-title"
        >
          {icon ? <span className="retroma-backlink-icon">{icon}</span> : null}
          <span className="retroma-backlink-title">{children}</span>
        </Wrapper>
        {snippet ? (
          <div className="search-result-file-matches retroma-backlink-snippet">
            {snippet}
          </div>
        ) : null}
      </div>
    );
  },
);

/** Grouping header inside a backlinks panel (e.g., "Unlinked mentions"). */
export interface BacklinksSectionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
}

export const BacklinksSection = forwardRef<HTMLDivElement, BacklinksSectionProps>(
  function BacklinksSection({ title, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="backlinks-section"
        className={cn("retroma-backlinks-section", className)}
        {...rest}
      >
        <div className="retroma-backlinks-section-title">{title}</div>
        {children}
      </div>
    );
  },
);
