import { useMemo, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { profile } from '../data/profile';
import { projectCategories, projects } from '../data/projects';
import type { ProjectCategory } from '../data/projects';
import ProjectImage from './ProjectImage';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

type Filter = ProjectCategory | 'all';

const categoryLabels: Record<ProjectCategory, string> = {
  client: 'Client work',
  product: 'Own product',
};

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

      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project, index) => (
          <li key={project.id} className="h-full">
            <Reveal delay={(index % 3) * 0.05} className="h-full">
              <article className="card card-hover group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-200/80 bg-slate-100 dark:border-white/10 dark:bg-ink-800">
                  <ProjectImage src={project.image} alt={project.imageAlt} />
                  <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    {categoryLabels[project.category]}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold">{project.title}</h3>

                  {project.context ? (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                      {project.context}
                    </p>
                  ) : null}

                  <p className="mt-3 text-sm leading-relaxed muted">{project.description}</p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  {project.liveUrl || project.githubUrl ? (
                    <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Live site
                          <ExternalLink size={14} aria-hidden="true" />
                          <span className="sr-only">for {project.title} (opens in a new tab)</span>
                        </a>
                      ) : null}
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          <Github size={14} aria-hidden="true" />
                          Source code
                          <span className="sr-only">for {project.title} (opens in a new tab)</span>
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      {/*
        DEV NOTE: this highlighted box reminds you that the artwork is temporary.
        Delete the block below once real screenshots are in public/projects/.
      */}
      <Reveal delay={0.1}>
        <p className="mt-10 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/60 px-4 py-3 text-center text-xs font-medium text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/5 dark:text-indigo-300">
          Project images are placeholders — drop real screenshots into
          <code className="mx-1 rounded bg-white/70 px-1.5 py-0.5 font-mono dark:bg-white/10">
            public/projects/
          </code>
          and they appear here automatically.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-10 flex justify-center">
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
