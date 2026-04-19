import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Theme model — mirrors Retroma's Style Settings panel.                     */
/* -------------------------------------------------------------------------- */

export type RetromaColorScheme =
  | "analogous"
  | "split-complementary"
  | "monochromatic"
  | "triadic";

export type RetromaVariant = "groovy" | "simple" | "minimalist";

export type RetromaRadiusSize = "sharp" | "large";

export interface RetromaThemeState {
  /** Theme light/dark mode. */
  mode: "light" | "dark";
  /** Base accent color (hex). Drives the entire oklch palette. */
  accent: string;
  /** Classic color-harmony preset — sets the two accent rotations. */
  colorScheme: RetromaColorScheme;
  /** Decorative variant. Switches border / shadow intensity. */
  variant: RetromaVariant;
  /** Window corner radius. */
  windowRadius: RetromaRadiusSize;
  /** Button corner radius. */
  buttonRadius: RetromaRadiusSize;
  /** Dark-mode base lightness (0–0.4). */
  darkLightness: number;
  /** Main accent hue rotation (degrees). */
  mainRotation: number;
  /** Minor accent hue rotation (degrees). */
  minorRotation: number;
}

export const defaultThemeState: RetromaThemeState = {
  mode: "light",
  accent: "#8a5cf5",
  colorScheme: "analogous",
  variant: "groovy",
  windowRadius: "large",
  buttonRadius: "large",
  darkLightness: 0.24,
  mainRotation: 330,
  minorRotation: 30,
};

/* -------------------------------------------------------------------------- */
/*  Scheme presets                                                            */
/* -------------------------------------------------------------------------- */

const schemeRotations: Record<
  RetromaColorScheme,
  { main: number; minor: number }
> = {
  analogous: { main: 330, minor: 30 },
  "split-complementary": { main: 150, minor: 210 },
  monochromatic: { main: 0, minor: 0 },
  triadic: { main: 120, minor: 240 },
};

const radiusValues: Record<RetromaRadiusSize, { window: string; button: string }> = {
  sharp: { window: "2px", button: "2px" },
  large: { window: "12px", button: "8px" },
};

const variantTokens: Record<
  RetromaVariant,
  {
    ridge: string;
    groove: string;
    shadow: string;
    shadowSm: string;
    shadowActive: string;
    shadowActiveSm: string;
    borderWidth: string;
  }
> = {
  groovy: {
    ridge: "4px ridge var(--background-primary)",
    groove: "4px groove var(--background-primary-alt)",
    shadow:
      "inset -2px -2px oklch(from var(--background-secondary) 50% c h), inset 2px 2px oklch(from var(--background-secondary) 100% c h)",
    shadowSm:
      "inset -1px -1px oklch(from var(--background-secondary) 50% c h), inset 1px 1px oklch(from var(--background-secondary) 100% c h)",
    shadowActive:
      "inset 2px 2px oklch(from var(--background-secondary) 50% c h), inset -2px -2px oklch(from var(--background-secondary) 100% c h)",
    shadowActiveSm:
      "inset 1px 1px oklch(from var(--background-secondary) 50% c h), inset -1px -1px oklch(from var(--background-secondary) 100% c h)",
    borderWidth: "1px",
  },
  simple: {
    ridge: "2px solid var(--background-primary)",
    groove: "2px solid var(--background-primary-alt)",
    shadow: "0 1px 2px oklch(from black l c h / 20%)",
    shadowSm: "0 1px 1px oklch(from black l c h / 14%)",
    shadowActive: "inset 0 1px 2px oklch(from black l c h / 20%)",
    shadowActiveSm: "inset 0 1px 1px oklch(from black l c h / 14%)",
    borderWidth: "1px",
  },
  minimalist: {
    ridge: "1px solid var(--outline-color)",
    groove: "1px solid var(--outline-color)",
    shadow: "none",
    shadowSm: "none",
    shadowActive: "none",
    shadowActiveSm: "none",
    borderWidth: "1px",
  },
};

/* -------------------------------------------------------------------------- */
/*  Apply state -> CSS variables on a host element                            */
/* -------------------------------------------------------------------------- */

function applyTheme(host: HTMLElement, state: RetromaThemeState) {
  /* theme.css's `.theme-light { ... }` and `.theme-dark { ... }` blocks
   * hold the palette tokens. Toggle both the host (e.g. <body>) and
   * <html> so descendants match regardless of which ancestor is queried. */
  host.classList.toggle("theme-light", state.mode === "light");
  host.classList.toggle("theme-dark", state.mode === "dark");
  if (typeof document !== "undefined" && host !== document.documentElement) {
    document.documentElement.classList.toggle("theme-light", state.mode === "light");
    document.documentElement.classList.toggle("theme-dark", state.mode === "dark");
  }
  host.dataset.retromaVariant = state.variant;

  const windowR = radiusValues[state.windowRadius].window;
  const buttonR = radiusValues[state.buttonRadius].button;

  /* Inline style on `host` (body) beats theme.css's
   * `body { --rotation-1: 30 }` rule so the tuner actually drives things. */
  host.style.setProperty("--interactive-accent", state.accent);
  host.style.setProperty("--rotation-1", String(state.minorRotation));
  host.style.setProperty("--rotation-2", String(state.mainRotation));
  host.style.setProperty("--window-border-radius", windowR);
  host.style.setProperty("--button-border-radius", buttonR);
  host.style.setProperty("--radius-m", buttonR);
  host.style.setProperty("--radius-s", buttonR);
  host.style.setProperty("--radius-xs", buttonR);
  host.style.setProperty("--lightness-accent", String(state.darkLightness));

  const v = variantTokens[state.variant];
  host.style.setProperty("--border-ridge", v.ridge);
  host.style.setProperty("--border-groove", v.groove);
  host.style.setProperty("--box-shadow", v.shadow);
  host.style.setProperty("--box-shadow-sm", v.shadowSm);
  host.style.setProperty("--box-shadow-active", v.shadowActive);
  host.style.setProperty("--box-shadow-active-sm", v.shadowActiveSm);
  host.style.setProperty("--border-width", v.borderWidth);
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

interface ThemeTunerContext {
  state: RetromaThemeState;
  setState: React.Dispatch<React.SetStateAction<RetromaThemeState>>;
}

const ThemeTunerCtx = createContext<ThemeTunerContext | null>(null);

function useTuner() {
  const ctx = useContext(ThemeTunerCtx);
  if (!ctx)
    throw new Error("ThemeTuner parts must be inside <ThemeTunerProvider>.");
  return ctx;
}

export interface ThemeTunerProviderProps {
  /** Where to write the CSS custom properties. Defaults to `document.body`
   * because theme.css declares its `--rotation-*` / `--base-accent` tokens
   * at `body`, and inline style on body wins the cascade. */
  target?: "body" | "document" | HTMLElement | null;
  /** Initial state. */
  initial?: Partial<RetromaThemeState>;
  /** Controlled state. */
  value?: RetromaThemeState;
  /** Change callback (fires on any tuner change). */
  onValueChange?: (state: RetromaThemeState) => void;
  children?: ReactNode;
}

export function ThemeTunerProvider({
  target = "body",
  initial,
  value: controlled,
  onValueChange,
  children,
}: ThemeTunerProviderProps) {
  const [uncontrolled, setUncontrolled] = useState<RetromaThemeState>({
    ...defaultThemeState,
    ...initial,
  });
  const state = controlled ?? uncontrolled;

  const setState = useCallback<React.Dispatch<React.SetStateAction<RetromaThemeState>>>(
    (next) => {
      setUncontrolled((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        onValueChange?.(resolved);
        return resolved;
      });
    },
    [onValueChange],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    let host: HTMLElement | null = null;
    if (target === "body") host = document.body;
    else if (target === "document") host = document.documentElement;
    else if (target instanceof HTMLElement) host = target;
    if (!host) return;
    applyTheme(host, state);
  }, [state, target]);

  const ctx = useMemo(() => ({ state, setState }), [state, setState]);
  return <ThemeTunerCtx.Provider value={ctx}>{children}</ThemeTunerCtx.Provider>;
}

/* -------------------------------------------------------------------------- */
/*  Shared small UI                                                           */
/* -------------------------------------------------------------------------- */

function Row({
  name,
  hint,
  children,
}: {
  name: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="retroma-tuner-row">
      <div className="retroma-tuner-row-info">
        <div className="retroma-tuner-row-name">{name}</div>
        {hint ? <div className="retroma-tuner-row-hint">{hint}</div> : null}
      </div>
      <div className="retroma-tuner-row-control">{children}</div>
    </div>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
}) {
  return (
    <select
      className="retroma-tuner-select"
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as T)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="retroma-tuner-color">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <code>{value.toUpperCase()}</code>
    </div>
  );
}

function NumberSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="retroma-tuner-slider">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <code>
        {value}
        {unit ?? ""}
      </code>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ThemeTunerPanel — composes every tuner row                                */
/* -------------------------------------------------------------------------- */

export interface ThemeTunerPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Hide the advanced Color Scheme Tuner section. */
  hideAdvanced?: boolean;
}

export const ThemeTunerPanel = forwardRef<HTMLDivElement, ThemeTunerPanelProps>(
  function ThemeTunerPanel({ className, hideAdvanced, ...rest }, ref) {
    const { state, setState } = useTuner();
    const set = <K extends keyof RetromaThemeState>(
      key: K,
      value: RetromaThemeState[K],
    ) => setState((s) => ({ ...s, [key]: value }));

    return (
      <div
        ref={ref}
        data-slot="theme-tuner"
        className={cn("retroma-tuner", className)}
        {...rest}
      >
        <div className="retroma-tuner-heading">Retroma Theme</div>

        <Row name="Mode" hint="Light or dark base.">
          <Select
            value={state.mode}
            onChange={(v) => set("mode", v)}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </Row>

        <Row name="Base accent" hint="One color to rule them all.">
          <ColorInput value={state.accent} onChange={(v) => set("accent", v)} />
        </Row>

        <Row
          name="Color scheme"
          hint="Classic harmony rules applied to your base accent."
        >
          <Select
            value={state.colorScheme}
            onChange={(v) => {
              const rot = schemeRotations[v];
              setState((s) => ({
                ...s,
                colorScheme: v,
                mainRotation: rot.main,
                minorRotation: rot.minor,
              }));
            }}
            options={[
              { value: "analogous", label: "Analogous (Default)" },
              { value: "split-complementary", label: "Split Complementary" },
              { value: "monochromatic", label: "Monochromatic" },
              { value: "triadic", label: "Triadic" },
            ]}
          />
        </Row>

        <Row name="Variant" hint="Depth / border personality.">
          <Select
            value={state.variant}
            onChange={(v) => set("variant", v)}
            options={[
              { value: "groovy", label: "Groovy (Default)" },
              { value: "simple", label: "Simple" },
              { value: "minimalist", label: "Minimalist" },
            ]}
          />
        </Row>

        <Row name="Theme border radius">
          <Select
            value={state.windowRadius}
            onChange={(v) => set("windowRadius", v)}
            options={[
              { value: "large", label: "Large (Default)" },
              { value: "sharp", label: "Sharp" },
            ]}
          />
        </Row>

        <Row name="Button border radius">
          <Select
            value={state.buttonRadius}
            onChange={(v) => set("buttonRadius", v)}
            options={[
              { value: "large", label: "Large (Default)" },
              { value: "sharp", label: "Sharp" },
            ]}
          />
        </Row>

        <Row name="Dark mode lightness" hint="Base L* for dark mode surfaces.">
          <NumberSlider
            value={state.darkLightness}
            onChange={(v) => set("darkLightness", v)}
            min={0.1}
            max={0.4}
            step={0.01}
          />
        </Row>

        {!hideAdvanced && (
          <>
            <div className="retroma-tuner-subheading">
              Color Scheme Tuner (advance)
            </div>
            <Row
              name="Main accents"
              hint="Rotation from the base accent. Powers h2/h4/headings."
            >
              <NumberSlider
                value={state.mainRotation}
                onChange={(v) => set("mainRotation", v)}
                min={0}
                max={360}
                unit="°"
              />
            </Row>
            <Row
              name="Minor accents"
              hint="Rotation for the complementary palette."
            >
              <NumberSlider
                value={state.minorRotation}
                onChange={(v) => set("minorRotation", v)}
                min={0}
                max={360}
                unit="°"
              />
            </Row>
          </>
        )}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Convenience hook                                                          */
/* -------------------------------------------------------------------------- */

export function useRetromaTheme() {
  return useTuner();
}
