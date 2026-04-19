import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

export interface TextScrambleProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The final text to reveal. */
  children: string;
  /** Characters the scramble draws from. */
  alphabet?: string;
  /** Milliseconds between animation frames. */
  tickMs?: number;
  /** Average number of frames each char scrambles before settling. */
  scrambleLength?: number;
  /** Re-run when this value changes. */
  trigger?: unknown;
  /** Auto-play on mount. */
  autoPlay?: boolean;
}

const DEFAULT_ALPHABET =
  "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const TextScramble = forwardRef<HTMLSpanElement, TextScrambleProps>(
  function TextScramble(
    {
      children: target,
      alphabet = DEFAULT_ALPHABET,
      tickMs = 30,
      scrambleLength = 8,
      trigger,
      autoPlay = true,
      className,
      ...rest
    },
    ref,
  ) {
    const [out, setOut] = useState(target);
    const rafRef = useRef<number | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      if (!autoPlay && trigger === undefined) return;
      const from = out;
      const to = target;
      const length = Math.max(from.length, to.length);
      const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
      for (let i = 0; i < length; i++) {
        const start = Math.floor(Math.random() * scrambleLength);
        const end = start + Math.floor(Math.random() * scrambleLength);
        queue.push({ from: from[i] ?? "", to: to[i] ?? "", start, end });
      }

      let frame = 0;
      const step = () => {
        let draft = "";
        let complete = 0;
        for (let i = 0, n = queue.length; i < n; i++) {
          const q = queue[i];
          if (frame >= q.end) {
            complete++;
            draft += q.to;
          } else if (frame >= q.start) {
            if (!q.char || Math.random() < 0.28) {
              q.char = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
            draft += q.char;
          } else {
            draft += q.from;
          }
        }
        setOut(draft);
        if (complete !== queue.length) {
          frame++;
          timeoutRef.current = setTimeout(() => {
            rafRef.current = requestAnimationFrame(step);
          }, tickMs);
        }
      };
      step();

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, alphabet, tickMs, scrambleLength, trigger]);

    return (
      <span
        ref={ref}
        data-slot="text-scramble"
        className={cn("retroma-text-scramble", className)}
        {...rest}
      >
        {out}
      </span>
    );
  },
);
