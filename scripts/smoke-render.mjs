/**
 * Render smoke test — loads the real App component through Vite and renders it
 * to a string, then asserts the important content is present.
 *
 * It catches things a type-check cannot: broken imports at runtime, undefined
 * access during render, missing sections, malformed data files.
 *
 * Run with: npm run smoke
 */
import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const EXPECTED = {
  sections: ['home', 'about', 'skills', 'services', 'projects', 'experience', 'contact'],
  text: [
    'Mehboob Masih',
    'Full Stack Developer',
    'Karachi, Pakistan',
    'codexstechnology@gmail.com',
    '+92 341 2768875',
    'Codex Technology SMC Pvt Ltd',
    'https://github.com/codexs-technology',
    'wa.me/923412768875',
    '/Mehboob_Masih_Resume.pdf',
    // Client projects
    'Lehigh Valley Roofers',
    'New Queens Nails',
    'Familia Heat, Air & Plumbing',
    'Auto Care Service Provider',
    'Leadership Consulting Firm',
    // Own products
    'AI Chatbot SaaS',
    'Authentication & REST API System',
    'Trading Platform (concept)',
    // Services
    'Software Development',
    'AI & Automation',
    'UI/UX & Creative Design',
    'Cloud & DevOps',
    'Data, Security & Quality',
    'Digital Marketing & Consulting',
    // Skills
    'PostgreSQL',
    'Prisma ORM',
    'n8n',
    'Swagger/OpenAPI',
    'Google Ads',
    'Lead Generation',
    // Experience
    'Founder & Lead Developer',
    'Mar 2024 — Feb 2026',
    'Apr 2021 — Mar 2024',
    'Government Boys Degree College, Karachi',
  ],
  selectors: [
    'id="name"',
    'id="email"',
    'id="message"',
    'type="email"',
    'id="main"',
    'aria-label="Main navigation"',
    'aria-label="Filter projects by category"',
    'aria-expanded="false"',
  ],
};

/** index.html isn't part of the React tree — check it straight from disk. */
const INDEX_HTML_CHECKS = [
  '<meta name="viewport"',
  'rel="canonical"',
  'property="og:title"',
  'property="og:image"',
  'name="twitter:card"',
  'application/ld+json',
  '"@type": "Person"',
  'codexstechnology@gmail.com',
  'rel="icon"',
  '<title>Mehboob Masih',
];

/** React escapes & " < > in output — normalise before comparing strings. */
function decodeEntities(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

const failures = [];
const notes = [];

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'warn',
});

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx');
  const html = decodeEntities(renderToString(createElement(App)));

  for (const id of EXPECTED.sections) {
    if (!html.includes(`id="${id}"`)) failures.push(`missing section #${id}`);
  }

  for (const needle of EXPECTED.text) {
    if (!html.includes(needle)) failures.push(`missing text: ${needle}`);
  }

  for (const selector of EXPECTED.selectors) {
    if (!html.includes(selector)) failures.push(`missing markup: ${selector}`);
  }

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) failures.push(`expected exactly one <h1>, found ${h1Count}`);

  if (html.includes('>undefined<') || html.includes('NaN')) {
    failures.push('rendered output contains undefined/NaN');
  }

  for (const project of ['lehigh-valley-roofers', 'ai-chatbot-saas', 'trading-platform']) {
    if (!html.includes(`/projects/${project}.png`)) {
      failures.push(`missing project image path for ${project}`);
    }
  }

  // Every project in the data file should be rendered with its alt text.
  const { projects } = await vite.ssrLoadModule('/src/data/projects.ts');
  for (const project of projects) {
    if (!html.includes(project.title)) failures.push(`project not rendered: ${project.title}`);
    if (!html.includes(project.imageAlt)) failures.push(`missing alt text: ${project.imageAlt}`);
  }

  // Static HTML shell (SEO tags) is not part of the React tree.
  const indexHtml = await readFile(join(ROOT, 'index.html'), 'utf8');
  for (const needle of INDEX_HTML_CHECKS) {
    if (!indexHtml.includes(needle)) failures.push(`index.html missing: ${needle}`);
  }

  notes.push(`rendered ${html.length} characters of HTML`);
  notes.push(`${h1Count} <h1>, ${(html.match(/<h2[\s>]/g) ?? []).length} <h2>`);
  notes.push(`${(html.match(/<section[\s>]/g) ?? []).length} <section>, ${projects.length} projects`);
  notes.push(`${INDEX_HTML_CHECKS.length} SEO tags verified in index.html`);
} finally {
  await vite.close();
}

notes.forEach((note) => console.log(`  · ${note}`));

if (failures.length > 0) {
  console.error('\nRender smoke test FAILED:');
  failures.forEach((failure) => console.error(`  ✗ ${failure}`));
  process.exit(1);
}

console.log('\nRender smoke test passed — all sections, copy and form fields render.');
