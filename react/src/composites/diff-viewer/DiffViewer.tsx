import {
  forwardRef,
  memo,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Diff data model                                                           */
/* -------------------------------------------------------------------------- */

export type DiffLineKind = "ctx" | "add" | "del" | "hunk" | "empty";

export interface DiffLine {
  /** Line kind. */
  kind: DiffLineKind;
  /** Text content (without the leading +/- marker). */
  text: string;
  /** Left-side (before) line number. */
  oldNumber?: number;
  /** Right-side (after) line number. */
  newNumber?: number;
}

export interface DiffHunk {
  /** Header line (e.g. "@@ -10,7 +10,9 @@ export function foo()"). */
  header: string;
  /** Lines inside the hunk. */
  lines: DiffLine[];
}

export interface DiffFile {
  /** File path before the change. */
  oldPath?: string;
  /** File path after the change. */
  newPath: string;
  /** Change classification. */
  kind?: "modified" | "added" | "deleted" | "renamed" | "binary";
  /** Detected language (for syntax-coloring hint only). */
  language?: string;
  /** Total lines added. */
  additions?: number;
  /** Total lines removed. */
  deletions?: number;
  /** Hunks. */
  hunks: DiffHunk[];
  /** Treat as binary — no inline diff rendered. */
  binary?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Parser (minimal subset of unified diff)                                   */
/* -------------------------------------------------------------------------- */

/**
 * Parse a single-file unified diff text into a DiffFile. Good enough for
 * rendering; not meant to replace a real parser.
 */
export function parseUnifiedDiff(raw: string, newPath = "file"): DiffFile {
  const lines = raw.split("\n");
  const hunks: DiffHunk[] = [];
  let current: DiffHunk | null = null;
  let oldNo = 0;
  let newNo = 0;
  let additions = 0;
  let deletions = 0;
  let oldPath: string | undefined;
  let finalNewPath = newPath;
  let kind: DiffFile["kind"] = "modified";

  for (const line of lines) {
    if (line.startsWith("--- ") && !line.startsWith("--- /dev/null")) {
      oldPath = line.slice(4).replace(/^a\//, "");
    } else if (line.startsWith("--- /dev/null")) {
      kind = "added";
    } else if (line.startsWith("+++ ") && !line.startsWith("+++ /dev/null")) {
      finalNewPath = line.slice(4).replace(/^b\//, "") || newPath;
    } else if (line.startsWith("+++ /dev/null")) {
      kind = "deleted";
    } else if (line.startsWith("@@")) {
      const m = /@@ -([0-9]+)(?:,[0-9]+)? \+([0-9]+)(?:,[0-9]+)? @@/.exec(line);
      oldNo = m ? Number(m[1]) : 1;
      newNo = m ? Number(m[2]) : 1;
      current = { header: line, lines: [] };
      hunks.push(current);
    } else if (current) {
      if (line.startsWith("+")) {
        current.lines.push({ kind: "add", text: line.slice(1), newNumber: newNo++ });
        additions++;
      } else if (line.startsWith("-")) {
        current.lines.push({ kind: "del", text: line.slice(1), oldNumber: oldNo++ });
        deletions++;
      } else {
        current.lines.push({
          kind: "ctx",
          text: line.startsWith(" ") ? line.slice(1) : line,
          oldNumber: oldNo++,
          newNumber: newNo++,
        });
      }
    }
  }

  return {
    oldPath,
    newPath: finalNewPath,
    kind,
    hunks,
    additions,
    deletions,
  };
}

/* -------------------------------------------------------------------------- */
/*  DiffViewer                                                                */
/* -------------------------------------------------------------------------- */

export type DiffView = "unified" | "split";

export interface DiffViewerProps extends HTMLAttributes<HTMLDivElement> {
  /** File to render. */
  file: DiffFile;
  /** Default view mode (controlled overrides this). */
  defaultView?: DiffView;
  /** Controlled view mode. */
  view?: DiffView;
  /** Fires when the user switches views. */
  onViewChange?: (v: DiffView) => void;
  /** Show the +NN / -NN counts in the header. */
  showStats?: boolean;
  /** Right-aligned header actions. */
  actions?: ReactNode;
  /** Collapsible hunks. */
  collapsible?: boolean;
  /** Wrap long lines (default: false → horizontal scroll). */
  wrap?: boolean;
}

export const DiffViewer = forwardRef<HTMLDivElement, DiffViewerProps>(
  function DiffViewer(
    {
      file,
      defaultView = "unified",
      view: controlledView,
      onViewChange,
      showStats = true,
      actions,
      collapsible,
      wrap,
      className,
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState<DiffView>(defaultView);
    const view = controlledView ?? uncontrolled;
    const switchView = (v: DiffView) => {
      if (controlledView === undefined) setUncontrolled(v);
      onViewChange?.(v);
    };

    return (
      <div
        ref={ref}
        data-slot="diff-viewer"
        data-view={view}
        className={cn(
          "retroma-diff",
          wrap && "retroma-diff--wrap",
          className,
        )}
        {...rest}
      >
        <DiffHeader
          file={file}
          view={view}
          onSwitch={switchView}
          showStats={showStats}
          actions={actions}
        />
        {file.binary ? (
          <div className="retroma-diff-binary">
            <span>binary file — no inline diff available</span>
          </div>
        ) : view === "unified" ? (
          <UnifiedView hunks={file.hunks} collapsible={collapsible} />
        ) : (
          <SplitView hunks={file.hunks} collapsible={collapsible} />
        )}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Sub-pieces                                                                */
/* -------------------------------------------------------------------------- */

function DiffHeader({
  file,
  view,
  onSwitch,
  showStats,
  actions,
}: {
  file: DiffFile;
  view: DiffView;
  onSwitch: (v: DiffView) => void;
  showStats: boolean;
  actions?: ReactNode;
}) {
  const kind = file.kind ?? "modified";
  return (
    <header className="retroma-diff-header">
      <span
        className={cn(
          "retroma-diff-kind",
          `retroma-diff-kind--${kind}`,
        )}
      >
        {kind}
      </span>
      <span className="retroma-diff-path" title={file.newPath}>
        {file.oldPath && file.oldPath !== file.newPath ? (
          <>
            <span className="retroma-diff-path-old">{file.oldPath}</span>
            <span className="retroma-diff-path-sep">→</span>
          </>
        ) : null}
        <span className="retroma-diff-path-new">{file.newPath}</span>
      </span>
      {showStats &&
      (file.additions !== undefined || file.deletions !== undefined) ? (
        <span className="retroma-diff-stats" aria-hidden="true">
          {file.additions !== undefined ? (
            <span className="retroma-diff-stat retroma-diff-stat--add">
              +{file.additions}
            </span>
          ) : null}
          {file.deletions !== undefined ? (
            <span className="retroma-diff-stat retroma-diff-stat--del">
              −{file.deletions}
            </span>
          ) : null}
        </span>
      ) : null}
      <span className="retroma-diff-spacer" />
      <div role="tablist" className="retroma-diff-view-switch">
        <button
          type="button"
          role="tab"
          aria-selected={view === "unified"}
          data-active={view === "unified" ? "true" : undefined}
          className="retroma-diff-view-tab"
          onClick={() => onSwitch("unified")}
        >
          unified
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "split"}
          data-active={view === "split" ? "true" : undefined}
          className="retroma-diff-view-tab"
          onClick={() => onSwitch("split")}
        >
          split
        </button>
      </div>
      {actions ? <span className="retroma-diff-actions">{actions}</span> : null}
    </header>
  );
}

const UnifiedView = memo(function UnifiedView({
  hunks,
  collapsible,
}: {
  hunks: DiffHunk[];
  collapsible?: boolean;
}) {
  return (
    <div className="retroma-diff-body retroma-diff-body--unified">
      {hunks.map((h, i) => (
        <HunkBlock key={i} hunk={h} view="unified" collapsible={collapsible} />
      ))}
    </div>
  );
});

const SplitView = memo(function SplitView({
  hunks,
  collapsible,
}: {
  hunks: DiffHunk[];
  collapsible?: boolean;
}) {
  return (
    <div className="retroma-diff-body retroma-diff-body--split">
      {hunks.map((h, i) => (
        <HunkBlock key={i} hunk={h} view="split" collapsible={collapsible} />
      ))}
    </div>
  );
});

function HunkBlock({
  hunk,
  view,
  collapsible,
}: {
  hunk: DiffHunk;
  view: DiffView;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const rows = useMemo(
    () => (view === "split" ? pairRowsForSplit(hunk.lines) : null),
    [hunk.lines, view],
  );
  return (
    <section className="retroma-diff-hunk">
      <button
        type="button"
        className="retroma-diff-hunk-head"
        onClick={() => (collapsible ? setOpen((v) => !v) : undefined)}
        aria-expanded={open}
      >
        <span className="retroma-diff-hunk-caret">{open ? "▾" : "▸"}</span>
        <code>{hunk.header}</code>
      </button>
      {open ? (
        view === "unified" ? (
          <div className="retroma-diff-hunk-body">
            {hunk.lines.map((line, i) => (
              <DiffRow key={i} line={line} />
            ))}
          </div>
        ) : (
          <div className="retroma-diff-hunk-body retroma-diff-hunk-body--split">
            {rows!.map((pair, i) => (
              <div key={i} className="retroma-diff-split-row">
                <DiffRow line={pair.left} side="left" />
                <DiffRow line={pair.right} side="right" />
              </div>
            ))}
          </div>
        )
      ) : null}
    </section>
  );
}

function DiffRow({
  line,
  side,
}: {
  line: DiffLine;
  side?: "left" | "right";
}) {
  const { kind, text, oldNumber, newNumber } = line;
  const gutter =
    side === "left"
      ? oldNumber
      : side === "right"
        ? newNumber
        : kind === "add"
          ? newNumber
          : kind === "del"
            ? oldNumber
            : newNumber ?? oldNumber;
  const marker = kind === "add" ? "+" : kind === "del" ? "−" : " ";
  return (
    <div
      data-kind={kind}
      className={cn(
        "retroma-diff-row",
        `retroma-diff-row--${kind}`,
        side && `retroma-diff-row--${side}`,
      )}
    >
      <span className="retroma-diff-gutter" aria-hidden="true">
        {gutter ?? ""}
      </span>
      <span className="retroma-diff-marker" aria-hidden="true">
        {marker}
      </span>
      <code className="retroma-diff-text">{text.length === 0 ? "\u00A0" : text}</code>
    </div>
  );
}

/* Pair add/del lines into split rows; context lines appear on both sides. */
function pairRowsForSplit(
  lines: DiffLine[],
): Array<{ left: DiffLine; right: DiffLine }> {
  const rows: Array<{ left: DiffLine; right: DiffLine }> = [];
  const empty: DiffLine = { kind: "empty", text: "" };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.kind === "ctx") {
      rows.push({ left: line, right: line });
      i++;
      continue;
    }
    if (line.kind === "del") {
      const dels: DiffLine[] = [line];
      i++;
      while (i < lines.length && lines[i].kind === "del") {
        dels.push(lines[i++]);
      }
      const adds: DiffLine[] = [];
      while (i < lines.length && lines[i].kind === "add") {
        adds.push(lines[i++]);
      }
      const max = Math.max(dels.length, adds.length);
      for (let j = 0; j < max; j++) {
        rows.push({
          left: dels[j] ?? empty,
          right: adds[j] ?? empty,
        });
      }
      continue;
    }
    if (line.kind === "add") {
      rows.push({ left: empty, right: line });
      i++;
      continue;
    }
    rows.push({ left: line, right: line });
    i++;
  }
  return rows;
}

/* -------------------------------------------------------------------------- */
/*  Multi-file wrapper                                                        */
/* -------------------------------------------------------------------------- */

export interface DiffFileListProps extends HTMLAttributes<HTMLDivElement> {
  files: readonly DiffFile[];
  /** Default view applied to every file. */
  defaultView?: DiffView;
  /** Render an icon / count summary header above the list. */
  summary?: ReactNode;
}

export const DiffFileList = forwardRef<HTMLDivElement, DiffFileListProps>(
  function DiffFileList(
    { files, defaultView, summary, className, ...rest },
    ref,
  ) {
    const totals = useMemo(() => {
      let adds = 0;
      let dels = 0;
      for (const f of files) {
        adds += f.additions ?? 0;
        dels += f.deletions ?? 0;
      }
      return { adds, dels };
    }, [files]);

    return (
      <div
        ref={ref}
        data-slot="diff-file-list"
        className={cn("retroma-diff-list", className)}
        {...rest}
      >
        {summary !== undefined ? (
          summary
        ) : (
          <header className="retroma-diff-list-summary">
            <span>
              <strong>{files.length}</strong> file
              {files.length === 1 ? "" : "s"} changed
            </span>
            <span className="retroma-diff-stat retroma-diff-stat--add">
              +{totals.adds}
            </span>
            <span className="retroma-diff-stat retroma-diff-stat--del">
              −{totals.dels}
            </span>
          </header>
        )}
        <div className="retroma-diff-list-items">
          {files.map((f) => (
            <DiffViewer
              key={f.newPath}
              file={f}
              defaultView={defaultView}
              collapsible
            />
          ))}
        </div>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Worktree lineage (trivial visual aid for the page)                        */
/* -------------------------------------------------------------------------- */

export interface WorktreeLineageNode {
  id: string;
  label: string;
  /** Short SHA / ref / branch name rendered next to the label. */
  ref?: string;
  /** State. */
  state?: "base" | "head" | "merged" | "branch";
  /** Optional note / author. */
  note?: string;
}

export interface WorktreeLineageProps extends HTMLAttributes<HTMLDivElement> {
  nodes: readonly WorktreeLineageNode[];
}

export const WorktreeLineage = forwardRef<HTMLDivElement, WorktreeLineageProps>(
  function WorktreeLineage({ nodes, className, ...rest }, ref) {
    return (
      <ol
        ref={ref as unknown as React.Ref<HTMLOListElement>}
        data-slot="worktree-lineage"
        className={cn("retroma-worktree", className)}
        {...(rest as HTMLAttributes<HTMLOListElement>)}
      >
        {nodes.map((n, i) => (
          <li
            key={n.id}
            data-state={n.state ?? "branch"}
            className={cn(
              "retroma-worktree-node",
              `retroma-worktree-node--${n.state ?? "branch"}`,
            )}
          >
            <span className="retroma-worktree-dot" aria-hidden="true" />
            <div className="retroma-worktree-body">
              <div className="retroma-worktree-title">
                <span className="retroma-worktree-label">{n.label}</span>
                {n.ref ? <code className="retroma-worktree-ref">{n.ref}</code> : null}
              </div>
              {n.note ? <div className="retroma-worktree-note">{n.note}</div> : null}
            </div>
            {i < nodes.length - 1 ? (
              <span className="retroma-worktree-connector" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    );
  },
);
