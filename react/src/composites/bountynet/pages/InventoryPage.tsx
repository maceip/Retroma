import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import { WorkSummaryCard, type WorkSummaryItem } from "../blocks";

const BOB_JOBS: WorkSummaryItem[] = [
  { id: "j_281", title: "flaky schedule tests", context: "acme/sdk · class:fix", status: "ok" },
  { id: "j_284", title: "bump webpack to 6", context: "widgets/core · class:upgrade", status: "info" },
  { id: "j_286", title: "migrate fixtures", context: "acme/sdk · class:refactor", status: "warn" },
  { id: "j_288", title: "stabilize e2e", context: "retroma/theme", status: "ok" },
];

const ALICE_SESSIONS: WorkSummaryItem[] = [
  { id: "s1", title: "context_hash 0x9f12…", context: "acme/sdk · CI ✓ · settled", status: "ok" },
  { id: "s2", title: "context_hash 0x7b04…", context: "widgets/core · CI ✓", status: "ok" },
  { id: "s3", title: "context_hash 0xa1ee…", context: "retroma/theme · CI ✗", status: "err" },
];

const AGENTS: WorkSummaryItem[] = [
  { id: "ag1", title: "alice-03", context: "pod lab-1 · lane green-ci", status: "ok" },
  { id: "ag2", title: "mallory-07", context: "pod lab-1 · lane green-ci", status: "ok" },
  { id: "ag3", title: "trent-01", context: "pod lab-2 · lane refactor", status: "warn" },
  { id: "ag4", title: "nia-12", context: "pod lab-2 · lane upgrade", status: "info" },
];

export function InventoryPage() {
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="inventory · dashboard"
          headline="who did what, and how much is left"
          body="Per-persona gauges, session history, and the live agent roster — all local-first with server enrichment."
        />
        <div className="bn-page-grid bn-page-grid--3">
          <WorkSummaryCard
            title="work done for you"
            hint="Bob · jobs closed this week"
            metric={{ label: "job throughput", value: 18, max: 30 }}
            items={BOB_JOBS}
          />
          <WorkSummaryCard
            title="work done by you"
            hint="Alice · sessions"
            metric={{ label: "sessions", value: 27, max: 40 }}
            items={ALICE_SESSIONS}
          />
          <WorkSummaryCard
            title="registered agents"
            hint="agents in your pod"
            metric={{ label: "active agents", value: AGENTS.length, max: 40 }}
            items={AGENTS}
          />
        </div>
      </PageLayout>
    </>
  );
}
