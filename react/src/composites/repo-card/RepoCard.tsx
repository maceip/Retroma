import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface RepoCardProps extends HTMLAttributes<HTMLDivElement> {
  /** e.g. "emarpiee/Retroma" or a link / owner name. */
  owner?: ReactNode;
  /** Repository name. */
  name: ReactNode;
  /** Repo href — wraps the title in an anchor. */
  href?: string;
  /** Description / tagline. */
  description?: ReactNode;
  /** Stars count. */
  stars?: number | string;
  /** Forks count. */
  forks?: number | string;
  /** Open-issues count. */
  issues?: number | string;
  /** Primary language label. */
  language?: ReactNode;
  /** Primary language color (CSS color string). */
  languageColor?: string;
  /** Visibility tag ("public" / "private" / "internal"). */
  visibility?: "public" | "private" | "internal";
  /** Topics / tag chips below the description. */
  topics?: readonly string[];
  /** Right-aligned header actions (star button, …). */
  actions?: ReactNode;
}

function fmt(n: number | string | undefined) {
  if (n === undefined) return null;
  if (typeof n === "string") return n;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

export const RepoCard = forwardRef<HTMLDivElement, RepoCardProps>(
  function RepoCard(
    {
      owner,
      name,
      href,
      description,
      stars,
      forks,
      issues,
      language,
      languageColor,
      visibility,
      topics,
      actions,
      className,
      ...rest
    },
    ref,
  ) {
    const titleContent = (
      <>
        {owner ? <span className="retroma-repo-card-owner">{owner}</span> : null}
        {owner ? <span className="retroma-repo-card-slash">/</span> : null}
        <span className="retroma-repo-card-name">{name}</span>
      </>
    );
    return (
      <article
        ref={ref}
        data-slot="repo-card"
        className={cn("retroma-repo-card", className)}
        {...rest}
      >
        <header className="retroma-repo-card-header">
          <span className="retroma-repo-card-icon" aria-hidden="true">
            📦
          </span>
          {href ? (
            <a href={href} className="retroma-repo-card-title">
              {titleContent}
            </a>
          ) : (
            <span className="retroma-repo-card-title">{titleContent}</span>
          )}
          {visibility ? (
            <span
              className={cn(
                "retroma-repo-card-visibility",
                `retroma-repo-card-visibility--${visibility}`,
              )}
            >
              {visibility}
            </span>
          ) : null}
          {actions ? (
            <span className="retroma-repo-card-actions">{actions}</span>
          ) : null}
        </header>
        {description ? (
          <p className="retroma-repo-card-description">{description}</p>
        ) : null}
        {topics && topics.length > 0 && (
          <div className="retroma-repo-card-topics">
            {topics.map((t) => (
              <span key={t} className="retroma-repo-card-topic">
                {t}
              </span>
            ))}
          </div>
        )}
        <footer className="retroma-repo-card-footer">
          {language ? (
            <span className="retroma-repo-card-lang">
              <span
                className="retroma-repo-card-lang-dot"
                style={{ background: languageColor ?? "var(--base-accent, #8a5cf5)" }}
              />
              {language}
            </span>
          ) : null}
          {stars !== undefined ? (
            <span className="retroma-repo-card-stat">
              ★ <span>{fmt(stars)}</span>
            </span>
          ) : null}
          {forks !== undefined ? (
            <span className="retroma-repo-card-stat">
              ⎇ <span>{fmt(forks)}</span>
            </span>
          ) : null}
          {issues !== undefined ? (
            <span className="retroma-repo-card-stat">
              ● <span>{fmt(issues)}</span> issues
            </span>
          ) : null}
        </footer>
      </article>
    );
  },
);
