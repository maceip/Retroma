import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

export interface SearchPanelProps extends HTMLAttributes<HTMLDivElement> {}

export const SearchPanel = forwardRef<HTMLDivElement, SearchPanelProps>(
  function SearchPanel({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="search-panel"
        className={cn("search-result-container mod-global-search retroma-search", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Right-hand toggle icons (Aa, case, filter, …). */
  adornments?: ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ adornments, className, ...rest }, ref) {
    return (
      <div className="retroma-search-input">
        <span className="retroma-search-input-icon">⌕</span>
        <input
          ref={ref}
          type="search"
          className={cn("retroma-search-input-field", className)}
          {...rest}
        />
        {adornments ? (
          <span className="retroma-search-input-adornments">{adornments}</span>
        ) : null}
      </div>
    );
  },
);

export interface SearchToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Result count summary text (e.g., "131 results"). */
  count?: ReactNode;
  /** Right-side controls (sort, filter, etc.). */
  controls?: ReactNode;
}

export const SearchToolbar = forwardRef<HTMLDivElement, SearchToolbarProps>(
  function SearchToolbar({ count, controls, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("search-results-info retroma-search-toolbar", className)}
        {...rest}
      >
        {count !== undefined ? (
          <span className="retroma-search-count">{count}</span>
        ) : null}
        {controls ? <span className="retroma-search-controls">{controls}</span> : null}
      </div>
    );
  },
);

export interface SearchResultProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  /** Tag badges or metadata row shown under the title. */
  meta?: ReactNode;
  /** Optional preview snippet. */
  snippet?: ReactNode;
}

export const SearchResult = forwardRef<HTMLDivElement, SearchResultProps>(
  function SearchResult({ title, meta, snippet, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="search-result"
        className={cn("search-result", "retroma-search-result", className)}
        {...rest}
      >
        <div className="search-result-file-title retroma-search-result-title">
          <span className="retroma-search-result-caret">›</span>
          <span>{title}</span>
        </div>
        {meta ? (
          <div className="retroma-search-result-meta">{meta}</div>
        ) : null}
        {snippet ? (
          <div className="search-result-file-matches retroma-search-result-snippet">
            {snippet}
          </div>
        ) : null}
      </div>
    );
  },
);
