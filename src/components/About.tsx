import { Award, CheckCircle2, Globe2, GraduationCap, MapPin } from 'lucide-react';
import { profile } from '../data/profile';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

const quickFacts = [
  { icon: MapPin, label: 'Based in', value: 'Karachi, Pakistan' },
  { icon: Globe2, label: 'Working with', value: 'Clients in the USA, Canada, UK & Australia' },
  { icon: Award, label: 'Founder', value: 'Codex Technology SMC Pvt Ltd' },
  { icon: GraduationCap, label: 'Education', value: 'Computer Science, Government Boys Degree College, Karachi (2016)' },
];

export default function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeading
        id="about-title"
        eyebrow="About"
        title="Full stack delivery with a marketing brain"
        description="I build products end to end and pay attention to whether they actually bring in business."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="space-y-5 text-base leading-relaxed muted">
            {profile.about.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 0.05}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <h3 className="mt-10 text-lg font-semibold">What you get working with me</h3>
            <ul className="mt-4 space-y-3">
              {profile.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-sm muted sm:text-base">
                  <CheckCircle2
                    size={18}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider muted">Quick facts</h3>
            <dl className="mt-5 space-y-5">
              {quickFacts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                  >
                    <Icon size={16} />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide muted">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <a
              href="#contact"
              className="btn btn-primary mt-7 w-full"
            >
              Let&apos;s work together
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
