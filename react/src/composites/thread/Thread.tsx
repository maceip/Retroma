import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Thread — scrollable message container with a "stick to bottom" affordance */
/*  and a floating jump-to-bottom button.                                     */
/* -------------------------------------------------------------------------- */

export interface ThreadProps extends HTMLAttributes<HTMLDivElement> {
  /** Auto-scroll to the bottom when children change. Default true. */
  stickToBottom?: boolean;
  /** Px threshold from the bottom under which "at bottom" is considered true. */
  bottomThreshold?: number;
}

export const Thread = forwardRef<HTMLDivElement, ThreadProps>(function Thread(
  {
    stickToBottom = true,
    bottomThreshold = 80,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="thread"
      data-stick={stickToBottom ? "true" : undefined}
      data-threshold={bottomThreshold}
      className={cn("retroma-thread", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  ThreadContent — the actual scrollable region. Tracks "at bottom" state    */
/*  and exposes a `renderAnchor` prop for the jump button.                    */
/* -------------------------------------------------------------------------- */

export interface ThreadContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Follow the tail when new children appear. */
  follow?: boolean;
  /** Distance from the bottom (px) that still counts as "at bottom". */
  bottomThreshold?: number;
}

export const ThreadContent = forwardRef<HTMLDivElement, ThreadContentProps>(
  function ThreadContent(
    { follow = true, bottomThreshold = 80, className, children, ...rest },
    ref,
  ) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [atBottom, setAtBottom] = useState(true);

    const mergeRef = useCallback(
      (node: HTMLDivElement | null) => {
        scrollRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    const recompute = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setAtBottom(distance <= bottomThreshold);
    }, [bottomThreshold]);

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      recompute();
      el.addEventListener("scroll", recompute, { passive: true });
      const ro = new ResizeObserver(recompute);
      ro.observe(el);
      return () => {
        el.removeEventListener("scroll", recompute);
        ro.disconnect();
      };
    }, [recompute]);

    useEffect(() => {
      if (!follow || !atBottom) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });

    return (
      <div
        ref={mergeRef}
        data-slot="thread-content"
        data-at-bottom={atBottom ? "true" : undefined}
        className={cn("retroma-thread-content", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  ThreadScrollToBottom — floating jump button that only appears when the    */
/*  user scrolled away from the tail.                                         */
/* -------------------------------------------------------------------------- */

export interface ThreadScrollToBottomProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Ref of the scrolling ThreadContent. */
  scrollRef: React.RefObject<HTMLDivElement | null>;
  /** Label override. */
  label?: ReactNode;
  /** Bottom threshold mirror (kept in sync with ThreadContent). */
  bottomThreshold?: number;
}

export const ThreadScrollToBottom = forwardRef<
  HTMLButtonElement,
  ThreadScrollToBottomProps
>(function ThreadScrollToBottom(
  { scrollRef, label = "jump to latest", bottomThreshold = 80, className, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      const d = el.scrollHeight - el.scrollTop - el.clientHeight;
      setVisible(d > bottomThreshold);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [scrollRef, bottomThreshold]);

  if (!visible) return null;
  return (
    <button
      ref={ref}
      type="button"
      data-slot="thread-scroll-to-bottom"
      className={cn("retroma-thread-scroll-to-bottom", className)}
      onClick={() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }}
      {...rest}
    >
      ↓ {label}
    </button>
  );
});
