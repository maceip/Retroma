import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface NotePreviewCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Breadcrumb path, e.g. "07-zettels / what-is-color". */
  path?: ReactNode;
  /** Optional icons in the top-right corner. */
  controls?: ReactNode;
  /** Card image (banner). */
  image?: ReactNode;
  /** Title rendered below the path. */
  title?: ReactNode;
}

export const NotePreviewCard = forwardRef<HTMLDivElement, NotePreviewCardProps>(
  function NotePreviewCard(
    { path, controls, image, title, className, children, ...rest },
    ref,
  ) {
    return (
      <article
        ref={ref}
        data-slot="note-preview-card"
        className={cn("retroma-note-preview", className)}
        {...rest}
      >
        {(path || controls) && (
          <header className="retroma-note-preview-header">
            {path ? <span className="retroma-note-preview-path">{path}</span> : null}
            {controls ? <span className="retroma-note-preview-controls">{controls}</span> : null}
          </header>
        )}
        <div className="retroma-note-preview-body">
          {title ? <h3 className="retroma-note-preview-title">{title}</h3> : null}
          {children ? <div className="retroma-note-preview-excerpt">{children}</div> : null}
        </div>
        {image ? <div className="retroma-note-preview-image">{image}</div> : null}
      </article>
    );
  },
);
