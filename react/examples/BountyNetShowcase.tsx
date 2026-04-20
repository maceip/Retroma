import { useMemo, useState } from "react";
import { BountyNet as BN, StatusRail } from "@retroma/react/composites";

const ROUTES: {
  path: string;
  label: string;
  keywords?: string[];
  render: (props: { pathname: string }) => React.ReactNode;
}[] = [
  { path: "/",                         label: "Home",          render: () => <BN.LandingPage /> },
  { path: "/marketplace",              label: "Marketplace",   render: () => <BN.MarketplacePage /> },
  { path: "/inventory",                label: "Inventory",     render: () => <BN.InventoryPage /> },
  { path: "/onboarding/bob",           label: "Onboarding · Bob",   render: () => <BN.OnboardingBobPage /> },
  { path: "/onboarding/alice",         label: "Onboarding · Alice", render: () => <BN.OnboardingAlicePage /> },
  { path: "/settings",                 label: "Settings",      render: () => <BN.SettingsPage /> },
  { path: "/diagnostics/webmcp",       label: "Diagnostics",   render: () => <BN.DiagnosticsPage /> },
  { path: "/marketplace/reputation",   label: "Reputation",    render: () => <BN.ReputationPage /> },
  { path: "/marketplace/settlements",  label: "Settlements",   render: () => <BN.SettlementsPage /> },
  { path: "/marketplace/disputes",     label: "Disputes",      render: () => <BN.DisputesPage /> },
  { path: "/ops/control-plane",        label: "Control plane", render: () => <BN.ControlPlanePage /> },
  { path: "/ops/simulator",            label: "Simulator",     render: () => <BN.SimulatorPage /> },
  { path: "/agent-track",              label: "Agent track",   render: () => <BN.AgentTrackPage /> },
  { path: "/pulls/482",                label: "Pull request",  render: () => <BN.GithubDiffPage /> },
  { path: "*",                         label: "404",           render: ({ pathname }) => <BN.NotFoundPage pathname={pathname} /> },
];

const NAV_ITEMS: BN.NavItem[] = [
  { path: "/",                        label: "home" },
  { path: "/marketplace",             label: "market" },
  { path: "/inventory",               label: "inventory" },
  { path: "/onboarding/bob",          label: "onboarding · bob",   paletteOnly: true },
  { path: "/onboarding/alice",        label: "onboarding · alice", paletteOnly: true },
  { path: "/settings",                label: "settings",           paletteOnly: true },
  { path: "/diagnostics/webmcp",      label: "diagnostics",        paletteOnly: true },
  { path: "/marketplace/reputation",  label: "reputation",         paletteOnly: true },
  { path: "/marketplace/settlements", label: "settlements",        paletteOnly: true },
  { path: "/marketplace/disputes",    label: "disputes",           paletteOnly: true },
  { path: "/ops/control-plane",       label: "control plane",      paletteOnly: true },
  { path: "/ops/simulator",           label: "simulator",          paletteOnly: true },
  { path: "/agent-track",             label: "agent track" },
  { path: "/pulls/482",               label: "pull #482",
    keywords: ["diff", "pr", "pull", "github"] },
];

export function BountyNetShowcase() {
  const [pathname, setPathname] = useState("/");
  const route = useMemo(
    () => ROUTES.find((r) => r.path === pathname) ?? ROUTES[ROUTES.length - 1],
    [pathname],
  );

  return (
    <div className="bn-showcase">
      <div className="gallery-section-title">BountyNet — app shell + pages</div>
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, maxWidth: "70ch", lineHeight: 1.5 }}>
        The whole client reassembled from Retroma composites. Click any route
        below or use the header&rsquo;s command palette (⌘K) to jump around.
        All data is inline demo content.
      </p>
      <nav className="bn-showcase-nav">
        {ROUTES.filter((r) => r.path !== "*").map((r) => (
          <button
            key={r.path}
            type="button"
            data-active={r.path === pathname ? "true" : undefined}
            className="bn-showcase-nav-link"
            onClick={() => setPathname(r.path)}
          >
            {r.label}
          </button>
        ))}
        <button
          type="button"
          data-active={!ROUTES.some((r) => r.path === pathname) ? "true" : undefined}
          className="bn-showcase-nav-link"
          onClick={() => setPathname("/nope")}
        >
          404
        </button>
      </nav>
      <div className="bn-showcase-frame">
        <BN.AppShell
          brand="BountyNet"
          navItems={NAV_ITEMS}
          activePath={pathname}
          onNavigate={setPathname}
          statusRail={
            <StatusRail label="voice" showFab={false} />
          }
        >
          {route.render({ pathname })}
        </BN.AppShell>
      </div>
    </div>
  );
}
