import { useState } from "react";
import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import {
  FormCard, Field, TextInput, PrimaryButton, GhostButton,
  TerminalReadout, CurlHint,
} from "../blocks";
import { Pane, PaneGroup } from "../../pane-group";
import { cn } from "../../../lib/utils";

const TOPOLOGY = {
  regions: ["us-east-1", "eu-west-1"],
  pods: [
    { id: "lab-1", region: "us-east-1", agents: 12 },
    { id: "lab-2", region: "us-east-1", agents: 8 },
    { id: "eu-core", region: "eu-west-1", agents: 5 },
  ],
};

const DRIFT = { clean: true, last_checked: "2025-11-14T13:02:00Z", resources_drifted: 0 };
const RUNBOOK = { version: "v23", flows: ["seed-fleet", "drift-fix", "freeze-settlement"] };

const INCIDENTS = [
  { action_type: "drift-correction", target: "pod:lab-1/cleanup-volumes", status: "resolved" },
  { action_type: "settlement-freeze", target: "settlement:s_473", status: "open" },
  { action_type: "gateway-restart", target: "region:us-east-1", status: "resolved" },
];

export function ControlPlanePage() {
  const [driftOut, setDriftOut] = useState(JSON.stringify(DRIFT, null, 2));
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="ops · control plane"
          headline="the levers"
          body="Topology, drift, and runbook — side by side. Drift-fix is one click away."
        />
        <PageSection title="topology · drift · runbook" hint="resize to taste — widths persist">
          <div style={{ height: 320 }}>
            <PaneGroup persistKey="bn-control-plane" defaultSizes={[35, 35, 30]}>
              <Pane>
                <strong>topology</strong>
                <TerminalReadout title="GET /ops/topology" content={JSON.stringify(TOPOLOGY, null, 2)} />
              </Pane>
              <Pane>
                <strong>drift</strong>
                <TerminalReadout title="GET /ops/drift" content={driftOut} />
                <div style={{ marginTop: 8 }}>
                  <PrimaryButton
                    onClick={() =>
                      setDriftOut(
                        JSON.stringify(
                          { ok: true, corrected: 3, last_run: new Date().toISOString() },
                          null,
                          2,
                        ),
                      )
                    }
                  >
                    run drift fix
                  </PrimaryButton>
                </div>
              </Pane>
              <Pane>
                <strong>runbook</strong>
                <TerminalReadout title="GET /ops/runbook" content={JSON.stringify(RUNBOOK, null, 2)} />
              </Pane>
            </PaneGroup>
          </div>
        </PageSection>

        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="market incidents">
            <div className="bn-incident-list">
              {INCIDENTS.map((i, idx) => (
                <div key={idx} className="bn-incident-row">
                  <span className="bn-incident-type">{i.action_type}</span>
                  <code className="bn-incident-target">{i.target}</code>
                  <span
                    className={cn(
                      "bn-status-pill",
                      `bn-status-pill--${i.status === "resolved" ? "paid" : "disputed"}`,
                    )}
                  >
                    {i.status}
                  </span>
                </div>
              ))}
            </div>
          </PageSection>

          <PageSection title="settlement freeze">
            <FormCard title="Freeze / unfreeze a settlement">
              <div className="bn-form-grid">
                <Field label="Settlement ID"><TextInput defaultValue="s_473" /></Field>
              </div>
              <div className="bn-form-actions">
                <PrimaryButton>freeze</PrimaryButton>
                <GhostButton>unfreeze</GhostButton>
              </div>
              <CurlHint command='curl -X POST $GATEWAY/ops/settlements/s_473/freeze -H "authorization: bearer $BN_TOKEN"' />
              <TerminalReadout title="POST /ops/settlements/:id/freeze" content='{ "ok": true, "frozen": true }' />
            </FormCard>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}

const JOURNEYS = {
  personas: {
    bob: ["install-app", "register-repo", "seed-budget"],
    alice: ["register-operator", "register-agent", "first-offer"],
    ops:  ["drift-check", "incident-review"],
  },
};

export function SimulatorPage() {
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="ops · simulator"
          headline="walk a journey before your user does"
          body="Journeys are scripted persona walk-throughs. Copy the command and run against your dev stack."
        />
        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="journey manifest">
            <TerminalReadout
              title="GET /api/bountynet/webmcp/journeys"
              content={JSON.stringify(JOURNEYS, null, 2)}
            />
          </PageSection>
          <PageSection title="run a journey">
            <FormCard title="Copy & paste">
              <CurlHint command="npm run journey -- --persona bob" />
              <CurlHint command="npm run journey -- --persona alice" />
              <CurlHint command="npm run journey -- --persona ops" />
              <TerminalReadout
                title="last error"
                lines={[
                  { kind: "err",  text: "E_GATEWAY_TIMEOUT · POST /market/agents/seed" },
                  { kind: "out",  text: "hint: ensure BOUNTYNET_GATEWAY_URL points at the dev stack" },
                ]}
              />
            </FormCard>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
