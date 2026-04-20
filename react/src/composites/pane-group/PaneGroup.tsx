import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Pane — a single column inside a PaneGroup.                                */
/* -------------------------------------------------------------------------- */

export interface PaneProps extends HTMLAttributes<HTMLDivElement> {
  /** Minimum allowed size as % (default 10). */
  minSize?: number;
  /** Maximum allowed size as % (default 90). */
  maxSize?: number;
}

export const Pane = forwardRef<HTMLDivElement, PaneProps>(function Pane(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="pane"
      className={cn("retroma-pane", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  PaneHandle — visible divider between panes.                               */
/* -------------------------------------------------------------------------- */

export interface PaneHandleProps extends HTMLAttributes<HTMLDivElement> {}

export const PaneHandle = forwardRef<HTMLDivElement, PaneHandleProps>(
  function PaneHandle({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="pane-handle"
        role="separator"
        aria-orientation="vertical"
        className={cn("retroma-pane-handle", className)}
        {...rest}
      />
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  PaneGroup                                                                 */
/* -------------------------------------------------------------------------- */

export interface PaneGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Persist pane sizes to localStorage under this key. */
  persistKey?: string;
  /** Orientation. Vertical drag handles still split horizontally for both. */
  direction?: "horizontal" | "vertical";
  /** Default sizes as percentages (sum to 100). */
  defaultSizes?: number[];
  /** Children should be <Pane> elements; <PaneHandle> is inserted between them. */
  children: ReactNode;
}

function safeParse(json: string | null): number[] | null {
  if (!json) return null;
  try {
    const v = JSON.parse(json);
    if (Array.isArray(v) && v.every((n) => typeof n === "number")) return v;
  } catch {
    /* ignore */
  }
  return null;
}

export const PaneGroup = forwardRef<HTMLDivElement, PaneGroupProps>(
  function PaneGroup(
    {
      persistKey,
      direction = "horizontal",
      defaultSizes,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const panes = useMemo(
      () =>
        Children.toArray(children).filter(
          (child) =>
            isValidElement(child) &&
            (child as ReactElement).type === Pane,
        ) as ReactElement<PaneProps>[],
      [children],
    );

    const [sizes, setSizes] = useState<number[]>(() => {
      if (typeof window !== "undefined" && persistKey) {
        const stored = safeParse(
          window.localStorage.getItem(`retroma.pane-group.${persistKey}`),
        );
        if (stored && stored.length === panes.length) return stored;
      }
      if (defaultSizes && defaultSizes.length === panes.length) return defaultSizes;
      const even = 100 / Math.max(panes.length, 1);
      return panes.map(() => even);
    });

    useEffect(() => {
      if (!persistKey || typeof window === "undefined") return;
      window.localStorage.setItem(
        `retroma.pane-group.${persistKey}`,
        JSON.stringify(sizes),
      );
    }, [sizes, persistKey]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragRef = useRef<{
      index: number;
      startCoord: number;
      totalSize: number;
      startSizes: number[];
    } | null>(null);

    const startDrag = useCallback(
      (index: number, event: React.PointerEvent) => {
        event.preventDefault();
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        dragRef.current = {
          index,
          startCoord: direction === "horizontal" ? event.clientX : event.clientY,
          totalSize: direction === "horizontal" ? rect.width : rect.height,
          startSizes: [...sizes],
        };

        const paneMins = panes.map((p) => p.props.minSize ?? 10);
        const paneMaxes = panes.map((p) => p.props.maxSize ?? 90);

        const onMove = (moveEvent: PointerEvent) => {
          const ctx = dragRef.current;
          if (!ctx) return;
          const coord =
            direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
          const deltaPx = coord - ctx.startCoord;
          const deltaPct = (deltaPx / ctx.totalSize) * 100;
          setSizes(() => {
            const next = [...ctx.startSizes];
            const a = next[ctx.index] + deltaPct;
            const b = next[ctx.index + 1] - deltaPct;
            if (
              a < paneMins[ctx.index] ||
              a > paneMaxes[ctx.index] ||
              b < paneMins[ctx.index + 1] ||
              b > paneMaxes[ctx.index + 1]
            ) {
              return ctx.startSizes;
            }
            next[ctx.index] = a;
            next[ctx.index + 1] = b;
            return next;
          });
        };
        const onUp = () => {
          dragRef.current = null;
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      },
      [direction, panes, sizes],
    );

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-slot="pane-group"
        data-direction={direction}
        className={cn(
          "retroma-pane-group",
          direction === "vertical" && "retroma-pane-group--vertical",
          className,
        )}
        {...rest}
      >
        {panes.map((pane, index) => (
          <div
            key={pane.key ?? index}
            className="retroma-pane-slot"
            style={{
              flexBasis: `${sizes[index]}%`,
            }}
          >
            {pane}
            {index < panes.length - 1 ? (
              <PaneHandle
                onPointerDown={(e) => startDrag(index, e)}
                tabIndex={0}
              />
            ) : null}
          </div>
        ))}
      </div>
    );
  },
);
