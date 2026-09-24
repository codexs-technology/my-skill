import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger helper — seconds. */
  delay?: number;
  /** Distance travelled while fading in, in pixels. */
  y?: number;
};

/**
 * Fades + lifts content into view once, using IntersectionObserver under the hood.
 * Falls back to a plain div when the visitor prefers reduced motion.
 */
export default function Reveal({ children, className, delay = 0, y = 20 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  );
}
