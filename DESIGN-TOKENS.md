# PartyLine Design Tokens & Primitives

Foundation layer for the PartyLine visual design system. Introduced in **W10b**.
Page redesigns (homepage, hubs, role pages, guides/blog, app) happen in **later
W10 phases** — this layer is mostly additive and is not yet adopted across pages.

## Design principle: Signal over noise

Green `#3ce861` is **signal**, not decoration. Use it for:

- key actions and primary interaction
- live / active / available state
- status indicators
- focus rings and hover feedback

Do **not** scatter green as ambient decoration across every section. Most
surfaces stay dark and neutral; green earns attention.

## Token categories (`src/styles/tokens.css`)

| Category | Tokens |
| --- | --- |
| Core palette (live) | `--color-bg`, `--color-surface`, `--color-surface-soft`, `--color-border`, `--color-primary`, `--color-text`, `--color-muted`, `--color-muted-strong` |
| Signal | `--signal`, `--signal-strong`, `--signal-soft`, `--signal-glow` |
| Surfaces | `--surface-0`, `--surface-1`, `--surface-2`, `--surface-3` |
| Borders | `--border-subtle`, `--border-strong`, `--border-focus` |
| Elevation / glow | `--elevation-1`, `--elevation-2`, `--glow-signal` |
| Status | `--status-live`, `--status-open`, `--status-closing`, `--status-closed`, `--status-planned`, `--status-info` |
| Radius | `--radius-xs`, `--radius-sm`, `--radius-card` (8px), `--radius-panel` (10px), `--radius-md`, `--radius-pill` |
| Typography | `--text-display` … `--text-eyebrow`, `--leading-*`, `--weight-*`, `--tracking-*` |
| Spacing | `--space-1` … `--space-12`, `--section-gap` |
| Motion | `--duration-fast`, `--duration-base`, `--ease-out` |
| Layers | `--z-base`, `--z-header`, `--z-overlay`, `--z-modal`, `--z-skip` |
| Texture | `--texture-grain` (used by the unused `.u-grain` utility) |

### Surface ladder

Depth is expressed through lightness, darkest to lightest:

`--surface-0` (page bg) → `--surface-1` → `--surface-2` → `--surface-3`

Pair with `--border-subtle` for quiet edges and `--border-strong` for defined
panels. `--border-focus` (green) is reserved for focus/active states.

> **W10b note:** the live core aliases (`--color-surface` etc.) keep their exact
> current hex values. The surface ladder is consumed by the new primitives only;
> existing pages are intentionally not retuned yet.

## Status vocabulary

Shared words across website (and later the app):

`live` · `open` · `closing` · `closed` · `planned` · `alpha`

- `live` / `open` / `alpha` → green signal
- `closing` → restrained amber `#f5b544` (closing-soon / warning only)
- `closed` / `planned` → muted neutral

**Never fabricate statuses on real data cards** (events / profiles /
opportunities). Badges are for genuine state only.

## Empty-state vocabulary

`no-data` · `unavailable` · `coming-soon`

- `no-data` — nothing here yet (calm, expected)
- `unavailable` — data could not load (honest, non-alarming)
- `coming-soon` — planned / not live yet

## Primitive components (`src/components/ui/`, `src/components/previews/`)

| Component | Purpose | Adopted in W10b? |
| --- | --- | --- |
| `PremiumCard` | Base card (`feature` / `content` / `preview` / `quiet` / `status`) | No |
| `SectionShell` | Section wrapper (`default` / `band` / `feature` / `editorial` / `inset`) | No |
| `StatusCallout` | Notes/status (`info` / `alpha` / `success` / `warning` / `roadmap`) | Yes — once on `/guides` |
| `RelatedLinks` | Unified related-links block | No |
| `EmptyState` | Designed empty states (`no-data` / `unavailable` / `coming-soon`) | No |
| `StatusBadge` | Status badge/dot (real state only) | No |
| `ImagePlaceholder` | Branded missing-image fallback | No |
| `PreviewPanel` | Frame for app-sourced live previews | No (wraps previews in W10d) |

## App portability notes

Tokens are framework-agnostic CSS custom properties — the goal is to copy this
token layer into `partyline-webapp` later without renaming.

- **CSS variables:** unprefixed, shared names. Keep names stable.
- **Conventions:** card variants, button variants (`primary` / `secondary` /
  `ghost`), the status vocabulary and the empty-state vocabulary should be reused
  verbatim in the app.
- **Forms / dashboards:** the app's inputs, tables and dashboard cards should
  consume `--surface-2/3`, `--border-subtle/strong`, `--border-focus`,
  `--radius-card` and the status palette directly.

## Texture

`.u-grain` layers a very faint (opacity ~0.035) static noise overlay using
`--texture-grain`. It is **defined but not applied globally** in W10b. No heavy
image assets are used.

---

**Reminder:** redesign of individual pages, card migration, preview framing and
app alignment are scheduled for later W10 phases (W10c–W10h). W10b is foundations
only.
