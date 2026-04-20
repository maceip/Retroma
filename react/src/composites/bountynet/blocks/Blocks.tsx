import {
  forwardRef,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/utils";
import { InfiniteSlider } from "../../infinite-slider";
import { TerminalFrame, TerminalLine } from "../../terminal-frame";
import { CodeLine } from "../../code-line";
import { Sparkline } from "../../sparkline";
import { Gauge } from "../../gauge";
import { AnimatedNumber } from "../../animated-number";
import { CommitGraph, generateDemoCommits } from "../../commit-graph";
import { RepoCard } from "../../repo-card";
import { PopoverCommandSelect, type PopoverCommandOption } from "../../popover-command-select";
import { useBountyNetShell } from "../shell";

/* ========================================================================
 *  LiveActivityFeed — used on Landing
 * ====================================================================== */

export interface MarketActivityItem {
  id: string;
  title: string;
  detail: string;
}

export interface LiveActivityFeedProps extends HTMLAttributes<HTMLDivElement> {
  activities?: readonly MarketActivityItem[];
  /** Loaded but empty? show this. */
  emptyState?: ReactNode;
  /** Mark the feed as live (adds a pulse dot). */
  live?: boolean;
}

export const LiveActivityFeed = forwardRef<HTMLDivElement, LiveActivityFeedProps>(
  function LiveActivityFeed(
    { activities = [], emptyState = "No activity yet.", live, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="bn-live-feed"
        className={cn("bn-live-feed", className)}
        {...rest}
      >
        <div className="bn-live-feed-head">
          <span className="bn-live-feed-title">live marketplace activity</span>
          {live ? <span className="bn-live-feed-dot" aria-label="Live" /> : null}
        </div>
        {activities.length === 0 ? (
          <div className="bn-live-feed-empty">{emptyState}</div>
        ) : (
          <InfiniteSlider duration={28}>
            {activities.map((a) => (
              <div key={a.id} className="bn-live-feed-chip">
                <span className="bn-live-feed-chip-title">{a.title}</span>
                <span className="bn-live-feed-chip-detail">{a.detail}</span>
              </div>
            ))}
          </InfiniteSlider>
        )}
      </div>
    );
  },
);

/* ========================================================================
 *  PersonaCardGrid — Bob / Alice / Inventory / Infrastructure
 * ====================================================================== */

export interface PersonaCard {
  /** Unique id for keys. */
  id: string;
  /** Mood color (folder-color-N or any CSS color). */
  accent?: string;
  /** Card title (e.g. "for Bob"). */
  title: ReactNode;
  /** Subtitle / 1-line context. */
  subtitle?: ReactNode;
  /** Bullet list. */
  bullets: ReactNode[];
  /** Inline links rendered at the bottom. */
  links?: { label: string; path: string }[];
}

export interface PersonaCardGridProps extends HTMLAttributes<HTMLDivElement> {
  cards: readonly PersonaCard[];
}

export const PersonaCardGrid = forwardRef<HTMLDivElement, PersonaCardGridProps>(
  function PersonaCardGrid({ cards, className, ...rest }, ref) {
    const shell = useBountyNetShell();
    return (
      <div
        ref={ref}
        data-slot="bn-persona-grid"
        className={cn("bn-persona-grid", className)}
        {...rest}
      >
        {cards.map((c) => (
          <article
            key={c.id}
            className="bn-persona-card"
            style={{
              ["--bn-accent" as string]: c.accent ?? "var(--base-accent, var(--interactive-accent))",
            }}
          >
            <header className="bn-persona-card-head">
              <span className="bn-persona-card-tag" />
              <div>
                <div className="bn-persona-card-title">{c.title}</div>
                {c.subtitle ? <div className="bn-persona-card-sub">{c.subtitle}</div> : null}
              </div>
            </header>
            <ul className="bn-persona-card-list">
              {c.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            {c.links?.length ? (
              <footer className="bn-persona-card-links">
                {c.links.map((l) => (
                  <button
                    key={l.path}
                    type="button"
                    className="bn-persona-card-link"
                    onClick={() => shell.navigate(l.path)}
                  >
                    {l.label} →
                  </button>
                ))}
              </footer>
            ) : null}
          </article>
        ))}
      </div>
    );
  },
);

/* ========================================================================
 *  FormCard — generic surface for the marketplace forms
 * ====================================================================== */

export interface FormCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  hint?: ReactNode;
  /** Right-aligned controls in the title bar. */
  controls?: ReactNode;
}

export const FormCard = forwardRef<HTMLDivElement, FormCardProps>(
  function FormCard({ title, hint, controls, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bn-form-card"
        className={cn("bn-form-card", className)}
        {...rest}
      >
        <header className="bn-form-card-head">
          <div>
            <div className="bn-form-card-title">{title}</div>
            {hint ? <div className="bn-form-card-hint">{hint}</div> : null}
          </div>
          {controls ? <div className="bn-form-card-controls">{controls}</div> : null}
        </header>
        <div className="bn-form-card-body">{children}</div>
      </div>
    );
  },
);

/* Lightweight labeled field used inside FormCard. */
export function Field({
  label,
  hint,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bn-field">
      <span className="bn-field-label">{label}</span>
      {children}
      {hint ? <span className="bn-field-hint">{hint}</span> : null}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn("bn-text-input", props.className)}
    />
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button type="button" {...props} className={cn("bn-btn", props.className)} />
  );
}

export function GhostButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      type="button"
      {...props}
      className={cn("bn-btn bn-btn--ghost", props.className)}
    />
  );
}

/* ========================================================================
 *  Reputation table — animated number + sparkline rows
 * ====================================================================== */

export interface ReputationRow {
  id: string;
  /** Human label (agent name / operator slug). */
  name: string;
  /** Pod / lane / org context. */
  context?: string;
  /** Big number on the right. */
  score: number;
  /** Series powering the sparkline. */
  series: number[];
  /** Optional secondary stats (wins, refunds, …). */
  stats?: { label: string; value: number | string }[];
}

export interface ReputationTableProps extends HTMLAttributes<HTMLDivElement> {
  rows: readonly ReputationRow[];
  emptyState?: ReactNode;
}

export const ReputationTable = forwardRef<HTMLDivElement, ReputationTableProps>(
  function ReputationTable(
    { rows, emptyState = "No reputation entries yet.", className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="bn-rep-table"
        className={cn("bn-rep-table", className)}
        {...rest}
      >
        {rows.length === 0 ? (
          <div className="bn-rep-table-empty">{emptyState}</div>
        ) : (
          rows.map((r) => (
            <article key={r.id} className="bn-rep-row">
              <div className="bn-rep-row-info">
                <div className="bn-rep-row-name">{r.name}</div>
                {r.context ? <div className="bn-rep-row-context">{r.context}</div> : null}
                {r.stats?.length ? (
                  <div className="bn-rep-row-stats">
                    {r.stats.map((s) => (
                      <span key={s.label} className="bn-rep-row-stat">
                        <span className="bn-rep-row-stat-label">{s.label}</span>
                        <span className="bn-rep-row-stat-value">{s.value}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="bn-rep-row-spark" style={{ color: "var(--base-accent)" }}>
                <Sparkline values={r.series} />
              </div>
              <div className="bn-rep-row-score">
                <AnimatedNumber value={r.score} />
              </div>
            </article>
          ))
        )}
      </div>
    );
  },
);

/* ========================================================================
 *  WorkSummaryCard — Gauge + list (Inventory page reuses for Bob & Alice)
 * ====================================================================== */

export interface WorkSummaryItem {
  id: string;
  title: ReactNode;
  context?: ReactNode;
  status?: "ok" | "warn" | "err" | "info";
}

export interface WorkSummaryCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  /** Description below the title. */
  hint?: ReactNode;
  /** Gauge config. */
  metric: { label: ReactNode; value: number; max: number; suffix?: ReactNode };
  /** Rows below the gauge. */
  items: readonly WorkSummaryItem[];
}

export const WorkSummaryCard = forwardRef<HTMLDivElement, WorkSummaryCardProps>(
  function WorkSummaryCard({ title, hint, metric, items, className, ...rest }, ref) {
    return (
      <article
        ref={ref}
        data-slot="bn-work-summary"
        className={cn("bn-work-summary", className)}
        {...rest}
      >
        <header className="bn-work-summary-head">
          <div className="bn-work-summary-title">{title}</div>
          {hint ? <div className="bn-work-summary-hint">{hint}</div> : null}
        </header>
        <Gauge
          value={metric.value}
          max={metric.max}
          label={metric.label}
          size={72}
          suffix={metric.suffix}
        />
        <ul className="bn-work-summary-list">
          {items.length === 0 ? (
            <li className="bn-work-summary-empty">Nothing here yet.</li>
          ) : (
            items.map((it) => (
              <li key={it.id} className="bn-work-summary-item">
                <span
                  className={cn(
                    "bn-work-summary-dot",
                    it.status && `bn-work-summary-dot--${it.status}`,
                  )}
                  aria-hidden="true"
                />
                <div className="bn-work-summary-item-body">
                  <div className="bn-work-summary-item-title">{it.title}</div>
                  {it.context ? (
                    <div className="bn-work-summary-item-context">{it.context}</div>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      </article>
    );
  },
);

/* ========================================================================
 *  RepositoryStream — one card per repo with a CommitGraph
 * ====================================================================== */

export interface RepoStreamItem {
  repo_full_name: string;
  status?: string;
  installation_id?: number | string;
  /** Optional language label. */
  language?: string;
}

export interface RepositoryStreamProps extends HTMLAttributes<HTMLDivElement> {
  repos: readonly RepoStreamItem[];
}

export const RepositoryStream = forwardRef<HTMLDivElement, RepositoryStreamProps>(
  function RepositoryStream({ repos, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bn-repo-stream"
        className={cn("bn-repo-stream", className)}
        {...rest}
      >
        {repos.map((r) => (
          <div key={r.repo_full_name} className="bn-repo-stream-item">
            <RepoCard
              owner={r.repo_full_name.split("/")[0]}
              name={r.repo_full_name.split("/")[1] ?? r.repo_full_name}
              description={r.status ?? "unknown"}
              language={r.language}
              visibility="public"
            />
            <div className="bn-repo-stream-graph">
              <CommitGraph
                days={generateDemoCommits(
                  20,
                  r.repo_full_name.length + (Number(r.installation_id) || 0),
                )}
                showMonths={false}
                showWeekdays={false}
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
);

/* ========================================================================
 *  OperatorStream — table of operators
 * ====================================================================== */

export interface OperatorStreamItem {
  id: string;
  name: string;
  email?: string;
  status?: "active" | "pending" | "suspended";
}

export interface OperatorStreamProps extends HTMLAttributes<HTMLDivElement> {
  operators: readonly OperatorStreamItem[];
}

export const OperatorStream = forwardRef<HTMLDivElement, OperatorStreamProps>(
  function OperatorStream({ operators, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bn-operator-stream"
        className={cn("bn-operator-stream", className)}
        {...rest}
      >
        <div className="bn-operator-stream-head">
          <span>operator</span>
          <span>email</span>
          <span>status</span>
        </div>
        {operators.map((op) => (
          <div key={op.id} className="bn-operator-stream-row">
            <span className="bn-operator-stream-name">{op.name}</span>
            <span className="bn-operator-stream-email">{op.email ?? "—"}</span>
            <span className={cn("bn-status-pill", `bn-status-pill--${op.status ?? "info"}`)}>
              {op.status ?? "unknown"}
            </span>
          </div>
        ))}
      </div>
    );
  },
);

/* ========================================================================
 *  JobsPanel — selector + list + Autopilot
 * ====================================================================== */

export interface JobItem {
  id: string;
  title: string;
  job_class: string;
  status: "queued" | "running" | "review" | "settled" | "disputed";
  repo_full_name: string;
}

export interface JobsPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  jobs: readonly JobItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onAutopilot?: (id: string) => void;
}

export const JobsPanel = forwardRef<HTMLDivElement, JobsPanelProps>(
  function JobsPanel(
    { jobs, selectedId, onSelect, onAutopilot, className, ...rest },
    ref,
  ) {
    const options: PopoverCommandOption[] = jobs.map((j) => ({
      value: j.id,
      label: j.title,
      description: `${j.job_class} · ${j.status}`,
    }));
    return (
      <div
        ref={ref}
        data-slot="bn-jobs-panel"
        className={cn("bn-jobs-panel", className)}
        {...rest}
      >
        <PopoverCommandSelect
          label="Active job"
          options={options}
          value={selectedId}
          onChange={onSelect}
          placeholder="select a job"
        />
        <div className="bn-jobs-list">
          {jobs.map((j) => (
            <div key={j.id} className="bn-jobs-row">
              <div className="bn-jobs-row-info">
                <div className="bn-jobs-row-title">{j.title}</div>
                <div className="bn-jobs-row-meta">
                  <span>{j.job_class}</span>
                  <span>·</span>
                  <span>{j.repo_full_name}</span>
                </div>
              </div>
              <span className={cn("bn-status-pill", `bn-status-pill--${j.status}`)}>
                {j.status}
              </span>
              <button
                type="button"
                className="bn-btn bn-btn--ghost bn-btn--xs"
                onClick={() => onAutopilot?.(j.id)}
              >
                autopilot
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

/* ========================================================================
 *  OfferBoard — offer form + offer list + award
 * ====================================================================== */

export interface OfferItem {
  id: string;
  agent: string;
  amount: string;
  eta: string;
  notes?: string;
  status?: "open" | "awarded" | "withdrawn";
}

export interface OfferBoardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  offers: readonly OfferItem[];
  /** Fires when the user submits a new offer. */
  onSubmit?: (data: Omit<OfferItem, "id">) => void;
  /** Fires when an award is confirmed. */
  onAward?: (offerId: string) => void;
}

export const OfferBoard = forwardRef<HTMLDivElement, OfferBoardProps>(
  function OfferBoard({ offers, onSubmit, onAward, className, ...rest }, ref) {
    const [agent, setAgent] = useState("");
    const [amount, setAmount] = useState("0");
    const [eta, setEta] = useState("PT24H");
    const [notes, setNotes] = useState("");
    const [award, setAward] = useState<string | undefined>(offers[0]?.id);

    const submit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit?.({ agent, amount, eta, notes });
    };

    return (
      <div
        ref={ref}
        data-slot="bn-offer-board"
        className={cn("bn-offer-board", className)}
        {...rest}
      >
        <form className="bn-offer-form" onSubmit={submit}>
          <Field label="Agent">
            <TextInput value={agent} onChange={(e) => setAgent(e.target.value)} placeholder="agent slug" />
          </Field>
          <Field label="Amount" hint="USD">
            <TextInput value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="ETA" hint="ISO 8601 duration">
            <TextInput value={eta} onChange={(e) => setEta(e.target.value)} />
          </Field>
          <Field label="Notes">
            <TextInput value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="optional" />
          </Field>
          <PrimaryButton type="submit">submit offer</PrimaryButton>
        </form>

        <div className="bn-offer-list">
          {offers.length === 0 ? (
            <div className="bn-offer-empty">No offers yet.</div>
          ) : (
            offers.map((o) => (
              <div key={o.id} className="bn-offer-row">
                <div className="bn-offer-row-info">
                  <span className="bn-offer-row-agent">{o.agent}</span>
                  <span className="bn-offer-row-amount">${o.amount}</span>
                  <span className="bn-offer-row-eta">{o.eta}</span>
                </div>
                <span
                  className={cn("bn-status-pill", `bn-status-pill--${o.status ?? "open"}`)}
                >
                  {o.status ?? "open"}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bn-offer-award">
          <PopoverCommandSelect
            label="Award to"
            options={offers.map((o) => ({
              value: o.id,
              label: o.agent,
              description: `$${o.amount} · ${o.eta}`,
            }))}
            value={award}
            onChange={setAward}
          />
          <PrimaryButton onClick={() => award && onAward?.(award)}>award</PrimaryButton>
        </div>
      </div>
    );
  },
);

/* ========================================================================
 *  TerminalReadout — used everywhere a JSON / log output is needed.
 * ====================================================================== */

export interface TerminalReadoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  /** Raw lines (string or pre-rendered nodes). */
  lines?: readonly { kind?: "cmd" | "out" | "ok" | "warn" | "err"; text: ReactNode }[];
  /** Or a single content blob (renders inside one TerminalLine). */
  content?: string;
}

export const TerminalReadout = forwardRef<HTMLDivElement, TerminalReadoutProps>(
  function TerminalReadout({ title, lines, content, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bn-terminal-readout"
        className={cn("bn-terminal-readout", className)}
        {...rest}
      >
        <TerminalFrame title={title ?? "output"}>
          {content !== undefined ? (
            <TerminalLine kind="out">{content}</TerminalLine>
          ) : (
            (lines ?? []).map((l, i) => (
              <TerminalLine key={i} kind={l.kind ?? "out"}>
                {l.text}
              </TerminalLine>
            ))
          )}
        </TerminalFrame>
      </div>
    );
  },
);

/* ========================================================================
 *  CurlHint — used in ops pages to show the equivalent curl command.
 * ====================================================================== */

export interface CurlHintProps extends HTMLAttributes<HTMLDivElement> {
  /** Full command line, e.g. "curl -X POST …". */
  command: string;
}

export const CurlHint = forwardRef<HTMLDivElement, CurlHintProps>(
  function CurlHint({ command, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="bn-curl-hint"
        className={cn("bn-curl-hint", className)}
        {...rest}
      >
        <CodeLine>{command}</CodeLine>
      </div>
    );
  },
);
