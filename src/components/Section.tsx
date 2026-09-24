import type { ReactNode } from 'react';
import Container from './Container';

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /** id of the heading element inside, for aria-labelledby */
  labelledBy?: string;
};

export default function Section({ id, children, className, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={['section', className].filter(Boolean).join(' ')}
    >
      <Container>{children}</Container>
    </section>
  );
}
