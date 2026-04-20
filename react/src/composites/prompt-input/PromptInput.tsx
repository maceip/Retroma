import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Context — lets ActionGroups read the value and trigger submit.            */
/* -------------------------------------------------------------------------- */

interface PromptInputCtx {
  value: string;
  setValue: (v: string) => void;
  submit: () => void;
  disabled?: boolean;
}

const PromptCtx = createContext<PromptInputCtx | null>(null);
function usePromptInput() {
  const ctx = useContext(PromptCtx);
  if (!ctx) throw new Error("PromptInput children must be inside <PromptInput>.");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export interface PromptInputProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Controlled value. */
  value?: string;
  /** Change callback (controlled). */
  onValueChange?: (value: string) => void;
  /** Fires when the user hits submit / Enter. */
  onSend?: (value: string) => void;
  /** Disable the whole surface. */
  disabled?: boolean;
}

export const PromptInput = forwardRef<HTMLFormElement, PromptInputProps>(
  function PromptInput(
    {
      value: controlled,
      onValueChange,
      onSend,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState("");
    const value = controlled ?? uncontrolled;

    const setValue = useCallback(
      (v: string) => {
        if (controlled === undefined) setUncontrolled(v);
        onValueChange?.(v);
      },
      [controlled, onValueChange],
    );

    const submit = useCallback(() => {
      if (disabled) return;
      const trimmed = value.trim();
      if (!trimmed) return;
      onSend?.(trimmed);
      if (controlled === undefined) setUncontrolled("");
      else onValueChange?.("");
    }, [controlled, disabled, onSend, onValueChange, value]);

    const ctx = useMemo<PromptInputCtx>(
      () => ({ value, setValue, submit, disabled }),
      [value, setValue, submit, disabled],
    );

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit();
    };

    return (
      <PromptCtx.Provider value={ctx}>
        <form
          ref={ref}
          data-slot="prompt-input"
          data-disabled={disabled ? "true" : undefined}
          className={cn("retroma-prompt-input", className)}
          onSubmit={onFormSubmit}
          {...rest}
        >
          {children}
        </form>
      </PromptCtx.Provider>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  PromptInputTextarea                                                       */
/* -------------------------------------------------------------------------- */

export interface PromptInputTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const PromptInputTextarea = forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(function PromptInputTextarea({ className, onKeyDown, placeholder, ...rest }, ref) {
  const ctx = usePromptInput();
  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ctx.submit();
    }
  };
  return (
    <textarea
      ref={ref}
      data-slot="prompt-input-textarea"
      className={cn("retroma-prompt-input-textarea", className)}
      placeholder={placeholder ?? "Ask anything…"}
      disabled={ctx.disabled}
      value={ctx.value}
      onChange={(e) => ctx.setValue(e.target.value)}
      onKeyDown={handleKey}
      rows={rest.rows ?? 2}
      {...rest}
    />
  );
});

/* -------------------------------------------------------------------------- */
/*  PromptInputActions / PromptInputActionGroup / PromptInputAction           */
/* -------------------------------------------------------------------------- */

export interface PromptInputActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const PromptInputActions = forwardRef<HTMLDivElement, PromptInputActionsProps>(
  function PromptInputActions({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="prompt-input-actions"
        className={cn("retroma-prompt-input-actions", className)}
        {...rest}
      />
    );
  },
);

export interface PromptInputActionGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Group alignment — `leading` stays on the left, `trailing` floats right. */
  align?: "leading" | "trailing";
}

export const PromptInputActionGroup = forwardRef<
  HTMLDivElement,
  PromptInputActionGroupProps
>(function PromptInputActionGroup({ align = "leading", className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="prompt-input-action-group"
      data-align={align}
      className={cn(
        "retroma-prompt-input-action-group",
        align === "trailing" && "retroma-prompt-input-action-group--trailing",
        className,
      )}
      {...rest}
    />
  );
});

export interface PromptInputActionProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Accessible label / tooltip. */
  tooltip?: string;
  /** Icon / text for the button. */
  children: ReactNode;
  /** Marks the action as the submit button. */
  submit?: boolean;
  /** Disable independently from the root. */
  disabled?: boolean;
}

export const PromptInputAction = forwardRef<
  HTMLButtonElement,
  PromptInputActionProps
>(function PromptInputAction(
  { tooltip, children, submit, className, disabled, ...rest },
  ref,
) {
  const ctx = usePromptInput();
  return (
    <button
      ref={ref}
      type={submit ? "submit" : "button"}
      aria-label={tooltip}
      title={tooltip}
      data-slot="prompt-input-action"
      data-submit={submit ? "true" : undefined}
      className={cn(
        "retroma-prompt-input-action",
        submit && "retroma-prompt-input-action--submit",
        className,
      )}
      disabled={disabled || ctx.disabled}
      {...rest}
    >
      {children}
    </button>
  );
});
