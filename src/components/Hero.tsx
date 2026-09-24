import {
  ArrowRight,
  Building2,
  Download,
  Github,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { profile } from '../data/profile';
import Container from './Container';
import Reveal from './Reveal';

const coreStack = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'OpenAI', 'n8n'];

type QuickLink = { href: string; label: string; icon: LucideIcon; external?: boolean };

const quickLinks: QuickLink[] = [
  { href: `mailto:${profile.email}`, label: profile.email, icon: Mail },
  { href: profile.whatsapp, label: 'WhatsApp', icon: MessageCircle, external: true },
  { href: profile.github, label: 'GitHub', icon: Github, external: true },
];

type DetailRow = {
  icon: LucideIcon;
  srLabel: string;
  text: string;
  href?: string;
  external?: boolean;
};

const detailRows: DetailRow[] = [
  { icon: MapPin, srLabel: 'Location', text: `${profile.location} — ${profile.remoteNote}` },
  { icon: Building2, srLabel: 'Company', text: `Founder, ${profile.company}` },
  { icon: Mail, srLabel: 'Email', text: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, srLabel: 'Phone and WhatsApp', text: profile.phoneDisplay, href: profile.phoneHref },
  {
    icon: Github,
    srLabel: 'GitHub',
    text: 'github.com/codexs-technology',
    href: profile.github,
    external: true,
  },
];

export default function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative scroll-mt-20 overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36"
    >
      {/* Decorative background. Clipped inside this wrapper so the blur blobs can
          never create a horizontal scrollbar. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-gradient opacity-20 blur-3xl dark:opacity-25" />
        <div className="absolute -right-20 top-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-grid-light [background-size:44px_44px] dark:bg-grid-dark" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-slate-50 dark:to-ink-900" />
      </div>

      <Container>
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <MapPin size={14} aria-hidden="true" className="text-indigo-500" />
                {profile.location}
                <span aria-hidden="true" className="text-slate-400">
                  •
                </span>
                Remote worldwide
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1
                id="hero-title"
                className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
              >
                {profile.name}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-3 text-xl font-semibold gradient-text sm:text-2xl">
                {profile.titleExtended}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-6 max-w-xl text-base leading-relaxed muted sm:text-lg">
                {profile.pitch}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className="btn btn-primary">
                  View Projects
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a href="#contact" className="btn btn-outline">
                  Contact Me
                </a>
                <a href={profile.resumeUrl} download className="btn btn-outline">
                  <Download size={16} aria-hidden="true" />
                  Download Resume
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                {quickLinks.map(({ href, label, icon: Icon, external }) => (
                  <li key={label} className="min-w-0">
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center gap-2 font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300"
                    >
                      <Icon size={16} aria-hidden="true" className="shrink-0" />
                      <span className="break-all">{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.3} className="min-w-0">
            <div className="card p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent-gradient text-lg font-bold text-white shadow-glow"
                >
                  {profile.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {profile.name}
                  </p>
                  <p className="text-sm muted">{profile.titleExtended}</p>
                </div>
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                {detailRows.map(({ icon: Icon, srLabel, text, href, external }) => (
                  <div key={srLabel} className="flex items-start gap-3">
                    <dt className="sr-only">{srLabel}</dt>
                    <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-indigo-500" />
                    <dd className="min-w-0 muted">
                      {href ? (
                        <a
                          href={href}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="break-all font-medium text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-300"
                        >
                          {text}
                        </a>
                      ) : (
                        text
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wider muted">Core stack</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {coreStack.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

        </div>
      </Container>
    </section>
  );
}
