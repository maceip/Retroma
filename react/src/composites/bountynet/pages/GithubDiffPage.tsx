import { useState } from "react";
import { AppHeader, PageHero, PageLayout, PageSection, useBountyNetShell } from "../shell";
import { GithubButton, GithubButtonGroup, GithubStarsButton } from "../../github-button";
import { StatusIndicator } from "../../status-indicator";
import { ContributorGrid, type Contributor } from "../../contributor-grid";
import { ActivityGraph } from "../../activity-graph";
import { Stepper } from "../../stepper";
import {
  DiffFileList,
  DiffViewer,
  WorktreeLineage,
  parseUnifiedDiff,
  type DiffFile,
  type WorktreeLineageNode,
} from "../../diff-viewer";
import { LogViewer, type LogEntry } from "../../log-viewer";
import { JsonViewer } from "../../json-viewer";
import { FileTree, FileTreeFile, FileTreeFolder } from "../../file-tree";
import { Pane, PaneGroup } from "../../pane-group";

/* -------------------------------------------------------------------------- */
/*  Demo data                                                                 */
/* -------------------------------------------------------------------------- */

const RAW_DIFF_A = `--- a/src/workers/queue.ts
+++ b/src/workers/queue.ts
@@ -12,7 +12,11 @@ export class WorkerQueue {
   }

-  enqueue(job: Job) {
-    this.items.push(job);
+  enqueue(job: Job, opts: EnqueueOpts = {}) {
+    const priority = opts.priority ?? 0;
+    this.items.push({ ...job, priority });
+    this.items.sort((a, b) => b.priority - a.priority);
+    this.metrics.enqueued += 1;
   }

@@ -29,6 +33,8 @@ export class WorkerQueue {
   async drain() {
+    if (this.draining) return;
+    this.draining = true;
     while (this.items.length) {
       const job = this.items.shift()!;`;

const RAW_DIFF_B = `--- a/package.json
+++ b/package.json
@@ -4,7 +4,7 @@
   "name": "@retroma/react",
-  "version": "0.2.0",
+  "version": "0.3.0",
   "description": "Retroma design system",
   "license": "MIT"
 }`;

const RAW_DIFF_C = `--- a/README.md
+++ b/README.md
@@ -1,4 +1,6 @@
 # Retroma
+
+High-performance diff page ported from Retroma's composite toolkit.

 Retroma is an Obsidian theme, now also a React component library.`;

const FILES: DiffFile[] = [
  parseUnifiedDiff(RAW_DIFF_A, "src/workers/queue.ts"),
  parseUnifiedDiff(RAW_DIFF_B, "package.json"),
  parseUnifiedDiff(RAW_DIFF_C, "README.md"),
];

const WORKTREE: WorktreeLineageNode[] = [
  { id: "main", label: "main", ref: "a3f42c1", state: "base", note: "last release · v0.2.0" },
  { id: "fork", label: "feat/worker-control", ref: "branch from main", state: "branch" },
  { id: "c1", label: "priority queue + drain guard", ref: "c4aeb12", state: "branch", note: "cory · 2h ago" },
  { id: "c2", label: "bump to 0.3.0 + changelog", ref: "9a1c08e", state: "branch", note: "cory · 2h ago" },
  { id: "head", label: "ready for review", ref: "HEAD", state: "head", note: "awaiting merge" },
];

const CONTRIBUTORS: Contributor[] = [
  { id: "cory", name: "cory", contributions: 148 },
  { id: "juno", name: "juno", contributions: 92 },
  { id: "rin", name: "rin", contributions: 63 },
  { id: "alice", name: "alice", contributions: 40 },
  { id: "mallory", name: "mallory", contributions: 28 },
  { id: "trent", name: "trent", contributions: 12 },
];

const ACTIVITY = Array.from({ length: 12 }).map((_, i) => ({
  label: `w${i + 1}`,
  value: [2, 5, 3, 9, 11, 7, 14, 18, 11, 22, 17, 25][i] ?? 0,
}));

const LOGS: LogEntry[] = [
  { id: "1", ts: "13:02:01", level: "info",   source: "runner", message: "▶ checkout main" },
  { id: "2", ts: "13:02:04", level: "info",   source: "runner", message: "▶ npm ci" },
  { id: "3", ts: "13:02:28", level: "info",   source: "runner", message: "▶ npm run typecheck" },
  { id: "4", ts: "13:02:44", level: "info",   source: "runner", message: "▶ npm run build" },
  { id: "5", ts: "13:03:01", level: "warn",   source: "vite",   message: "chunk index-CVcb1nQp larger than 500 kB" },
  { id: "6", ts: "13:03:05", level: "info",   source: "runner", message: "▶ npm test --silent" },
  { id: "7", ts: "13:03:41", level: "stdout", source: "jest",   message: "PASS  src/composites/diff-viewer/DiffViewer.test.tsx" },
  { id: "8", ts: "13:03:42", level: "stdout", source: "jest",   message: "PASS  src/composites/log-viewer/LogViewer.test.tsx" },
  { id: "9", ts: "13:03:45", level: "info",   source: "runner", message: "✓ all checks green" },
];

const CHECKS_JSON = {
  job: "build-and-test",
  runner: "ubuntu-latest",
  conclusion: "success",
  duration_s: 104,
  steps: [
    { name: "checkout",   ok: true,  ms: 812 },
    { name: "install",    ok: true,  ms: 23040 },
    { name: "typecheck",  ok: true,  ms: 16421 },
    { name: "build",      ok: true,  ms: 18907 },
    { name: "test",       ok: true,  ms: 36122 },
    { name: "upload",     ok: true,  ms: 2144 },
  ],
};

const CI_STEPS = [
  { id: "queued",   label: "queued",   hint: "waiting for runner" },
  { id: "build",    label: "build",    hint: "tsup + vite" },
  { id: "test",     label: "test",     hint: "jest · vitest" },
  { id: "deploy",   label: "preview",  hint: "retroma-preview.vercel.app" },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function GithubDiffPage() {
  const shell = useBountyNetShell();
  const [view, setView] = useState<"unified" | "split">("split");

  return (
    <>
      <AppHeader
        trailing={
          <GithubButtonGroup>
            <GithubStarsButton stars={1245} />
            <GithubButton icon="⎇" count={82}>Fork</GithubButton>
            <GithubButton icon="👁" count={31}>Watch</GithubButton>
          </GithubButtonGroup>
        }
      />
      <PageLayout>
        <PageHero
          label={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <StatusIndicator tone="ok" variant="pill" label="all checks passed" pulse />
              <code style={{ fontFamily: "var(--font-monospace)", fontSize: 12, color: "var(--text-muted)" }}>
                retroma/react · pull #482
              </code>
            </span>
          }
          headline="feat(workers): priority queue + idempotent drain"
          body={
            <>
              Refactors <code>WorkerQueue</code> to take a priority per job and adds a
              drain-in-progress guard. Bumps the package to <code>0.3.0</code> and
              updates the README. All three files below reviewed at a glance.
            </>
          }
          ctas={
            <>
              <button className="bn-btn" onClick={() => setView(view === "split" ? "unified" : "split")}>
                toggle {view === "split" ? "unified" : "split"} view
              </button>
              <button className="bn-btn bn-btn--ghost" onClick={shell.openPalette}>
                jump to file · ⌘K
              </button>
            </>
          }
        />

        <PageSection title="CI" hint="the most recent checks run">
          <Stepper steps={CI_STEPS} current={CI_STEPS.length} />
        </PageSection>

        <div className="bn-page-grid bn-page-grid--3">
          <PageSection title="worktree lineage" hint="base → head">
            <WorktreeLineage nodes={WORKTREE} />
          </PageSection>
          <PageSection title="activity" hint="last 12 weeks">
            <ActivityGraph buckets={ACTIVITY} />
          </PageSection>
          <PageSection title="contributors" hint="top 6">
            <ContributorGrid contributors={CONTRIBUTORS} />
          </PageSection>
        </div>

        <PageSection
          title="changes"
          hint={`${FILES.length} files · +${FILES.reduce((a, f) => a + (f.additions ?? 0), 0)} −${FILES.reduce((a, f) => a + (f.deletions ?? 0), 0)}`}
          controls={
            <div className="retroma-diff-view-switch" role="tablist">
              <button
                type="button"
                data-active={view === "unified" ? "true" : undefined}
                className="retroma-diff-view-tab"
                onClick={() => setView("unified")}
              >
                unified
              </button>
              <button
                type="button"
                data-active={view === "split" ? "true" : undefined}
                className="retroma-diff-view-tab"
                onClick={() => setView("split")}
              >
                split
              </button>
            </div>
          }
        >
          <div className="bn-diff-split">
            <FileTree defaultOpen={["src", "workers"]}>
              <FileTreeFolder id="src" name="src">
                <FileTreeFolder id="workers" name="workers">
                  <FileTreeFile id="queue" name="queue.ts" adornment="+5 −2" />
                </FileTreeFolder>
              </FileTreeFolder>
              <FileTreeFile id="pkg" name="package.json" adornment="+1 −1" />
              <FileTreeFile id="readme" name="README.md" adornment="+2 −0" />
            </FileTree>
            <div className="bn-diff-files">
              {FILES.map((f) => (
                <DiffViewer
                  key={f.newPath}
                  file={f}
                  view={view}
                  onViewChange={setView}
                  collapsible
                />
              ))}
            </div>
          </div>
        </PageSection>

        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="CI log" hint="follows the tail">
            <LogViewer entries={LOGS} height={280} follow />
          </PageSection>
          <PageSection title="checks payload" hint="the raw JSON">
            <JsonViewer value={CHECKS_JSON} defaultExpandedDepth={2} />
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}

/* Re-export the all-files list component for consumers that want the bundle
 * without the rest of the page shell. */
export { DiffFileList };
