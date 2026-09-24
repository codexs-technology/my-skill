import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Project } from '../data/projects';

type LightboxProps = {
  project: Project | null;
  onClose: () => void;
};

/**
 * Accessible image viewer: closes on X, Escape or backdrop click, moves focus to
 * the close button on open and restores it afterwards. Tall website screenshots
 * are shown at full width inside a vertically scrollable area.
 */
export default function Lightbox({ project, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} — full-size screenshot`}
        className="relative w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <figure className="overflow-hidden rounded-2xl border border-white/15 bg-ink-900 shadow-2xl">
          <div className="relative max-h-[78vh] overflow-y-auto scroll-strip">
            <img src={project.image} alt={project.imageAlt} className="h-auto w-full" />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close image viewer"
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink-950/70 text-white backdrop-blur transition-colors hover:bg-ink-950"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-sm text-slate-200">
            <span className="font-semibold">{project.title}</span>
            {project.context ? (
              <span className="text-xs text-slate-400">{project.context}</span>
            ) : null}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
