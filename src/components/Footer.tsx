import { ArrowUp, Github, Mail, MessageCircle, Phone } from 'lucide-react';
import { navItems } from '../data/nav';
import { profile } from '../data/profile';
import { services } from '../data/services';
import Container from './Container';

const socials = [
  { href: `mailto:${profile.email}`, label: 'Email Mehboob Masih', icon: Mail },
  { href: profile.whatsapp, label: 'WhatsApp', icon: MessageCircle, external: true },
  { href: profile.github, label: 'GitHub profile', icon: Github, external: true },
  { href: profile.phoneHref, label: 'Call Mehboob Masih', icon: Phone },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/60 dark:border-white/10 dark:bg-ink-950/60">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-xl bg-accent-gradient text-sm font-bold text-white"
              >
                {profile.initials}
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {profile.name}
              </span>
            </a>
            <p className="mt-4 max-w-md text-sm leading-relaxed muted">
              {profile.titleExtended} — founder of {profile.company}. {profile.remoteNote}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {socials.map(({ href, label, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="icon-btn"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-wider muted">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider muted">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-white/10">
          <p className="text-xs muted">
            © {year} {profile.name} · {profile.company}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={profile.resumeUrl}
              download
              className="text-xs font-semibold text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300"
            >
              Download resume (PDF)
            </a>
            <a
              href="#home"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300"
            >
              <ArrowUp size={13} aria-hidden="true" />
              Back to top
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
