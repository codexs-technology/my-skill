# Mehboob Masih — Portfolio

A single-page, fully static portfolio site for **Mehboob Masih** — Full Stack Developer | AI &
Automation | Digital Marketing, founder of Codex Technology SMC Pvt Ltd.

Built with React 18 + Vite + TypeScript, Tailwind CSS, Framer Motion and lucide-react. No backend:
the contact form is delivered by Web3Forms, and `npm run build` produces a plain `dist/` folder that
can be served from any static host (Cloudflare Pages, Netlify, S3, Nginx…).

---

## Requirements

- Node.js **18 or newer** (developed and tested on Node 24)
- npm 9+

## Local development

```bash
# 1. install dependencies
npm install

# 2. create your local env file (git-ignored)
#    Windows PowerShell:  Copy-Item .env.example .env
cp .env.example .env
#    ...then paste your Web3Forms access key into VITE_WEB3FORMS_KEY

# 3. start the dev server (http://localhost:5173)
npm run dev
```

Without a `VITE_WEB3FORMS_KEY` the site still runs — the contact form shows a friendly
"not configured yet" message instead of submitting.

## Build & preview

```bash
npm run build     # type-check (tsc --noEmit) then bundle to dist/
npm run preview   # serve the built dist/ locally to sanity-check it
```

The build is **100% static** — HTML, CSS, JS and images only. There is no server process to keep
alive.

## Useful scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run smoke` | Renders the real App through Vite's SSR loader and asserts every section, project and SEO tag is present |
| `npm run layout` | Drives headless Chrome/Edge over the DevTools protocol: checks for horizontal scrolling at 375/768/1024/1440, verifies all gutters line up, and exercises the marquee, arrows, drag and lightbox. Writes screenshots to `.layout-shots/` (needs Chrome or Edge installed) |
| `npm run placeholders` | Regenerate the placeholder project images, `og-image.png` and the placeholder resume PDF |

---

## Project structure

```
├─ index.html                  # <title>, meta description, Open Graph, JSON-LD Person schema, theme boot script
├─ public/
│  ├─ favicon.svg              # Monogram favicon
│  ├─ og-image.png             # 1200x630 social share card (generated placeholder)
│  ├─ robots.txt               # Remember to add your sitemap URL + production domain
│  ├─ sitemap.xml              # Replace the placeholder domain
│  ├─ site.webmanifest
│  ├─ Mehboob_Masih_Resume.pdf # PLACEHOLDER — replace with your real resume
│  └─ projects/                # PLACEHOLDER screenshots + README explaining how to swap them
├─ scripts/
│  └─ generate-placeholders.mjs# Generates the placeholder PNG/PDF assets (Node built-ins only)
└─ src/
   ├─ App.tsx                  # Section order: Hero → About → Skills → Services → Projects → Experience → Contact
   ├─ data/                    # ← EDIT CONTENT HERE
   │  ├─ profile.ts            # Name, contact details, pitch, about copy, highlights
   │  ├─ nav.ts                # Navbar sections
   │  ├─ skills.ts             # Skill groups
   │  ├─ services.ts           # The six Codex Technology service cards
   │  ├─ projects.ts           # Client work + own products (titles, tags, images, links)
   │  └─ experience.ts         # Timeline + education (+ FOUNDER_START_YEAR placeholder)
   ├─ components/              # Navbar, Hero, About, Skills, Services, Projects, Experience, Contact, Footer…
   ├─ hooks/                   # useTheme (dark/light), useActiveSection (scroll-spy)
   └─ lib/web3forms.ts         # Contact form validation + Web3Forms submission
```

## Editing content

Everything visible lives in `src/data/`. Add a project by appending an object to
`projects` in `src/data/projects.ts`:

```ts
{
  id: 'my-project',
  title: 'My Project',
  description: 'What it is and what it does — keep it factual.',
  tags: ['React', 'Node.js'],
  image: '/projects/my-project.png',   // file inside public/projects/
  imageAlt: 'Screenshot of My Project',
  category: 'client',                  // 'client' | 'product'
  context: 'Short label shown under the title',
  liveUrl: 'https://example.com',      // optional
  githubUrl: 'https://github.com/...', // optional
}
```

The grid, the "All / Client work / Own products" filters and the tag chips all adapt
automatically.

## Layout, carousel and the shared `Container`

- **One gutter for the whole page.** `src/components/Container.tsx`
  (`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`) is used by the navbar, the hero, every section and
  the footer, so their left/right edges line up exactly at every width. Sections go through `Section`,
  which wraps `Container` — avoid adding ad-hoc `max-w-*` / `px-*` to individual sections.
- **Consistent rhythm.** Every section uses the shared `.section` class (`py-20 md:py-28`) plus the
  centred `SectionHeading`, so vertical spacing and heading alignment stay uniform.
- **Projects reel.** `src/components/ProjectsCarousel.tsx` renders a seamless CSS-keyframe marquee
  (the card list is rendered twice; `translateX(0 → -50%)` is exactly one copy, so the loop never
  jumps):
  - pauses on hover, keyboard focus and touch, and resumes automatically;
  - can be dragged/swiped, or moved with the previous/next arrows; `←`/`→` work when it has focus;
  - with `prefers-reduced-motion: reduce` the animation is skipped entirely and the reel becomes a
    normal horizontal scroller;
  - if a filter leaves fewer than 4 projects, they render as a static centred grid;
  - clicking a card image opens `Lightbox` — close it with the X, `Esc` or a backdrop click.
- After changing layout, run `npm run layout`: it fails if anything introduces horizontal scrolling
  or breaks the gutter alignment.

---

## Deploying to Cloudflare Pages

### Option A — Git integration (recommended)

1. Push this repository to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the repository, then use these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | **Vite** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave blank unless the site lives in a subfolder)* |

4. Add the environment variable (Settings → **Environment variables** → Production **and** Preview):

   | Name | Value |
   | --- | --- |
   | `VITE_WEB3FORMS_KEY` | your Web3Forms access key |

   Vite inlines `VITE_*` variables at build time, so **redeploy after changing this value**.
5. Save and deploy. Every push to the default branch publishes to production; other branches get
   preview URLs.

Node version: Cloudflare Pages defaults (Node 18+/20+) are fine. Optionally set `NODE_VERSION=20`
as an environment variable.

### Option B — Direct upload with Wrangler

```bash
npm run build
npx wrangler pages deploy dist --project-name mehboob-masih-portfolio
```

### About `public/_redirects`

No `_redirects` file is included, and **none is needed**. This is a single-page site that navigates
with in-page anchors (`#projects`, `#contact`) rather than a client-side router, so every path
Cloudflare Pages serves is already `index.html` — an SPA fallback would never be hit. If you later
add React Router (or any multi-route setup), add `public/_redirects` containing:

```
/*  /index.html  200
```

Vite copies everything from `public/` into `dist/`, so Cloudflare Pages picks it up automatically.

---

## Contact form (Web3Forms)

1. Go to <https://web3forms.com>, enter `codexstechnology@gmail.com` and create a free access key.
2. Put it in `.env` locally as `VITE_WEB3FORMS_KEY=...` and add the same variable in Cloudflare
   Pages.
3. Submissions arrive by email. Validation (name, email format, minimum message length) runs in
   `src/lib/web3forms.ts` before anything is sent.

## SEO checklist

- `index.html` already contains the page title, meta description, Open Graph/Twitter tags, favicon
  and a JSON-LD `Person` schema.
- Replace the placeholder domain `https://mehboobmasih.com` in `index.html` (canonical + OG tags +
  JSON-LD) and in `public/sitemap.xml`.
- Uncomment the `Sitemap:` line in `public/robots.txt` once `sitemap.xml` uses your real domain.
- Replace `public/og-image.png` with a designed 1200×630 card (a generated placeholder ships today).

## Accessibility & performance notes

- Semantic landmarks (`header`, `main`, `nav`, `section`, `footer`), a skip-to-content link, visible
  keyboard focus rings, labelled form fields with `aria-invalid` / `aria-describedby`, and
  `aria-label`ed icon buttons.
- Dark theme by default with a light/dark toggle; the choice is stored in `localStorage` and applied
  before first paint so there is no theme flash.
- Images are lazy-loaded with explicit `width`/`height` to avoid layout shift, and vendor code is
  split into separate cacheable chunks (`react`, `framer-motion`, icons).
- Animations switch off automatically for visitors using `prefers-reduced-motion: reduce`.

## Deploy checklist

```bash
npm install
npm run placeholders   # only if you need to regenerate placeholder art
npm run build          # must finish with no errors
npm run smoke          # optional: verifies the page renders and SEO tags exist
npm run preview        # optional sanity check of dist/
```

## Placeholders to replace before launch

| # | Placeholder | Where | What to do |
| --- | --- | --- | --- |
| 1 | Project screenshots (`public/projects/*.png`, 8 files) | `src/data/projects.ts` → `image` | Drop your real screenshots in with the same filenames — any dimensions work, cards crop to 16:10 from the top (`object-cover object-top`), so website screenshots keep their header visible. Update `imageAlt` if needed. See `public/projects/README.md`. |
| 2 | Codex Technology start year (`20XX`) | `src/data/experience.ts` → `FOUNDER_START_YEAR` | Set the real founding year. |
| 3 | Web3Forms access key | `.env` (local) + Cloudflare Pages env vars | Create a free key at web3forms.com. |
| 4 | Resume PDF | `public/Mehboob_Masih_Resume.pdf` | Overwrite the generated placeholder with your real PDF (keep the filename). |
| 5 | Live project URLs / repos | `src/data/projects.ts` | Uncomment the `liveUrl` / `githubUrl` lines and add real links — buttons appear automatically. |
| 6 | Production domain | `index.html` (canonical, `og:url`, `og:image`, JSON-LD) + `public/sitemap.xml` + `public/robots.txt` | Replace `https://mehboobmasih.com`. |
| 7 | Social share image | `public/og-image.png` | Replace with a designed 1200×630 card. |
| 8 | Dev-only placeholder notice | `src/components/Projects.tsx` | Delete the dashed "Project images are placeholders" block once real screenshots are in. |


