import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface MinimalSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
}
interface SpeechResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}
interface SpeechEvent {
  resultIndex: number;
  results: { length: number } & { [index: number]: SpeechResult };
}
type SRCtor = new () => MinimalSpeechRecognition;

interface AudioRefs {
  stream: MediaStream;
  audioContext: AudioContext;
}

function getSpeechRecognition(): SRCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRCtor;
    webkitSpeechRecognition?: SRCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/* -------------------------------------------------------------------------- */
/*  StatusRail                                                                */
/* -------------------------------------------------------------------------- */

export interface StatusRailProps extends HTMLAttributes<HTMLDivElement> {
  /** Fires on each final transcript chunk. */
  onTranscript?: (text: string) => void;
  /** Override the rail label. */
  label?: ReactNode;
  /** Number of audio level bars. */
  bars?: number;
  /** Auto-insert the final transcript into the currently focused input/textarea. */
  autoInsert?: boolean;
  /** Render a floating mic FAB (useful on mobile). Default: true. */
  showFab?: boolean;
}

export const StatusRail = forwardRef<HTMLDivElement, StatusRailProps>(
  function StatusRail(
    {
      onTranscript,
      label = "status rail",
      bars = 4,
      autoInsert = true,
      showFab = true,
      className,
      ...rest
    },
    ref,
  ) {
    const [isListening, setIsListening] = useState(false);
    const [message, setMessage] = useState<string>("voice idle");
    const [level, setLevel] = useState(0);

    const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);
    const audioRef = useRef<AudioRefs | null>(null);
    const rafRef = useRef(0);
    const lastFocusedRef = useRef<Element | null>(null);

    useEffect(() => {
      if (!autoInsert) return;
      const onFocus = (e: FocusEvent) => {
        lastFocusedRef.current = e.target as Element;
      };
      document.addEventListener("focusin", onFocus);
      return () => document.removeEventListener("focusin", onFocus);
    }, [autoInsert]);

    const insertIntoActiveField = useCallback(
      (text: string) => {
        const target = (document.activeElement ?? lastFocusedRef.current) as
          | HTMLElement
          | null;
        if (!target || !text) return false;
        if (
          (target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement) &&
          !target.readOnly &&
          !target.disabled
        ) {
          const start = target.selectionStart ?? target.value.length;
          const end = target.selectionEnd ?? start;
          target.value = `${target.value.slice(0, start)}${text}${target.value.slice(
            end,
          )}`;
          target.dispatchEvent(new Event("input", { bubbles: true }));
          return true;
        }
        if (target.isContentEditable) {
          target.append(document.createTextNode(`${text} `));
          target.dispatchEvent(new Event("input", { bubbles: true }));
          return true;
        }
        return false;
      },
      [],
    );

    const startMeter = useCallback(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      const audioContext = new Ctx();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg =
          data.reduce((a, b) => a + b, 0) / Math.max(data.length, 1);
        setLevel(avg / 255);
        rafRef.current = window.requestAnimationFrame(tick);
      };
      tick();
      audioRef.current = { stream, audioContext };
    }, []);

    const stopMeter = useCallback(() => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      const cur = audioRef.current;
      if (cur) {
        cur.stream.getTracks().forEach((t) => t.stop());
        cur.audioContext.close().catch(() => {});
      }
      audioRef.current = null;
      setLevel(0);
    }, []);

    const startListening = useCallback(async () => {
      const SR = getSpeechRecognition();
      if (!SR) {
        setMessage("speech recognition unavailable");
        return;
      }
      try {
        await startMeter();
      } catch {
        setMessage("microphone permission denied");
        return;
      }
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = () => {
        setIsListening(true);
        setMessage("listening…");
      };
      recognition.onresult = (event) => {
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result[0]?.transcript ?? "";
          if (result.isFinal) finalText += `${transcript} `;
        }
        const text = finalText.trim();
        if (text) {
          if (autoInsert) insertIntoActiveField(`${text} `);
          onTranscript?.(text);
          setMessage(text);
        }
      };
      recognition.onend = () => {
        setIsListening(false);
        stopMeter();
      };
      recognition.onerror = () => {
        setIsListening(false);
        stopMeter();
        setMessage("voice error");
      };
      recognition.start();
    }, [autoInsert, insertIntoActiveField, onTranscript, startMeter, stopMeter]);

    const stopListening = useCallback(() => {
      recognitionRef.current?.stop();
      stopMeter();
      setIsListening(false);
    }, [stopMeter]);

    useEffect(() => {
      return () => {
        try {
          recognitionRef.current?.stop();
        } catch {
          /* ignore */
        }
        stopMeter();
      };
    }, [stopMeter]);

    const barEls = Array.from({ length: bars }).map((_, i) => {
      const m = (i + 1) / bars;
      return (
        <span
          key={i}
          className="retroma-status-rail-bar"
          style={{
            height: `${8 + level * 24 * m * (i % 2 === 0 ? 1 : 0.8)}px`,
          }}
        />
      );
    });

    return (
      <>
        <aside
          ref={ref}
          data-slot="status-rail"
          data-listening={isListening ? "true" : undefined}
          className={cn("retroma-status-rail", className)}
          {...rest}
        >
          <div className="retroma-status-rail-left">
            <span className="retroma-status-rail-label">{label}</span>
            <div className="retroma-status-rail-bars">{barEls}</div>
            <span className="retroma-status-rail-message" title={message}>
              {message}
            </span>
          </div>
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "retroma-status-rail-toggle",
              isListening && "is-listening",
            )}
          >
            {isListening ? "stop voice" : "start voice"}
          </button>
        </aside>
        {showFab ? (
          <button
            type="button"
            aria-label={isListening ? "Stop voice" : "Start voice"}
            className={cn(
              "retroma-status-rail-fab",
              isListening && "is-listening",
            )}
            onClick={isListening ? stopListening : startListening}
          >
            mic
          </button>
        ) : null}
      </>
    );
  },
);
