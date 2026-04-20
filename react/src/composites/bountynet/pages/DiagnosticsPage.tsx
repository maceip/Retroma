import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import { FormCard, GhostButton, PrimaryButton, TerminalReadout } from "../blocks";

const RUNTIME = {
  ok: true,
  agent: "smui-web@0.9.1",
  ua: "Mozilla/5.0 (Macintosh; …) Firefox/126",
  navigatorModelContext: true,
  tools: ["bn.invokeJourney", "bn.insertTranscript", "bn.listRepos"],
};

const JOURNEYS = {
  personas: ["bob", "alice", "ops"],
  versions: { bob: "2025.11.14", alice: "2025.11.14", ops: "2025.11.02" },
};

export function DiagnosticsPage() {
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="diagnostics · WebMCP"
          headline="inspect the in-browser agent runtime"
          body="WebMCP exposes tools + journeys to agents running in the page. This screen shows everything they can see."
        />
        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="runtime">
            <TerminalReadout title="window.__bnWebmcpDiagnostics" content={JSON.stringify(RUNTIME, null, 2)} />
          </PageSection>
          <PageSection title="journeys">
            <TerminalReadout title="GET /api/bountynet/webmcp/journeys" content={JSON.stringify(JOURNEYS, null, 2)} />
          </PageSection>
          <PageSection title="last invoke">
            <TerminalReadout
              title="tool bn.listRepos"
              lines={[
                { kind: "cmd", text: "> bn.listRepos({ limit: 5 })" },
                { kind: "ok",  text: "✓ ok · 5ms" },
                { kind: "out", text: '[{"repo":"acme/sdk"},{"repo":"widgets/core"},{"repo":"retroma/theme"}]' },
              ]}
            />
          </PageSection>
          <PageSection title="quick actions">
            <FormCard title="Probe the runtime">
              <div className="bn-form-actions">
                <PrimaryButton>invoke sample tool</PrimaryButton>
                <GhostButton>diff journeys vs last fetch</GhostButton>
                <GhostButton>export diagnostics JSON</GhostButton>
              </div>
            </FormCard>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
