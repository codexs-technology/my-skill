import { Brain, Code2, Database, Layers, Megaphone, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { skillGroups } from '../data/skills';
import type { SkillGroup } from '../data/skills';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

const icons: Record<SkillGroup['id'], LucideIcon> = {
  development: Code2,
  databases: Database,
  'ai-automation': Brain,
  devops: Wrench,
  marketing: Megaphone,
  other: Layers,
};

export default function Skills() {
  return (
    <Section id="skills" labelledBy="skills-title">
      <SectionHeading
        id="skills-title"
        eyebrow="Skills"
        title="The stack behind the work"
        description="A pragmatic toolkit — chosen to ship maintainable software quickly and keep it running."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => {
          const Icon = icons[group.id];
          return (
            <li key={group.id} className="h-full">
              <Reveal delay={index * 0.05} className="h-full">
                <article className="card card-hover h-full p-6">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                    >
                      <Icon size={18} />
                    </span>
                    <h3 className="text-base font-semibold">{group.title}</h3>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
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
    </Section>
  );
}
