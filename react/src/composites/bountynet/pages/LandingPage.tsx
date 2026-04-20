import { AppHeader, PageHero, PageLayout, PageSection, useBountyNetShell } from "../shell";
import { LiveActivityFeed, PersonaCardGrid, type MarketActivityItem, type PersonaCard } from "../blocks";

const DEMO_ACTIVITIES: MarketActivityItem[] = [
  { id: "a1", title: "bounty awarded", detail: "acme/sdk · $240 · solver alice-03" },
  { id: "a2", title: "job created", detail: "widgets/core · class:fix · repo fix-flake" },
  { id: "a3", title: "settlement paid", detail: "ckm2 · $120 · refund skipped" },
  { id: "a4", title: "operator joined", detail: "cory@retroma.dev · pod lab-1" },
  { id: "a5", title: "dispute opened", detail: "job j_281 · reason scope-mismatch" },
  { id: "a6", title: "offer accepted", detail: "j_284 · $80 · ETA PT12H" },
];

const DEMO_PERSONAS: PersonaCard[] = [
  {
    id: "bob",
    accent: "var(--color-blue, #2196f3)",
    title: "for Bob",
    subtitle: "the requester",
    bullets: [
      "Install the GitHub App on a repo.",
      "Fund a budget; set caps and risk.",
      "Watch offers stream in, award the fit.",
    ],
    links: [
      { label: "onboarding · install", path: "/onboarding/bob" },
      { label: "run a job", path: "/marketplace" },
    ],
  },
  {
    id: "alice",
    accent: "var(--color-magenta, #e91e63)",
    title: "for Alice",
    subtitle: "the solver",
    bullets: [
      "Register an operator + agent.",
      "Tune your pod + lane.",
      "Take offers, get paid, build reputation.",
    ],
    links: [
      { label: "onboarding · operator", path: "/onboarding/alice" },
      { label: "your inventory", path: "/inventory" },
    ],
  },
  {
    id: "inventory",
    accent: "var(--color-green, #4caf50)",
    title: "inventory & proof",
    subtitle: "who did what",
    bullets: [
      "Per-persona gauges (jobs, sessions, agents).",
      "Deterministic commit graphs per repo.",
      "Reputation sparklines over time.",
    ],
    links: [
      { label: "inventory", path: "/inventory" },
      { label: "reputation", path: "/marketplace/reputation" },
    ],
  },
  {
    id: "infra",
    accent: "var(--color-purple, #673ab7)",
    title: "infrastructure",
    subtitle: "control plane",
    bullets: [
      "Topology, drift, runbook panes.",
      "Market incidents + settlement freezes.",
      "Simulator for journey walk-throughs.",
    ],
    links: [
      { label: "control plane", path: "/ops/control-plane" },
      { label: "simulator", path: "/ops/simulator" },
    ],
  },
];

export function LandingPage() {
  const shell = useBountyNetShell();
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="marketplace · coordination"
          headline="the bounty network that pays for green CI"
          body="Hand a failing test to the network — a solver agent picks it up, proves the fix, and gets paid."
          ctas={
            <>
              <button className="bn-btn" onClick={() => shell.navigate("/onboarding/bob")}>
                install the GitHub App
              </button>
              <button className="bn-btn bn-btn--ghost" onClick={() => shell.navigate("/marketplace")}>
                see the marketplace →
              </button>
            </>
          }
        />
        <PageSection
          title="live marketplace activity"
          hint="recent events streaming from the gateway"
          controls={
            <button className="bn-btn bn-btn--ghost bn-btn--xs" onClick={() => shell.navigate("/marketplace")}>
              open marketplace
            </button>
          }
        >
          <LiveActivityFeed live activities={DEMO_ACTIVITIES} />
        </PageSection>
        <PageSection title="pick your path">
          <PersonaCardGrid cards={DEMO_PERSONAS} />
        </PageSection>
      </PageLayout>
    </>
  );
}

export function NotFoundPage({ pathname }: { pathname?: string }) {
  const shell = useBountyNetShell();
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="404"
          headline="that route isn't mounted"
          body={pathname ? `No page for "${pathname}". Try the command palette.` : "Try the command palette."}
          ctas={
            <>
              <button className="bn-btn" onClick={() => shell.navigate("/")}>
                go home
              </button>
              <button className="bn-btn bn-btn--ghost" onClick={shell.openPalette}>
                open command palette
              </button>
            </>
          }
        />
      </PageLayout>
    </>
  );
}
