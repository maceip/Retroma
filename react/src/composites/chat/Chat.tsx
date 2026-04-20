import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  ChatContainer — outer scroll region for bubbles.                          */
/* -------------------------------------------------------------------------- */

export interface ChatContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  function ChatContainer({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="chat-container"
        className={cn("retroma-chat", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface ChatMessageListProps extends HTMLAttributes<HTMLDivElement> {}

export const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  function ChatMessageList({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="log"
        aria-live="polite"
        className={cn("retroma-chat-messages", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  ChatMessage bubble.                                                       */
/* -------------------------------------------------------------------------- */

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  /** Sender label (name or model id). */
  sender?: ReactNode;
  /** Avatar element. */
  avatar?: ReactNode;
  /** Timestamp. */
  timestamp?: ReactNode;
  /** Right-side actions (copy, retry, …). */
  actions?: ReactNode;
  /** Mark the message as streaming (shows a caret). */
  streaming?: boolean;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(
    {
      role,
      sender,
      avatar,
      timestamp,
      actions,
      streaming,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="chat-message"
        data-role={role}
        className={cn("retroma-chat-message", `retroma-chat-message--${role}`, className)}
        {...rest}
      >
        {avatar ? <div className="retroma-chat-avatar">{avatar}</div> : null}
        <div className="retroma-chat-bubble">
          {(sender || timestamp) && (
            <div className="retroma-chat-meta">
              {sender ? <span className="retroma-chat-sender">{sender}</span> : null}
              {timestamp ? (
                <span className="retroma-chat-timestamp">{timestamp}</span>
              ) : null}
            </div>
          )}
          <div className="retroma-chat-content">
            {children}
            {streaming ? <span className="retroma-chat-caret" aria-hidden="true" /> : null}
          </div>
          {actions ? <div className="retroma-chat-actions">{actions}</div> : null}
        </div>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Copy action button.                                                       */
/* -------------------------------------------------------------------------- */

export interface ChatCopyButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** Text to copy when clicked. */
  value: string;
  /** Label shown before copy (default: "Copy"). */
  idleLabel?: ReactNode;
  /** Label shown after copy (default: "Copied"). */
  copiedLabel?: ReactNode;
  /** Auto-reset timeout ms. */
  resetMs?: number;
}

export const ChatCopyButton = forwardRef<HTMLButtonElement, ChatCopyButtonProps>(
  function ChatCopyButton(
    { value, idleLabel = "Copy", copiedLabel = "Copied", resetMs = 1500, className, onClick, ...rest },
    ref,
  ) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handle = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setCopied(false), resetMs);
        } catch {
          /* ignore — clipboard can be blocked */
        }
      },
      [onClick, value, resetMs],
    );

    return (
      <button
        ref={ref}
        type="button"
        data-slot="chat-copy"
        data-copied={copied ? "true" : undefined}
        className={cn("retroma-chat-copy", className)}
        onClick={handle}
        {...rest}
      >
        {copied ? copiedLabel : idleLabel}
      </button>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  ChatInput — footer with textarea, model picker, send.                     */
/* -------------------------------------------------------------------------- */

export interface ChatInputProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Left-hand attachments / controls. */
  leading?: ReactNode;
  /** Right-hand actions (send button, mic). */
  trailing?: ReactNode;
  /** Fires when the user hits enter or clicks submit. */
  onSend?: (value: string) => void;
  /** Controlled textarea value. */
  value?: string;
  /** onChange for controlled mode. */
  onValueChange?: (value: string) => void;
  /** Textarea props. */
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  /** Placeholder text. */
  placeholder?: string;
}

export const ChatInput = forwardRef<HTMLFormElement, ChatInputProps>(
  function ChatInput(
    {
      leading,
      trailing,
      onSend,
      value: controlled,
      onValueChange,
      textareaProps,
      placeholder = "Message the agent…",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState("");
    const value = controlled ?? uncontrolled;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!value.trim()) return;
      onSend?.(value);
      if (controlled === undefined) setUncontrolled("");
      else onValueChange?.("");
    };

    const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      textareaProps?.onKeyDown?.(e);
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }
    };

    return (
      <form
        ref={ref}
        data-slot="chat-input"
        className={cn("retroma-chat-input", className)}
        onSubmit={handleSubmit}
        {...rest}
      >
        <textarea
          {...textareaProps}
          className={cn("retroma-chat-input-textarea", textareaProps?.className)}
          placeholder={placeholder}
          rows={textareaProps?.rows ?? 2}
          value={value}
          onChange={(e) => {
            textareaProps?.onChange?.(e);
            if (controlled === undefined) setUncontrolled(e.target.value);
            else onValueChange?.(e.target.value);
          }}
          onKeyDown={handleKey}
        />
        <div className="retroma-chat-input-footer">
          <div className="retroma-chat-input-leading">{leading}</div>
          <div className="retroma-chat-input-trailing">{trailing}</div>
        </div>
        {children}
      </form>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Model picker dropdown.                                                    */
/* -------------------------------------------------------------------------- */

export interface ChatModel {
  id: string;
  label: string;
  description?: string;
}

export interface ChatModelPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  models: ChatModel[];
  value?: string;
  onChange?: (id: string) => void;
  /** Optional label shown before the select. */
  label?: ReactNode;
}

export const ChatModelPicker = forwardRef<HTMLDivElement, ChatModelPickerProps>(
  function ChatModelPicker({ models, value, onChange, label, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="chat-model-picker"
        className={cn("retroma-chat-model-picker", className)}
        {...rest}
      >
        {label ? <span className="retroma-chat-model-label">{label}</span> : null}
        <select
          className="retroma-chat-model-select"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id} title={m.description}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Send button — looks like a chunky Retroma button.                         */
/* -------------------------------------------------------------------------- */

export interface ChatSendButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** Disable / show spinner. */
  loading?: boolean;
  /** Override the default label text. */
  label?: ReactNode;
}

export const ChatSendButton = forwardRef<HTMLButtonElement, ChatSendButtonProps>(
  function ChatSendButton({ loading, label = "Send", className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="submit"
        data-slot="chat-send"
        data-loading={loading ? "true" : undefined}
        disabled={loading}
        className={cn("retroma-chat-send", className)}
        {...rest}
      >
        {children ?? label}
      </button>
    );
  },
);
