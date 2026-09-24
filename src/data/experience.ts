/**
 * TODO (placeholder): set the real year Codex Technology SMC Pvt Ltd was founded.
 * It is rendered in the Experience timeline as "<FOUNDER_START_YEAR> — Present".
 */
export const FOUNDER_START_YEAR = '20XX';

export type ExperienceItem = {
  id: string;
  role: string;
  organisation: string;
  period: string;
  /** Short, factual summary of scope. */
  description: string;
  bullets?: string[];
  current?: boolean;
  type: 'work' | 'education';
};

export const experience: ExperienceItem[] = [
  {
    id: 'codex-founder',
    role: 'Founder & Lead Developer',
    organisation: 'Codex Technology SMC Pvt Ltd',
    // TODO: replace FOUNDER_START_YEAR with the real founding year.
    period: `${FOUNDER_START_YEAR} — Present`,
    description:
      'Leading end-to-end delivery of software, AI automation and digital marketing engagements — from discovery and architecture through to deployment and ongoing support.',
    bullets: [
      'Own technical direction: stack choices, architecture, code quality and release process',
      'Deliver web applications, APIs, SaaS products, AI-powered tools and automation workflows',
      'Run conversion-focused marketing work (Google Ads, Meta Ads, SEO, landing pages) alongside development',
      'Client communication, scoping, estimation and project delivery',
    ],
    current: true,
    type: 'work',
  },
  {
    id: 'freelance-fullstack',
    role: 'Freelance Full Stack Developer & Digital Marketer',
    organisation: 'Independent / Remote',
    period: '2016 — Present',
    description:
      'Building and marketing websites, web apps and APIs for clients across the USA, Canada, the UK and Australia.',
    bullets: [
      'Full stack builds with React, TypeScript, Node.js/Express, PostgreSQL and MongoDB',
      'Business websites, landing pages and e-commerce storefronts with SEO and speed in mind',
      'Paid acquisition and lead generation support for service businesses',
    ],
    current: true,
    type: 'work',
  },
  {
    id: 'senior-fullstack',
    role: 'Senior Full Stack Developer (Freelance)',
    organisation: 'Remote contract engagements',
    period: 'Mar 2024 — Feb 2026',
    description:
      'Senior development role on client products — API design, database modelling, integrations and front-end implementation.',
    bullets: [
      'Designed and built REST APIs with authentication, validation and documented endpoints',
      'Implemented responsive React interfaces and integrated third-party services',
      'Worked directly with stakeholders on requirements, reviews and releases',
    ],
    type: 'work',
  },
  {
    id: 'digital-marketing',
    role: 'Digital Marketing Specialist (Freelance)',
    organisation: 'Remote client campaigns',
    period: 'Apr 2021 — Mar 2024',
    description:
      'Planned and managed paid and organic campaigns for service businesses and e-commerce brands.',
    bullets: [
      'Google Ads and Meta Ads campaign setup, creatives, audience targeting and testing',
      'On-page SEO, landing page optimisation and conversion improvements',
      'Lead generation funnels and reporting on cost per lead and enquiry quality',
    ],
    type: 'work',
  },
  {
    id: 'education',
    role: 'Computer Science Graduate',
    organisation: 'Government Boys Degree College, Karachi',
    period: '2016',
    description:
      'Studied computer science, which is where the path into software development and web engineering started.',
    type: 'education',
  },
];
