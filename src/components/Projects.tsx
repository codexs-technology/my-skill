import { useMemo, useState } from 'react';
import { Github } from 'lucide-react';
import { profile } from '../data/profile';
import { projectCategories, projects } from '../data/projects';
import type { ProjectCategory } from '../data/projects';
import ProjectsCarousel from './ProjectsCarousel';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

type Filter = ProjectCategory | 'all';

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('all');

  const visibleProjects = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  );

  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading
        id="projects-title"
        eyebrow="Projects"
        title="Selected client work & products"
        description="Real engagements and in-house builds — details are factual, with no invented metrics."
      />

      <div
        className="mt-10 flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Filter projects by category"
      >
        {projectCategories.map((category) => {
          const isActive = filter === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setFilter(category.id)}
              aria-pressed={isActive}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-accent-gradient text-white shadow-glow'
                  : 'border border-slate-200 bg-white/70 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-white',
              ].join(' ')}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <ProjectsCarousel projects={visibleProjects} />

      <Reveal delay={0.15}>
        <div className="mt-12 flex justify-center">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Github size={16} aria-hidden="true" />
            More code on GitHub
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
