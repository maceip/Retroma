import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { ModalContent, ModalOverlay } from "./Modal";

/* -------------------------------------------------------------------------- */
/*  Command item shape                                                         */
/* -------------------------------------------------------------------------- */

export interface Command {
  id: string;
  /** Primary label shown in the list. */
  label: ReactNode;
  /** Optional keyboard shortcut (e.g. "⌘P"). */
  hotkey?: string;
  /** Optional grouping / section heading used by the default filter. */
  group?: string;
  /** Optional icon. */
  icon?: ReactNode;
  /** Fires when the command is selected. */
  onSelect?: () => void;
  /** Search keywords not shown to the user. */
  keywords?: string[];
}

/* -------------------------------------------------------------------------- */
/*  CommandPalette                                                             */
/* -------------------------------------------------------------------------- */

export interface CommandPaletteProps {
  open: boolean;
  onClose?: () => void;
  commands: Command[];
  /** Override the default substring filter. */
  filter?: (query: string, command: Command) => boolean;
  placeholder?: string;
}

const defaultFilter = (query: string, cmd: Command): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  const haystacks: string[] = [];
  if (typeof cmd.label === "string") haystacks.push(cmd.label.toLowerCase());
  if (cmd.group) haystacks.push(cmd.group.toLowerCase());
  cmd.keywords?.forEach((k) => haystacks.push(k.toLowerCase()));
  return haystacks.some((h) => h.includes(q));
};

export function CommandPalette({
  open,
  onClose,
  commands,
  filter = defaultFilter,
  placeholder = "Type a command…",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(
    () => commands.filter((c) => filter(query, c)),
    [commands, filter, query],
  );

  useEffect(() => {
    if (cursor >= results.length) setCursor(Math.max(0, results.length - 1));
  }, [results.length, cursor]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setCursor(0);
    }
  }, [open]);

  const select = useCallback(
    (index: number) => {
      const cmd = results[index];
      if (!cmd) return;
      cmd.onSelect?.();
      onClose?.();
    },
    [results, onClose],
  );

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(cursor);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-command-index="${cursor}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  return (
    <ModalOverlay open={open} onClose={onClose}>
      <ModalContent variant="prompt">
        <CommandInput
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
        />
        <CommandList ref={listRef}>
          {results.length === 0 ? (
            <div className="suggestion-empty" style={{ padding: 12 }}>
              No matching commands
            </div>
          ) : (
            results.map((cmd, index) => (
              <CommandItem
                key={cmd.id}
                data-command-index={index}
                selected={index === cursor}
                hotkey={cmd.hotkey}
                icon={cmd.icon}
                onClick={() => select(index)}
                onMouseEnter={() => setCursor(index)}
              >
                {cmd.label}
              </CommandItem>
            ))
          )}
        </CommandList>
      </ModalContent>
    </ModalOverlay>
  );
}

/* -------------------------------------------------------------------------- */
/*  CommandInput                                                               */
/* -------------------------------------------------------------------------- */

export interface CommandInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  function CommandInput({ className, ...rest }, ref) {
    return (
      <div className="prompt-input-container">
        <input
          ref={ref}
          type="text"
          className={cn("prompt-input", className)}
          {...rest}
        />
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  CommandList                                                                */
/* -------------------------------------------------------------------------- */

export interface CommandListProps extends HTMLAttributes<HTMLDivElement> {}

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  function CommandList({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="listbox"
        className={cn("prompt-results", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  CommandItem                                                                */
/* -------------------------------------------------------------------------- */

export interface CommandItemProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  hotkey?: string;
  icon?: ReactNode;
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  function CommandItem(
    { selected, hotkey, icon, className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        className={cn(
          "suggestion-item",
          selected && "is-selected",
          className,
        )}
        {...rest}
      >
        {icon ? <span className="suggestion-icon">{icon}</span> : null}
        <span className="suggestion-title">{children}</span>
        {hotkey ? <span className="suggestion-hotkey">{hotkey}</span> : null}
      </div>
    );
  },
);
