import { Briefcase, GraduationCap } from 'lucide-react';
import { experience } from '../data/experience';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

export default function Experience() {
  return (
    <Section id="experience" labelledBy="experience-title">
      <SectionHeading
        id="experience-title"
        eyebrow="Experience"
        title="How I got here"
        description="A decade of shipping software and running campaigns — most of it remotely for clients outside Pakistan."
      />

      <ol className="relative mt-14 space-y-8 border-l border-slate-200 pl-6 sm:pl-8 dark:border-white/10">
        {/* Gradient accent over the timeline rail */}
        <span
          aria-hidden="true"
          className="absolute -left-px top-0 h-40 w-0.5 bg-accent-gradient"
        />

        {experience.map((item, index) => {
          const Icon = item.type === 'education' ? GraduationCap : Briefcase;
          return (
            <li key={item.id} className="relative">
              <span
                aria-hidden="true"
                className={[
                  'absolute -left-6 top-1.5 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full sm:-left-8',
                  item.current
                    ? 'bg-accent-gradient text-white shadow-glow'
                    : 'border border-slate-300 bg-white text-slate-500 dark:border-white/20 dark:bg-ink-800 dark:text-slate-400',
                ].join(' ')}
              >
                <Icon size={11} />
              </span>

              <Reveal delay={index * 0.05}>
                <div className="card card-hover p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="text-base font-semibold sm:text-lg">{item.role}</h3>
                    {item.current ? (
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                        Current
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.organisation}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                    {item.period}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed muted">{item.description}</p>

                  {item.bullets ? (
                    <ul className="mt-4 space-y-2">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2.5 text-sm muted">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gradient" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
