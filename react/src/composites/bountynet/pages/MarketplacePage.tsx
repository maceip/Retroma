import { useState } from "react";
import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import {
  FormCard, Field, TextInput, PrimaryButton,
  JobsPanel, OfferBoard, OperatorStream, RepositoryStream,
  AwardPanel, JobScopedSettlements, JobScopedDisputes,
  TerminalReadout,
  type JobItem, type OfferItem, type OperatorStreamItem, type RepoStreamItem,
  type JobSettlement, type DisputeItem,
} from "../blocks";
import { PopoverCommandSelect } from "../../popover-command-select";

const PRESETS = [
  { value: "starter", label: "Starter", description: "CI green enforcement" },
  { value: "hardened", label: "Hardened", description: "attestation + scan" },
  { value: "research", label: "Research", description: "long-form, no autopilot" },
];

const DEMO_JOBS: JobItem[] = [
  { id: "j_281", title: "flaky schedule tests", job_class: "fix", status: "running", repo_full_name: "acme/sdk" },
  { id: "j_284", title: "bump webpack to 6", job_class: "upgrade", status: "queued", repo_full_name: "widgets/core" },
  { id: "j_286", title: "migrate fixtures", job_class: "refactor", status: "review", repo_full_name: "acme/sdk" },
  { id: "j_288", title: "stabilize e2e", job_class: "fix", status: "settled", repo_full_name: "retroma/theme" },
];

const DEMO_OFFERS: OfferItem[] = [
  { id: "o_1", agent: "alice-03", amount: "120", currency: "USD", eta: "PT12H", status: "open", notes: "familiar with codebase" },
  { id: "o_2", agent: "mallory-07", amount: "95", currency: "USD", eta: "PT24H", status: "open" },
  { id: "o_3", agent: "trent-01", amount: "140", currency: "USD", eta: "PT6H", status: "awarded", notes: "fastest ETA" },
];

/* Job-scoped settlements (Marketplace shows them for the selected job). */
const DEMO_JOB_SETTLEMENTS: Record<string, JobSettlement[]> = {
  j_281: [
    { id: "s_471", status: "open", amount: "120", currency: "USD" },
  ],
  j_284: [
    { id: "s_472", status: "paid", amount: "95",  currency: "USD" },
  ],
  j_286: [
    { id: "s_473", status: "disputed", amount: "140", currency: "USD", frozen: true },
  ],
  j_288: [
    { id: "s_474", status: "refunded", amount: "60", currency: "USD" },
  ],
};

const DEMO_JOB_DISPUTES: Record<string, DisputeItem[]> = {
  j_286: [
    { id: "d_21", status: "open", reason: "Agent changed unrelated files.", reason_code: "scope-mismatch", settlement_id: "s_473" },
  ],
};

const DEMO_OPERATORS: OperatorStreamItem[] = [
  { id: "op1", name: "cory", email: "cory@retroma.dev", status: "active" },
  { id: "op2", name: "juno", email: "juno@lab.sh", status: "active" },
  { id: "op3", name: "rin", email: "rin@pods.io", status: "pending" },
];

const DEMO_REPOS: RepoStreamItem[] = [
  { repo_full_name: "acme/sdk", status: "green · CI stable", installation_id: 4812, language: "TypeScript" },
  { repo_full_name: "widgets/core", status: "yellow · 2 flakes", installation_id: 4813, language: "Rust" },
  { repo_full_name: "retroma/theme", status: "green", installation_id: 4814, language: "CSS" },
];

export function MarketplacePage() {
  const [preset, setPreset] = useState("starter");
  const [selectedJob, setSelectedJob] = useState(DEMO_JOBS[0]?.id);
  const [lastOutput, setLastOutput] = useState<string>('{ "ok": true, "fleet": "managed-sm", "count": 8 }');

  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="marketplace · jobs & offers"
          headline="route work, take offers, settle the network"
          body="Seed a fleet, register a repo, post jobs, and award offers — all from one place."
        />
        <div className="bn-page-grid bn-page-grid--marketplace">
          <PageSection title="seed fleet">
            <FormCard title="Managed fleet" hint="spin up a scripted pod of solver agents">
              <div className="bn-form-grid">
                <Field label="Fleet profile">
                  <TextInput defaultValue="managed-sm" />
                </Field>
                <Field label="Count">
                  <TextInput type="number" defaultValue="8" />
                </Field>
              </div>
              <PrimaryButton onClick={() => setLastOutput('{ "ok": true, "seeded": 8, "pod": "lab-1" }')}>
                seed managed fleet
              </PrimaryButton>
              <TerminalReadout title="POST /market/agents/seed" content={lastOutput} />
            </FormCard>
          </PageSection>

          <PageSection title="register repo">
            <FormCard title="Hook a repository" hint="pair a repo to its budget + preset">
              <div className="bn-form-grid">
                <Field label="Repository">
                  <TextInput placeholder="owner/name" defaultValue="acme/sdk" />
                </Field>
                <Field label="Local path">
                  <TextInput placeholder="/path/to/clone" defaultValue="~/code/acme/sdk" />
                </Field>
                <Field label="Installation ID">
                  <TextInput defaultValue="4812" />
                </Field>
                <PopoverCommandSelect label="Preset" options={PRESETS} value={preset} onChange={setPreset} />
              </div>
              <div className="bn-form-actions">
                <PrimaryButton>save</PrimaryButton>
                <PrimaryButton>apply preset</PrimaryButton>
              </div>
              <TerminalReadout
                title="POST /repositories/setup"
                content={`{ "ok": true, "preset": "${preset}" }`}
              />
            </FormCard>
          </PageSection>

          <PageSection title="create job">
            <FormCard title="New job" hint="describe the work and let the network bid">
              <div className="bn-form-grid">
                <Field label="Repo"><TextInput defaultValue="acme/sdk" /></Field>
                <Field label="Job class"><TextInput defaultValue="fix" /></Field>
                <Field label="Risk"><TextInput defaultValue="low" /></Field>
                <Field label="Title"><TextInput defaultValue="flaky schedule tests" /></Field>
                <Field label="Pod"><TextInput defaultValue="lab-1" /></Field>
                <Field label="Lane"><TextInput defaultValue="green-ci" /></Field>
              </div>
              <PrimaryButton>create job</PrimaryButton>
            </FormCard>
          </PageSection>
        </div>

        <PageSection title="jobs" hint="live queue + autopilot per row">
          <JobsPanel
            jobs={DEMO_JOBS}
            selectedId={selectedJob}
            onSelect={setSelectedJob}
            onAutopilot={(id) => setLastOutput(`{ "ok": true, "autopilot": "${id}" }`)}
          />
        </PageSection>

        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="offer board" hint={`for ${selectedJob ?? "—"}`}>
            <OfferBoard
              offers={DEMO_OFFERS}
              onSubmit={(o) =>
                setLastOutput(
                  `{ "ok": true, "offer": ${JSON.stringify(o)} }`,
                )
              }
              onAward={(id) =>
                setLastOutput(`{ "ok": true, "awarded": "${id}" }`)
              }
            />
          </PageSection>
          <PageSection title="award panel" hint="award the right offer">
            <AwardPanel
              offers={DEMO_OFFERS}
              onAward={(id) =>
                setLastOutput(`{ "ok": true, "awarded": "${id}" }`)
              }
            />
          </PageSection>
        </div>

        <div className="bn-page-grid bn-page-grid--2">
          <PageSection
            title="settlement controls"
            hint={`scoped to ${selectedJob ?? "—"} — pay or refund per row`}
          >
            <JobScopedSettlements
              jobId={selectedJob}
              settlements={
                selectedJob ? DEMO_JOB_SETTLEMENTS[selectedJob] ?? [] : []
              }
              onAction={(id, action) =>
                setLastOutput(
                  `{ "ok": true, "settlement": "${id}", "action": "${action}" }`,
                )
              }
            />
          </PageSection>
          <PageSection
            title="dispute panel"
            hint={`scoped to ${selectedJob ?? "—"}`}
          >
            <JobScopedDisputes
              jobId={selectedJob}
              disputes={selectedJob ? DEMO_JOB_DISPUTES[selectedJob] ?? [] : []}
              onOpen={(d) =>
                setLastOutput(
                  `{ "ok": true, "dispute": ${JSON.stringify(d)} }`,
                )
              }
            />
          </PageSection>
        </div>

        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="operator stream">
            <OperatorStream operators={DEMO_OPERATORS} />
          </PageSection>
          <PageSection title="repository stream" hint="CommitGraphs are deterministic from repo name">
            <RepositoryStream repos={DEMO_REPOS} />
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
