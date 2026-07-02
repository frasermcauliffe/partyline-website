# Public website QA checklist

Short pre-launch QA for the PartyLine marketing site (`partyline-website`). Run before alpha launch or after Scene Index / directory changes.

## Preflight

Confirm environment variables (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `PUBLIC_APP_URL` | App CTAs and preview card links |
| `PUBLIC_APP_API_URL` | Build-time public API (`/api/public/events`, `/api/public/scene-index`, etc.) |
| `SITE_URL` | Canonical URLs in `src/data/site.ts` — must match production domain |

**Production targets (example):**

- `PUBLIC_APP_URL=https://app.partylinecollective.com`
- `PUBLIC_APP_API_URL=https://app.partylinecollective.com`

## Build commands

```bash
npm install
npm run test
npx astro check
npm run build
npm run preview   # optional smoke at http://localhost:4321
```

### Invalid API fallback build

Simulates Scene Index and preview API outage at build time:

```bash
PUBLIC_APP_API_URL=https://invalid.partyline.local npm run build
```

**Expected:** build succeeds; no thrown errors; no fabricated numeric Scene Index counts.

## Scene Index surfaces

### Homepage (`/`)

| Condition | Expected |
|-----------|----------|
| API available | PartyLine Scene Index teaser above event preview; four stats; alpha note; links to `/events` and app |
| API unavailable | Info callout (“Snapshot unavailable…”) or teaser omitted — **never fake counts** |

### Event directory (`/events`)

| Condition | Expected |
|-----------|----------|
| API available | “Current listings snapshot” stats row; “Formats currently tracked” strip (if `by_event_type` non-empty); “Snapshot detail” cards |
| API unavailable | Soft/computed fallback stats; **formats strip hidden**; “Snapshot detail” uses neutral preview fallback copy (no “top/most active”) |
| Event preview | Cards from public events API only; empty state if preview unavailable |

### City landing (e.g. `/events/perth`)

| Condition | Expected |
|-----------|----------|
| API available | City listings snapshot strip with counts + updated time |
| API unavailable | Strip omitted; preview panel + FAQ still render |

### Genre landing (e.g. `/events/genre/techno`)

Same as city — genre snapshot when available, omitted when not.

### This weekend (`/events/this-weekend`)

| Condition | Expected |
|-----------|----------|
| API available | Platform-wide snapshot strip (UTC week — **not** “this weekend only” stats) |
| API unavailable | Strip omitted; weekend honesty FAQ/callout unchanged |

## Copy guardrails

**Use:**

- PartyLine listings snapshot
- currently tracked by PartyLine
- upcoming and live listings
- updated [time]
- public preview
- Open the app for the full calendar

**Avoid:**

- every event / total market / complete coverage claims
- most popular / top / best / ranked / #1 / market share
- leaderboard or “top formats” language

Quick grep (should return no matches in Scene Index helpers/components):

```bash
rg -i 'most active|top genres|most popular|market share|#1' src/lib/event-directory-stats.ts src/components/directory/ src/lib/event-landing-data.ts
```

## Event preview sanity

- [ ] Preview cards link to the app (`PUBLIC_APP_URL` / `PUBLIC_APP_API_URL` origin)
- [ ] Empty states show honest copy + CTA (not fake events)
- [ ] Directory, homepage, and landing pages still build when preview API fails

## Basic SEO smoke

- [ ] `/events` — unique title and meta description
- [ ] One city page (e.g. Perth) — canonical URL correct
- [ ] One genre page — canonical URL correct
- [ ] Sitemap builds (`dist/sitemap-index.xml` after `npm run build`)

## Accessibility smoke

- [ ] Directory stats row has accessible list label
- [ ] Formats strip chips readable at mobile width (wrap, no horizontal overflow)
- [ ] Focus visible on filter chips and teaser CTAs
- [ ] Snapshot sections use semantic headings (eyebrow + title)

## Sign-off

| Date | Environment | Tester | Normal build | Fallback build | Notes |
|------|-------------|--------|--------------|----------------|-------|
| | | | ☐ Pass | ☐ Pass | |

---

Related: webapp public Scene Index API lives in `partyline-webapp` (`GET /api/public/scene-index`). Website counts refresh on each deploy/build.
