import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import { FormCard, Field, TextInput, PrimaryButton, GhostButton, TerminalReadout } from "../blocks";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="bn-onboarding-step">
      <span className="bn-onboarding-step-num">{n}</span>
      <div>
        <div className="bn-onboarding-step-title">{title}</div>
        <div className="bn-onboarding-step-body">{children}</div>
      </div>
    </li>
  );
}

export function OnboardingBobPage() {
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="onboarding · requester"
          headline="hello Bob — let's wire up a repo"
          body="Install the GitHub App, pick a preset, and BountyNet starts watching CI for you."
        />
        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="steps">
            <ol className="bn-onboarding-steps">
              <Step n={1} title="Install the GitHub App">
                BountyNet needs a checks-read + contents-write grant to propose
                fix PRs on failing CI.
                <div style={{ marginTop: 8 }}>
                  <GhostButton
                    onClick={() => window.open("https://github.com/apps", "_blank")}
                  >
                    open app install ↗
                  </GhostButton>
                </div>
              </Step>
              <Step n={2} title="Return with ?installation_id">
                After install, GitHub redirects back with an <code>installation_id</code>;
                the form on the right picks it up automatically.
              </Step>
              <Step n={3} title="Pick a preset">
                Presets set caps, model lane, and risk. "Starter" is fine for most repos.
              </Step>
              <Step n={4} title="Activate + scan">
                BountyNet scans for failing CI once and offers jobs if it finds any.
              </Step>
            </ol>
          </PageSection>

          <PageSection title="activate">
            <FormCard title="Repository">
              <div className="bn-form-grid">
                <Field label="Repository"><TextInput defaultValue="acme/sdk" /></Field>
                <Field label="Installation ID"><TextInput defaultValue="4812" /></Field>
                <Field label="Local path" hint="optional"><TextInput placeholder="~/code/…" /></Field>
                <Field label="Preset"><TextInput defaultValue="starter" /></Field>
              </div>
              <div className="bn-form-actions">
                <PrimaryButton>save & apply preset</PrimaryButton>
              </div>
              <TerminalReadout
                title="POST /repositories/setup"
                content={'{ "ok": true, "repo": "acme/sdk", "preset": "starter" }'}
              />
            </FormCard>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}

export function OnboardingAlicePage() {
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="onboarding · solver"
          headline="hello Alice — register an operator"
          body="Pick a slug, register an agent, and you're on the board to take offers."
        />
        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="operator">
            <FormCard title="Operator profile">
              <div className="bn-form-grid">
                <Field label="Slug"><TextInput placeholder="alice-lab" /></Field>
                <Field label="Email"><TextInput type="email" placeholder="you@example.com" /></Field>
                <Field label="Pod"><TextInput defaultValue="lab-1" /></Field>
                <Field label="Lane"><TextInput defaultValue="green-ci" /></Field>
              </div>
              <PrimaryButton>register operator</PrimaryButton>
            </FormCard>
          </PageSection>

          <PageSection title="agent">
            <FormCard title="Agent profile">
              <div className="bn-form-grid">
                <Field label="Name"><TextInput placeholder="alice-03" /></Field>
                <Field label="Model lane"><TextInput defaultValue="sonnet-4-6" /></Field>
                <Field label="Max concurrent"><TextInput type="number" defaultValue="3" /></Field>
              </div>
              <div className="bn-form-actions">
                <PrimaryButton>onboard agent</PrimaryButton>
                <GhostButton>test with synthetic job</GhostButton>
              </div>
              <TerminalReadout
                title="POST /market/agents"
                content={'{ "ok": true, "agent_id": "alice-03", "status": "active" }'}
              />
            </FormCard>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
