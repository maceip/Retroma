import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface KanbanBoardProps extends HTMLAttributes<HTMLDivElement> {}

export const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(
  function KanbanBoard({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="kanban-board"
        className={cn("kanban-plugin__board retroma-kanban", className)}
        {...rest}
      >
        <div className="retroma-kanban-columns">{children}</div>
      </div>
    );
  },
);

export interface KanbanColumnProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Column title (e.g., "Backlog"). */
  title: ReactNode;
  /** Optional count badge. */
  count?: number | string;
  /** Header controls (menu, add button). */
  controls?: ReactNode;
}

export const KanbanColumn = forwardRef<HTMLDivElement, KanbanColumnProps>(
  function KanbanColumn({ title, count, controls, className, children, ...rest }, ref) {
    return (
      <section
        ref={ref}
        data-slot="kanban-column"
        className={cn("kanban-plugin__lane retroma-kanban-column", className)}
        {...rest}
      >
        <header className="retroma-kanban-column-header">
          <span className="retroma-kanban-column-title">{title}</span>
          {count !== undefined ? (
            <span className="retroma-kanban-column-count">{count}</span>
          ) : null}
          <span style={{ flex: 1 }} />
          {controls}
        </header>
        <div className="retroma-kanban-column-body">{children}</div>
      </section>
    );
  },
);

export interface KanbanCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Card title. */
  title?: ReactNode;
  /** Tag row / metadata below the content. */
  footer?: ReactNode;
}

export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(
  function KanbanCard({ title, footer, className, children, ...rest }, ref) {
    return (
      <article
        ref={ref}
        data-slot="kanban-card"
        className={cn("kanban-plugin__item retroma-kanban-card", className)}
        {...rest}
      >
        {title ? <div className="retroma-kanban-card-title">{title}</div> : null}
        {children ? <div className="retroma-kanban-card-body">{children}</div> : null}
        {footer ? <div className="retroma-kanban-card-footer">{footer}</div> : null}
      </article>
    );
  },
);
