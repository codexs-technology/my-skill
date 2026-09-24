import { ArrowRight, Bot, Cloud, Code2, Palette, ShieldCheck, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { profile } from '../data/profile';
import { services } from '../data/services';
import type { Service } from '../data/services';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

const icons: Record<Service['id'], LucideIcon> = {
  software: Code2,
  ai: Bot,
  design: Palette,
  cloud: Cloud,
  data: ShieldCheck,
  marketing: TrendingUp,
};

export default function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <SectionHeading
        id="services-title"
        eyebrow="Services"
        title="What Codex Technology delivers"
        description={`Capabilities offered through ${profile.company} — from building the product to getting it in front of the right customers.`}
      />

      <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = icons[service.id];
          return (
            <li key={service.id} className="h-full">
              <Reveal delay={index * 0.05} className="h-full">
                <article className="card card-hover group flex h-full flex-col p-6">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 place-items-center rounded-xl bg-accent-gradient text-white shadow-glow transition-transform duration-300 group-hover:scale-105"
                  >
                    <Icon size={20} />
                  </span>

                  <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed muted">{service.description}</p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.items.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <Reveal delay={0.1}>
        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm muted">
          Not sure which of these you need?
          <a
            href="#contact"
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Send me the problem, not the spec
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </p>
      </Reveal>
    </Section>
  );
}
