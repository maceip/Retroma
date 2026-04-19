import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface TaskCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Header title (e.g., "Tasks", "2025-09-03"). */
  title?: ReactNode;
  /** Right-aligned header controls. */
  controls?: ReactNode;
  /** Footer (tag row, metadata). */
  footer?: ReactNode;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard({ title, controls, footer, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="task-card"
        className={cn("retroma-task-card", className)}
        {...rest}
      >
        {(title || controls) && (
          <div className="retroma-task-card-header">
            {title ? <span className="retroma-task-card-title">{title}</span> : null}
            {controls ? <span className="retroma-task-card-controls">{controls}</span> : null}
          </div>
        )}
        <div className="retroma-task-card-body">{children}</div>
        {footer ? <div className="retroma-task-card-footer">{footer}</div> : null}
      </div>
    );
  },
);

export interface TaskItemProps extends HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (next: boolean) => void;
}

export const TaskItem = forwardRef<HTMLDivElement, TaskItemProps>(
  function TaskItem({ checked, onCheckedChange, className, children, ...rest }, ref) {
    return (
      <label className={cn("retroma-task-item", className)}>
        <input
          type="checkbox"
          checked={!!checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="retroma-task-item-checkbox"
        />
        <div
          ref={ref}
          data-slot="task-item"
          className={cn("retroma-task-item-body", checked && "is-checked")}
          {...rest}
        >
          {children}
        </div>
      </label>
    );
  },
);
