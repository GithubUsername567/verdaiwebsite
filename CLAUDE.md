# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static single-page marketing site for **Verdai** — a crop-diagnosis mobile app. No build system; open `index.html` directly in a browser to preview.

## Structure

```
index.html          # entire site — HTML, CSS, and JS inline
assets/             # logo variants (verdai-logo-rosette.png is the one used)
```

## Design system

All tokens are CSS custom properties on `:root` in `index.html`:

| Token | Use |
|---|---|
| `--leaf` / `--leaf-deep` | primary green CTAs and accents |
| `--bg` / `--bg-cream` | alternating section backgrounds |
| `--ink` / `--ink-soft` / `--ink-muted` | text hierarchy |
| `--sun` | amber accent (pricing badge, Pro tier checkmarks) |
| `--paper` | card / overlay backgrounds |

Typefaces: **Fraunces** (serif display, headings), **Inter** (body), **JetBrains Mono** (eyebrows, code labels) — loaded from Google Fonts.

## Page sections (in order)

Nav → Hero (phone mockup + floating cards) → Features (6-card grid) → How it works (3 steps) → Quote band → Pricing (6 tiers) → FAQ (accordion) → Final CTA → Footer

## Pricing tiers

| Tier | Price | Key limit |
|---|---|---|
| Sprout | $0 | 3 diagnoses/mo |
| Grower | $5.99/mo or $59/yr | 25 diagnoses/mo |
| Pro *(featured)* | $14.99/mo or $149/yr | 100 diagnoses/mo |
| Co-op | contact | Starter (25 farmers / 1,500 diagnoses) + Growth (100 farmers / 5,000 diagnoses) in one card |

Pro card uses `class="featured"` — dark background, elevated, gold checkmarks (`--sun`). Co-op card uses `class="coop"` and shows both tiers (Starter / Growth) with a divider; "Contact for pricing" via `.price-custom`; CTA links to `mailto:partnerships@verdai.com`.

## Responsive breakpoints

- `≤ 1024px` — hero and feature/step grids collapse to 1 column; pricing goes 2-column
- `≤ 640px` — nav links hidden; pricing goes 1-column; `.float-3` card hidden
