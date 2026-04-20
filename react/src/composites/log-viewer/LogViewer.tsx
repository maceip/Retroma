import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "stdout" | "stderr";

export interface LogEntry {
  /** Stable id (row key). */
  id: string;
  /** ISO timestamp or any displayable label. */
  ts?: ReactNode;
  /** Level tag. */
  level?: LogLevel;
  /** Source / namespace (e.g., "api", "worker-1"). */
  source?: ReactNode;
  /** Raw message. */
  message: ReactNode;
}

export interface LogViewerProps extends HTMLAttributes<HTMLDivElement> {
  entries: readonly LogEntry[];
  /** Follow tail (auto-scroll on new entries). */
  follow?: boolean;
  /** Fixed height. Defaults to 320. */
  height?: number | string;
  /** Filter by level. */
  level?: LogLevel | LogLevel[];
  /** Search term (case-insensitive). */
  search?: string;
  /** Hide timestamps column. */
  hideTs?: boolean;
  /** Hide source column. */
  hideSource?: boolean;
}

export const LogViewer = forwardRef<HTMLDivElement, LogViewerProps>(
  function LogViewer(
    {
      entries,
      follow = true,
      height = 320,
      level,
      search,
      hideTs,
      hideSource,
      className,
      ...rest
    },
    ref,
  ) {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const levels = useMemo(() => {
      if (!level) return null;
      return new Set(Array.isArray(level) ? level : [level]);
    }, [level]);

    const filtered = useMemo(() => {
      return entries.filter((e) => {
        if (levels && e.level && !levels.has(e.level)) return false;
        if (search) {
          const hay =
            typeof e.message === "string" ? e.message.toLowerCase() : "";
          if (!hay.includes(search.toLowerCase())) return false;
        }
        return true;
      });
    }, [entries, levels, search]);

    useEffect(() => {
      if (!follow) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }, [filtered.length, follow]);

    return (
      <div
        ref={ref}
        data-slot="log-viewer"
        className={cn("retroma-log-viewer", className)}
        style={{ height, ...rest.style }}
        {...rest}
      >
        <div ref={scrollRef} className="retroma-log-viewer-scroll">
          {filtered.length === 0 ? (
            <div className="retroma-log-viewer-empty">
              {search || level ? "no entries match the filter" : "waiting for logs…"}
            </div>
          ) : (
            filtered.map((e) => (
              <div
                key={e.id}
                data-level={e.level ?? "info"}
                className={cn(
                  "retroma-log-row",
                  `retroma-log-row--${e.level ?? "info"}`,
                )}
              >
                {!hideTs && e.ts !== undefined ? (
                  <span className="retroma-log-ts">{e.ts}</span>
                ) : null}
                {e.level ? (
                  <span className="retroma-log-level">{e.level}</span>
                ) : null}
                {!hideSource && e.source !== undefined ? (
                  <span className="retroma-log-source">{e.source}</span>
                ) : null}
                <span className="retroma-log-message">{e.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
);
