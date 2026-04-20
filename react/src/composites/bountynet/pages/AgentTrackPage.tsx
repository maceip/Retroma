import { useState } from "react";
import { AppHeader, PageHero, PageLayout, PageSection } from "../shell";
import {
  FormCard, PrimaryButton, GhostButton, TerminalReadout,
  RepositoryStream, type RepoStreamItem,
} from "../blocks";
import { CommitGraph, generateDemoCommits } from "../../commit-graph";
import { ChatContainer, ChatInput, ChatMessage, ChatMessageList, ChatSendButton } from "../../chat";
import { cn } from "../../../lib/utils";

const AGENTS = [
  { id: "alice-03", name: "alice-03",   state: "idle",    ping: "12ms" },
  { id: "mallory-07", name: "mallory-07", state: "busy",  ping: "48ms" },
  { id: "trent-01", name: "trent-01",   state: "offline", ping: "—"   },
  { id: "nia-12",   name: "nia-12",     state: "idle",    ping: "7ms" },
];

const REPOS: RepoStreamItem[] = [
  { repo_full_name: "acme/sdk", status: "sim · watching", language: "TypeScript" },
  { repo_full_name: "widgets/core", status: "sim · watching", language: "Rust" },
];

const EVENTS = [
  { kind: "cmd" as const, text: "> assign j_281 → alice-03" },
  { kind: "out" as const, text: "picked up · ETA PT10H" },
  { kind: "ok"  as const, text: "✓ awarded · s_475" },
  { kind: "cmd" as const, text: "> voice:inbox · 2 queued" },
];

export function AgentTrackPage() {
  const [paused, setPaused] = useState(false);
  const [voiceCount, setVoiceCount] = useState(2);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string; t: string }>
  >([
    { id: "m1", role: "assistant", content: "Sim is warm. Queue some voice work.", t: "14:02" },
  ]);

  const send = (text: string) => {
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((ms) => [
      ...ms,
      { id: String(Date.now()), role: "user", content: text, t },
    ]);
    setVoiceCount((n) => n + 1);
    setTimeout(() => {
      setMessages((ms) => [
        ...ms,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: `Queued to voice inbox (${voiceCount + 1} pending).`,
          t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 450);
  };

  return (
    <>
      <AppHeader />
      <PageLayout>
        <PageHero
          label="agent track · sim"
          headline="a deterministic sandbox"
          body="All data here is simulated: pair agents with repos, queue voice transcripts, watch the event log."
        />
        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="controls">
            <FormCard title="Simulator">
              <div className="bn-form-actions">
                <PrimaryButton onClick={() => setPaused((p) => !p)}>
                  {paused ? "resume" : "pause"}
                </PrimaryButton>
                <GhostButton>add pair</GhostButton>
                <GhostButton onClick={() => setVoiceCount(0)}>
                  clear voice inbox ({voiceCount})
                </GhostButton>
              </div>
              <div style={{ marginTop: 12 }}>
                <CommitGraph days={generateDemoCommits(16, voiceCount + 7)} showMonths={false} />
              </div>
            </FormCard>
          </PageSection>

          <PageSection title="agent track chat" hint="queues into smui.voice.inbox.v1">
            <ChatContainer>
              <ChatMessageList>
                {messages.map((m) => (
                  <ChatMessage key={m.id} role={m.role} sender={m.role === "assistant" ? "sim" : "you"} timestamp={m.t}>
                    {m.content}
                  </ChatMessage>
                ))}
              </ChatMessageList>
              <ChatInput
                value={draft}
                onValueChange={setDraft}
                onSend={(v) => {
                  send(v);
                  setDraft("");
                }}
                trailing={<ChatSendButton>send ↵</ChatSendButton>}
              />
            </ChatContainer>
          </PageSection>
        </div>

        <div className="bn-page-grid bn-page-grid--2">
          <PageSection title="agent stream">
            <div className="bn-operator-stream">
              <div className="bn-operator-stream-head">
                <span>agent</span>
                <span>ping</span>
                <span>state</span>
              </div>
              {AGENTS.map((a) => (
                <div key={a.id} className="bn-operator-stream-row">
                  <span className="bn-operator-stream-name">{a.name}</span>
                  <span className="bn-operator-stream-email">{a.ping}</span>
                  <span className={cn("bn-status-pill", `bn-status-pill--${a.state === "offline" ? "disputed" : a.state === "busy" ? "running" : "paid"}`)}>
                    {a.state}
                  </span>
                </div>
              ))}
            </div>
          </PageSection>

          <PageSection title="repository stream">
            <RepositoryStream repos={REPOS} />
          </PageSection>
        </div>

        <PageSection title="assignment log">
          <TerminalReadout title="sim events" lines={EVENTS} />
        </PageSection>
      </PageLayout>
    </>
  );
}
