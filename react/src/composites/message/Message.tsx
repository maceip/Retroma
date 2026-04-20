import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Context so descendants (Content, Actions, Avatar) can react to the role.  */
/* -------------------------------------------------------------------------- */

export type MessageFrom = "user" | "assistant" | "system";

interface MessageCtx {
  from: MessageFrom;
}

const MessageContext = createContext<MessageCtx | null>(null);
const useMessageCtx = () => useContext(MessageContext);

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  from?: MessageFrom;
  /** Mark the message as still streaming (draws a trailing caret). */
  streaming?: boolean;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(function Message(
  { from = "assistant", streaming, className, children, ...rest },
  ref,
) {
  const value = useMemo(() => ({ from }), [from]);
  return (
    <MessageContext.Provider value={value}>
      <div
        ref={ref}
        data-slot="message"
        data-from={from}
        data-streaming={streaming ? "true" : undefined}
        className={cn(
          "retroma-message",
          `retroma-message--${from}`,
          streaming && "retroma-message--streaming",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </MessageContext.Provider>
  );
});

/* -------------------------------------------------------------------------- */
/*  MessageStack — vertical container for a run of messages.                  */
/* -------------------------------------------------------------------------- */

export interface MessageStackProps extends HTMLAttributes<HTMLDivElement> {}

export const MessageStack = forwardRef<HTMLDivElement, MessageStackProps>(
  function MessageStack({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="message-stack"
        className={cn("retroma-message-stack", className)}
        {...rest}
      />
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  MessageAvatar                                                             */
/* -------------------------------------------------------------------------- */

export interface MessageAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image url. */
  src?: string;
  /** Fallback text when `src` is absent or fails to load. */
  fallback?: ReactNode;
}

export const MessageAvatar = forwardRef<HTMLSpanElement, MessageAvatarProps>(
  function MessageAvatar({ src, fallback, className, ...rest }, ref) {
    const ctx = useMessageCtx();
    const defaultFallback =
      ctx?.from === "assistant" ? "🤖" : ctx?.from === "system" ? "ⓘ" : "🧑";
    return (
      <span
        ref={ref}
        data-slot="message-avatar"
        className={cn("retroma-message-avatar", className)}
        {...rest}
      >
        {src ? <img src={src} alt="" /> : fallback ?? defaultFallback}
      </span>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  MessageHeader (sender + timestamp)                                        */
/* -------------------------------------------------------------------------- */

export interface MessageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  sender?: ReactNode;
  timestamp?: ReactNode;
}

export const MessageHeader = forwardRef<HTMLDivElement, MessageHeaderProps>(
  function MessageHeader({ sender, timestamp, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="message-header"
        className={cn("retroma-message-header", className)}
        {...rest}
      >
        {sender ? <span className="retroma-message-sender">{sender}</span> : null}
        {timestamp ? (
          <span className="retroma-message-timestamp">{timestamp}</span>
        ) : null}
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  MessageContent — the bubble body                                          */
/* -------------------------------------------------------------------------- */

export interface MessageContentProps extends HTMLAttributes<HTMLDivElement> {}

export const MessageContent = forwardRef<HTMLDivElement, MessageContentProps>(
  function MessageContent({ className, children, ...rest }, ref) {
    const ctx = useMessageCtx();
    return (
      <div
        ref={ref}
        data-slot="message-content"
        className={cn("retroma-message-content", className)}
        {...rest}
      >
        {children}
        {ctx?.from === "assistant" ? (
          <span className="retroma-message-caret" aria-hidden="true" />
        ) : null}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  MessageActions / MessageAction                                            */
/* -------------------------------------------------------------------------- */

export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const MessageActions = forwardRef<HTMLDivElement, MessageActionsProps>(
  function MessageActions({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="message-actions"
        className={cn("retroma-message-actions", className)}
        {...rest}
      />
    );
  },
);

export interface MessageActionProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Accessible label + tooltip. */
  label: string;
  /** Optional icon (defaults to the first character of the label). */
  icon?: ReactNode;
}

export const MessageAction = forwardRef<HTMLButtonElement, MessageActionProps>(
  function MessageAction({ label, icon, className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        data-slot="message-action"
        className={cn("retroma-message-action", className)}
        {...rest}
      >
        {icon ?? children ?? label.slice(0, 1).toUpperCase()}
      </button>
    );
  },
);
