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
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

interface FileTreeCtx {
  isOpen(id: string): boolean;
  toggle(id: string): void;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const FileTreeContext = createContext<FileTreeCtx | null>(null);
const useFileTree = () => {
  const ctx = useContext(FileTreeContext);
  if (!ctx) throw new Error("FileTree children must be inside <FileTree>.");
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export interface FileTreeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  defaultOpen?: string[];
  open?: string[];
  onOpenChange?: (open: string[]) => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export const FileTree = forwardRef<HTMLDivElement, FileTreeProps>(function FileTree(
  {
    defaultOpen,
    open: controlled,
    onOpenChange,
    selectedId,
    onSelect,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultOpen ?? []);
  const openSet = useMemo(
    () => new Set(controlled ?? uncontrolled),
    [controlled, uncontrolled],
  );

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(openSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const arr = Array.from(next);
      if (controlled === undefined) setUncontrolled(arr);
      onOpenChange?.(arr);
    },
    [controlled, onOpenChange, openSet],
  );

  const value = useMemo<FileTreeCtx>(
    () => ({
      isOpen: (id) => openSet.has(id),
      toggle,
      selectedId,
      onSelect,
    }),
    [openSet, toggle, selectedId, onSelect],
  );

  return (
    <FileTreeContext.Provider value={value}>
      <div
        ref={ref}
        role="tree"
        data-slot="file-tree"
        className={cn("retroma-file-tree", className)}
        {...rest}
      >
        {children}
      </div>
    </FileTreeContext.Provider>
  );
});

/* -------------------------------------------------------------------------- */
/*  Folder                                                                    */
/* -------------------------------------------------------------------------- */

export interface FileTreeFolderProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  name: ReactNode;
  /** Optional per-folder icon override. */
  icon?: ReactNode;
}

export const FileTreeFolder = forwardRef<HTMLDivElement, FileTreeFolderProps>(
  function FileTreeFolder({ id, name, icon, className, children, ...rest }, ref) {
    const ctx = useFileTree();
    const open = ctx.isOpen(id);
    return (
      <div
        ref={ref}
        role="treeitem"
        aria-expanded={open}
        data-slot="file-tree-folder"
        className={cn("retroma-file-tree-folder", !open && "is-collapsed", className)}
        {...rest}
      >
        <button
          type="button"
          className="retroma-file-tree-row"
          onClick={() => ctx.toggle(id)}
        >
          <span className="retroma-file-tree-caret" aria-hidden="true">
            {open ? "▾" : "▸"}
          </span>
          <span className="retroma-file-tree-icon" aria-hidden="true">
            {icon ?? (open ? "📂" : "📁")}
          </span>
          <span className="retroma-file-tree-name">{name}</span>
        </button>
        {open ? <div className="retroma-file-tree-children">{children}</div> : null}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  File                                                                      */
/* -------------------------------------------------------------------------- */

export interface FileTreeFileProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  name: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Right-aligned label (e.g., size, diff count). */
  adornment?: ReactNode;
}

export const FileTreeFile = forwardRef<HTMLDivElement, FileTreeFileProps>(
  function FileTreeFile({ id, name, icon, adornment, className, onClick, ...rest }, ref) {
    const ctx = useFileTree();
    const selected = ctx.selectedId === id;
    return (
      <div
        ref={ref}
        role="treeitem"
        aria-selected={selected}
        tabIndex={0}
        data-slot="file-tree-file"
        className={cn(
          "retroma-file-tree-file",
          selected && "is-active",
          className,
        )}
        onClick={(e) => {
          onClick?.(e);
          ctx.onSelect?.(id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            ctx.onSelect?.(id);
          }
        }}
        {...rest}
      >
        <span className="retroma-file-tree-indent" aria-hidden="true" />
        <span className="retroma-file-tree-icon" aria-hidden="true">
          {icon ?? "📄"}
        </span>
        <span className="retroma-file-tree-name">{name}</span>
        {adornment ? (
          <span className="retroma-file-tree-adornment">{adornment}</span>
        ) : null}
      </div>
    );
  },
);
