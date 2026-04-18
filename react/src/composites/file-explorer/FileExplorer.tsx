import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Context — tracks which folders are open.                                  */
/* -------------------------------------------------------------------------- */

interface TreeContextValue {
  isOpen(id: string): boolean;
  toggle(id: string): void;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);

function useTree(): TreeContextValue {
  const ctx = useContext(TreeContext);
  if (!ctx) {
    throw new Error(
      "FileExplorer components must be rendered inside <TreeRoot>.",
    );
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  TreeRoot                                                                  */
/* -------------------------------------------------------------------------- */

export interface TreeRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Folder ids that start open (uncontrolled). */
  defaultOpen?: string[];
  /** Folder ids currently open (controlled). */
  open?: string[];
  /** Fires when a folder is expanded/collapsed. */
  onOpenChange?: (open: string[]) => void;
  /** Currently selected file id (controlled). */
  selectedId?: string;
  /** Fires when a file is clicked. */
  onSelect?: (id: string) => void;
}

export const TreeRoot = forwardRef<HTMLDivElement, TreeRootProps>(
  function TreeRoot(
    {
      defaultOpen,
      open: controlledOpen,
      onOpenChange,
      selectedId,
      onSelect,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState<string[]>(
      defaultOpen ?? [],
    );
    const openSet = useMemo(
      () => new Set(controlledOpen ?? uncontrolledOpen),
      [controlledOpen, uncontrolledOpen],
    );

    const toggle = useCallback(
      (id: string) => {
        const next = new Set(openSet);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        const nextArr = Array.from(next);
        if (controlledOpen === undefined) setUncontrolledOpen(nextArr);
        onOpenChange?.(nextArr);
      },
      [controlledOpen, onOpenChange, openSet],
    );

    const value = useMemo<TreeContextValue>(
      () => ({
        isOpen: (id) => openSet.has(id),
        toggle,
        selectedId,
        onSelect,
      }),
      [openSet, toggle, selectedId, onSelect],
    );

    return (
      <TreeContext.Provider value={value}>
        <div
          ref={ref}
          role="tree"
          className={cn("nav-files-container", className)}
          {...rest}
        >
          <div>{children}</div>
        </div>
      </TreeContext.Provider>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  TreeFolder                                                                */
/* -------------------------------------------------------------------------- */

export interface TreeFolderProps extends HTMLAttributes<HTMLDivElement> {
  /** Stable id for open-state tracking. */
  id: string;
  /** Folder label. */
  label: ReactNode;
  /** If true, this is the vault root and gets `.mod-root`. */
  root?: boolean;
  /** Optional trailing icon (e.g. count badge). */
  adornment?: ReactNode;
}

export const TreeFolder = forwardRef<HTMLDivElement, TreeFolderProps>(
  function TreeFolder(
    { id, label, root, adornment, className, children, ...rest },
    ref,
  ) {
    const tree = useTree();
    const open = tree.isOpen(id);
    return (
      <div
        ref={ref}
        role="treeitem"
        aria-expanded={open}
        className={cn(
          "nav-folder",
          root && "mod-root",
          !open && "is-collapsed",
          className,
        )}
        {...rest}
      >
        <button
          type="button"
          className="nav-folder-title"
          onClick={() => tree.toggle(id)}
        >
          <span className="collapse-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path
                fill="currentColor"
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="nav-folder-title-content">{label}</span>
          {adornment}
        </button>
        <div className="nav-folder-children">{children}</div>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  TreeFile                                                                  */
/* -------------------------------------------------------------------------- */

export interface TreeFileProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  /** File name / label text. */
  label: ReactNode;
  /** Optional leading icon (prefer <TreeItemIcon/>). */
  icon?: ReactNode;
  /** Optional trailing adornment (badge, dot). */
  adornment?: ReactNode;
}

export const TreeFile = forwardRef<HTMLDivElement, TreeFileProps>(
  function TreeFile(
    { id, label, icon, adornment, className, onClick, ...rest },
    ref,
  ) {
    const tree = useTree();
    const selected = tree.selectedId === id;
    return (
      <div
        ref={ref}
        role="treeitem"
        aria-selected={selected}
        tabIndex={0}
        className={cn("nav-file", selected && "is-active", className)}
        onClick={(e) => {
          onClick?.(e);
          tree.onSelect?.(id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            tree.onSelect?.(id);
          }
        }}
        {...rest}
      >
        <div className={cn("nav-file-title", selected && "is-active")}>
          {icon}
          <span className="nav-file-title-content">{label}</span>
          {adornment}
        </div>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  TreeItemIcon / TreeItemLabel                                              */
/* -------------------------------------------------------------------------- */

export interface TreeItemIconProps extends HTMLAttributes<HTMLSpanElement> {}

export const TreeItemIcon = forwardRef<HTMLSpanElement, TreeItemIconProps>(
  function TreeItemIcon({ className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn("nav-file-icon", className)}
        {...rest}
      />
    );
  },
);

export interface TreeItemLabelProps extends HTMLAttributes<HTMLSpanElement> {
  /** Put the label into rename mode. The parent controls whether an input
   *  is shown — we just swap the inner element.                             */
  editing?: boolean;
  /** Value when editing. */
  value?: string;
  /** Commit handler for rename. */
  onCommit?: (value: string) => void;
  /** Cancel handler (Esc). */
  onCancel?: () => void;
}

export const TreeItemLabel = forwardRef<HTMLSpanElement, TreeItemLabelProps>(
  function TreeItemLabel(
    { editing, value, onCommit, onCancel, className, children, ...rest },
    ref,
  ) {
    if (editing) {
      return (
        <input
          autoFocus
          defaultValue={value ?? (typeof children === "string" ? children : "")}
          className={cn("nav-file-title-content", "is-editing", className)}
          onBlur={(e) => onCommit?.(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onCommit?.(e.currentTarget.value);
            } else if (e.key === "Escape") {
              e.preventDefault();
              onCancel?.();
            }
          }}
          style={{ background: "transparent", border: 0, outline: 0, font: "inherit" }}
        />
      );
    }
    return (
      <span
        ref={ref}
        className={cn("nav-file-title-content", className)}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
