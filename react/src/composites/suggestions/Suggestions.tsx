import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Suggestions — a horizontal row of suggestion chips under a chat message   */
/*  or as part of an empty-state prompt surface.                              */
/* -------------------------------------------------------------------------- */

export interface SuggestionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Short heading above the chips. */
  title?: ReactNode;
  /** Make the chip list horizontally scrollable (vs wrapping). */
  scroll?: boolean;
}

export const Suggestions = forwardRef<HTMLDivElement, SuggestionsProps>(
  function Suggestions({ title, scroll, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="suggestions"
        className={cn(
          "retroma-suggestions",
          scroll && "retroma-suggestions--scroll",
          className,
        )}
        {...rest}
      >
        {title ? (
          <div className="retroma-suggestions-title">{title}</div>
        ) : null}
        <div className="retroma-suggestions-list">{children}</div>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Suggestion — single chip.                                                 */
/* -------------------------------------------------------------------------- */

export interface SuggestionProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Fires when the chip is selected. */
  onSelect?: (label: string) => void;
}

export const Suggestion = forwardRef<HTMLButtonElement, SuggestionProps>(
  function Suggestion({ icon, onSelect, onClick, className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        data-slot="suggestion"
        className={cn("retroma-suggestion", className)}
        onClick={(e) => {
          onClick?.(e);
          if (typeof children === "string") onSelect?.(children);
        }}
        {...rest}
      >
        {icon ? <span className="retroma-suggestion-icon">{icon}</span> : null}
        <span className="retroma-suggestion-label">{children}</span>
      </button>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  SuggestionPanel — the larger "empty state" surface that holds an intro    */
/*  + a Suggestions row.                                                      */
/* -------------------------------------------------------------------------- */

export interface SuggestionPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional header content. */
  header?: ReactNode;
  /** Close callback — renders a × button when present. */
  onClose?: () => void;
}

export const SuggestionPanel = forwardRef<HTMLDivElement, SuggestionPanelProps>(
  function SuggestionPanel(
    { header, onClose, className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="suggestion-panel"
        className={cn("retroma-suggestion-panel", className)}
        {...rest}
      >
        {(header || onClose) && (
          <header className="retroma-suggestion-panel-header">
            {header ? <div className="retroma-suggestion-panel-header-content">{header}</div> : null}
            {onClose ? (
              <button
                type="button"
                aria-label="Dismiss suggestions"
                className="retroma-suggestion-panel-close"
                onClick={onClose}
              >
                ×
              </button>
            ) : null}
          </header>
        )}
        <div className="retroma-suggestion-panel-content">{children}</div>
      </div>
    );
  },
);
