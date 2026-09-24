import { ExternalLink, Github, Maximize2 } from 'lucide-react';
import type { Project, ProjectCategory } from '../data/projects';
import ProjectImage from './ProjectImage';

export const categoryLabels: Record<ProjectCategory, string> = {
  client: 'Client work',
  product: 'Own product',
};

type ProjectCardProps = {
  project: Project;
  /** Opens the full-size screenshot in the lightbox. */
  onOpen: (project: Project) => void;
  /** Duplicated marquee copies are hidden from assistive tech. */
  ariaHidden?: boolean;
  className?: string;
};

/** Fixed-width project card used by the marquee, the scroll strip and the grid. */
export default function ProjectCard({ project, onOpen, ariaHidden, className }: ProjectCardProps) {
  return (
    <div aria-hidden={ariaHidden || undefined} className={['h-full', className].filter(Boolean).join(' ')}>
      <article className="card card-hover flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/10] border-b border-slate-200/80 bg-slate-100 dark:border-white/10 dark:bg-ink-800">
          <button
            type="button"
            onClick={() => onOpen(project)}
            tabIndex={ariaHidden ? -1 : undefined}
            aria-label={`Open full-size screenshot of ${project.title}`}
            className="group/image block h-full w-full cursor-zoom-in overflow-hidden"
          >
            <ProjectImage src={project.image} alt={project.imageAlt} />
          </button>

          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink-950/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {categoryLabels[project.category]}
          </span>

          <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-ink-950/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
            <Maximize2 size={11} aria-hidden="true" />
            View
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-base font-semibold">{project.title}</h3>

          {project.context ? (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              {project.context}
            </p>
          ) : null}

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed muted">{project.description}</p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>

          {project.liveUrl || project.githubUrl ? (
            <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200 pt-3 dark:border-white/10">
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
    </div>
  );
}
