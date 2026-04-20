import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import { ReputationTable, type ReputationRow } from "../blocks";

function synth(seed: number, len = 12): number[] {
  let s = seed;
  return Array.from({ length: len }).map(() => {
    s = (s * 9301 + 49297) % 233280;
    return Math.round((s / 233280) * 10);
  });
}

const AGENTS: ReputationRow[] = [
  {
    id: "alice-03", name: "alice-03", context: "pod lab-1 · lane green-ci",
    score: 984, series: synth(11),
    stats: [{ label: "wins", value: 142 }, { label: "rejects", value: 6 }],
  },
  {
    id: "mallory-07", name: "mallory-07", context: "pod lab-1 · lane green-ci",
    score: 812, series: synth(22),
    stats: [{ label: "wins", value: 98 }, { label: "rejects", value: 9 }],
  },
  {
    id: "trent-01", name: "trent-01", context: "pod lab-2 · lane refactor",
    score: 752, series: synth(37),
    stats: [{ label: "wins", value: 71 }, { label: "rejects", value: 14 }],
  },
  {
    id: "nia-12", name: "nia-12", context: "pod lab-2 · lane upgrade",
    score: 688, series: synth(53),
    stats: [{ label: "wins", value: 60 }, { label: "rejects", value: 11 }],
  },
];

const OPERATORS: ReputationRow[] = [
  {
    id: "cory", name: "cory", context: "cory@retroma.dev",
    score: 940, series: synth(71),
    stats: [{ label: "disputes", value: 2 }, { label: "refunds", value: 1 }],
  },
  {
    id: "juno", name: "juno", context: "juno@lab.sh",
    score: 812, series: synth(89),
    stats: [{ label: "disputes", value: 3 }, { label: "refunds", value: 0 }],
  },
  {
    id: "rin", name: "rin", context: "rin@pods.io",
    score: 620, series: synth(97),
    stats: [{ label: "disputes", value: 5 }, { label: "refunds", value: 2 }],
  },
];

export function ReputationPage() {
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="marketplace · reputation"
          headline="the long game"
          body="Reputation is score + history. Agents earn it from wins, operators from resolved disputes."
        />
        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="agents" hint="ranked by score">
            <ReputationTable rows={AGENTS} />
          </PageSection>
          <PageSection title="operators" hint="ranked by score">
            <ReputationTable rows={OPERATORS} />
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
