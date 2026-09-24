export type ProjectCategory = 'client' | 'product';

export type Project = {
  id: string;
  title: string;
  /** One or two sentences. Keep it factual: what was built, for whom, and what it does. */
  description: string;
  tags: string[];
  /** Path inside public/ — see public/projects/README.md for where to drop real screenshots. */
  image: string;
  /** Short alt text for accessibility + SEO. */
  imageAlt: string;
  category: ProjectCategory;
  /** Optional context line shown under the title (client location, product status, etc.). */
  context?: string;
  /** Optional: shown as a "Live site" button when set. */
  liveUrl?: string;
  /** Optional: shown as a "Source code" button when set. */
  githubUrl?: string;
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOW TO EDIT
 *  1. Replace each `image` PNG in public/projects/ with a real screenshot
 *     (keep the same filenames; 1200x750 / 16:10 looks best).
 *  2. Add real links by removing the `//` in front of `liveUrl` / `githubUrl`.
 *  3. Add or remove projects freely — the grid and filters adapt automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  // ─────────────────────────────── Client work ───────────────────────────────
  {
    id: 'lehigh-valley-roofers',
    title: 'Lehigh Valley Roofers',
    description:
      'Responsive roofing website for a Pennsylvania-based contractor, paired with Facebook ad campaigns covering creative production, local homeowner targeting and offer testing — aimed at better lead quality and a lower cost per lead.',
    tags: ['Responsive Website', 'Meta Ads', 'Lead Generation', 'Local SEO'],
    image: '/projects/lehigh-valley-roofers.png',
    imageAlt: 'Placeholder preview for the Lehigh Valley Roofers website project',
    category: 'client',
    context: 'Roofing contractor — Pennsylvania, USA',
    // liveUrl: 'https://example.com',  // TODO: add the live site URL
    // githubUrl: 'https://github.com/codexs-technology/<repo>',  // TODO: add repo URL if public
  },
  {
    id: 'new-queens-nails',
    title: 'New Queens Nails',
    description:
      'Mobile-optimised salon website with a service gallery and online appointment booking, designed so social and walk-by traffic can book in a few taps.',
    tags: ['Website', 'Booking Flow', 'Mobile-first', 'Service Gallery'],
    image: '/projects/new-queens-nails.png',
    imageAlt: 'Placeholder preview for the New Queens Nails salon website project',
    category: 'client',
    context: 'Nail salon — service gallery & online booking',
    // liveUrl: 'https://example.com',  // TODO: add the live site URL
    // githubUrl: 'https://github.com/codexs-technology/<repo>',  // TODO: add repo URL if public
  },
  {
    id: 'familia-heat-air-plumbing',
    title: 'Familia Heat, Air & Plumbing',
    description:
      'Fast-loading HVAC and plumbing website with dedicated service pages, an enquiry form and clear calls-to-action for emergency and seasonal demand.',
    tags: ['Website', 'Service Pages', 'Contact Form', 'Performance'],
    image: '/projects/familia-heat-air-plumbing.png',
    imageAlt: 'Placeholder preview for the Familia Heat, Air & Plumbing website project',
    category: 'client',
    context: 'HVAC & plumbing — service site with clear CTAs',
    // liveUrl: 'https://example.com',  // TODO: add the live site URL
    // githubUrl: 'https://github.com/codexs-technology/<repo>',  // TODO: add repo URL if public
  },
  {
    id: 'auto-care-service',
    title: 'Auto Care Service Provider',
    description:
      'Automotive service website with online scheduling, location-based promotions and seasonal offers to drive bookings from local search.',
    tags: ['Website', 'Scheduling', 'Local Promotions', 'Seasonal Offers'],
    image: '/projects/auto-care-service.png',
    imageAlt: 'Placeholder preview for the Auto Care Service Provider website project',
    category: 'client',
    context: 'Automotive services — scheduling & location promotions',
    // liveUrl: 'https://example.com',  // TODO: add the live site URL
    // githubUrl: 'https://github.com/codexs-technology/<repo>',  // TODO: add repo URL if public
  },
  {
    id: 'leadership-consulting',
    title: 'Leadership Consulting Firm',
    description:
      'Authority-building website for an executive coach, featuring TEDx talks, workshops and a clear pathway from first visit to enquiry.',
    tags: ['Website', 'Personal Brand', 'Content Structure', 'CRO'],
    image: '/projects/leadership-consulting.png',
    imageAlt: 'Placeholder preview for the leadership consulting firm website project',
    category: 'client',
    context: 'Executive coaching — authority & speaker positioning',
    // liveUrl: 'https://example.com',  // TODO: add the live site URL
  },

  // ────────────────────────────── Own products ───────────────────────────────
  {
    id: 'ai-chatbot-saas',
    title: 'AI Chatbot SaaS',
    description:
      'AI conversational app with a modern UI, backend APIs, authentication and AI integration — built as a reusable base for client chatbot deployments.',
    tags: ['React', 'TypeScript', 'Node.js', 'OpenAI', 'Auth', 'SaaS'],
    image: '/projects/ai-chatbot-saas.png',
    imageAlt: 'Placeholder preview for the AI Chatbot SaaS product',
    category: 'product',
    context: 'Own product — conversational AI platform',
    // liveUrl: 'https://example.com',  // TODO: add the live demo URL
    // githubUrl: 'https://github.com/codexs-technology/<repo>',  // TODO: add repo URL if public
  },
  {
    id: 'auth-rest-api',
    title: 'Authentication & REST API System',
    description:
      'Node.js and TypeScript API with PostgreSQL, Prisma, JWT authentication, request validation, email workflows, Swagger documentation and a Docker-based local setup.',
    tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'JWT', 'Swagger', 'Docker'],
    image: '/projects/auth-rest-api.png',
    imageAlt: 'Placeholder preview for the authentication and REST API system',
    category: 'product',
    context: 'Own product — production-ready API foundation',
    // liveUrl: 'https://example.com',  // TODO: add the API docs / live URL
    // githubUrl: 'https://github.com/codexs-technology/<repo>',  // TODO: add repo URL if public
  },
  {
    id: 'trading-platform',
    title: 'Trading Platform (concept)',
    description:
      'Concept build exploring market dashboards, backend services and AI-assisted features for traders. Currently at prototype stage — no performance claims.',
    tags: ['Dashboard', 'Backend Services', 'AI-assisted', 'Prototype'],
    image: '/projects/trading-platform.png',
    imageAlt: 'Placeholder preview for the trading platform concept build',
    category: 'product',
    context: 'Concept / prototype',
    // liveUrl: 'https://example.com',  // TODO: add the live demo URL
    // githubUrl: 'https://github.com/codexs-technology/<repo>',  // TODO: add repo URL if public
  },
];

export const projectCategories: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All projects' },
  { id: 'client', label: 'Client work' },
  { id: 'product', label: 'Own products' },
];

