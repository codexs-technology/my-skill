export type Service = {
  /** Matches an icon lookup key in Services.tsx */
  id: 'software' | 'ai' | 'design' | 'cloud' | 'data' | 'marketing';
  title: string;
  description: string;
  items: string[];
};

/**
 * Services offered through Codex Technology SMC Pvt Ltd.
 * Descriptions are intentionally capability-based (no invented metrics or claims).
 */
export const services: Service[] = [
  {
    id: 'software',
    title: 'Software Development',
    description:
      'End-to-end product engineering — from discovery and architecture to launch and iteration.',
    items: [
      'Web',
      'Mobile',
      'Custom Software',
      'SaaS',
      'E-commerce',
      'API Integration',
      'ERP & CRM',
      'MVP',
    ],
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    description:
      'Practical AI features and automation that remove manual work from real business processes.',
    items: [
      'Agentic AI',
      'AI Chatbots',
      'Generative AI',
      'LLM & RAG',
      'AI-Powered Apps',
      'ML & Data Science',
      'Business Process Automation',
    ],
  },
  {
    id: 'design',
    title: 'UI/UX & Creative Design',
    description:
      'Interfaces and brand systems designed for clarity, trust and conversion.',
    items: [
      'UI/UX',
      'Web & Mobile App Design',
      'Landing Pages',
      'Graphic Design',
      'Logo & Branding',
      'Design Systems',
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    description:
      'Reliable infrastructure, shipping pipelines and day-two operations for growing products.',
    items: [
      'Cloud Architecture',
      'AWS / Azure / GCP',
      'Migration & Hosting',
      'CI/CD',
      'Server Management',
      'Platform Engineering',
    ],
  },
  {
    id: 'data',
    title: 'Data, Security & Quality',
    description:
      'Solid data foundations, measurable insight and quality gates you can trust in production.',
    items: [
      'Database Design',
      'Analytics & BI Dashboards',
      'Cybersecurity & Audits',
      'DevSecOps',
      'QA & Testing',
      'Maintenance & Support',
    ],
  },
  {
    id: 'marketing',
    title: 'Digital Marketing & Consulting',
    description:
      'Acquisition, conversion and advisory work that connects technical delivery to business outcomes.',
    items: [
      'SEO',
      'PPC',
      'Social Media',
      'Content Marketing',
      'CRO',
      'Technology Consulting',
      'Digital Transformation',
    ],
  },
];
