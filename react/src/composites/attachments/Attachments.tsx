import {
  forwardRef,
  useCallback,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Model                                                                     */
/* -------------------------------------------------------------------------- */

export interface AttachmentMeta {
  /** Stable identifier. */
  id: string;
  /** Display name. */
  name: string;
  /** Byte size (for the display label). */
  size?: number;
  /** MIME type. */
  type?: string;
  /** Upload status. */
  status?: "pending" | "uploading" | "ready" | "error";
  /** Upload progress 0–1. */
  progress?: number;
  /** Optional preview thumbnail url (data:, blob:, http:). */
  thumbnail?: string;
  /** Error message when status === "error". */
  error?: string;
}

export interface AttachmentsReject {
  file: File;
  reason: string;
}

export function toAttachmentMeta(file: File, id?: string): AttachmentMeta {
  return {
    id: id ?? `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: "pending",
  };
}

function formatBytes(n?: number): string {
  if (n === undefined || n < 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/* -------------------------------------------------------------------------- */
/*  Attachments root — accepts drop + click-to-browse.                        */
/* -------------------------------------------------------------------------- */

export interface AttachmentsProps extends HTMLAttributes<HTMLDivElement> {
  /** Accepted MIME pattern (passed to input[type=file] accept). */
  accept?: string;
  /** Allow multiple files. */
  multiple?: boolean;
  /** Upper byte limit for a single file. */
  maxSize?: number;
  /** Upper total file count (across all drops). */
  maxFiles?: number;
  /** Current list (controlled). */
  value?: readonly AttachmentMeta[];
  /** Fired when files pass validation. Receives newly-added metas. */
  onAdd?: (metas: AttachmentMeta[], files: File[]) => void;
  /** Fired when files fail validation. */
  onReject?: (rejects: AttachmentsReject[]) => void;
  /** Fires when the user clicks the remove-chip for a file. */
  onRemove?: (id: string) => void;
  /** Render the drop surface as a compact dashed strip (vs tall box). */
  compact?: boolean;
}

export const Attachments = forwardRef<HTMLDivElement, AttachmentsProps>(
  function Attachments(
    {
      accept,
      multiple = true,
      maxSize,
      maxFiles,
      value,
      onAdd,
      onReject,
      onRemove,
      compact,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState<AttachmentMeta[]>([]);
    const attachments = value ?? uncontrolled;

    const handleFiles = useCallback(
      (raw: File[]) => {
        if (!raw.length) return;
        const passed: File[] = [];
        const rejects: AttachmentsReject[] = [];
        for (const f of raw) {
          if (maxSize !== undefined && f.size > maxSize) {
            rejects.push({ file: f, reason: `exceeds ${formatBytes(maxSize)}` });
            continue;
          }
          passed.push(f);
        }
        if (
          maxFiles !== undefined &&
          attachments.length + passed.length > maxFiles
        ) {
          const slots = Math.max(0, maxFiles - attachments.length);
          rejects.push(
            ...passed.slice(slots).map((f) => ({ file: f, reason: "file limit reached" })),
          );
          passed.length = slots;
        }
        const metas = passed.map((f) => toAttachmentMeta(f));
        if (metas.length) {
          if (value === undefined) {
            setUncontrolled((prev) => [...prev, ...metas]);
          }
          onAdd?.(metas, passed);
        }
        if (rejects.length) onReject?.(rejects);
      },
      [attachments.length, maxFiles, maxSize, onAdd, onReject, value],
    );

    const onDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.removeAttribute("data-drag-over");
        const files = Array.from(e.dataTransfer.files ?? []);
        handleFiles(files);
      },
      [handleFiles],
    );

    const remove = (id: string) => {
      if (value === undefined) {
        setUncontrolled((prev) => prev.filter((a) => a.id !== id));
      }
      onRemove?.(id);
    };

    return (
      <div
        ref={ref}
        data-slot="attachments"
        className={cn(
          "retroma-attachments",
          compact && "retroma-attachments--compact",
          className,
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.setAttribute("data-drag-over", "true");
        }}
        onDragLeave={(e) => {
          e.currentTarget.removeAttribute("data-drag-over");
        }}
        onDrop={onDrop}
        {...rest}
      >
        <label className="retroma-attachments-drop">
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => {
              handleFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
          <span className="retroma-attachments-drop-icon" aria-hidden="true">
            ⎘
          </span>
          <span className="retroma-attachments-drop-copy">
            <strong>drop files</strong> or <u>browse</u>
          </span>
          {maxSize !== undefined ? (
            <span className="retroma-attachments-drop-hint">
              up to {formatBytes(maxSize)}
              {maxFiles !== undefined ? ` · ${maxFiles} files` : ""}
            </span>
          ) : null}
        </label>

        {attachments.length > 0 ? (
          <ul className="retroma-attachments-list">
            {attachments.map((a) => (
              <AttachmentChip
                key={a.id}
                attachment={a}
                onRemove={() => remove(a.id)}
              />
            ))}
          </ul>
        ) : null}

        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Single chip                                                               */
/* -------------------------------------------------------------------------- */

export interface AttachmentChipProps extends HTMLAttributes<HTMLLIElement> {
  attachment: AttachmentMeta;
  onRemove?: () => void;
  /** Custom leading icon. Defaults to a paperclip-ish glyph. */
  icon?: ReactNode;
}

export const AttachmentChip = forwardRef<HTMLLIElement, AttachmentChipProps>(
  function AttachmentChip({ attachment: a, onRemove, icon, className, ...rest }, ref) {
    const progress = a.progress ?? (a.status === "ready" ? 1 : 0);
    return (
      <li
        ref={ref}
        data-status={a.status ?? "pending"}
        className={cn("retroma-attachment-chip", className)}
        {...rest}
      >
        <span className="retroma-attachment-chip-icon" aria-hidden="true">
          {icon ?? (a.thumbnail ? (
            <img src={a.thumbnail} alt="" />
          ) : (
            "📎"
          ))}
        </span>
        <div className="retroma-attachment-chip-body">
          <span className="retroma-attachment-chip-name" title={a.name}>
            {a.name}
          </span>
          <span className="retroma-attachment-chip-meta">
            {formatBytes(a.size)}
            {a.type ? ` · ${a.type}` : ""}
            {a.status === "error" && a.error ? ` · ${a.error}` : ""}
          </span>
          {a.status === "uploading" ? (
            <span className="retroma-attachment-chip-progress">
              <span style={{ width: `${Math.round(progress * 100)}%` }} />
            </span>
          ) : null}
        </div>
        {onRemove ? (
          <button
            type="button"
            className="retroma-attachment-chip-remove"
            aria-label={`Remove ${a.name}`}
            onClick={onRemove}
          >
            ×
          </button>
        ) : null}
      </li>
    );
  },
);
