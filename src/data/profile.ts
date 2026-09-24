/**
 * Single source of truth for personal / contact details.
 * Update here and every section (hero, contact, footer, SEO copy) follows.
 */
export const profile = {
  name: 'Mehboob Masih',
  shortName: 'Mehboob',
  initials: 'MM',
  title: 'Full Stack Developer',
  titleExtended: 'Full Stack Developer | AI & Automation | Digital Marketing',
  company: 'Codex Technology SMC Pvt Ltd',
  location: 'Karachi, Pakistan',
  remoteNote: 'Working remotely with clients in the USA, Canada, UK and Australia.',

  // Contact
  email: 'codexstechnology@gmail.com',
  phoneDisplay: '+92 341 2768875',
  phoneHref: 'tel:+923412768875',
  whatsapp: 'https://wa.me/923412768875',
  github: 'https://github.com/codexs-technology',

  // Hero pitch — kept factual, no invented metrics.
  pitch:
    'I build web applications, APIs, SaaS products, AI-powered tools and automation workflows that solve real business problems — and I help them get found and convert with practical digital marketing.',

  about: [
    "I'm a full stack developer based in Karachi, Pakistan, working remotely with clients across the USA, Canada, the UK and Australia. My work spans web applications, REST APIs, SaaS products, AI-powered tools, business automation workflows and conversion-focused business websites.",
    'Alongside development I bring practical digital marketing experience — Meta Ads, Google Ads, SEO, lead generation and e-commerce — which means I build with acquisition, speed and conversion in mind rather than just shipping features.',
    'I am the founder of Codex Technology SMC Pvt Ltd, where I lead end-to-end delivery: discovery, architecture, development, deployment and ongoing support. I care about clean, maintainable code, clear documentation and keeping clients informed at every step.',
  ],

  highlights: [
    'Full stack delivery: React + TypeScript front ends, Node.js/Express APIs, PostgreSQL & MongoDB',
    'AI & automation: chatbots, AI agents, OpenAI integrations and n8n workflows',
    'Marketing-aware builds: SEO, landing pages, ad-driven lead generation and CRO',
    'Remote-first collaboration with clients across four continents',
  ],

  // TODO: replace with your production domain after deploying to Cloudflare Pages.
  siteUrl: 'https://mehboobmasih.com',
  // TODO: drop the real PDF at public/Mehboob_Masih_Resume.pdf (a placeholder ships by default).
  resumeUrl: '/Mehboob_Masih_Resume.pdf',
} as const;

export type Profile = typeof profile;
