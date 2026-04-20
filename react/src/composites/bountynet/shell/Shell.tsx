import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shell context — exposes the active route + setter to descendants so the   */
/*  CommandPalette can navigate without React Router.                         */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  /** Route path, e.g. "/marketplace". */
  path: string;
  /** Label used in the nav strip + command palette. */
  label: string;
  /** Optional icon (any ReactNode). */
  icon?: ReactNode;
  /** Search keywords for the command palette. */
  keywords?: string[];
  /** Hide from the visible nav (still in the palette). */
  paletteOnly?: boolean;
}

interface BountyNetShellCtx {
  brand: ReactNode;
  logoSrc?: string;
  navItems: NavItem[];
  activePath: string;
  navigate: (path: string) => void;
  openPalette: () => void;
}

const ShellCtx = createContext<BountyNetShellCtx | null>(null);
export function useBountyNetShell() {
  const ctx = useContext(ShellCtx);
  if (!ctx) throw new Error("BountyNet shell parts must be inside <AppShell>.");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  AppShell                                                                  */
/* -------------------------------------------------------------------------- */

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Brand label rendered in the header. */
  brand?: ReactNode;
  /** Optional logo image (e.g. /brand/globe-64.png). */
  logoSrc?: string;
  /** Routes exposed in the header nav + command palette. */
  navItems: NavItem[];
  /** Active path (controlled). */
  activePath: string;
  /** Called when a nav item or command palette entry is selected. */
  onNavigate: (path: string) => void;
  /** Optional bottom-fixed status rail (e.g. <StatusRail/>). */
  statusRail?: ReactNode;
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  function AppShell(
    {
      brand = "BountyNet",
      logoSrc,
      navItems,
      activePath,
      onNavigate,
      statusRail,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [paletteOpen, setPaletteOpen] = useState(false);

    const navigate = useCallback(
      (path: string) => {
        setPaletteOpen(false);
        onNavigate(path);
      },
      [onNavigate],
    );

    const openPalette = useCallback(() => setPaletteOpen(true), []);

    const ctx = useMemo<BountyNetShellCtx>(
      () => ({ brand, logoSrc, navItems, activePath, navigate, openPalette }),
      [brand, logoSrc, navItems, activePath, navigate, openPalette],
    );

    return (
      <ShellCtx.Provider value={ctx}>
        <div
          ref={ref}
          data-slot="bn-app-shell"
          className={cn("bn-app-shell", className)}
          {...rest}
        >
          {children}
          {statusRail ? <div className="bn-app-shell-rail">{statusRail}</div> : null}

          <BountyNetCommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            navItems={navItems}
            navigate={navigate}
          />
        </div>
      </ShellCtx.Provider>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  AppHeader                                                                 */
/* -------------------------------------------------------------------------- */

export interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Right-aligned slot for actions (settings cog, persona switcher, …). */
  trailing?: ReactNode;
}

export const AppHeader = forwardRef<HTMLElement, AppHeaderProps>(
  function AppHeader({ trailing, className, ...rest }, ref) {
    const shell = useBountyNetShell();
    return (
      <header
        ref={ref}
        data-slot="bn-app-header"
        className={cn("bn-app-header", className)}
        {...rest}
      >
        <div className="bn-app-header-brand">
          {shell.logoSrc ? (
            <img src={shell.logoSrc} alt="" className="bn-app-header-logo" />
          ) : (
            <span className="bn-app-header-logo bn-app-header-logo--glyph">◉</span>
          )}
          <span className="bn-app-header-name">{shell.brand}</span>
        </div>
        <button
          type="button"
          className="bn-app-header-palette"
          onClick={shell.openPalette}
        >
          <span className="bn-app-header-palette-icon">⌕</span>
          <span>open command palette</span>
          <kbd className="bn-app-header-palette-kbd">⌘K</kbd>
        </button>
        <AppNav />
        {trailing ? <div className="bn-app-header-trailing">{trailing}</div> : null}
      </header>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  AppNav                                                                    */
/* -------------------------------------------------------------------------- */

export interface AppNavProps extends HTMLAttributes<HTMLElement> {}

export const AppNav = forwardRef<HTMLElement, AppNavProps>(function AppNav(
  { className, ...rest },
  ref,
) {
  const shell = useBountyNetShell();
  return (
    <nav
      ref={ref}
      data-slot="bn-app-nav"
      className={cn("bn-app-nav", className)}
      {...rest}
    >
      {shell.navItems
        .filter((item) => !item.paletteOnly)
        .map((item) => (
          <button
            key={item.path}
            type="button"
            data-active={shell.activePath === item.path ? "true" : undefined}
            className="bn-app-nav-link"
            onClick={() => shell.navigate(item.path)}
          >
            {item.icon ? <span className="bn-app-nav-icon">{item.icon}</span> : null}
            <span>{item.label}</span>
          </button>
        ))}
    </nav>
  );
});

/* -------------------------------------------------------------------------- */
/*  PageLayout / PageHero / PageSection                                       */
/* -------------------------------------------------------------------------- */

export interface PageLayoutProps extends HTMLAttributes<HTMLElement> {}

export const PageLayout = forwardRef<HTMLElement, PageLayoutProps>(
  function PageLayout({ className, children, ...rest }, ref) {
    return (
      <main
        ref={ref}
        data-slot="bn-page-layout"
        className={cn("bn-page-layout", className)}
        {...rest}
      >
        {children}
      </main>
    );
  },
);

export interface PageHeroProps extends HTMLAttributes<HTMLDivElement> {
  /** Small label above the headline ("marketplace · jobs"). */
  label?: ReactNode;
  /** Big headline. */
  headline: ReactNode;
  /** Body copy under the headline. */
  body?: ReactNode;
  /** CTA buttons / links rendered below the body. */
  ctas?: ReactNode;
}

export const PageHero = forwardRef<HTMLDivElement, PageHeroProps>(
  function PageHero({ label, headline, body, ctas, className, ...rest }, ref) {
    return (
      <section
        ref={ref}
        data-slot="bn-page-hero"
        className={cn("bn-page-hero", className)}
        {...rest}
      >
        {label ? <div className="bn-page-hero-label">{label}</div> : null}
        <h1 className="bn-page-hero-headline">{headline}</h1>
        {body ? <p className="bn-page-hero-body">{body}</p> : null}
        {ctas ? <div className="bn-page-hero-ctas">{ctas}</div> : null}
      </section>
    );
  },
);

export interface PageSectionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Section title (rendered as a band above content). */
  title?: ReactNode;
  /** Subtitle / hint below the title. */
  hint?: ReactNode;
  /** Right-aligned controls in the title band. */
  controls?: ReactNode;
}

export const PageSection = forwardRef<HTMLDivElement, PageSectionProps>(
  function PageSection({ title, hint, controls, className, children, ...rest }, ref) {
    return (
      <section
        ref={ref}
        data-slot="bn-page-section"
        className={cn("bn-page-section", className)}
        {...rest}
      >
        {(title || controls) && (
          <header className="bn-page-section-head">
            <div className="bn-page-section-titles">
              {title ? <h2 className="bn-page-section-title">{title}</h2> : null}
              {hint ? <p className="bn-page-section-hint">{hint}</p> : null}
            </div>
            {controls ? <div className="bn-page-section-controls">{controls}</div> : null}
          </header>
        )}
        <div className="bn-page-section-body">{children}</div>
      </section>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Internal — minimal command palette tied to the shell context.             */
/* -------------------------------------------------------------------------- */

function BountyNetCommandPalette({
  open,
  onClose,
  navItems,
  navigate,
}: {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  navigate: (path: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return navItems;
    return navItems.filter((item) => {
      const hay = [item.label, item.path, ...(item.keywords ?? [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [navItems, query]);

  if (!open) return null;
  return (
    <div className="bn-command-palette-backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="bn-command-palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bn-command-palette-input">
          <span className="bn-command-palette-input-icon">⌕</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="jump to route…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered[0]) navigate(filtered[0].path);
              if (e.key === "Escape") onClose();
            }}
          />
        </div>
        <ul className="bn-command-palette-list">
          {filtered.length === 0 ? (
            <li className="bn-command-palette-empty">no matches</li>
          ) : (
            filtered.map((item) => (
              <li key={item.path}>
                <button
                  type="button"
                  className="bn-command-palette-row"
                  onClick={() => navigate(item.path)}
                >
                  {item.icon ? (
                    <span className="bn-command-palette-row-icon">{item.icon}</span>
                  ) : null}
                  <span>{item.label}</span>
                  <span className="bn-command-palette-row-path">{item.path}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
