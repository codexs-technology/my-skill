import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navIds, navItems } from '../data/nav';
import { profile } from '../data/profile';
import { useActiveSection, useScrolled } from '../hooks/useActiveSection';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(12);
  const activeId = useActiveSection(navIds);

  // Close the mobile menu with Escape (keyboard friendly)
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-slate-200/70 bg-white/85 backdrop-blur-lg dark:border-white/10 dark:bg-ink-900/85'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <nav aria-label="Main navigation" className="container-x flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]">
        <a
          href="#home"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 rounded-lg py-1"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl bg-accent-gradient text-sm font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-105"
          >
            {profile.initials}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {profile.name}
            </span>
            <span className="text-[11px] font-medium muted">{profile.title}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Hire me
          </a>
          <button
            type="button"
            className="icon-btn lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-slate-200/70 bg-white/95 backdrop-blur-lg lg:hidden dark:border-white/10 dark:bg-ink-900/95"
      >
        <ul className="container-x flex flex-col gap-1 py-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={closeMenu}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeId === item.id
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                }`}
                aria-current={activeId === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a href="#contact" onClick={closeMenu} className="btn btn-primary w-full">
              Start a project
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
