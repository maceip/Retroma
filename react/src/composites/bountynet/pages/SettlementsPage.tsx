import { useState } from "react";
import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import { FormCard, Field, TextInput, PrimaryButton, GhostButton, TerminalReadout } from "../blocks";
import { PopoverCommandSelect } from "../../popover-command-select";
import { cn } from "../../../lib/utils";

interface Settlement {
  id: string;
  job_id: string;
  amount: string;
  status: "open" | "paid" | "refunded" | "frozen" | "disputed";
  operator?: string;
  agent?: string;
  notes?: string;
}

const SETTLEMENTS: Settlement[] = [
  { id: "s_471", job_id: "j_281", amount: "120", status: "open", operator: "cory", agent: "alice-03" },
  { id: "s_472", job_id: "j_284", amount: "95", status: "paid", operator: "juno", agent: "mallory-07" },
  { id: "s_473", job_id: "j_286", amount: "140", status: "disputed", operator: "cory", agent: "trent-01" },
  { id: "s_474", job_id: "j_288", amount: "60", status: "refunded", operator: "rin", agent: "nia-12" },
];

const DISPUTES = [
  { id: "d_21", settlement_id: "s_473", reason: "scope-mismatch", status: "open" },
  { id: "d_18", settlement_id: "s_451", reason: "ci-regression", status: "resolved" },
];

const RULING_OPTS = [
  { value: "pay",       label: "Pay agent",      description: "full amount" },
  { value: "split-50",  label: "Split 50/50",    description: "partial refund" },
  { value: "refund",    label: "Refund operator", description: "no pay" },
];

export function SettlementsPage() {
  const [output, setOutput] = useState('{ "ok": true }');
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="marketplace · settlements"
          headline="the money lives here"
          body="Settlements are pay + refund events tied to a job. Disputes freeze payouts until resolved."
        />
        <PageSection title="all settlements">
          <div className="bn-settlement-table">
            <div className="bn-settlement-head">
              <span>id</span>
              <span>job</span>
              <span>amount</span>
              <span>agent · operator</span>
              <span>status</span>
              <span>actions</span>
            </div>
            {SETTLEMENTS.map((s) => (
              <div key={s.id} className="bn-settlement-row">
                <code>{s.id}</code>
                <code>{s.job_id}</code>
                <span className="bn-settlement-amount">${s.amount}</span>
                <span>{s.agent} · {s.operator}</span>
                <span className={cn("bn-status-pill", `bn-status-pill--${s.status}`)}>{s.status}</span>
                <span className="bn-settlement-actions">
                  <GhostButton onClick={() => setOutput(`{ "ok": true, "settlement": "${s.id}", "action": "pay" }`)}>pay</GhostButton>
                  <GhostButton onClick={() => setOutput(`{ "ok": true, "settlement": "${s.id}", "action": "refund" }`)}>refund</GhostButton>
                </span>
              </div>
            ))}
          </div>
          <TerminalReadout title="last action" content={output} />
        </PageSection>
      </PageLayout>
    </>
  );
}

export function DisputesPage() {
  const [ruling, setRuling] = useState("pay");
  const [output, setOutput] = useState('{ "ok": true }');
  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="marketplace · disputes"
          headline="the adversarial layer"
          body="Scope a dispute to a job, pick a ruling, and the gateway re-settles."
        />
        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="open a dispute">
            <FormCard title="New dispute">
              <div className="bn-form-grid">
                <Field label="Settlement ID"><TextInput defaultValue="s_473" /></Field>
                <Field label="Reason code"><TextInput defaultValue="scope-mismatch" /></Field>
                <Field label="Reason" hint="human-readable"><TextInput defaultValue="Agent changed unrelated files." /></Field>
              </div>
              <PrimaryButton onClick={() => setOutput('{ "ok": true, "dispute_id": "d_22" }')}>
                submit
              </PrimaryButton>
            </FormCard>
          </PageSection>

          <PageSection title="resolve">
            <FormCard title="Resolve a dispute">
              <div className="bn-form-grid">
                <Field label="Dispute ID"><TextInput defaultValue="d_21" /></Field>
                <PopoverCommandSelect label="Ruling" options={RULING_OPTS} value={ruling} onChange={setRuling} />
              </div>
              <PrimaryButton onClick={() => setOutput(`{ "ok": true, "ruling": "${ruling}" }`)}>
                resolve
              </PrimaryButton>
            </FormCard>
          </PageSection>
        </div>

        <PageSection title="dispute list">
          <div className="bn-dispute-list">
            {DISPUTES.map((d) => (
              <div key={d.id} className="bn-dispute-row">
                <code>{d.id}</code>
                <span>settlement <code>{d.settlement_id}</code></span>
                <span>{d.reason}</span>
                <span className={cn("bn-status-pill", `bn-status-pill--${d.status === "resolved" ? "paid" : "disputed"}`)}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
          <TerminalReadout title="last action" content={output} />
        </PageSection>
      </PageLayout>
    </>
  );
}
