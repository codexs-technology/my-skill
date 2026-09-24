import { ArrowUp } from 'lucide-react';
import { useScrolled } from '../hooks/useActiveSection';

export default function BackToTop() {
  const visible = useScrolled(700);

  if (!visible) return null;

  return (
    <a
      href="#home"
      aria-label="Back to top of page"
      className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-gradient text-white shadow-glow transition-transform duration-200 hover:scale-105"
    >
      <ArrowUp size={18} aria-hidden="true" />
    </a>
  );
}
