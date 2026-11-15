import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { NAV_LINKS, PROFESSIONAL_DISCLAIMER, SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-10">
        <div className="grid gap-12 border-b border-ink-border pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo variant="onDark" height={52} />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ink-muted">
              {SITE.category}. {SITE.headline}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-ink-muted">Navigate</p>
            <ul className="mt-5 grid grid-cols-2 gap-y-3 md:grid-cols-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={`/${l.href}`} className="link-underline text-[0.95rem]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow text-ink-muted">Contact</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <a href={SITE.emailHref} className="link-underline break-all">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="link-underline">
                  {SITE.phone}
                </a>
              </li>
              {SITE.bookingUrl && (
                <li>
                  <a
                    href={SITE.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    Book a 15-minute clarity call ↗
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-[0.8rem] leading-relaxed text-ink-muted md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl">{PROFESSIONAL_DISCLAIMER}</p>
          <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/privacy" className="link-underline">
              Privacy information
            </Link>
            <Link to="/auth" className="link-underline">
              Owner sign-in
            </Link>
            <span>
              © {year} {SITE.name} · Est. {SITE.established}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
