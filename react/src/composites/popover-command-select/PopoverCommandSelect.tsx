import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

export interface PopoverCommandOption {
  value: string;
  label: string;
  /** Optional hint rendered below the label. */
  description?: string;
  /** Disable this row. */
  disabled?: boolean;
}

export interface PopoverCommandSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Field label. Rendered above the trigger. */
  label?: ReactNode;
  /** Current value. */
  value?: string;
  /** Fires when the user picks an option. */
  onChange?: (value: string) => void;
  /** Options to display. */
  options: readonly PopoverCommandOption[];
  /** Placeholder when nothing is selected. */
  placeholder?: string;
  /** Filter input placeholder. */
  filterPlaceholder?: string;
  /** Provide an explicit id to link label ↔ trigger. */
  id?: string;
}

export const PopoverCommandSelect = forwardRef<
  HTMLDivElement,
  PopoverCommandSelectProps
>(function PopoverCommandSelect(
  {
    label,
    value,
    onChange,
    options,
    placeholder = "select",
    filterPlaceholder = "type to filter…",
    id: idProp,
    className,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `retroma-pcs-${reactId}`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const active = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      data-slot="popover-command-select"
      className={cn("retroma-pcs", className)}
      {...rest}
    >
      {label ? (
        <label htmlFor={id} className="retroma-pcs-label">
          {label}
        </label>
      ) : null}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        data-open={open ? "true" : undefined}
        className="retroma-pcs-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={cn("retroma-pcs-trigger-label", !active && "is-placeholder")}>
          {active?.label ?? placeholder}
        </span>
        <span className="retroma-pcs-trigger-caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open ? (
        <div className="retroma-pcs-popup" role="dialog">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={filterPlaceholder}
            className="retroma-pcs-filter"
          />
          <ul role="listbox" className="retroma-pcs-list">
            {filtered.length === 0 ? (
              <li className="retroma-pcs-empty">no matches</li>
            ) : (
              filtered.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt.value === value}
                    disabled={opt.disabled}
                    data-active={opt.value === value ? "true" : undefined}
                    className="retroma-pcs-option"
                    onClick={() => {
                      onChange?.(opt.value);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <span className="retroma-pcs-option-label">{opt.label}</span>
                    {opt.description ? (
                      <span className="retroma-pcs-option-desc">{opt.description}</span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
});
