# S3 Clothing — Store screen designs

**Date:** 2026-06-18
**Status:** Approved (design), ready for implementation planning

## Goal

The S3 homepage ([index.html](../../../index.html)) is a finished, high-fidelity design. A
shoppable store needs several more screens in the same visual language. This project designs
those remaining screens as **static HTML/CSS mockups**, so the whole store is visually locked
before any Shopify theme is built. The eventual Shopify build is explicitly out of scope for
now — but the work here is structured so it hands off cleanly to that build later (nothing
throwaway).

**In scope:** Collection/listing, Product detail, Cart, and the supporting screens (search,
about, account, 404), plus extracting the homepage's design system into a shared stylesheet.
Screens use **real product, category, and pricing data from the live store**
(https://www.s3clothing.com/, currently on Wix). During the refactor the homepage's three
placeholder prices (£68/£94/£98) are corrected to the real prices (see Real store data below)
— layout stays pixel-identical, only the price numbers change.

**Out of scope (later phases):** the actual Shopify theme (Liquid sections/snippets/schema,
CLI, dev store), real cart/checkout behaviour, real product data wiring, CMS/admin.

## Approach

**Shared `theme.css` + one HTML file per screen.** Lift the design system out of the
homepage's inline `<style>` block into a single `assets/theme.css` (tokens, fonts, component
classes). Each screen is its own static `.html` file that links `theme.css` and reuses those
classes. This gives one source of truth (no visual drift across screens), costs nothing to
view (no build/tooling), and means the shared CSS *is* the foundation the future Shopify theme
needs — each screen maps to a future template, each component class to a future snippet.

Rejected alternatives: standalone per-page HTML with duplicated inline CSS (drift across 8
screens); designing in Figma (abandons the existing high-fidelity HTML, redundant re-derivation
for the Shopify build).

## File structure

```
design/
├─ index.html            ← refactored to link theme.css (kept pixel-identical)
├─ collection.html       ← NEW — collection / product listing
├─ product.html          ← NEW — product detail
├─ cart.html             ← NEW — cart (full page)
├─ search.html           ← NEW — search results
├─ about.html            ← NEW — brand story
├─ account.html          ← NEW — login / register
├─ 404.html              ← NEW — not found
├─ assets/
│  └─ theme.css          ← NEW — the entire design system, one file
└─ (existing images stay in place at repo root)
```

Everything remains static files openable directly in a browser.

## The design system: `assets/theme.css`

Extracted verbatim from the homepage where it already exists; organised into four layers.

1. **Tokens** — existing `:root` variables unchanged: `--pine`, `--pine-900`, `--pine-700`,
   `--bone`, `--bone-d`, `--sand`, `--sand-d`, `--sand-text`, `--flag`, `--ink`, `--sage`,
   `--maxw`, `--gut`, and the three font stacks `--f-display` (Anton), `--f-body`
   (Hanken Grotesk), `--f-mono` (DM Mono). New tokens are added **only** where a new screen
   needs one (e.g. an input-border colour, an input `--radius`), named in the same style.
   **No changes to the existing palette or type.**
2. **Primitives** — `.wrap`, `.eyebrow`, `.btn` and variants (`.btn-solid`, `.btn-line`,
   `.btn-line-d`), the `:focus-visible` ring.
3. **Existing homepage components** — `header.nav`, product `.card`, `.scorecard`, `.ticker`,
   `.section` / `.sec-head`, `footer`. Reused as-is across new screens.
4. **New shared components** the store needs, all built from existing tokens and idioms
   (mono uppercase labels, 2px radii, flag-yellow accent, pine surfaces): breadcrumb,
   filter/sort bar, colour-swatch picker, size-pill picker, quantity stepper, cart line-item
   row, form fields (styled like the newsletter input), badges, pagination.

Shared **nav** and **footer** markup is kept byte-identical on every page (verified by diff);
visual consistency is enforced by the styling living in `theme.css`.

## Real store data (from https://www.s3clothing.com/)

The live store runs on Wix; this is reference data for content, not a structure to import.
Brand also trades as **Sweet Spot Styles**. Social: Instagram (@sweetspotstyles____),
TikTok (@sweet.spot.styles), Facebook.

**Navigation / categories** (mirror the live IA): Home · Shop On Course (Ladies, Mens, Golf
Accessories) · Shop Off Course · About (Our Story) · Contact. Category URL pattern on the live
site is `/category/<name>`, products `/product-page/<slug>` — our static mockups use flat files
(`collection.html`, `product.html`) but the nav labels match.

**Products & prices (GBP)** — used to populate the grids and the product page:

| Product | Price | Category |
|---|---|---|
| Signature Block Polo | £37.99 | Mens / On course |
| Signature Panelled Shirt | £37.99 | On course |
| GeoLine Performance Polo | £38.99 | On course |
| S3 Tour Mid Layer | £44.99 | On course |
| Core Ribbed Mid Layer | £44.99 | On course |
| Tour Performance Mid Layer | £44.99 | On course |
| Performance Mid Layer / Frill Luxe Mid Layer | £39.99 | On course |
| S3 Essential Gilet | £39.99 | On course |
| Ladies Padded Gilet | £49.99 | Ladies |
| Floral Pattern Skort | £39.99 | Ladies |
| Icon Flare Dress | £44.99 | Ladies |
| High Waisted Pull On Trousers | £44.99 | Ladies / Off course |
| Pull On Full Stretch Capris | £39.99 | Ladies |
| Floral Sleeveless Shirt | £34.99 | Ladies |
| Performance Golf Joggers | £39.99 | Off course |
| Fleece Lined Snoods | £14.99 | Accessories |
| S3 Fleece Lined Mittens | £18.99 | Accessories |
| Lined Bobble Hat / Cable Bobble Hats | £14.99 | Accessories |

**Images:** reuse the real product/lifestyle images already in the repo (the `fad824_*.png`
product shots map to Signature Block Polo, S3 Tour Mid Layer, and a mid-layer; the `PHOTO-*.jpg`
and `hero.jpg` are lifestyle shots). Grids are filled by repeating these real assets rather than
hotlinking the live Wix CDN. If more product imagery is needed it can be sourced from the live
site later.

**Featured product for `product.html`:** Signature Block Polo (£37.99) — we have its product
image (`fad824_236eeeb7fd4743568e5cbca667edcc9c~mv2.png`).

**Homepage price correction:** the homepage's three cards become £37.99 / £44.99 / £37.99
(Signature Block Polo / S3 Tour Mid Layer / Signature Full-Zip→Signature Panelled Shirt naming
stays as-is on the card unless changed separately).

## Screen designs

All screens: sticky pine nav, shared footer, Anton display caps, mono labels, flag-yellow
accent, scorecard/clubhouse motif. Same responsive breakpoints as the homepage
(900px / 780px / 560px).

### collection.html — Collection / listing
- Pine hero strip: eyebrow, Anton title, one-line description (homepage section-head treatment
  on a pine band).
- Sticky filter/sort bar (mono labels): filter chips (Category, Colour, Size, Price) left;
  result count + Sort dropdown right.
- Product grid reusing the homepage `.card` exactly (scorecol strip, swatch, name/price/tag),
  populated with real products and prices from the data table (e.g. Signature Block Polo
  £37.99, S3 Tour Mid Layer £44.99, GeoLine Performance Polo £38.99…), reusing the repo's
  product images.
- Filter chips reflect the real IA: Category (Ladies / Mens / Golf Accessories / Sale),
  Colour, Size, Price.
- Pagination as a scorecard-style strip ("Hole 1 of 3 · Next →").

### product.html — Product detail
- Two columns: left = image gallery (large image + thumbnail rail); right = info column.
- Featured product: Signature Block Polo, £37.99 (real data; repo product image).
- Info column: eyebrow ("On course · Polo"), Anton product name, mono price; colour-swatch
  picker + size-pill picker; quantity stepper; full-width flag-yellow Add-to-cart
  (`.btn-solid`); accordion for Details / Materials / Sizing & care.
- Sustainability mini-callout reusing the pillar style.
- "Complete the round" — 3 related products in the homepage card grid.

### cart.html — Cart (full page)
- Pine page header ("Your bag").
- Line-item rows (reusable component): thumbnail, name + variant, qty stepper, line price,
  remove.
- Right-rail order summary: subtotal, "Free UK delivery over £75" threshold (from the ticker
  copy) with a progress hint, flag-yellow Checkout button, mono reassurances.
- Empty-cart state with a "Shop on course" CTA.
- *Drawer variant* noted for the Shopify phase; not built now.

### search.html — Search results
- Search field, result count, the same product grid, plus a "no results" state.

### about.html — Brand story
- Reuses homepage blocks: hero/band/pillars/split. Reuses the sustainability section.

### account.html — Login / register
- Split layout: Login form | Create-account form, using the new shared form fields.

### 404.html — Not found
- Pine full-screen, Anton "Out of bounds", flag-yellow "Back to the clubhouse" CTA.

## Interaction scope (mockups)

These are visual mockups, not a working store. Interactive bits are presentation-only via
small vanilla JS: variant swatches/size pills highlight on click; accordion expands; qty
stepper increments; mobile nav toggles. Nothing posts, persists, or adds to a real cart.
This matches the homepage's existing approach (the mobile "Read more" toggle is plain inline
JS).

## Consistency & verification

**Consistency mechanism**
- Single source of truth: all styling in `theme.css`. New screens only use existing
  token/component classes. Anything genuinely new becomes a named component in `theme.css`,
  never an inline one-off style.
- Shared nav + footer markup kept byte-identical across pages (diffed).
- Same responsive breakpoints as the homepage on every screen.

**Fidelity verification (performed, not asserted)**
1. Homepage refactor is pixel-identical — render `index.html` before and after the `theme.css`
   extraction, compare screenshots, fix any diff before proceeding.
2. Each new screen — open in a real browser at desktop and mobile widths, compare against the
   homepage for palette, type scale, spacing rhythm, component reuse.
3. Token audit — grep new HTML for hard-coded hex colours or font-family names; everything must
   route through `var(--*)` / shared classes.
4. Accessibility carry-over — keep focus ring, alt text, labelled inputs, and
   `prefers-reduced-motion` handling present on the homepage.

## Build order

1. `assets/theme.css` + refactor `index.html` onto it (pixel-identical).
2. `collection.html`
3. `product.html`
4. `cart.html`
5. Supporting: `search.html`, `about.html`, `account.html`, `404.html`

Screenshots shared after each screen so the design can be steered before the next is built.

## Future handoff (informational, not part of this work)

When the Shopify theme is built later: each screen → a theme template; each `theme.css`
component → a snippet/section; tokens → `config/settings_schema.json` emitting CSS variables;
fonts via Google Fonts. The static mockups become the visual spec for that build.
