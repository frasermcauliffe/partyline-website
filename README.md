# PartyLine Collective — Marketing Website

Static Astro marketing site for **PartyLine Collective** (`https://partylinecollective.com`). This project explains PartyLine and routes visitors into the separate SvelteKit app — it does not serve live app data, auth, or backend forms.

**App (accounts, events, profiles, dashboards):** configured in `src/data/app-links.ts` (currently the hosted preview at `https://partyline-webapp.vercel.app`).

## Stack

- [Astro](https://astro.build) 6
- TypeScript
- Static-first — no live app data, no auth, no forms backend

## Project structure

```
src/
├── components/   # Site header/footer, UI primitives, SEO
├── data/         # App URLs, nav, site constants
├── layouts/      # BaseLayout.astro
├── lib/          # SEO helpers
├── pages/        # Marketing routes (8 pages)
└── styles/       # Design tokens + global CSS
```

**App URL constants** live in `src/data/app-links.ts` — update `APP_URL` when the production app subdomain is ready.

**Marketing site origin** lives in `src/data/site.ts` (`SITE_URL`) and must stay in sync with `astro.config.mjs`. Confirm DNS before launch; preview deploys may use a Vercel URL until then.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # preview production build
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/events` | Event discovery landing → app |
| `/artists-djs` | Artist/DJ profiles landing |
| `/organisers` | Organiser landing |
| `/venues` | Venue landing |
| `/opportunities` | DJ opportunities landing |
| `/about` | Mission and positioning |
| `/contact` | Email + in-app feedback |

Contact: `hello@partylinecollective.com`

## Configuration & assets

- **`src/data/site.ts`** — `SITE_URL`, contact email, site name
- **`astro.config.mjs`** — site URL + `@astrojs/sitemap` (keep in sync with `site.ts`)
- **`public/robots.txt`** — sitemap URL

**TODO before launch:**

- Branded OG image (currently `public/og-default.svg` placeholder)
- Final production favicon
- Self-hosted fonts (optional)

## Deploy

Build outputs static files to `dist/`. Deploy to Vercel or any static host. Keep the marketing domain separate from the app preview URL until DNS and app subdomain are configured.

## Related repo

The main PartyLine app is **`partyline-webapp`** (SvelteKit + Supabase).
