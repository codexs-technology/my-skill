export type NavItem = {
  /** DOM id of the section (used for anchor href + active-section tracking). */
  id: string;
  label: string;
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

/** Stable array of section ids — used for scroll-spy so the effect deps never change. */
export const navIds: readonly string[] = navItems.map((item) => item.id);

