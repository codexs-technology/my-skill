export type SkillGroup = {
  /** Matches an icon lookup key in Skills.tsx */
  id: 'development' | 'databases' | 'ai-automation' | 'devops' | 'marketing';
  title: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'development',
    title: 'Development',
    items: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Express.js',
      'REST APIs',
      'HTML',
      'CSS',
      'Tailwind CSS',
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'Prisma ORM'],
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    items: [
      'AI chatbots',
      'AI agents',
      'OpenAI integrations',
      'Workflow automation',
      'n8n',
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & Tools',
    items: ['Git', 'GitHub', 'Docker', 'Swagger/OpenAPI', 'API testing'],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    items: [
      'Google Ads',
      'Meta Ads',
      'SEO',
      'Social Media Marketing',
      'Lead Generation',
      'Landing Pages',
    ],
  },
];
