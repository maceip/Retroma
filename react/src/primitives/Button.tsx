import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "default" | "primary" | "ghost" | "outline" | "warning";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Whether the button is currently active/selected. */
  active?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  default: "",
  primary: "mod-cta",
  warning: "mod-warning",
  ghost: "clickable-icon",
  outline: "",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", active, className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        variantClass[variant],
        active && "is-active",
        className,
      )}
      {...rest}
    />
  );
});
