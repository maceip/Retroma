import {
  forwardRef,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { PopoverCommandSelect, type PopoverCommandOption } from "../popover-command-select";

export interface ModelItemData {
  id: string;
  label: string;
  /** Short line used as a subtitle. */
  description?: string;
  /** Vendor tag (e.g. "Anthropic", "OpenAI"). */
  provider?: string;
  /** Token window size in thousands (e.g. 200 → 200k). */
  contextKb?: number;
  /** Optional tone — colors the pill. */
  tone?: "default" | "fast" | "smart" | "beta";
  /** Disable the option. */
  disabled?: boolean;
}

export interface ModelSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Model catalog. */
  models: readonly ModelItemData[];
  /** Current value. */
  value?: string;
  /** Fires when a model is picked. */
  onChange?: (id: string) => void;
  /** Label shown above the trigger (default "Model"). */
  label?: ReactNode;
  /** Placeholder. */
  placeholder?: string;
  /** Compact mode: drop the label, use a short trigger. */
  compact?: boolean;
}

export const ModelSelector = forwardRef<HTMLDivElement, ModelSelectorProps>(
  function ModelSelector(
    {
      models,
      value,
      onChange,
      label = "Model",
      placeholder = "choose a model",
      compact,
      className,
      ...rest
    },
    ref,
  ) {
    const options = useMemo<PopoverCommandOption[]>(
      () =>
        models.map((m) => ({
          value: m.id,
          label: m.label,
          description:
            m.description ??
            [
              m.provider,
              m.contextKb !== undefined ? `${m.contextKb}k ctx` : undefined,
              m.tone && m.tone !== "default" ? m.tone : undefined,
            ]
              .filter(Boolean)
              .join(" · "),
          disabled: m.disabled,
        })),
      [models],
    );

    return (
      <div
        ref={ref}
        data-slot="model-selector"
        className={cn(
          "retroma-model-selector",
          compact && "retroma-model-selector--compact",
          className,
        )}
        {...rest}
      >
        <PopoverCommandSelect
          label={compact ? undefined : label}
          placeholder={placeholder}
          options={options}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  },
);
