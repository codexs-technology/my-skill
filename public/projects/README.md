# Project images

Every `.png` in this folder is a **generated placeholder** (an abstract mock
browser window) — no real product screenshots are committed here yet.

## Replacing them

1. Take a screenshot of the real project (or export a mockup).
2. Crop/resize to roughly **1200 × 750** (16:10). Keep the file under ~300 KB —
   TinyPNG or `squoosh` does this well.
3. Save it over the matching filename below, e.g.
   `public/projects/lehigh-valley-roofers.png`.

The image paths live in `src/data/projects.ts`. If you rename a file, update the
`image` field there. Alt text lives in the same file (`imageAlt`) — please keep it
descriptive for accessibility and SEO.

## Filenames in use

| File | Project |
| --- | --- |
| `lehigh-valley-roofers.png` | Lehigh Valley Roofers (client) |
| `new-queens-nails.png` | New Queens Nails (client) |
| `familia-heat-air-plumbing.png` | Familia Heat, Air & Plumbing (client) |
| `auto-care-service.png` | Auto Care Service Provider (client) |
| `leadership-consulting.png` | Leadership Consulting Firm (client) |
| `ai-chatbot-saas.png` | AI Chatbot SaaS (own product) |
| `auth-rest-api.png` | Authentication & REST API System (own product) |
| `trading-platform.png` | Trading Platform concept (own product) |

## Regenerating the placeholders

```
npm run placeholders
```

That script also refreshes `public/og-image.png` (the social share card) and the
placeholder `public/Mehboob_Masih_Resume.pdf`.
