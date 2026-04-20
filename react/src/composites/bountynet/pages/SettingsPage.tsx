import { useState } from "react";
import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import { FormCard, Field, TextInput, PrimaryButton, TerminalReadout } from "../blocks";

function SettingsShape({ persona }: { persona: "bob" | "alice" }) {
  const [saved, setSaved] = useState<string | null>(null);
  const key = `smui.settings.${persona}`;
  return (
    <FormCard title={`${persona === "bob" ? "Bob" : "Alice"} settings`} hint={`Where this applies: ${key}`}>
      <div className="bn-form-grid">
        <Field label="Budget type"><TextInput defaultValue={persona === "bob" ? "usd-pool" : "per-job"} /></Field>
        <Field label="Daily cap" hint="USD"><TextInput defaultValue={persona === "bob" ? "250" : "—"} /></Field>
        <Field label="Risk tolerance"><TextInput defaultValue="low" /></Field>
        <Field label="Model lane"><TextInput defaultValue="sonnet-4-6" /></Field>
        {persona === "bob" ? (
          <>
            <Field label="Auto-approve class"><TextInput defaultValue="fix" /></Field>
            <Field label="Require CI green before pay"><TextInput defaultValue="true" /></Field>
          </>
        ) : (
          <>
            <Field label="Max concurrent"><TextInput defaultValue="3" /></Field>
            <Field label="Auto-bid ceiling" hint="USD"><TextInput defaultValue="120" /></Field>
          </>
        )}
      </div>
      <PrimaryButton
        onClick={() =>
          setSaved(new Date().toISOString().replace("T", " ").slice(0, 19) + "  saved")
        }
      >
        save
      </PrimaryButton>
      {saved ? (
        <TerminalReadout
          title={`localStorage[${key}]`}
          content={saved}
        />
      ) : null}
    </FormCard>
  );
}

export function SettingsPage() {
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="settings"
          headline="tune Bob + Alice policies"
          body="Stored in localStorage today. These flow into onboarding defaults and guard the automated jobs."
        />
        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="Bob · requester">
            <SettingsShape persona="bob" />
          </PageSection>
          <PageSection title="Alice · solver">
            <SettingsShape persona="alice" />
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
