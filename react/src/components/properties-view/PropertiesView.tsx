import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  PropertiesView (container — optional)                                     */
/* -------------------------------------------------------------------------- */

export interface PropertiesViewProps extends HTMLAttributes<HTMLDivElement> {}

export const PropertiesView = forwardRef<HTMLDivElement, PropertiesViewProps>(
  function PropertiesView({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("metadata-container", className)}
        {...rest}
      >
        <div className="metadata-properties">{children}</div>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  PropertyRow                                                               */
/* -------------------------------------------------------------------------- */

export interface PropertyRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Marks the row as currently focused/selected. */
  selected?: boolean;
}

export const PropertyRow = forwardRef<HTMLDivElement, PropertyRowProps>(
  function PropertyRow({ selected, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "metadata-property",
          selected && "is-selected",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  PropertyKey                                                               */
/* -------------------------------------------------------------------------- */

export interface PropertyKeyProps extends HTMLAttributes<HTMLDivElement> {
  /** Label text for the property. */
  name: ReactNode;
  /** Optional icon (use <PropertyIcon/>). */
  icon?: ReactNode;
}

export const PropertyKey = forwardRef<HTMLDivElement, PropertyKeyProps>(
  function PropertyKey({ name, icon, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("metadata-property-key", className)}
        {...rest}
      >
        {icon}
        <span className="metadata-property-key-input">{name}</span>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  PropertyValue                                                             */
/* -------------------------------------------------------------------------- */

export type PropertyValueType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "checkbox"
  | "multiselect"
  | "aliases"
  | "tags";

export interface PropertyValueProps extends HTMLAttributes<HTMLDivElement> {
  type?: PropertyValueType;
  /** Render-prop / direct children for custom controls. */
  children?: ReactNode;
}

export const PropertyValue = forwardRef<HTMLDivElement, PropertyValueProps>(
  function PropertyValue({ type = "text", className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-property-type={type}
        className={cn(
          "metadata-property-value",
          type === "multiselect" && "multi-select-container",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  PropertyIcon                                                              */
/* -------------------------------------------------------------------------- */

export interface PropertyIconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Name of the property type (text, date, …) — used as an accessibility hint. */
  type?: PropertyValueType;
}

export const PropertyIcon = forwardRef<HTMLSpanElement, PropertyIconProps>(
  function PropertyIcon({ type, className, children, ...rest }, ref) {
    return (
      <span
        ref={ref}
        aria-label={type ? `${type} property` : undefined}
        className={cn("metadata-property-icon", className)}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
