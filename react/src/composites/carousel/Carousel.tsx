import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Context for sibling controls (prev/next).                                 */
/* -------------------------------------------------------------------------- */

interface CarouselCtx {
  scrollPrev: () => void;
  scrollNext: () => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  canPrev: boolean;
  canNext: boolean;
}

const CarouselContext = createContext<CarouselCtx | null>(null);
const useCarousel = () => {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel children must be inside <Carousel>.");
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** Pixels to scroll per prev/next click. Defaults to 80% of viewport width. */
  step?: number;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { step, className, children, ...rest },
  ref,
) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const recompute = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
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

  const scrollPrev = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: -(step ?? el.clientWidth * 0.8), behavior: "smooth" });
  }, [step]);

  const scrollNext = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: step ?? el.clientWidth * 0.8, behavior: "smooth" });
  }, [step]);

  const ctx = useMemo(
    () => ({ scrollPrev, scrollNext, viewportRef, canPrev, canNext }),
    [scrollPrev, scrollNext, canPrev, canNext],
  );

  return (
    <CarouselContext.Provider value={ctx}>
      <div
        ref={ref}
        data-slot="carousel"
        className={cn("retroma-carousel", className)}
        {...rest}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

export interface CarouselViewportProps extends HTMLAttributes<HTMLDivElement> {}

export const CarouselViewport = forwardRef<HTMLDivElement, CarouselViewportProps>(
  function CarouselViewport({ className, children, ...rest }, ref) {
    const ctx = useCarousel();
    return (
      <div
        ref={(node) => {
          ctx.viewportRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-slot="carousel-viewport"
        className={cn("retroma-carousel-viewport", className)}
        {...rest}
      >
        <div className="retroma-carousel-track">{children}</div>
      </div>
    );
  },
);

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  function CarouselItem({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="carousel-item"
        className={cn("retroma-carousel-item", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface CarouselButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** "prev" or "next". */
  direction: "prev" | "next";
}

export const CarouselButton = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  function CarouselButton({ direction, className, children, ...rest }, ref) {
    const ctx = useCarousel();
    const disabled = direction === "prev" ? !ctx.canPrev : !ctx.canNext;
    return (
      <button
        ref={ref}
        type="button"
        aria-label={direction === "prev" ? "Previous" : "Next"}
        data-slot="carousel-button"
        disabled={disabled}
        onClick={direction === "prev" ? ctx.scrollPrev : ctx.scrollNext}
        className={cn(
          "retroma-carousel-button",
          `retroma-carousel-button--${direction}`,
          className,
        )}
        {...rest}
      >
        {children ?? (direction === "prev" ? "‹" : "›")}
      </button>
    );
  },
);
