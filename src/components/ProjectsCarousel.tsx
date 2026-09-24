import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../data/projects';
import Lightbox from './Lightbox';
import ProjectCard from './ProjectCard';

/** Identical width classes in every mode so the track maths stay exact. */
const CARD_WIDTH_CLASS = 'w-[280px] shrink-0 sm:w-[340px] lg:w-[360px]';
const GAP_PX = 24; // mr-6 / gap-6
const MARQUEE_SECONDS = 55;
const MIN_CARDS_FOR_MARQUEE = 4;
/** Movement beyond this (px) counts as a drag, not a click. */
const CLICK_MOVE_TOLERANCE = 8;

type ProjectsCarouselProps = {
  projects: Project[];
};

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const reduceMotion = useReducedMotion();

  const [advance, setAdvance] = useState(0); // seconds of animation already scrolled
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [touchHold, setTouchHold] = useState(false);
  const [lightbox, setLightbox] = useState<Project | null>(null);
  const [suppressClick, setSuppressClick] = useState(false);
  const [copyWidth, setCopyWidth] = useState(0);
  const [stepWidth, setStepWidth] = useState(0);

  const marqueeViewportRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLUListElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ pointerId: number; startX: number; moved: number } | null>(null);
  const touchTimer = useRef<number | undefined>(undefined);

  const count = projects.length;
  const mode: 'marquee' | 'scroll' | 'grid' =
    count < MIN_CARDS_FOR_MARQUEE ? 'grid' : reduceMotion ? 'scroll' : 'marquee';

  // Reset the manual offset whenever the visible set changes (filter switch).
  useEffect(() => {
    setAdvance(0);
    setDragX(0);
    dragState.current = null;
  }, [projects]);

  // Measure one copy of the track so the loop and the arrow steps are exact.
  useEffect(() => {
    const measure = () => {
      if (mode === 'marquee' && copyRef.current) {
        const first = copyRef.current.firstElementChild as HTMLElement | null;
        setCopyWidth(copyRef.current.getBoundingClientRect().width);
        if (first) {
          const gap = Number.parseFloat(window.getComputedStyle(first).marginRight) || GAP_PX;
          setStepWidth(first.getBoundingClientRect().width + gap);
        }
        return;
      }
      if (scrollRef.current) {
        const first = scrollRef.current.firstElementChild as HTMLElement | null;
        setCopyWidth(0);
        if (first) setStepWidth(first.getBoundingClientRect().width + GAP_PX);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [mode, projects]);

  useEffect(() => () => window.clearTimeout(touchTimer.current), []);

  /** Move the track by `px` (positive moves content right / shows earlier cards). */
  const shiftBy = useCallback(
    (px: number) => {
      if (copyWidth <= 0) return;
      const pixelsPerSecond = copyWidth / MARQUEE_SECONDS;
      setAdvance((previous) => {
        const next = previous - px / pixelsPerSecond;
        return ((next % MARQUEE_SECONDS) + MARQUEE_SECONDS) % MARQUEE_SECONDS;
      });
    },
    [copyWidth],
  );

  const scrollStripBy = useCallback(
    (direction: -1 | 1) => {
      scrollRef.current?.scrollBy({ left: direction * (stepWidth || 320), behavior: 'smooth' });
    },
    [stepWidth],
  );

  const goPrev = useCallback(() => {
    if (mode === 'scroll') scrollStripBy(-1);
    else shiftBy(stepWidth || 320);
  }, [mode, scrollStripBy, shiftBy, stepWidth]);

  const goNext = useCallback(() => {
    if (mode === 'scroll') scrollStripBy(1);
    else shiftBy(-(stepWidth || 320));
  }, [mode, scrollStripBy, shiftBy, stepWidth]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (mode !== 'marquee' || (event.pointerType === 'mouse' && event.button !== 0)) return;
    setSuppressClick(false);
    dragState.current = { pointerId: event.pointerId, startX: event.clientX, moved: 0 };
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state) return;
    state.moved = event.clientX - state.startX;
    setDragX(state.moved);
  };

  /**
   * Ends a drag. Deliberately no `setPointerCapture`: capturing retargets the
   * following `click` to this wrapper, which would stop card clicks from opening
   * the lightbox. A window-level release listener covers releases outside the track.
   */
  const endDrag = useCallback(() => {
    const state = dragState.current;
    dragState.current = null;
    setDragging(false);
    setDragX(0);
    if (!state) return;
    if (state.moved !== 0) shiftBy(state.moved);
    setSuppressClick(Math.abs(state.moved) > CLICK_MOVE_TOLERANCE);
  }, [shiftBy]);

  useEffect(() => {
    if (!dragging) return;
    const onRelease = () => endDrag();
    window.addEventListener('pointerup', onRelease);
    window.addEventListener('pointercancel', onRelease);
    return () => {
      window.removeEventListener('pointerup', onRelease);
      window.removeEventListener('pointercancel', onRelease);
    };
  }, [dragging, endDrag]);

  /** Swallow the click that follows a real drag, so dragging never opens the lightbox. */
  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    setSuppressClick(false);
  };

  const onTouchStart = () => {
    window.clearTimeout(touchTimer.current);
    setTouchHold(true);
  };

  const onTouchEnd = () => {
    window.clearTimeout(touchTimer.current);
    touchTimer.current = window.setTimeout(() => setTouchHold(false), 3000);
  };

  const paused = hovered || focused || dragging || touchHold;

  const trackStyle = {
    '--marquee-duration': `${MARQUEE_SECONDS}s`,
    '--marquee-state': paused ? 'paused' : 'running',
    animationDelay: `-${advance}s`,
  } as CSSProperties;

  const dragStyle = useMemo<CSSProperties>(
    () => (dragX ? { transform: `translateX(${dragX}px)` } : {}),
    [dragX],
  );

  const renderCards = (mirrored: boolean) =>
    projects.map((project) => (
      <li key={`${mirrored ? 'dup-' : ''}${project.id}`} className={`${CARD_WIDTH_CLASS} mr-6`}>
        <ProjectCard project={project} onOpen={setLightbox} ariaHidden={mirrored} />
      </li>
    ));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <div className="mt-10">
      {mode === 'grid' ? (
        <ul className="flex flex-wrap justify-center gap-6">
          {projects.map((project) => (
            <li key={project.id} className="w-full max-w-[360px]">
              <ProjectCard project={project} onOpen={setLightbox} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className="relative">
            {/* Soft fades so cards dissolve into the page at both edges */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-slate-50 to-transparent sm:w-20 dark:from-ink-900"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-slate-50 to-transparent sm:w-20 dark:from-ink-900"
            />

            {mode === 'marquee' ? (
              <div
                ref={marqueeViewportRef}
                role="group"
                aria-label="Project showcase — drag, scroll or use the arrow buttons"
                tabIndex={0}
                onKeyDown={onKeyDown}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onClickCapture={onClickCapture}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                style={{ touchAction: 'pan-y' }}
                className={[
                  'overflow-hidden py-1',
                  dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
                ].join(' ')}
              >
                <div className="marquee-track flex w-max" style={trackStyle}>
                  <div className="flex w-max" style={dragStyle}>
                    <ul ref={copyRef} className="flex w-max">
                      {renderCards(false)}
                    </ul>
                    <ul className="flex w-max" aria-hidden="true">
                      {renderCards(true)}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div
                ref={scrollRef}
                role="group"
                aria-label="Project showcase — scroll sideways"
                className="scroll-strip flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 pt-1"
              >
                {projects.map((project) => (
                  <div key={project.id} className={`${CARD_WIDTH_CLASS} snap-start`}>
                    <ProjectCard project={project} onOpen={setLightbox} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={goPrev} className="icon-btn" aria-label="Previous projects">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <p className="text-xs font-medium muted">
              {mode === 'scroll'
                ? 'Scroll sideways to explore all projects'
                : 'Drag, scroll or use the arrows — paused while you hover'}
            </p>
            <button type="button" onClick={goNext} className="icon-btn" aria-label="Next projects">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </>
      )}

      <Lightbox project={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
