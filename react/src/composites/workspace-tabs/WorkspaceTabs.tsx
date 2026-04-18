import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Context — tracks the active tab.                                          */
/* -------------------------------------------------------------------------- */

interface TabsContextValue {
  activeId?: string;
  setActiveId(id: string): void;
  onClose?: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("WorkspaceTabs children must be inside <TabList>.");
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  TabList                                                                   */
/* -------------------------------------------------------------------------- */

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** Active tab id (controlled). */
  activeId?: string;
  /** Default active tab id (uncontrolled). */
  defaultActiveId?: string;
  /** Fires whenever a tab is clicked. */
  onActiveIdChange?: (id: string) => void;
  /** Fires when a tab's close button is pressed. */
  onClose?: (id: string) => void;
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  {
    activeId: controlledActiveId,
    defaultActiveId,
    onActiveIdChange,
    onClose,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(
    defaultActiveId,
  );
  const activeId = controlledActiveId ?? uncontrolled;

  const setActiveId = useCallback(
    (id: string) => {
      if (controlledActiveId === undefined) setUncontrolled(id);
      onActiveIdChange?.(id);
    },
    [controlledActiveId, onActiveIdChange],
  );

  const value = useMemo<TabsContextValue>(
    () => ({ activeId, setActiveId, onClose }),
    [activeId, setActiveId, onClose],
  );

  return (
    <TabsContext.Provider value={value}>
      <div
        ref={ref}
        role="tablist"
        className={cn("workspace-tab-container", className)}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

/* -------------------------------------------------------------------------- */
/*  TabTrigger                                                                */
/* -------------------------------------------------------------------------- */

export interface TabTriggerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  /** Stable tab id. */
  id: string;
  /** Tab label text (usually a filename). */
  label: ReactNode;
  /** Whether this tab is pinned. */
  pinned?: boolean;
  /** Whether to render a close button (default true; disabled when pinned). */
  closable?: boolean;
}

export const TabTrigger = forwardRef<HTMLDivElement, TabTriggerProps>(
  function TabTrigger(
    { id, label, pinned, closable = true, className, children, onClick, ...rest },
    ref,
  ) {
    const tabs = useTabs();
    const active = tabs.activeId === id;
    return (
      <div
        ref={ref}
        role="tab"
        aria-selected={active}
        tabIndex={active ? 0 : -1}
        className={cn(
          "workspace-tab-header",
          active && "is-active mod-active",
          pinned && "mod-pinned",
          className,
        )}
        onClick={(e) => {
          onClick?.(e);
          tabs.setActiveId(id);
        }}
        {...rest}
      >
        <div className="workspace-tab-header-inner">
          {children}
          <span className="workspace-tab-header-inner-title">{label}</span>
        </div>
        {closable && !pinned ? <TabCloseButton tabId={id} /> : null}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  TabCloseButton                                                            */
/* -------------------------------------------------------------------------- */

export interface TabCloseButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Id of the parent tab. */
  tabId: string;
}

export const TabCloseButton = forwardRef<HTMLButtonElement, TabCloseButtonProps>(
  function TabCloseButton({ tabId, className, onClick, ...rest }, ref) {
    const tabs = useTabs();
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick?.(e);
      tabs.onClose?.(tabId);
    };
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Close tab"
        className={cn("workspace-tab-header-close", "clickable-icon", className)}
        onClick={handleClick}
        {...rest}
      >
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  TabFavicon                                                                */
/* -------------------------------------------------------------------------- */

export interface TabFaviconProps extends HTMLAttributes<HTMLSpanElement> {}

export const TabFavicon = forwardRef<HTMLSpanElement, TabFaviconProps>(
  function TabFavicon({ className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn("workspace-tab-header-inner-icon", className)}
        {...rest}
      />
    );
  },
);
