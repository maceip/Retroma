import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Model                                                                     */
/* -------------------------------------------------------------------------- */

export interface CitationSourceInput {
  /** Canonical URL of the source. */
  url: string;
  /** Optional title (used if provided, otherwise derived from the URL). */
  title?: string;
  /** Favicon override. */
  faviconUrl?: string;
}

export interface ResolvedCitation {
  url: string;
  title: string;
  host: string;
  siteName: string;
  faviconUrl: string;
}

export function rootDomainSiteName(url: URL): string {
  const host = url.host.replace(/^www\./, "");
  const parts = host.split(".");
  if (parts.length <= 2) return parts[0] ?? host;
  return parts[parts.length - 2] ?? host;
}

export function resolveCitationSource(
  input: CitationSourceInput | string,
): ResolvedCitation {
  const src: CitationSourceInput =
    typeof input === "string" ? { url: input } : input;
  let url: URL;
  try {
    url = new URL(src.url);
  } catch {
    return {
      url: src.url,
      title: src.title ?? src.url,
      host: src.url,
      siteName: src.url,
      faviconUrl: src.faviconUrl ?? "",
    };
  }
  return {
    url: src.url,
    title: src.title ?? decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() ?? url.host),
    host: url.host,
    siteName: rootDomainSiteName(url),
    faviconUrl:
      src.faviconUrl ??
      `https://www.google.com/s2/favicons?sz=64&domain=${url.host}`,
  };
}

export function resolveCitationSources(
  sources: ReadonlyArray<CitationSourceInput | string>,
): ResolvedCitation[] {
  return sources.map(resolveCitationSource);
}

/* -------------------------------------------------------------------------- */
/*  Components                                                                */
/* -------------------------------------------------------------------------- */

export interface CitationProps extends HTMLAttributes<HTMLSpanElement> {
  /** Inline index shown in the badge (defaults to the index prop). */
  index?: number;
  /** Sources feeding the citation — first one powers the inline badge. */
  sources: ReadonlyArray<CitationSourceInput | string>;
  /** Render style: `inline` puts a small numbered pill inline with text;
   *  `card` renders a full preview card. */
  variant?: "inline" | "card";
}

export const Citation = forwardRef<HTMLSpanElement, CitationProps>(
  function Citation({ index, sources, variant = "inline", className, ...rest }, ref) {
    const resolved = useMemo(() => resolveCitationSources(sources), [sources]);
    const first = resolved[0];
    if (!first) return null;
    if (variant === "card") {
      return (
        <span
          ref={ref}
          data-slot="citation"
          className={cn("retroma-citation-card", className)}
          {...rest}
        >
          {resolved.map((r, i) => (
            <CitationCard key={i} citation={r} />
          ))}
        </span>
      );
    }
    return (
      <a
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        href={first.url}
        target="_blank"
        rel="noopener noreferrer"
        data-slot="citation"
        className={cn("retroma-citation-inline", className)}
        title={`${first.siteName} · ${first.url}`}
        {...(rest as HTMLAttributes<HTMLAnchorElement>)}
      >
        {index !== undefined ? (
          <span className="retroma-citation-inline-index">{index}</span>
        ) : null}
        {first.faviconUrl ? (
          <img
            className="retroma-citation-inline-favicon"
            src={first.faviconUrl}
            alt=""
            width={12}
            height={12}
            loading="lazy"
          />
        ) : null}
        <span className="retroma-citation-inline-site">{first.siteName}</span>
      </a>
    );
  },
);

function CitationCard({
  citation,
  children,
}: {
  citation: ResolvedCitation;
  children?: ReactNode;
}) {
  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="retroma-citation-card-item"
    >
      {citation.faviconUrl ? (
        <img
          className="retroma-citation-card-favicon"
          src={citation.faviconUrl}
          alt=""
          width={16}
          height={16}
          loading="lazy"
        />
      ) : null}
      <div className="retroma-citation-card-body">
        <div className="retroma-citation-card-title">{citation.title}</div>
        <div className="retroma-citation-card-host">{citation.host}</div>
        {children}
      </div>
    </a>
  );
}
