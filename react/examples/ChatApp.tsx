import { useMemo, useState, type ReactNode } from "react";
import {
  /* Layout + shell */
  AppRibbon,
  RibbonAction,
  RibbonSeparator,
  StatusBar,
  StatusGroup,
  StatusItem,
  /* Chat interfaces (tier-2 composites). */
  Thread,
  ThreadContent,
  Message,
  MessageAvatar,
  MessageHeader,
  MessageContent,
  MessageActions,
  MessageAction,
  Suggestions,
  Suggestion,
  SuggestionPanel,
  /* Chat bar */
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputActionGroup,
  PromptInputAction,
  /* Model selector */
  ModelSelector,
  type ModelItemData,
} from "@retroma/react/composites";

/* ---------------------------------------------------------------- */
/*  Demo data                                                        */
/* ---------------------------------------------------------------- */

const MODELS: ModelItemData[] = [
  {
    id: "opus-4-7",
    label: "Claude Opus 4.7",
    provider: "Anthropic",
    contextKb: 200,
    tone: "smart",
    description: "Most capable · long-context reasoning",
  },
  {
    id: "sonnet-4-6",
    label: "Claude Sonnet 4.6",
    provider: "Anthropic",
    contextKb: 200,
    description: "Balanced · everyday agentic work",
  },
  {
    id: "haiku-4-5",
    label: "Claude Haiku 4.5",
    provider: "Anthropic",
    contextKb: 100,
    tone: "fast",
    description: "Fastest · low-latency replies",
  },
  {
    id: "gpt-5",
    label: "GPT-5",
    provider: "OpenAI",
    contextKb: 128,
    description: "Frontier · multimodal",
  },
  {
    id: "gemini-3",
    label: "Gemini 3",
    provider: "Google",
    contextKb: 1000,
    tone: "beta",
    description: "Enormous context · research preview",
  },
];

interface ChatMsg {
  id: string;
  from: "user" | "assistant" | "system";
  text: string;
  time: string;
  streaming?: boolean;
}

const SEED_THREADS: Array<{
  id: string;
  title: string;
  preview: string;
  messages: ChatMsg[];
}> = [
  {
    id: "palette",
    title: "Tuning the accent palette",
    preview: "how the oklch algorithm derives everything",
    messages: [
      {
        id: "s",
        from: "system",
        time: "09:02",
        text: "Retroma Chat — a cozy place to think.",
      },
      {
        id: "u1",
        from: "user",
        time: "09:03",
        text: "How do I override the Retroma accent across the whole app?",
      },
      {
        id: "a1",
        from: "assistant",
        time: "09:03",
        text:
          "Set `--interactive-accent` on `body` (or any ancestor of `<RetromaApp>`). The oklch-based algorithm re-derives surface, border, muted, and hover tones for every composite — no per-component overrides needed.",
      },
      {
        id: "u2",
        from: "user",
        time: "09:04",
        text: "Does that include the chat bubbles and model selector pill?",
      },
      {
        id: "a2",
        from: "assistant",
        time: "09:04",
        text:
          "Yes. ChatMessage, PromptInput, and ModelSelector all read from the same tokens, so a single accent change restyles the chat bar, the bubbles, and the popover command select in one breath.",
      },
    ],
  },
  {
    id: "composer",
    title: "Composer shortcuts",
    preview: "enter = send · shift+enter = newline",
    messages: [
      {
        id: "u",
        from: "user",
        time: "yesterday",
        text: "Remind me which keys send vs break a line?",
      },
      {
        id: "a",
        from: "assistant",
        time: "yesterday",
        text: "Enter sends. Shift+Enter inserts a newline. Cmd/Ctrl+K opens the command palette.",
      },
    ],
  },
  {
    id: "recipes",
    title: "Cozy lentil soup",
    preview: "off-topic, but cozy",
    messages: [
      {
        id: "u",
        from: "user",
        time: "Mon",
        text: "Give me a soothing weeknight soup.",
      },
      {
        id: "a",
        from: "assistant",
        time: "Mon",
        text:
          "Sauté onion + carrot + celery. Add 1c red lentils, 4c broth, a pinch of cumin, and a bay leaf. Simmer 20 min. Finish with lemon and olive oil.",
      },
    ],
  },
];

const STARTER_PROMPTS = [
  "Explain the oklch color token system",
  "Write a haiku about retro UIs",
  "Summarize my open PRs",
  "Draft release notes for v0.2",
];

/* ---------------------------------------------------------------- */
/*  Small SVG icons                                                  */
/* ---------------------------------------------------------------- */

const RibbonIcon = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const PLUS = "M12 5v14M5 12h14";
const PAPERCLIP =
  "M21 12.5 12.5 21a5 5 0 0 1-7-7L14 5.5a3.5 3.5 0 0 1 5 5L10.5 19a2 2 0 0 1-3-3L15 8.5";
const MIC = "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm7 10a7 7 0 0 1-14 0M12 19v3";
const SEND = "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z";
const CHAT = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z";
const SPARK = "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8";
const BOOK = "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z";
const GEAR =
  "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.5-2.4.9a7.4 7.4 0 0 0-2-1.2l-.4-2.6h-4l-.4 2.6a7.4 7.4 0 0 0-2 1.2l-2.4-.9-2 3.5 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.5 2.4-.9a7.4 7.4 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7.4 7.4 0 0 0 2-1.2l2.4.9 2-3.5-2-1.6a7.4 7.4 0 0 0 .1-1.2Z";

/* ---------------------------------------------------------------- */
/*  Root                                                             */
/* ---------------------------------------------------------------- */

export default function ChatApp() {
  const [activeThread, setActiveThread] = useState(SEED_THREADS[0].id);
  const [threads, setThreads] =
    useState<typeof SEED_THREADS>(SEED_THREADS);
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState("sonnet-4-6");
  const [ribbon, setRibbon] = useState<"chat" | "library" | "settings">("chat");

  const current = useMemo(
    () => threads.find((t) => t.id === activeThread) ?? threads[0],
    [threads, activeThread],
  );

  const activeModel = MODELS.find((m) => m.id === model);

  const appendMessage = (threadId: string, msg: ChatMsg) =>
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, messages: [...t.messages, msg], preview: msg.text }
          : t,
      ),
    );

  const handleSend = (value: string) => {
    if (!value.trim()) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const uid = `u-${Date.now()}`;
    const aid = `a-${Date.now() + 1}`;
    appendMessage(current.id, { id: uid, from: "user", text: value, time: now });
    setDraft("");
    window.setTimeout(() => {
      appendMessage(current.id, {
        id: aid,
        from: "assistant",
        time: now,
        text: `Drafted with ${activeModel?.label ?? model}: "${value.trim()}"`,
      });
    }, 400);
  };

  const handleNewThread = () => {
    const id = `t-${Date.now()}`;
    const fresh = {
      id,
      title: "New conversation",
      preview: "Just getting started…",
      messages: [
        {
          id: `s-${id}`,
          from: "system" as const,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: "Fresh thread. What should we think about?",
        },
      ],
    };
    setThreads((prev) => [fresh, ...prev]);
    setActiveThread(id);
  };

  return (
    <div className="chat-shell theme-light">
      <div className="chat-app">
        {/* ------------------------------ Ribbon ------------------------------ */}
        <AppRibbon collapsed>
          <RibbonAction
            label="Chat"
            tooltip="Conversations"
            active={ribbon === "chat"}
            onClick={() => setRibbon("chat")}
            icon={<RibbonIcon d={CHAT} />}
          />
          <RibbonAction
            label="Library"
            tooltip="Saved prompts"
            active={ribbon === "library"}
            onClick={() => setRibbon("library")}
            icon={<RibbonIcon d={BOOK} />}
          />
          <RibbonAction
            label="Sparks"
            tooltip="Starter prompts"
            icon={<RibbonIcon d={SPARK} />}
          />
          <RibbonSeparator />
          <RibbonAction
            label="New chat"
            tooltip="Start a new conversation"
            onClick={handleNewThread}
            icon={<RibbonIcon d={PLUS} />}
          />
          <RibbonAction
            label="Settings"
            tooltip="Preferences"
            active={ribbon === "settings"}
            onClick={() => setRibbon("settings")}
            icon={<RibbonIcon d={GEAR} />}
          />
        </AppRibbon>

        {/* ------------------------------ Sidebar ----------------------------- */}
        <aside className="chat-side" aria-label="Conversations">
          <div className="chat-side-header">
            <div className="chat-side-title">
              <span className="dot" aria-hidden="true" />
              Retroma Chat
            </div>
            <ModelSelector
              models={MODELS}
              value={model}
              onChange={setModel}
              label="Model"
            />
          </div>
          <ul className="chat-side-list">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="chat-thread-btn"
                  aria-current={t.id === activeThread ? "true" : undefined}
                  onClick={() => setActiveThread(t.id)}
                >
                  <span className="chat-thread-title">{t.title}</span>
                  <span className="chat-thread-sub">{t.preview}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="chat-side-footer">
            Cozy mode · tokens driven by{" "}
            <code>--interactive-accent</code>
          </div>
        </aside>

        {/* ------------------------------ Main -------------------------------- */}
        <section className="chat-main" aria-label="Conversation">
          <header className="chat-topbar">
            <h2>{current.title}</h2>
            <div className="chat-topbar-spacer" />
            <span className="chat-topbar-meta">
              {activeModel?.provider} · {activeModel?.label}
            </span>
            <a className="chat-topbar-link" href="./index.html">
              ← Gallery
            </a>
          </header>

          <Thread>
            <ThreadContent className="chat-conversation">
              {current.messages.length <= 1 && (
                <div className="chat-empty">
                  <SuggestionPanel
                    header={
                      <div>
                        <strong>Start the conversation</strong>
                        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                          Pick a starter, or type your own in the composer.
                        </div>
                      </div>
                    }
                  >
                    <Suggestions>
                      {STARTER_PROMPTS.map((p) => (
                        <Suggestion
                          key={p}
                          onSelect={(label) => handleSend(label)}
                        >
                          {p}
                        </Suggestion>
                      ))}
                    </Suggestions>
                  </SuggestionPanel>
                </div>
              )}

              {current.messages.map((m) => (
                <Message key={m.id} from={m.from} streaming={m.streaming}>
                  <MessageAvatar
                    fallback={
                      m.from === "assistant"
                        ? "✦"
                        : m.from === "system"
                        ? "ⓘ"
                        : "🧑"
                    }
                  />
                  <div>
                    <MessageHeader
                      sender={
                        m.from === "assistant"
                          ? activeModel?.label ?? "Assistant"
                          : m.from === "system"
                          ? "System"
                          : "You"
                      }
                      timestamp={m.time}
                    />
                    <MessageContent>{m.text}</MessageContent>
                    {m.from !== "system" && (
                      <MessageActions>
                        <MessageAction label="Copy" />
                        <MessageAction label="Retry" icon="↻" />
                        <MessageAction label="Share" icon="↗" />
                      </MessageActions>
                    )}
                  </div>
                </Message>
              ))}
            </ThreadContent>
          </Thread>

          <footer className="chat-composer">
            <PromptInput value={draft} onValueChange={setDraft} onSend={handleSend}>
              <PromptInputTextarea
                placeholder={`Ask ${activeModel?.label ?? "anything"}…  (enter to send, shift+enter = newline)`}
                rows={2}
              />
              <PromptInputActions>
                <PromptInputActionGroup align="leading">
                  <PromptInputAction tooltip="Attach file">
                    <RibbonIcon d={PAPERCLIP} />
                  </PromptInputAction>
                  <PromptInputAction tooltip="Voice">
                    <RibbonIcon d={MIC} />
                  </PromptInputAction>
                </PromptInputActionGroup>
                <PromptInputActionGroup align="trailing">
                  <PromptInputAction submit tooltip="Send">
                    <RibbonIcon d={SEND} /> send
                  </PromptInputAction>
                </PromptInputActionGroup>
              </PromptInputActions>
            </PromptInput>
            <div className="chat-hint">
              <span>
                <kbd>Enter</kbd> send · <kbd>Shift</kbd> + <kbd>Enter</kbd>{" "}
                newline
              </span>
              <span>{draft.trim().length} chars</span>
            </div>
          </footer>
        </section>

        {/* ------------------------------ Status ------------------------------ */}
        <StatusBar>
          <StatusGroup>
            <StatusItem>{threads.length} conversations</StatusItem>
            <StatusItem>·</StatusItem>
            <StatusItem>{current.messages.length} messages</StatusItem>
          </StatusGroup>
          <StatusGroup align="end">
            <StatusItem>{activeModel?.label}</StatusItem>
            <StatusItem>·</StatusItem>
            <StatusItem>online</StatusItem>
          </StatusGroup>
        </StatusBar>
      </div>
    </div>
  );
}

/* unused by design, keeps JSX tree tidy for future sidepanel contents */
export function Aside({ children }: { children: ReactNode }) {
  return <aside>{children}</aside>;
}
