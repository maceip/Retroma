import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  ModalOverlay                                                              */
/* -------------------------------------------------------------------------- */

export interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /** Fires on backdrop click or Esc. */
  onClose?: () => void;
  /** Close on backdrop click (default true). */
  dismissable?: boolean;
  /** Render target. Defaults to `document.body`. */
  container?: HTMLElement | null;
}

export const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  function ModalOverlay(
    {
      open,
      onClose,
      dismissable = true,
      container,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const dialogRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!open) return;
      const onKey = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape" && dismissable) onClose?.();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [open, dismissable, onClose]);

    const handleBackdrop = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (!dismissable) return;
        if (e.target === e.currentTarget) onClose?.();
      },
      [dismissable, onClose],
    );

    if (!open) return null;

    const content = (
      <>
        <div
          className={cn("modal-bg", "is-open", className)}
          style={{ background: "oklch(from black l c h / 50%)" }}
          {...rest}
        />
        <div
          ref={(node) => {
            dialogRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="dialog"
          aria-modal="true"
          className="modal-container"
          onClick={handleBackdrop}
        >
          {children}
        </div>
      </>
    );

    if (typeof window === "undefined") return content;
    return createPortal(content, container ?? document.body);
  },
);

/* -------------------------------------------------------------------------- */
/*  ModalContent                                                              */
/* -------------------------------------------------------------------------- */

export interface ModalContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Variant: `modal` (settings-style card) or `prompt` (command palette). */
  variant?: "modal" | "prompt";
  /** Optional title shown in a header row. */
  title?: ReactNode;
  /** Optional footer content. */
  footer?: ReactNode;
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  function ModalContent(
    { variant = "modal", title, footer, className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(variant === "prompt" ? "prompt" : "modal", className)}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {title ? (
          <div className="modal-header">
            <div className="modal-title">{title}</div>
          </div>
        ) : null}
        <div className={variant === "prompt" ? "prompt-body" : "modal-content"}>
          {children}
        </div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  SettingsModal — thin wrapper around Overlay + Content.                    */
/* -------------------------------------------------------------------------- */

export interface SettingsModalProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

export function SettingsModal({
  open,
  onClose,
  title,
  children,
  footer,
}: SettingsModalProps) {
  return (
    <ModalOverlay open={open} onClose={onClose}>
      <ModalContent variant="modal" title={title} footer={footer}>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
}

