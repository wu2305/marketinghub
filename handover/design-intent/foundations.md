# Foundations — the visual language behind the original

Status: **Phase 1 proposal, awaiting user review** (2026-09-27). Nothing in `src/design` has changed yet.

Rule this document serves (user decision, 2026-09-27): the original bundle is *evidence of intent*, not a
spec. The React UI must be recognisably the same product ("likely"), not a pixel copy. Accidental
inconsistencies collapse onto one role each; a variation keeps its own token only when it serves a
different purpose.

## 1. What the original actually declares

The strongest evidence of intent is not the 1,478 colour literals — it is the small theme that the original
author declared **four separate times**, once per generation of the demo, with nearly the same values:

| role | `base/workspace.css:34–47` | `base/theme.css:2–18` (`--v4-*`) | `components/assistant-panel.css:20–32` (`--ai-*`) | `governance/review.css:2–17` |
|---|---|---|---|---|
| page | `#f3f5f7` | `#f4f6f8` | `#f4f6f8` | `#f4f6f8` |
| surface | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` |
| surface soft | `#f7f9fa` | `#f7f7f7` | `#f7f8fa` | — |
| ink | `#16191d` | `#141414` | `#171b1f` | `#15130f` |
| copy | `#3f4852` | `#3f4854` | `#4f5963` | — |
| muted | `#68727c` | `#6b7280` | `#717b85` | `rgba(21,19,15,.58)` |
| faint | `#8b949d` | `#8b929a` | — | — |
| line | `#dce1e6` | `#dfe3e8` | `#dce1e6` | `rgba(21,19,15,.12)` |
| line strong | `#c8d0d8` | `#cbd2d9` | `#bcc5ce` | — |
| brand gold | `#e6bc73` | `#e6bc73` | `#e6bc73` | — |
| blue / teal / green / red | `#3f73a6` `#2d7972` `#34765b` `#9b1230` | same | same (no teal) | Tailwind amber/green/red |

Reading: **one cool-slate neutral ramp (page → surface → 4 ink steps → 2 line steps), one warm gold brand
accent, four muted status hues.** Every later page re-declared this instead of importing it, then drifted by
a few units. That drift — not a design decision — is what the rest of the CSS is made of.

Two further intents are visible in usage rather than declarations:

- **The gold is used as a gradient, not a flat colour.** Primary actions use
  `linear-gradient(135deg, #f2d185, #daa860)` (`base/workspace.css:201,252,325`); `#f2d185` (89 background
  uses) and `#daa860` (84 background + 70 border uses) are the two most-used chromatic values in the whole
  bundle. The declared `#e6bc73` is almost never painted.
- **Dark surfaces are an inverse context, not a second theme.** The Home hero, the assistant launcher and
  the live-report chrome sit on near-black slate (`#20262c`, `#1a1d20`, `#14171a`) with white text at
  62–72 % alpha. `reports/report-core.css:46–64` declares a full dark palette, but the React rebuild only
  uses it for accents over the light catalogue skin.

Typography: DIN 2014 for everything (`base/foundation.css:40–45`, `base/workspace.css:30–32` alias
`--font-ui`/`--font-copy`/`--font-heading` all to DIN), BentonModDisplay semibold italic for display
headlines, a monospace only for formulas/code.

## 2. What the CSS does in practice (counts)

Scanned: all 50 files in `assets/css` (50,093 lines), comments stripped, `!important` ignored for
classification. Colours normalised (3→6 digit hex, `rgb()`→hex, alpha kept separately). Role comes from the
property: `color`/`fill`/`stroke` → text, `background*` → surface, `border*`/`outline*` → line.

| dimension | distinct values | uses | notes |
|---|---:|---:|---|
| colour (all) | 1,478 | 5,021 | 568 solid text colours; 326 solid surface; 310 solid line; 212 alpha variants |
| font-size | 77 | — | 44 px values from 5 px to 72 px, plus 30 rem values and 2 `clamp()` |
| font-weight | 21 | — | 300, 400, 500, 520, 560, 580, 600, 620, 650, 660, 680, 700, 720, 730, 740, 750, 760, 780, 800, 900 |
| border-radius | 39 | — | 18 single values + per-corner combinations |
| box-shadow | 175 | 250 | |
| spacing (px in padding/margin/gap) | 64 | 4,217 | 49 % on a 4 px grid, 35 % on 2 px, 16 % odd |
| `@media` widths | 24 | — | 560–1280 px, no two files share a set |
| `!important` | — | 1,502 | cascade fights between generations |

### 2.1 Colour, clustered by role

Each distinct solid colour assigned to its nearest proposed role (§3) inside its property role. Top four
literal values per cluster shown; the declared theme value is the anchor where one exists.

| role | proposed token | distinct originals | uses | most-used originals |
|---|---|---:|---:|---|
| text | `--mh-text-strong` | 71 | 425 | `#1a1d20`×206, `#111111`×21, `#1c2328`×18, `#171b1f`×16 |
| text | `--mh-text` | 86 | 209 | `#3f4c55`×32, `#403e3b`×19, `#2f3a45`×10, `#383634`×8 |
| text | `--mh-text-muted` | 135 | 357 | `#5d6872`×80, `#6a747c`×18, `#77736d`×14, `#6b7280`×12 |
| text | `--mh-text-faint` | 111 | 290 | `#8b949d`×84, `#99948a`×11, `#9ca3af`×10, `#9aa0a8`×10 |
| text | `--mh-text-inverse` | 4 | 138 | `#ffffff`×133 |
| text | `--mh-accent-ink` | 72 | 173 | `#986525`×14, `#c8892b`×13, `#8c5622`×13, `#8a5a00`×10 |
| text | `--mh-success` | 28 | 70 | `#2e7d32`×26, `#047857`×7, `#78b52b`×5, `#28785f`×4 |
| text | `--mh-danger` | 26 | 70 | `#c62828`×11, `#b91c1c`×8, `#dc2626`×5 |
| text | `--mh-info` | 31 | 79 | `#1565c0`×15, `#414b66`×11, `#171b35`×7 |
| text | `--mh-warning` | 3 | 23 | `#e65100`×17, `#b45309`×5 |
| surface | `--mh-surface` | 8 | 435 | `#ffffff`×421 |
| surface | `--mh-surface-page` | 23 | 129 | `#f5f7f8`×43, `#f4f6f8`×32 |
| surface | `--mh-surface-subtle` | 28 | 125 | `#f9fafb`×17, `#f6f7f8`×17, `#fafbfc`×11 |
| surface | `--mh-surface-muted` | 40 | 123 | `#f0f2f4`×47, `#f1f2f3`×5 |
| surface | `--mh-surface-inverse` | 41 | 75 | `#20262c`×14, `#1a1d20`×9 |
| surface | `--mh-accent` | 36 | 138 | `#daa860`×84, `#c17d22`×6 |
| surface | `--mh-accent-soft` | 13 | 105 | `#f2d185`×89 |
| surface | `--mh-accent-wash` | 55 | 167 | `#fff8df`×24, `#fff3e0`×15, `#fffbeb`×11 |
| surface | status washes (derived) | 48 | 125 | `#e8f5e9`×21, `#e3f2fd`×15, `#ffebee`×6 |
| line | `--mh-line-subtle` | 50 | 253 | `#e2e8ed`×56, `#e8ecef`×52, `#e5e7eb`×23 |
| line | `--mh-line` | 88 | 287 | `#d8e0e6`×65, `#d8d4cd`×15, `#dce1e6`×11 |
| line | `--mh-line-strong` | 45 | 84 | `#cfd6db`×9, `#b0bec5`×9, `#c8d2d8`×7 |
| line | `--mh-accent` | 47 | 159 | `#daa860`×70, `#c9a44a`×12 |

So 1,478 literals express roughly **22 roles**. The spread inside each role is drift: e.g. 135 different
"muted text" greys, all within a few ΔE of `#68727c`, none of them carrying a different meaning.

Three kinds of drift worth naming, because they explain what gets merged:

1. **Generational copies.** Each page family re-declared the palette (§1) and then hard-coded near-misses of
   it.
2. **Borrowed palettes.** Review, Feedback and the assistant chips use Material (`#2e7d32`, `#c62828`,
   `#1565c0`, `#e65100`, `#e8f5e9` …) and Tailwind (`#10b981`, `#ef4444`, `#f59e0b`) literals instead of the
   declared status hues. Same meaning, different library.
3. **Warm greys.** Business Term, Principles and the checkbox filter use a warm-grey ink ramp (`#403e3b`,
   `#77736d`, `#99948a`, `#383634`, `#e4e0d9`) next to the cool slate ramp of the rest of the page. Nothing in
   the content distinguishes those views; it reads as a different author.

### 2.2 Type

| proposed step | originals folded in | distinct | uses |
|---|---|---:|---:|
| `xs` 11 px | 5–11.5 px, 0.63–0.72 rem | 18 | 639 |
| `sm` 12 px | 12, 12.5 px, 0.74–0.78 rem | 6 | 397 |
| `md` 13 px (body) | 13, 13.5 px, 0.8–0.84 rem | 6 | 278 |
| `lg` 14 px | 14 px, 0.85–0.9 rem | 3 | 184 |
| `xl` 16 px | 15–17 px, 0.92–1.02 rem | 7 | 135 |
| `2xl` 20 px | 18–21 px, 1.1–1.18 rem | 6 | 79 |
| `3xl` 24 px | 22–34 px, 1.58–1.8 rem | 15 | 95 |
| `display` 56 px | 37–72 px, 2.6–2.8 rem, two `clamp()` | 12 | 29 |

**Font weight is already three values in the browser.** Only three DIN files exist: Light 300, Regular 400,
Bold 700 (`tokens.css:11–37`, `assets/fonts/`). CSS font matching renders any requested 500 as 400 and any
600–900 as 700. The 21 authored weights (and the 13 still in `src/design`) are therefore invisible noise:
the actual design uses **light (long copy), regular, bold**.

### 2.3 Radius, elevation, spacing, breakpoints

| radius step | originals folded in | uses |
|---|---|---:|
| `sm` 4 px (tags, small controls) | 2–5 px | 135 |
| `md` 8 px (controls, cards, rows) | 6–10 px | 491 |
| `lg` 14 px (panels, dialogs, large cards) | 11–26 px | 90 |
| `pill` 999 px / `50%` (chips, avatars, dots) | 99 px, 999 px, 50 % | 205 |

| elevation step | originals folded in (by largest blur) | distinct | uses |
|---|---|---:|---:|
| `raised` — resting cards, chips | blur ≤ 12 px | 27 | 33 |
| `overlay` — hover cards, popovers, menus, toasts | blur 13–40 px | 83 | 108 |
| `modal` — dialogs, drawers, full panels | blur > 40 px | 26 | 41 |
| (not elevation) focus/selection ring `0 0 0 Npx` | — | 33 | 54 |

Spacing: 4,217 px values; 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24 account for 75 %. Odd values (5, 7, 9, 11,
13, 15 …) are 16 % and come from nudging, not rhythm.

Breakpoints: the original uses 24 different `max-width` values; `src/design` uses ~20. Three clusters carry
almost all of them: **~1180** (1080–1280: wide layouts drop a column), **~900** (820–980: sidebars stack),
**~760** (560–800: single column / phone).

## 3. Proposed foundation (~65 tokens instead of 445)

Anchor rule: take the value the original *declared* in its theme (`base/workspace.css:34–47`); where it
declared none, take the most-used literal in the cluster. The result should look like the original at a
glance, because every anchor is the original's own dominant value.

### 3.1 Colour (29)

| group | tokens | values | purpose |
|---|---|---|---|
| text (6) | `--mh-text-strong` · `--mh-text` · `--mh-text-muted` · `--mh-text-faint` · `--mh-text-inverse` · `--mh-text-inverse-muted` | `#16191d` · `#3f4852` · `#68727c` · `#8b949d` · `#ffffff` · `rgba(255,255,255,.7)` | headings/values · body · secondary/meta · placeholder, disabled, large captions only (3.1:1 on white — not for body text) · on dark · secondary on dark |
| surface (6) | `--mh-surface-page` · `--mh-surface` · `--mh-surface-subtle` · `--mh-surface-muted` · `--mh-surface-inverse` · `--mh-scrim` | `#f4f6f8` · `#ffffff` · `#f7f9fa` · `#f0f2f4` · `#20262c` · `rgba(31,41,55,.3)` | canvas · cards/panels · table heads, hover rows, soft panels · neutral chips, disabled fills · hero/launcher/tooltip · behind overlays |
| line (4) | `--mh-line-subtle` · `--mh-line` · `--mh-line-strong` · `--mh-line-inverse` | `#e8ecef` · `#dce1e6` · `#c8d0d8` · `rgba(255,255,255,.12)` | dividers inside a surface · card and control borders · hover/emphasis borders · lines on dark |
| accent (5) | `--mh-accent-soft` · `--mh-accent` · `--mh-accent-ink` · `--mh-accent-wash` · `--mh-accent-fill` | `#f2d185` · `#daa860` · `#986525` · `#fff8df` · `linear-gradient(135deg, #f2d185, #daa860)` | light gold · active borders, selected markers · gold text/links/toggles (5.0:1 on white) · selected/highlighted backgrounds · primary action fill |
| status (4) | `--mh-success` · `--mh-warning` · `--mh-danger` · `--mh-info` | `#34765b` · `#b45309` · `#9b1230` · `#3f73a6` | status ink/icon/border. Washes and tinted borders are **derived**, not tokens: `color-mix(in srgb, var(--mh-success) 10%, var(--mh-surface))` |
| data (3) | `--mh-data-teal` · `--mh-data-violet` · `--mh-data-rose` | `#2d7972` · `#6941c6` · `#c2185b` | categorical identity (feedback/memory categories, chart series) beyond the four status hues |
| focus (1) | `--mh-focus-ring` | `rgba(63,115,166,.55)` as `2px solid`, offset 2 px | the original's global `:focus-visible` (`base/workspace.css:276–279`) |

### 3.2 Type (14)

- Families (3): `--mh-font-sans` DIN 2014 · `--mh-font-display` BentonModDisplay · `--mh-font-mono`.
- Weights (3): `--mh-font-weight-light` 300 · `--mh-font-weight-regular` 400 · `--mh-font-weight-bold` 700.
- Sizes (8): `--mh-font-size-xs` 11 · `sm` 12 · `md` 13 · `lg` 14 · `xl` 16 · `2xl` 20 · `3xl` 24 ·
  `display` `clamp(40px, 5vw, 56px)`. (Sizes use `font-size`, not `text`, so they never collide with the
  `--mh-text-*` colour family.) Line height follows size role: 1.2 headings, 1.5 body, 1 for
  single-line chips (the three most-used original line heights).

### 3.3 Shape, depth, space, layout (22)

- Radius (4): `--mh-radius-sm` 4 · `md` 8 · `lg` 14 · `pill` 999 (full names `--mh-radius-md` etc.).
- Shadow (3): `--mh-shadow-raised` `0 2px 8px rgba(31,41,55,.06)` · `--mh-shadow-overlay`
  `0 16px 40px rgba(24,33,42,.18)` · `--mh-shadow-modal` `0 28px 80px rgba(31,41,55,.2)`. Overlay and modal
  are the existing `--mh-popover-shadow` / `--mh-modal-shadow`; the raised cluster has no dominant value (its
  most-used literal appears 4×), so `raised` is its median, tinted with the slate shadow colour the other two
  use.
- Space (9): `--mh-space-1…9` = 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48. Half-steps (6, 10, 14) only inside
  dense controls, where they are a property of the control, not a token.
- Layout (4): `--mh-layout-header-height` 56 · `--mh-z-launcher` · `--mh-z-overlay` · `--mh-z-modal`
  (`header` is a reserved component prefix in `css-budget.test.js`, hence `layout`).
- Breakpoints (3, documented constants — CSS cannot read custom properties in `@media`): 1180 · 900 · 760.

Total: 29 + 14 + 22 = **65**.

## 4. From 445 tokens to 65

| action | tokens | meaning |
|---|---:|---|
| merge | 393 | references move to a role token; rendered value may shift a few units |
| derive | 27 | status/accent washes become `color-mix()` of their role colour |
| remove | 11 | 10 unused + 1 image filter that belongs to its one component |
| keep / rename | 14 | fonts, header height, z-scale, control radius |

Per-token detail: Appendix A. Of the current 445, 160 have exactly one owner directory, and 162 sit on the
CSS budget's legacy-name exemption list (`css-budget.json` `legacyPrefixExemptions`: named after a
component or page — `--mh-bt-*`, `--mh-reports-*`, `--mh-copilot-*`, `--mh-principle-*`, `--mh-sc-*` …).
Many of the rest carry the location in the suffix instead (`--mh-ink-report-copy`,
`--mh-line-sidebar-cool`, `--mh-surface-scenario-hover`). The token file records *where* a colour was seen,
not *what it is for*.

Outside the token file, component CSS still carries 72 raw `rgba()` literals (56 distinct), 34 font sizes,
29 radii, 67 shadows and 13 weights. The hex budget (`css-budget.json`) does not count these; the Phase 2
budget should.

## 5. Decisions (user-approved 2026-09-27)

All five recommendations were approved by the user on 2026-09-27; the "recommendation" column is now the rule.

| # | question | recommendation | alternative |
|---|---|---|---|
| D1 | Smallest text: fold 9–10 px (≈290 uses: eyebrows, badges, table meta) into 11 px? | **Yes, 11 px.** 9–10 px DIN is below comfortable reading size; uppercase + letter-spacing keeps the "eyebrow" look | keep a 10 px `2xs` step for uppercase labels only (9 sizes) |
| D2 | One focus ring colour? | **Blue** `rgba(63,115,166,.55)`, the global rule | gold, which several knowledge components use locally |
| D3 | Warning hue vs brand gold: the current `--mh-ink-warning #9b6218` is indistinguishable from `--mh-accent-ink #986525` | **Separate them:** warning = orange-amber `#b45309` (used in the original's warning icons) so "warning" never reads as "brand highlight" | keep warning gold and rely on icons |
| D4 | Warm-grey ramp in Business Term / Principles / checkbox filter | **Merge into the cool slate ramp** (drift, §2.1 item 3) | keep a warm sub-palette for knowledge views |
| D5 | Material/Tailwind status literals in Review/Feedback/assistant chips | **Map to the four declared status hues** (brighter chart green/red included) | keep brighter chart colours as `data-positive/negative` |

## 6. How Phase 2 uses this

- New or migrated components reference only §3 tokens. A new token needs a purpose no existing token
  serves, stated in one line.
- Visual review asks two questions per view: *does it use the foundation?* and *would someone who knows the
  original recognise it?* — not "is it pixel-identical?".
- Appendix A is a first-pass map. Each migration PR re-checks the rows it touches and corrects the map in
  the same PR.


## Appendix A — every current token → proposed role

Generated by a first-pass classifier: the role comes from the CSS property each token is used on (`color` → text, `background` → surface, `border`/`outline` → line); within the role the nearest proposed value in CIELAB wins; chromatic values go to a hue family first. It is a starting map for review, not a verdict — Phase 2 migrations re-check each row they touch. `refs` counts `var()` references outside tokens.css (token-to-token references included); `owners` counts distinct component/feature/page directories that use it.

Actions: **keep** (already the role token) · **rename** · **merge** (replace references with the target; the rendered value may shift slightly — that is intended) · **derive** (replace with `color-mix(in srgb, <target> N%, var(--mh-surface))` at the use site) · **remove** (unused, or not a foundation — the value stays local to its one component).

### → `--mh-text-strong` (25)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-ink` | `#16191d` | 86 | 32 | merge |
| `--mh-ink-section-deep` | `#20272e` | 1 | 1 | merge |
| `--mh-ink-primary-deep` | `#1f252b` | 14 | 2 | merge |
| `--mh-ink-darkest` | `#111820` | 1 | 1 | merge |
| `--mh-ink-strong` | `#1a1d20` | 58 | 19 | merge |
| `--mh-ink-field` | `#1c2328` | 3 | 3 | merge |
| `--mh-ink-dark-control` | `#20262c` | 1 | 1 | merge |
| `--mh-ink-action-strong` | `#111111` | 5 | 3 | merge |
| `--mh-ink-ai` | `#171b1f` | 17 | 3 | merge |
| `--mh-reports-ink` | `#17191c` | 26 | 4 | merge |
| `--mh-sc-ink` | `#1f2329` | 8 | 3 | merge |
| `--mh-ink-black-soft` | `#141414` | 13 | 4 | merge |
| `--mh-ink-black` | `#000000` | 4 | 3 | merge |
| `--mh-copilot-card-ink` | `#101820` | 6 | 3 | merge |
| `--mh-ink-primary-neutral` | `#26262a` | 4 | 1 | merge |
| `--mh-principle-title` | `#20252a` | 3 | 3 | merge |
| `--mh-principle-search-ink` | `#292724` | 4 | 3 | merge |
| `--mh-ink-heading-warm` | `#1d1c1b` | 5 | 1 | merge |
| `--mh-bt-drawer-title` | `#252423` | 3 | 3 | merge |
| `--mh-bt-section-title` | `#20262d` | 5 | 3 | merge |
| `--mh-ink-recipient` | `#2d2b29` | 1 | 1 | merge |
| `--mh-ink-primary-button` | `#1c2630` | 2 | 1 | merge |
| `--mh-ink-row-title` | `#1d252b` | 2 | 2 | merge |
| `--mh-ink-row-primary` | `#1f282f` | 4 | 3 | merge |
| `--mh-ink-empty-strong` | `#202930` | 1 | 1 | merge |

### → `--mh-text` (27)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-copy` | `#3f4852` | 30 | 15 | merge |
| `--mh-ink-card-copy` | `#2f3a45` | 1 | 1 | merge |
| `--mh-ink-report-copy` | `#344054` | 1 | 1 | merge |
| `--mh-ink-metric-copy` | `#343230` | 1 | 1 | merge |
| `--mh-ink-control-slate` | `#334155` | 2 | 2 | merge |
| `--mh-ink-copy-dark` | `#3e464e` | 5 | 3 | merge |
| `--mh-ink-heading-slate` | `#313941` | 1 | 1 | merge |
| `--mh-ink-heading-charcoal` | `#2e343a` | 1 | 1 | merge |
| `--mh-subtle` | `#4a5260` | 1 | 1 | merge |
| `--mh-copy-ai` | `#4f5963` | 13 | 3 | merge |
| `--mh-subtle-ai` | `#4b5563` | 2 | 1 | merge |
| `--mh-reports-copy` | `#46505b` | 19 | 3 | merge |
| `--mh-ink-secondary-dark` | `#3f4854` | 4 | 2 | merge |
| `--mh-ink-secondary-cool` | `#415064` | 4 | 1 | merge |
| `--mh-hr-insight-ink` | `#444441` | 3 | 3 | merge |
| `--mh-ra-insight-ink` | `#3f3f3c` | 3 | 3 | merge |
| `--mh-check-filter-ink` | `#383634` | 5 | 4 | merge |
| `--mh-check-filter-option` | `#4a4743` | 4 | 4 | merge |
| `--mh-principle-copy` | `#4d5963` | 3 | 3 | merge |
| `--mh-pagination-select-ink` | `#404850` | 3 | 3 | merge |
| `--mh-bt-copy` | `#403e3b` | 20 | 3 | merge |
| `--mh-bt-dialog-ink` | `#354253` | 4 | 3 | merge |
| `--mh-ink-state` | `#25313d` | 2 | 1 | merge |
| `--mh-ink-secondary-button` | `#303d4c` | 3 | 2 | merge |
| `--mh-ink-dialog-title` | `#243143` | 1 | 1 | merge |
| `--mh-ink-dialog-input` | `#2b394a` | 1 | 1 | merge |
| `--mh-ink-control-deep` | `#3f4c55` | 11 | 3 | merge |

### → `--mh-text-muted` (41)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-muted` | `#68727c` | 77 | 25 | merge |
| `--mh-ink-label-steel` | `#69747f` | 3 | 2 | merge |
| `--mh-ink-copy-slate` | `#6b7682` | 2 | 1 | merge |
| `--mh-ink-icon-muted` | `#77828d` | 1 | 1 | merge |
| `--mh-ink-table-caption` | `#596570` | 2 | 1 | merge |
| `--mh-ink-neutral-copy` | `#5f6367` | 1 | 1 | merge |
| `--mh-ink-secondary-slate` | `#66717b` | 2 | 2 | merge |
| `--mh-ink-table-muted` | `#65717c` | 2 | 2 | merge |
| `--mh-ink-row-muted` | `#68737e` | 2 | 1 | merge |
| `--mh-ink-flow-muted` | `#536170` | 2 | 1 | merge |
| `--mh-ink-flow-secondary` | `#667085` | 2 | 1 | merge |
| `--mh-ink-status-neutral` | `#607080` | 1 | 1 | merge |
| `--mh-slate` | `#5b6678` | 2 | 1 | merge |
| `--mh-icon-slate` | `#5b6470` | 3 | 3 | merge |
| `--mh-muted-ai` | `#717b85` | 9 | 3 | merge |
| `--mh-muted-strong` | `#6a747c` | 6 | 3 | merge |
| `--mh-ink-secondary-muted` | `#5d6872` | 26 | 8 | merge |
| `--mh-reports-muted` | `#737d88` | 26 | 5 | merge |
| `--mh-ink-faint-warm` | `#74726c` | 5 | 1 | merge |
| `--mh-sc-label` | `#5a6068` | 8 | 3 | merge |
| `--mh-ink-muted-neutral` | `#6b7280` | 6 | 2 | merge |
| `--mh-copilot-card-faint` | `#667487` | 4 | 3 | merge |
| `--mh-hr-mid` | `#5f5e5a` | 4 | 3 | merge |
| `--mh-principle-badge-ink` | `#5e6872` | 3 | 3 | merge |
| `--mh-principle-empty-ink` | `#6f7a83` | 3 | 3 | merge |
| `--mh-principle-search-placeholder` | `#77716b` | 4 | 3 | merge |
| `--mh-bt-state-off-ink` | `#77736d` | 3 | 3 | merge |
| `--mh-ink-icon-warm-muted` | `#6f665d` | 2 | 1 | merge |
| `--mh-bt-countline` | `#6f6961` | 4 | 3 | merge |
| `--mh-bt-empty` | `#78838d` | 4 | 3 | merge |
| `--mh-bt-chip-ink` | `#536576` | 5 | 4 | merge |
| `--mh-bt-confirm-copy` | `#737e90` | 3 | 3 | merge |
| `--mh-bt-pag-ink` | `#6c7785` | 3 | 3 | merge |
| `--mh-ink-empty-report` | `#778391` | 1 | 1 | merge |
| `--mh-ink-meta-label` | `#697789` | 2 | 1 | merge |
| `--mh-ink-description` | `#6b7787` | 1 | 1 | merge |
| `--mh-ink-dialog-label` | `#5a6778` | 1 | 1 | merge |
| `--mh-ink-status-gray` | `#616161` | 0 | 0 | remove (unused) |
| `--mh-ink-empty-muted` | `#64717a` | 3 | 3 | merge |
| `--mh-ink-filter-label` | `#74808a` | 1 | 1 | merge |
| `--mh-ink-navigation` | `#60666d` | 1 | 1 | merge |

### → `--mh-text-faint` (31)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-faint` | `#8b949d` | 36 | 15 | merge |
| `--mh-ink-disabled-soft` | `#c9d2dc` | 1 | 1 | merge |
| `--mh-ink-thumbnail-muted` | `#788493` | 1 | 1 | merge |
| `--mh-ink-sidebar-muted` | `#87919b` | 1 | 1 | merge |
| `--mh-indicator-muted` | `#8c96a0` | 1 | 1 | merge |
| `--mh-ink-control-muted` | `#a2a9b0` | 2 | 2 | merge |
| `--mh-ink-neutral-mid` | `#8c8c8c` | 1 | 1 | merge |
| `--mh-ink-neutral-light` | `#b0b0b0` | 2 | 1 | merge |
| `--mh-ink-placeholder-cool` | `#a5aeb7` | 1 | 1 | merge |
| `--mh-stroke-graph-muted` | `#9ba8b5` | 1 | 1 | merge |
| `--mh-fill-graph-muted` | `#9aa9b8` | 1 | 1 | merge |
| `--mh-ink-attachment-muted` | `#7b8794` | 1 | 1 | merge |
| `--mh-kicker` | `#b8b4ae` | 1 | 1 | merge |
| `--mh-disabled-ink` | `#8a949e` | 2 | 2 | merge |
| `--mh-empty` | `#8a93a5` | 1 | 1 | merge |
| `--mh-placeholder` | `#a8afb8` | 2 | 1 | merge |
| `--mh-search-placeholder` | `#8e959d` | 1 | 1 | merge |
| `--mh-ink-faint-neutral` | `#9aa0a8` | 12 | 1 | merge |
| `--mh-sc-note` | `#8a9099` | 4 | 3 | merge |
| `--mh-copilot-placeholder` | `#8a939d` | 3 | 3 | merge |
| `--mh-hr-muted` | `#8a8a85` | 4 | 3 | merge |
| `--mh-hr-index` | `#a29b8c` | 4 | 3 | merge |
| `--mh-hr-grid-zero` | `#c9c7bd` | 3 | 3 | merge |
| `--mh-hr-axis` | `#aab0b8` | 4 | 3 | merge |
| `--mh-check-filter-label` | `#969188` | 4 | 4 | merge |
| `--mh-bt-label` | `#99948a` | 10 | 3 | merge |
| `--mh-bt-action-disabled` | `#858b91` | 3 | 3 | merge |
| `--mh-bt-status-off-ink` | `#8b8f94` | 4 | 4 | merge |
| `--mh-bt-status-off-dot` | `#929292` | 4 | 4 | merge |
| `--mh-ink-empty` | `#8f9aa5` | 1 | 1 | merge |
| `--mh-ink-action-disabled` | `#aeb7c1` | 4 | 1 | merge |

### → `--mh-text-inverse` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-ink-inverse` | `#ffffff` | 10 | 7 | merge |

### → `--mh-accent` (32)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-indicator-selection-warm` | `#b08d57` | 1 | 1 | merge |
| `--mh-gold` | `#e6bc73` | 16 | 8 | merge |
| `--mh-line-gold-active` | `#d9ad67` | 5 | 3 | merge |
| `--mh-indicator-active` | `#b87926` | 2 | 1 | merge |
| `--mh-line-active-warm` | `#b08d57` | 2 | 2 | merge |
| `--mh-indicator-amber` | `#b88a3d` | 1 | 1 | merge |
| `--mh-index-line` | `#d8c76f` | 1 | 1 | merge |
| `--mh-gold-medium` | `#daa860` | 56 | 26 | merge |
| `--mh-gold-rule` | `#b28c2d` | 9 | 3 | merge |
| `--mh-copilot-fb-pressed-bg` | `#e7bb6b` | 3 | 3 | merge |
| `--mh-hr-dot-warn` | `#e6a23c` | 3 | 3 | merge |
| `--mh-line-highlight-chart` | `#c9a44a` | 4 | 1 | merge |
| `--mh-bt-action` | `#c8892b` | 12 | 4 | merge |
| `--mh-line-control-warm` | `#d9bd91` | 2 | 1 | merge |
| `--mh-line-control-focus-warm` | `#b98234` | 2 | 1 | merge |
| `--mh-gold-action-start` | `#e3ba6d` | 3 | 1 | merge |
| `--mh-gold-action-end` | `#cb8f2b` | 3 | 1 | merge |
| `--mh-gold-action-hover-end` | `#d59a33` | 3 | 1 | merge |
| `--mh-bt-status-on-dot` | `#c17d22` | 4 | 4 | merge |
| `--mh-line-card-active` | `#d69b3d` | 2 | 1 | merge |
| `--mh-line-card-hover-gold` | `#d9aa63` | 3 | 1 | merge |
| `--mh-line-card-hover-warm` | `#d8a24f` | 1 | 1 | merge |
| `--mh-line-scenario-focus` | `#b67a27` | 4 | 2 | merge |
| `--mh-line-primary-button` | `#d6a447` | 1 | 1 | merge |
| `--mh-surface-primary-button-hover` | `#ecc05c` | 1 | 1 | merge |
| `--mh-line-primary-button-hover` | `#bd8624` | 1 | 1 | merge |
| `--mh-line-dialog-input-focus` | `#c99a4a` | 1 | 1 | merge |
| `--mh-surface-dialog-button` | `#d3ad78` | 1 | 1 | merge |
| `--mh-line-dialog-button` | `#c79652` | 1 | 1 | merge |
| `--mh-surface-dialog-button-hover` | `#bf8f50` | 1 | 1 | merge |
| `--mh-line-dialog-button-hover` | `#b7813f` | 1 | 1 | merge |
| `--mh-surface-dialog-button-disabled` | `#dbc19b` | 1 | 1 | merge |

### → `--mh-accent-soft` (10)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-line-gold-soft` | `#ecd7bd` | 1 | 1 | merge |
| `--mh-line-gold-detail` | `#e5d4b6` | 1 | 1 | merge |
| `--mh-gold-light` | `#f2d185` | 28 | 19 | merge |
| `--mh-warn-line` | `#e5d58b` | 1 | 1 | merge |
| `--mh-chip-line` | `#e1c48f` | 3 | 3 | merge |
| `--mh-gold-action-hover-start` | `#ecc673` | 3 | 1 | merge |
| `--mh-surface-scenario-hover` | `#f7dfb4` | 1 | 1 | merge |
| `--mh-surface-primary-button` | `#f4c766` | 1 | 1 | merge |
| `--mh-line-dialog-button-disabled` | `#e1c9a7` | 1 | 1 | merge |
| `--mh-surface-accent-hover` | `#ffe99b` | 0 | 0 | remove (unused) |

### → `--mh-accent-wash` (26)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-surface-gold-wash` | `#fffaf2` | 7 | 3 | merge |
| `--mh-surface-gold-detail` | `#fff9ef` | 1 | 1 | merge |
| `--mh-surface-warning` | `#fff5e4` | 6 | 4 | merge |
| `--mh-surface-warm-soft` | `#f7efe2` | 4 | 2 | merge |
| `--mh-surface-warning-soft` | `#fff2d8` | 8 | 6 | merge |
| `--mh-surface-status-warm` | `#f6efe4` | 2 | 2 | merge |
| `--mh-surface-warning-pale` | `#fff9df` | 5 | 4 | merge |
| `--mh-hover-warm` | `#fffbeb` | 7 | 6 | merge |
| `--mh-chip-bg` | `#fff8eb` | 3 | 3 | merge |
| `--mh-reports-badge-bg` | `#fef8e1` | 5 | 3 | merge |
| `--mh-reports-pill-bg` | `#fff8db` | 7 | 5 | merge |
| `--mh-surface-gold-hover-soft` | `#faeed4` | 2 | 2 | merge |
| `--mh-check-filter-checked-bg` | `#f7f2e8` | 3 | 3 | merge |
| `--mh-principle-number-bg` | `#f4ede0` | 3 | 3 | merge |
| `--mh-pagination-hover-bg` | `#fff9f2` | 5 | 4 | merge |
| `--mh-bt-state-bg` | `#f7f1e5` | 3 | 3 | merge |
| `--mh-bt-action-hover-bg` | `#fff6e8` | 6 | 4 | merge |
| `--mh-bt-draft-bg` | `#f6ede0` | 3 | 3 | merge |
| `--mh-bt-status-on-bg` | `#fff4df` | 6 | 4 | merge |
| `--mh-surface-warning-icon` | `#fef3c7` | 1 | 1 | merge |
| `--mh-surface-recipient` | `#f4f1eb` | 1 | 1 | merge |
| `--mh-surface-edit` | `#fff8ec` | 2 | 1 | merge |
| `--mh-surface-edit-hover` | `#f9ead1` | 1 | 1 | merge |
| `--mh-surface-review` | `#fff3e0` | 2 | 2 | merge |
| `--mh-surface-gold-pale` | `#fff8df` | 4 | 3 | merge |
| `--mh-surface-gold-hover` | `#ffeeb3` | 0 | 0 | remove (unused) |

### → `--mh-accent-ink` (27)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-gold-deep` | `#a66f27` | 29 | 7 | merge |
| `--mh-gold-text` | `#986525` | 7 | 5 | merge |
| `--mh-ink-warning` | `#9b6218` | 5 | 1 | merge |
| `--mh-ink-warning-brown` | `#9f6b24` | 4 | 3 | merge |
| `--mh-ink-status-warm` | `#a16616` | 1 | 1 | merge |
| `--mh-amber` | `#9a7229` | 3 | 3 | merge |
| `--mh-index-ink` | `#6c5800` | 1 | 1 | merge |
| `--mh-warn-note` | `#776f4b` | 1 | 1 | merge |
| `--mh-ink-accent-warm` | `#8a5a00` | 5 | 4 | merge |
| `--mh-chip-ink` | `#3b2b14` | 3 | 3 | merge |
| `--mh-chip-icon` | `#6f5a35` | 3 | 3 | merge |
| `--mh-reports-badge-ink` | `#7a5c3a` | 4 | 3 | merge |
| `--mh-reports-pill-hover-ink` | `#6f4900` | 3 | 3 | merge |
| `--mh-reports-title-hover` | `#916732` | 3 | 3 | merge |
| `--mh-ra-icon-retail` | `#8a6d1f` | 3 | 3 | merge |
| `--mh-check-filter-checked-ink` | `#84611f` | 3 | 3 | merge |
| `--mh-principle-number-ink` | `#9a661a` | 3 | 3 | merge |
| `--mh-principle-toggle` | `#956318` | 3 | 3 | merge |
| `--mh-principle-toggle-hover` | `#71480d` | 3 | 3 | merge |
| `--mh-bt-state-ink` | `#b4872d` | 3 | 3 | merge |
| `--mh-bt-draft-ink` | `#a76412` | 3 | 3 | merge |
| `--mh-bt-drawer-eyebrow` | `#a57531` | 3 | 3 | merge |
| `--mh-bt-status-on-ink` | `#8c5622` | 7 | 4 | merge |
| `--mh-ink-edit` | `#d09135` | 1 | 1 | merge |
| `--mh-ink-edit-hover` | `#a96c16` | 2 | 1 | merge |
| `--mh-ink-scenario-hover` | `#6f3f12` | 1 | 1 | merge |
| `--mh-indicator-like` | `#f59e0b` | 0 | 0 | remove (unused) |

### → `--mh-accent-fill` (2)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-reports-card-edge` | `linear-gradient(180deg, #fcf5e6 0%, #f2d185 100%)` | 4 | 3 | merge |
| `--mh-reports-gold-btn` | `linear-gradient(135deg, #f2d185 0%, #daa860 100%)` | 7 | 3 | merge |

### → `--mh-surface` (3)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-surface` | `#ffffff` | 206 | 42 | keep |
| `--mh-surface-highlight-warm` | `#fdfbf6` | 3 | 2 | merge |
| `--mh-ra-insight-bg` | `#fbf9f4` | 3 | 3 | merge |

### → `--mh-surface-page` (11)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-bg` | `#f4f6f8` | 9 | 8 | merge |
| `--mh-surface-info-soft` | `#f3f8fc` | 3 | 3 | merge |
| `--mh-fill-soft` | `#f4f4f4` | 4 | 2 | merge |
| `--mh-surface-neutral-cool` | `#f3f5f7` | 4 | 4 | merge |
| `--mh-live-toolbar-bg` | `rgba(244, 246, 248, 0.96)` | 3 | 3 | merge |
| `--mh-sc-row-hover` | `#f3f5f8` | 3 | 3 | merge |
| `--mh-copilot-tool-bg` | `#f2f4f7` | 3 | 3 | merge |
| `--mh-surface-chip-cool` | `#f6f8fb` | 2 | 1 | merge |
| `--mh-bt-drawer-bg` | `#f6f7f9` | 4 | 4 | merge |
| `--mh-surface-status-gray` | `#f5f5f5` | 3 | 1 | merge |
| `--mh-surface-hover-neutral` | `#f5f7f8` | 0 | 0 | remove (unused) |

### → `--mh-surface-subtle` (10)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-bg-soft` | `#f7f9fa` | 23 | 14 | merge |
| `--mh-surface-dialog-tint` | `#f7f9fc` | 1 | 1 | merge |
| `--mh-row-hover` | `#fafbfc` | 3 | 3 | merge |
| `--mh-surface-ai` | `#f7f8fa` | 14 | 6 | merge |
| `--mh-page-bg` | `#f6f7f8` | 10 | 9 | merge |
| `--mh-bg-faint` | `#f9fafb` | 6 | 4 | merge |
| `--mh-surface-panel-muted` | `#fbfcfd` | 6 | 4 | merge |
| `--mh-surface-chart-neutral` | `#f7f7f7` | 2 | 1 | merge |
| `--mh-hr-surface` | `#faf9f6` | 4 | 3 | merge |
| `--mh-surface-dialog` | `#fbfcfe` | 1 | 1 | merge |

### → `--mh-surface-muted` (18)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-surface-neutral-soft` | `#f1f3f5` | 17 | 9 | merge |
| `--mh-surface-flow-neutral` | `#eef2f6` | 3 | 2 | merge |
| `--mh-surface-status-neutral` | `#f1f2f3` | 1 | 1 | merge |
| `--mh-disabled-bg` | `#e8ebee` | 3 | 3 | merge |
| `--mh-fill-hover` | `#f2f3f4` | 1 | 1 | merge |
| `--mh-line-faintest` | `#f0f2f4` | 11 | 8 | merge |
| `--mh-ai-feedback-line` | `#edf0f3` | 4 | 3 | merge |
| `--mh-reports-thumb-bg` | `#e9edf1` | 3 | 3 | merge |
| `--mh-reports-media-bg` | `#dfe4e8` | 4 | 4 | merge |
| `--mh-live-bar` | `#d8d4c9` | 3 | 3 | merge |
| `--mh-sc-bg` | `#f0f2f5` | 3 | 3 | merge |
| `--mh-sc-static-bg` | `#eef0f3` | 3 | 3 | merge |
| `--mh-copilot-action-bg` | `#edf0f3` | 4 | 3 | merge |
| `--mh-principle-badge-bg` | `#eef1f3` | 3 | 3 | merge |
| `--mh-bt-tag-bg` | `#f1efeb` | 6 | 3 | merge |
| `--mh-bt-state-off-bg` | `#f1f1ef` | 3 | 3 | merge |
| `--mh-surface-control-muted` | `#f0f2f4` | 3 | 3 | merge |
| `--mh-bt-chip-bg` | `#edf1f5` | 6 | 4 | merge |

### → `--mh-surface-inverse` (10)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-surface-dark-strong` | `#14171a` | 1 | 1 | merge |
| `--mh-surface-action-slate` | `#39444e` | 2 | 1 | merge |
| `--mh-surface-action-blue` | `#344f60` | 2 | 1 | merge |
| `--mh-surface-dark-cool` | `#1c2328` | 1 | 1 | merge |
| `--mh-launcher-line` | `#303840` | 3 | 3 | merge |
| `--mh-surface-dark` | `#20262c` | 6 | 4 | merge |
| `--mh-launcher-bg-hover` | `#171c21` | 3 | 3 | merge |
| `--mh-tooltip` | `#262626` | 1 | 1 | merge |
| `--mh-live-inkline` | `#2a2925` | 4 | 3 | merge |
| `--mh-surface-control-black-soft` | `#141414` | 2 | 1 | merge |

### → `--mh-scrim` (7)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-scrim` | `rgba(31, 41, 55, 0.3)` | 1 | 1 | keep |
| `--mh-scrim-deep` | `rgba(15, 18, 24, 0.55)` | 1 | 1 | merge |
| `--mh-scrim-mid` | `rgba(31, 41, 55, 0.42)` | 3 | 3 | merge |
| `--mh-reports-scrim` | `rgba(28, 36, 44, 0.28)` | 3 | 3 | merge |
| `--mh-bt-drawer-scrim` | `rgba(20, 32, 50, 0.4)` | 4 | 4 | merge |
| `--mh-bt-dialog-scrim` | `rgba(23, 34, 50, 0.4)` | 3 | 3 | merge |
| `--mh-scrim-soft-cool` | `rgba(24, 32, 39, 0.28)` | 0 | 0 | remove (unused) |

### → `--mh-line-subtle` (20)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-line-sidebar-cool` | `#e4e9ed` | 3 | 2 | merge |
| `--mh-line-panel-soft` | `#edf0f2` | 10 | 3 | merge |
| `--mh-line-table-soft` | `#edf1f4` | 3 | 2 | merge |
| `--mh-line-faint` | `#eef1f4` | 2 | 2 | merge |
| `--mh-line-warm` | `#e7e3dc` | 1 | 1 | merge |
| `--mh-line-warm-strong` | `#e6e1d8` | 2 | 1 | merge |
| `--mh-line-tab` | `#e5e7eb` | 4 | 2 | merge |
| `--mh-line-neutral-faint` | `#eceef1` | 6 | 1 | merge |
| `--mh-sc-head-line` | `#eeeeee` | 3 | 3 | merge |
| `--mh-sc-gridline` | `#eef0f3` | 3 | 3 | merge |
| `--mh-line-warm-soft` | `#eceae4` | 3 | 2 | merge |
| `--mh-hr-card-line` | `#f0ede6` | 3 | 3 | merge |
| `--mh-hr-th-line` | `#e4e2da` | 3 | 3 | merge |
| `--mh-hr-td-line` | `#f0efe9` | 3 | 3 | merge |
| `--mh-ra-stat-line` | `#f0f2f5` | 3 | 3 | merge |
| `--mh-line-card-warm` | `#e6e2db` | 2 | 1 | merge |
| `--mh-line-overview` | `#e6eaf0` | 1 | 1 | merge |
| `--mh-line-dialog-header` | `#e8edf3` | 2 | 1 | merge |
| `--mh-line-panel-subtle` | `#e8ecef` | 15 | 6 | merge |
| `--mh-line-panel-divider` | `#e2e8ed` | 0 | 0 | remove (unused) |

### → `--mh-line` (22)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-line` | `#dce1e6` | 125 | 26 | keep |
| `--mh-line-control-soft` | `#d8dde2` | 4 | 4 | merge |
| `--mh-line-subtle-cool` | `#dfe5ea` | 8 | 2 | merge |
| `--mh-line-input-cool` | `#dfe6ec` | 6 | 3 | merge |
| `--mh-line-graph-panel` | `#dce3e8` | 3 | 3 | merge |
| `--mh-line-soft` | `#e1e7ec` | 4 | 1 | merge |
| `--mh-line-neutral-soft` | `#dfe3e8` | 11 | 2 | merge |
| `--mh-sc-line-strong` | `#d9dde3` | 5 | 3 | merge |
| `--mh-sc-static-line` | `#e0e3e8` | 3 | 3 | merge |
| `--mh-copilot-box-line` | `#d8e0e6` | 28 | 7 | merge |
| `--mh-line-secondary-cool` | `#d8dee6` | 4 | 1 | merge |
| `--mh-check-filter-line` | `#e4e0d9` | 5 | 4 | merge |
| `--mh-principle-line` | `#d8dfe5` | 6 | 3 | merge |
| `--mh-principle-empty-line` | `#d8dfe4` | 3 | 3 | merge |
| `--mh-pagination-select-line` | `#d9dee3` | 4 | 3 | merge |
| `--mh-bt-drawer-line` | `#dfe5eb` | 4 | 3 | merge |
| `--mh-bt-dialog-line` | `#dbe1e8` | 3 | 3 | merge |
| `--mh-bt-confirm-btn-line` | `#dce2e9` | 3 | 3 | merge |
| `--mh-line-empty` | `#d9e1e8` | 1 | 1 | merge |
| `--mh-line-thumbnail` | `#dfe5ec` | 1 | 1 | merge |
| `--mh-line-secondary-button` | `#d7dee5` | 3 | 2 | merge |
| `--mh-line-dialog-close` | `#d8e0ea` | 1 | 1 | merge |

### → `--mh-line-strong` (10)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-line-control-hover` | `#b5bcc4` | 3 | 3 | merge |
| `--mh-line-strong` | `#c8d0d8` | 32 | 14 | keep |
| `--mh-line-attachment` | `#cbd3df` | 1 | 1 | merge |
| `--mh-disabled-line` | `#d0d4d8` | 1 | 1 | merge |
| `--mh-line-hover` | `#929da7` | 1 | 1 | merge |
| `--mh-control-line` | `#c8d2d8` | 6 | 5 | merge |
| `--mh-line-strong-ai` | `#bcc5ce` | 7 | 1 | merge |
| `--mh-field-line` | `#cfd6db` | 4 | 4 | merge |
| `--mh-line-control-strong` | `#cbd2d9` | 5 | 2 | merge |
| `--mh-line-dialog-input` | `#cfd9e5` | 1 | 1 | merge |

### → `--mh-success` (9)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-green` | `#34765b` | 12 | 7 | merge |
| `--mh-ink-success-bright` | `#0f9f5d` | 2 | 1 | merge |
| `--mh-ai-chip-pos` | `#2e7d32` | 8 | 5 | merge |
| `--mh-reports-green` | `#39745b` | 4 | 3 | merge |
| `--mh-live-bar-alt` | `#79a991` | 4 | 3 | merge |
| `--mh-indicator-positive-chart` | `#00a06b` | 3 | 1 | merge |
| `--mh-copilot-metric-pos` | `#16a34a` | 3 | 3 | merge |
| `--mh-ink-positive-dark` | `#0a7a54` | 3 | 1 | merge |
| `--mh-bt-scope-ink` | `#28785f` | 4 | 3 | merge |

### → `--mh-warning` (2)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-ink-warning-icon` | `#b45309` | 1 | 1 | merge |
| `--mh-ink-review` | `#e65100` | 0 | 0 | remove (unused) |

### → `--mh-danger` (11)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-danger-muted` | `#a23b4f` | 6 | 5 | merge |
| `--mh-red` | `#9b1230` | 7 | 6 | merge |
| `--mh-danger-border` | `#c03b3b` | 2 | 1 | merge |
| `--mh-danger-bright` | `#ef4444` | 3 | 2 | merge |
| `--mh-required` | `#c0392b` | 1 | 1 | merge |
| `--mh-ai-chip-neg` | `#c62828` | 5 | 4 | merge |
| `--mh-danger` | `#d8222a` | 4 | 1 | keep |
| `--mh-indicator-negative-chart` | `#e34d59` | 3 | 1 | merge |
| `--mh-copilot-metric-neg` | `#dc2626` | 8 | 6 | merge |
| `--mh-ink-negative-bright` | `#d43d4a` | 3 | 1 | merge |
| `--mh-ink-required` | `#e23b3b` | 2 | 1 | merge |

### → `--mh-info` (9)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-ink-info` | `#296a9b` | 3 | 2 | merge |
| `--mh-ink-link-strong` | `#184a8c` | 3 | 3 | merge |
| `--mh-ink-link-hover` | `#12386b` | 1 | 1 | merge |
| `--mh-blue` | `#3f73a6` | 10 | 8 | merge |
| `--mh-icon-info-bright` | `#3b82f6` | 1 | 1 | merge |
| `--mh-info` | `#2f6ea6` | 3 | 3 | keep |
| `--mh-reports-blue` | `#315f88` | 15 | 3 | merge |
| `--mh-ink-info-accent` | `#185fa5` | 3 | 1 | merge |
| `--mh-ink-info-strong` | `#1565c0` | 1 | 1 | merge |

### → `--mh-data-teal` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-indicator-teal` | `#2d7972` | 1 | 1 | merge |

### → `--mh-data-violet` (3)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-ink-draft` | `#6941c6` | 1 | 1 | merge |
| `--mh-indicator-purple` | `#7c3aed` | 1 | 1 | merge |
| `--mh-ink-violet` | `#7b1fa2` | 0 | 0 | remove (unused) |

### → `--mh-data-rose` (2)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-indicator-rose` | `#db2777` | 1 | 1 | merge |
| `--mh-ink-rose` | `#c2185b` | 0 | 0 | remove (unused) |

### → `--mh-focus-ring` (11)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-focus-blue` | `#8da7c0` | 12 | 12 | merge |
| `--mh-focus-ring` | `rgba(63, 115, 166, 0.1)` | 1 | 1 | keep |
| `--mh-focus-strong` | `rgba(63, 115, 166, 0.55)` | 2 | 2 | merge |
| `--mh-focus-gold` | `rgba(218, 168, 96, 0.18)` | 1 | 1 | merge |
| `--mh-launcher-focus` | `rgba(63, 115, 166, 0.52)` | 3 | 3 | merge |
| `--mh-composer-focus` | `0 0 0 3px rgba(218, 168, 96, 0.18)` | 3 | 3 | merge |
| `--mh-danger-ring` | `rgba(216, 34, 42, 0.1)` | 1 | 1 | merge |
| `--mh-gold-ring` | `rgba(178, 140, 45, 0.14)` | 1 | 1 | merge |
| `--mh-principle-focus-ring` | `rgba(185, 130, 52, 0.35)` | 9 | 4 | merge |
| `--mh-shadow-card-focus` | `0 0 0 3px rgba(214, 155, 61, 0.18)` | 1 | 1 | merge |
| `--mh-shadow-focus-warm-soft` | `0 0 0 3px rgba(218, 168, 96, 0.15)` | 4 | 4 | merge |

### → `--mh-shadow-raised` (5)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-sc-panel-shadow` | `0 4px 12px rgba(0, 0, 0, 0.1)` | 3 | 3 | merge |
| `--mh-sc-tip-shadow` | `0 4px 12px rgba(0, 0, 0, 0.12)` | 3 | 3 | merge |
| `--mh-sc-canvas-shadow` | `0 1px 3px rgba(0, 0, 0, 0.06)` | 3 | 3 | merge |
| `--mh-bt-create-shadow` | `0 3px 9px rgba(174, 105, 16, 0.14)` | 5 | 3 | merge |
| `--mh-shadow-chip-soft` | `0 1px 2px rgba(0, 0, 0, 0.04)` | 2 | 2 | merge |

### → `--mh-shadow-overlay` (17)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-popover-shadow` | `0 16px 40px rgba(24, 33, 42, 0.18)` | 6 | 6 | merge |
| `--mh-toast-shadow` | `0 14px 40px rgba(31, 41, 55, 0.22)` | 3 | 3 | merge |
| `--mh-launcher-shadow` | `0 10px 26px rgba(31, 41, 55, 0.2)` | 3 | 3 | merge |
| `--mh-launcher-shadow-hover` | `0 12px 30px rgba(31, 41, 55, 0.24), 0 0 18px rgba(218, 168, 96, 0.18)` | 3 | 3 | merge |
| `--mh-composer-shadow` | `0 5px 16px rgba(31, 41, 55, 0.06)` | 5 | 4 | merge |
| `--mh-reports-card-shadow` | `0 6px 22px rgba(0, 0, 0, 0.08)` | 3 | 3 | merge |
| `--mh-reports-card-shadow-hover` | `0 16px 34px rgba(34, 45, 58, 0.09)` | 3 | 3 | merge |
| `--mh-reports-row-shadow` | `0 6px 18px rgba(34, 45, 58, 0.035)` | 3 | 3 | merge |
| `--mh-reports-row-shadow-hover` | `0 10px 26px rgba(34, 45, 58, 0.065)` | 3 | 3 | merge |
| `--mh-live-shadow` | `0 8px 18px rgba(31, 41, 55, 0.06)` | 3 | 3 | merge |
| `--mh-check-filter-shadow` | `0 8px 24px rgba(25, 34, 48, 0.1)` | 3 | 3 | merge |
| `--mh-principle-shadow` | `0 4px 14px rgba(25, 31, 37, 0.08)` | 5 | 3 | merge |
| `--mh-shadow-search-warm` | `0 8px 24px rgba(116, 78, 31, 0.08)` | 2 | 1 | merge |
| `--mh-bt-drawer-shadow` | `-8px 0 32px rgba(23, 32, 42, 0.15)` | 4 | 4 | merge |
| `--mh-shadow-card-active` | `0 14px 32px rgba(31, 41, 55, 0.08)` | 2 | 1 | merge |
| `--mh-shadow-card-hover-gold` | `0 14px 28px rgba(31, 41, 55, 0.08), 0 0 0 3px rgba(217, 170, 99, 0.12)` | 2 | 1 | merge |
| `--mh-shadow-card-hover-warm` | `0 10px 26px rgba(31, 41, 55, 0.08)` | 1 | 1 | merge |

### → `--mh-shadow-modal` (7)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-drawer-shadow` | `-18px 0 50px rgba(31, 42, 50, 0.16)` | 3 | 3 | merge |
| `--mh-modal-shadow` | `0 28px 80px rgba(31, 41, 55, 0.2)` | 3 | 3 | merge |
| `--mh-modal-shadow-soft` | `0 24px 60px rgba(0, 0, 0, 0.25)` | 5 | 4 | merge |
| `--mh-flow-shadow` | `0 30px 78px rgba(24, 33, 42, 0.24)` | 6 | 5 | merge |
| `--mh-reports-shadow` | `0 18px 48px rgba(34, 45, 58, 0.12)` | 3 | 3 | merge |
| `--mh-copilot-shadow-expanded` | `0 30px 90px rgba(24, 33, 42, 0.28)` | 3 | 3 | merge |
| `--mh-shadow-dialog` | `0 24px 70px rgba(23, 34, 50, 0.22)` | 1 | 1 | merge |

### → `(component-local)` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-reports-filter` | `saturate(0.86) contrast(0.96) brightness(1.04)` | 4 | 3 | remove |

### → `--mh-font-display` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-display` | `"BentonModDisplay", Georgia, serif` | 7 | 7 | keep |

### → `--mh-font-sans` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-font` | `"DIN 2014", Arial, sans-serif` | 110 | 48 | keep |

### → `--mh-layout-header-height` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-header` | `56px` | 13 | 11 | keep |

### → `--mh-radius-sm` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-radius-control` | `4px` | 5 | 5 | rename |

### → `--mh-z-launcher` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-z-launcher` | `880` | 1 | 1 | keep |

### → `--mh-z-modal` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-z-modal` | `2400` | 2 | 2 | keep |

### → `--mh-z-overlay` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-z-overlay` | `1900` | 3 | 3 | keep |

### → `color-mix(--mh-accent)` (10)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-launcher-aura` | `rgba(218, 168, 96, 0.2)` | 3 | 3 | derive |
| `--mh-gold-faint` | `rgba(178, 140, 45, 0.07)` | 1 | 1 | derive |
| `--mh-chip-hover` | `rgba(93, 68, 30, 0.12)` | 3 | 3 | derive |
| `--mh-copilot-gold-wash` | `rgba(218, 168, 96, 0.14)` | 4 | 3 | derive |
| `--mh-copilot-fb-hover-line` | `rgba(184, 138, 61, 0.68)` | 3 | 3 | derive |
| `--mh-copilot-fb-hover-bg` | `rgba(231, 187, 106, 0.16)` | 3 | 3 | derive |
| `--mh-copilot-fb-pressed-line` | `rgba(184, 138, 61, 0.8)` | 3 | 3 | derive |
| `--mh-ra-icon-retail-bg` | `rgba(201, 164, 74, 0.16)` | 3 | 3 | derive |
| `--mh-line-domain-warm` | `rgba(183, 122, 39, 0.28)` | 2 | 1 | derive |
| `--mh-line-scenario-hover` | `rgba(183, 122, 39, 0.5)` | 1 | 1 | derive |

### → `color-mix(--mh-danger)` (3)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-ai-chip-neg-bg` | `#ffebee` | 5 | 5 | derive |
| `--mh-ra-badge-down-bg` | `rgba(227, 77, 89, 0.12)` | 3 | 3 | derive |
| `--mh-surface-danger-hover` | `#fef2f2` | 2 | 2 | derive |

### → `color-mix(--mh-data-rose)` (1)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-surface-rose-soft` | `#fce4ec` | 3 | 3 | derive |

### → `color-mix(--mh-data-violet)` (2)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-surface-draft` | `#f4f0ff` | 1 | 1 | derive |
| `--mh-surface-violet-soft` | `#f3e5f5` | 3 | 3 | derive |

### → `color-mix(--mh-info)` (7)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-surface-info` | `#eef6ff` | 8 | 6 | derive |
| `--mh-surface-info-pale` | `#eff6ff` | 1 | 1 | derive |
| `--mh-line-info-pale` | `#dbeafe` | 1 | 1 | derive |
| `--mh-reports-blue-soft` | `#edf4fa` | 3 | 3 | derive |
| `--mh-ra-icon-outlet-bg` | `rgba(24, 95, 165, 0.12)` | 3 | 3 | derive |
| `--mh-ra-option-icon-bg` | `rgba(24, 95, 165, 0.1)` | 3 | 3 | derive |
| `--mh-surface-info-strong` | `#e3f2fd` | 6 | 3 | derive |

### → `color-mix(--mh-success)` (4)

| token | value | refs | owners | action |
|---|---|---:|---:|---|
| `--mh-surface-success-soft` | `#e7f6ed` | 13 | 8 | derive |
| `--mh-ai-chip-pos-bg` | `#e8f5e9` | 9 | 7 | derive |
| `--mh-ra-badge-up-bg` | `rgba(0, 160, 107, 0.1)` | 3 | 3 | derive |
| `--mh-bt-scope-bg` | `#edf5f1` | 4 | 3 | derive |


### Corrections applied during WP2b adversarial review

- corrected in WP2b: `--mh-surface-action-slate` `--mh-surface-inverse` → `color-mix(in srgb, var(--mh-surface-inverse) 86%, var(--mh-surface))` because every use is primary-button hover/focus fill or border (`components/Button/Button.css:55–58`); the resting fill is already inverse, so a direct merge removes hover feedback. Original `#39444e` → sRGB `(63.22, 68.38, 73.54)`, approximately `#3f444a`. N=86 minimizes squared sRGB channel distance over whole percentages 0–100, correcting the old #31 candidate's unmeasured 85%.
- corrected in WP2b: `--mh-launcher-line` `--mh-surface-inverse` → `--mh-line-inverse` because its only use is a border on the dark launcher (`components/AssistantLauncher/AssistantLauncher.css:19`); inverse fill would hide the border. Preserves the justified correction from old PR #31.
- corrected in WP2b: `--mh-live-bar` `--mh-surface-muted` → `--mh-line-strong` because its only use fills neutral data bars on the light chart panel (`features/cockpit/LiveOverview/LiveOverview.css:119–125`); the muted surface washes out the data. Preserves the justified correction from old PR #31.
