import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  /** Extra classes (e.g. vertical padding for the footer). */
  className?: string;
  /** Wrapper element — defaults to div. */
  as?: 'div' | 'nav' | 'ul';
  'aria-label'?: string;
};

/**
 * The single source of truth for horizontal page gutters.
 * Navbar, hero, every section and the footer all use this, so their left and
 * right edges line up exactly on every breakpoint.
 */
export default function Container({
  children,
  className,
  as: Tag = 'div',
  'aria-label': ariaLabel,
}: ContainerProps) {
  return (
    <Tag
      aria-label={ariaLabel}
      className={['mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
