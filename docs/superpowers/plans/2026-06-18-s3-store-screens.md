# S3 Store Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Design the remaining S3 storefront screens (collection, product, cart, search, about, account, 404) as static HTML/CSS mockups in the homepage's exact visual language, backed by a shared `theme.css` design system.

**Architecture:** Extract the homepage's inline `<style>`/`<script>` into shared `assets/theme.css` + `assets/theme.js` (one source of truth for tokens and components). Each screen is a standalone static `.html` file that links those assets and reuses the shared classes. New store components are added to `theme.css` in the first task that needs them, then reused. No build step, no framework — files open directly in a browser.

**Tech Stack:** HTML5, CSS (custom properties, grid/flexbox), vanilla JS. Google Fonts: Anton, Hanken Grotesk, DM Mono. No dependencies.

## Global Constraints

- **Palette (verbatim, never changed):** `--pine:#102a22` `--pine-900:#0a1813` `--pine-700:#16382d` `--bone:#f3eee3` `--bone-d:#e7dfcd` `--sand:#c29a63` `--sand-d:#a87f4c` `--sand-text:#7a5a30` `--flag:#f2c53d` `--ink:#14110d` `--sage:#9cb3a4`.
- **Fonts:** `--f-display:"Anton"` `--f-body:"Hanken Grotesk"` `--f-mono:"DM Mono"`.
- **Layout tokens:** `--maxw:1240px` `--gut:clamp(20px,5vw,72px)`.
- **Breakpoints (match homepage):** 900px, 780px, 560px.
- **No hard-coded colours or font-families in HTML files** — everything routes through `theme.css` classes / `var(--*)`. New screens contain no `<style>` block.
- **Real data only** (from https://www.s3clothing.com/): prices GBP, e.g. Signature Block Polo £37.99, S3 Tour Mid Layer £44.99, Signature Panelled Shirt £37.99, GeoLine Performance Polo £38.99, accessories £14.99–£18.99. Full table in the spec.
- **Real categories / nav:** Home · Shop On Course (Ladies, Mens, Golf Accessories) · Shop Off Course · About · Contact.
- **Images:** reuse repo assets (`fad824_*.png` products, `PHOTO-*.jpg` / `hero.jpg` lifestyle), repeated to fill grids. No hotlinking the Wix CDN.
- **Accessibility:** keep focus ring, `alt` text, labelled inputs, `prefers-reduced-motion`.
- **Spec:** `docs/superpowers/specs/2026-06-18-s3-store-screens-design.md`.

## Verification recipe (referenced by every task as "run the verification recipe")

1. **Serve & screenshot.** From the repo root: `python3 -m http.server 8000`. Render the page at **1280×900** (desktop) and **390×844** (mobile) using available headless-browser tooling (e.g. `npx --yes playwright screenshot --viewport-size=1280,900 http://localhost:8000/<file> /tmp/<file>-desktop.png`; install browsers once with `npx --yes playwright install chromium` if needed). If no headless tool is available, open the file in a real browser at both widths.
2. **Visual check.** Compare against `index.html` and the spec: palette, Anton headings, mono labels, flag-yellow accent, spacing rhythm, component reuse, mobile collapse.
3. **Token audit (deterministic gate — must pass):**
   ```bash
   FILE=<file>.html
   ! grep -nE '#[0-9a-fA-F]{3,6}' "$FILE"   # no hard-coded hex
   ! grep -n 'font-family' "$FILE"          # no inline font-family
   ! grep -n '<style' "$FILE"               # no inline <style> block
   ```
   All three must produce **no output** (grep exits non-zero, the `!` makes that a pass).
4. **Nav/footer drift check** (new screens only): the `<header class="nav">…</header>` and `<footer>…</footer>` blocks must be byte-identical to `index.html`'s. Verify by extracting and diffing (see Task 2 step).

---

## File Structure

- `assets/theme.css` — entire design system (tokens, primitives, all components). CREATE in Task 1; APPEND new component sections in later tasks.
- `assets/theme.js` — shared behaviour (mobile nav, hero toggle, accordion, qty stepper, variant pickers, thumbnail gallery). CREATE in Task 1; APPEND handlers in later tasks.
- `index.html` — MODIFY in Task 1 (extract styles/script to assets, fix 3 prices). Canonical source of the shared nav + footer markup.
- `collection.html`, `product.html`, `cart.html`, `search.html`, `about.html`, `account.html`, `404.html` — CREATE, one per screen task.

---

### Task 1: Extract design system + refactor homepage

**Files:**
- Create: `assets/theme.css`, `assets/theme.js`
- Modify: `index.html`

**Interfaces:**
- Produces: `assets/theme.css` (all token vars + classes `.wrap .eyebrow .btn .btn-solid .btn-line .btn-line-d`, plus homepage components `.nav .hero .scorecard .ticker .section .sec-head .grid3 .card .swatch .split .band .sustain .news footer`), `assets/theme.js` (the hero mobile toggle), and the canonical `<header class="nav">` + `<footer>` markup that every later screen copies verbatim.

- [ ] **Step 1: Create `assets/theme.css` by moving the homepage's CSS verbatim.**
  Cut the entire contents **between** `<style>` and `</style>` in `index.html` (currently lines ~21–1010) and paste into `assets/theme.css` unchanged. Do not restyle anything. Keep the `:root` block, all component rules, all `@media` blocks, and `@media (prefers-reduced-motion)` exactly as-is.

- [ ] **Step 2: Create `assets/theme.js` by moving the homepage's script verbatim.**
  Cut the contents between `<script>` and `</script>` at the bottom of `index.html` (the hero "Read more" toggle IIFE) into `assets/theme.js` unchanged.

- [ ] **Step 3: Link the assets in `index.html`.**
  In `<head>`, replace the now-empty `<style></style>` with:
  ```html
  <link rel="stylesheet" href="assets/theme.css" />
  ```
  Just before `</body>`, replace the now-empty `<script></script>` with:
  ```html
  <script src="assets/theme.js" defer></script>
  ```

- [ ] **Step 4: Correct the three placeholder prices to real values.**
  In the collection section of `index.html`, change the `.price` spans:
  - Signature Block Polo: `£68.00` → `£37.99`
  - S3 Tour Mid-Layer: `£94.00` → `£44.99`
  - Signature Full-Zip: `£98.00` → `£37.99`
  Leave all other markup (names, tags, layout) untouched.

- [ ] **Step 5: Run the verification recipe on `index.html`.**
  Critical extra check — the refactor must be **pixel-identical except the three prices**. Capture a desktop screenshot and compare against the pre-refactor homepage (use `git stash` to render the old version if needed). Expected: layout, fonts, colours, spacing all identical; only the three price numbers differ. The token audit's `<style>`-block check confirms the inline styles were fully moved out. (Inline `style="…"` *attributes* already in the homepage may remain.)

- [ ] **Step 6: Commit.**
  ```bash
  git add assets/theme.css assets/theme.js index.html
  git commit -m "Extract design system to theme.css/theme.js; fix homepage prices"
  ```

---

### Task 2: Lock the canonical nav + footer, prepare a reusable page shell

**Files:**
- Create: `assets/_shell.md` (a copy-paste reference snippet — NOT served; documents the shared head/nav/footer block)

**Interfaces:**
- Consumes: `index.html`'s `<header class="nav">` and `<footer>` blocks (canonical).
- Produces: `assets/_shell.md` containing the exact `<head>` links, `<header class="nav">…</header>`, and `<footer>…</footer>` markup every screen task pastes in. This is the anti-drift source.

- [ ] **Step 1: Extract the canonical blocks.**
  Copy from `index.html`: (a) the `<head>` font + stylesheet links, (b) the full `<header class="nav">…</header>`, (c) the full `<footer>…</footer>`, (d) the `<script src="assets/theme.js" defer></script>` tag. Paste all four into `assets/_shell.md` inside fenced code blocks, with a one-line note above each ("paste verbatim into every screen").

- [ ] **Step 2: Update the nav links to real destinations.**
  In `assets/_shell.md`'s nav block (and later when pasted), the nav anchors point to the real screens: `On Course → collection.html`, `Off Course → collection.html#off`, `Sustainability → about.html#sustain`, `Contact → account.html` is wrong — use `Contact` linking to `about.html#contact` placeholder. Keep labels exactly as on the homepage (`On Course`, `Off Course`, `Sustainability`, `Contact`, `Log In`). `Log In → account.html`. Brand logo links to `index.html`.
  Then propagate the same `href` updates into `index.html`'s nav and re-commit it.

- [ ] **Step 3: Add the drift-check helper to the verification recipe usage.**
  Document in `_shell.md` the diff command screens use:
  ```bash
  # extract the <header class="nav"> … </header> block from two files and diff
  awk '/<header class="nav">/,/<\/header>/' index.html > /tmp/nav-index.html
  awk '/<header class="nav">/,/<\/header>/' collection.html > /tmp/nav-screen.html
  diff /tmp/nav-index.html /tmp/nav-screen.html   # expected: no output
  ```
  (Repeat for `<footer>…</footer>`.) Screens must match `index.html` after Step 2's href update.

- [ ] **Step 4: Commit.**
  ```bash
  git add assets/_shell.md index.html
  git commit -m "Lock canonical nav/footer shell; wire real nav destinations"
  ```

---

### Task 3: Collection / listing page

**Files:**
- Create: `collection.html`
- Modify: `assets/theme.css` (append "COLLECTION PAGE" component section), `assets/theme.js` (append chip toggle)

**Interfaces:**
- Consumes: shell from `_shell.md`; `.wrap .card .swatch .grid3 .eyebrow .btn` from `theme.css`.
- Produces: classes `.page-head .crumbs .filterbar .chips .chip .sortwrap .badge .badge-sale .pager` (reused by `search.html`).

- [ ] **Step 1: Append the collection components to `assets/theme.css`.**
  ```css
  /* ================= PAGE HEAD (pine) ================= */
  .page-head { background: var(--pine); color: var(--bone); }
  .page-head .wrap { padding-block: clamp(40px, 6vw, 76px); }
  .page-head .eyebrow { color: var(--sand); }
  .page-head h1 { font-family: var(--f-display); text-transform: uppercase;
    font-size: clamp(2.1rem, 5vw, 3.6rem); line-height: .95; margin-top: 10px; letter-spacing: .01em; }
  .page-head p { max-width: 42ch; color: #cdd9d0; margin: 14px 0 0; font-size: .98rem; }

  /* breadcrumb */
  .crumbs { font-family: var(--f-mono); font-size: .68rem; letter-spacing: .16em;
    text-transform: uppercase; color: var(--sand); display: flex; gap: .6em; align-items: center; }
  .crumbs a:hover { color: var(--bone); }
  .crumbs .sep { opacity: .5; }

  /* filter / sort bar */
  .filterbar { position: sticky; top: 72px; z-index: 20;
    background: rgba(243, 238, 227, .92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--bone-d); }
  .filterbar .wrap { display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding-block: 14px; flex-wrap: wrap; }
  .chips { display: flex; gap: 10px; flex-wrap: wrap; }
  .chip { font-family: var(--f-mono); font-size: .7rem; letter-spacing: .12em; text-transform: uppercase;
    padding: .6em 1em; border: 1.5px solid var(--bone-d); border-radius: 2px; background: #fff;
    cursor: pointer; color: var(--ink); transition: border-color .2s, background .2s, color .2s; }
  .chip:hover { border-color: var(--pine); color: var(--pine); }
  .chip.is-active { background: var(--pine); color: var(--bone); border-color: var(--pine); }
  .sortwrap { display: flex; align-items: center; gap: 10px; font-family: var(--f-mono);
    font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--sand-text); }
  .sortwrap select { font-family: var(--f-mono); font-size: .72rem; text-transform: uppercase;
    letter-spacing: .08em; border: 1.5px solid var(--bone-d); border-radius: 2px;
    padding: .55em 2em .55em .8em; background: #fff; color: var(--ink); cursor: pointer; }
  .result-count { color: var(--sand-text); }

  /* badges (overlay on card swatch) */
  .badge { font-family: var(--f-mono); font-size: .58rem; letter-spacing: .14em;
    text-transform: uppercase; padding: .4em .7em; border-radius: 2px; display: inline-block; }
  .badge-sale { background: var(--flag); color: var(--ink); }
  .card .swatch .badge { position: absolute; top: 12px; left: 12px; z-index: 1; }

  /* pagination (scorecard-style) */
  .pager { display: flex; align-items: center; justify-content: center; gap: 14px;
    font-family: var(--f-mono); font-size: .74rem; letter-spacing: .14em; text-transform: uppercase;
    color: var(--sand-text); margin-top: clamp(36px, 5vw, 64px); }
  .pager a, .pager span { padding: .6em .9em; }
  .pager .num { border: 1.5px solid var(--bone-d); border-radius: 2px; }
  .pager .num.is-current { background: var(--pine); color: var(--bone); border-color: var(--pine); }
  @media (max-width: 560px) { .filterbar .wrap { gap: 10px; } .filterbar .chips { order: 2; } }
  ```

- [ ] **Step 2: Append the chip toggle to `assets/theme.js`.**
  ```js
  /* Collection filter chips — visual toggle only (mockup) */
  document.querySelectorAll('.chips').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      chip.classList.toggle('is-active');
    });
  });
  ```

- [ ] **Step 3: Create `collection.html`.**
  Structure (paste the shell head/nav/footer/script from `_shell.md`):
  ```html
  <!doctype html>
  <html lang="en">
  <head>
    <!-- paste canonical <head> links from _shell.md -->
    <title>On Course — S3 Clothing</title>
  </head>
  <body>
    <!-- paste canonical <header class="nav"> from _shell.md -->

    <section class="page-head">
      <div class="wrap">
        <p class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>Shop On Course</p>
        <h1 style="margin-top:18px">On Course</h1>
        <p>Technical polos, mid-layers and accessories built to move with your swing and hold up through eighteen.</p>
      </div>
    </section>

    <div class="filterbar">
      <div class="wrap">
        <div class="chips">
          <button class="chip is-active">All</button>
          <button class="chip">Ladies</button>
          <button class="chip">Mens</button>
          <button class="chip">Golf Accessories</button>
          <button class="chip">Sale</button>
        </div>
        <div class="sortwrap">
          <span class="result-count">12 pieces</span>
          <label for="sort" style="position:absolute;left:-9999px">Sort by</label>
          <select id="sort">
            <option>Featured</option><option>Price: low to high</option>
            <option>Price: high to low</option><option>Newest</option>
          </select>
        </div>
      </div>
    </div>

    <section class="section wrap">
      <div class="grid3">
        <!-- Repeat this <article class="card"> for each product below, using the
             repo product images (cycle the 3 fad824_*.png files) and real names/prices: -->
        <!-- Signature Block Polo £37.99 (Best seller) · S3 Tour Mid Layer £44.99 (New) ·
             Signature Full-Zip £37.99 (Best seller) · GeoLine Performance Polo £38.99 ·
             Core Ribbed Mid Layer £44.99 · S3 Essential Gilet £39.99 ·
             Signature Panelled Shirt £37.99 · Tour Performance Mid Layer £44.99 ·
             Performance Mid Layer £39.99 · Ladies Padded Gilet £49.99 ·
             Fleece Lined Snoods £14.99 (Sale) · S3 Fleece Lined Mittens £18.99 -->
        <article class="card">
          <div class="scorecol"><span class="hole"></span><span>Best seller</span></div>
          <div class="swatch">
            <img src="fad824_236eeeb7fd4743568e5cbca667edcc9c~mv2.png" alt="S3 Signature Block Polo" loading="lazy" />
          </div>
          <div class="meta">
            <span class="tag">On course · Polo</span>
            <div class="line"><a class="name" href="product.html">Signature Block Polo</a></div>
            <div class="line"><span class="price">£37.99</span><span class="tag">4 colours</span></div>
          </div>
        </article>
        <!-- … remaining 11 cards … -->
      </div>

      <nav class="pager" aria-label="Pagination">
        <span class="num is-current">1</span><a class="num" href="#">2</a><a class="num" href="#">3</a>
        <a href="#">Next →</a>
      </nav>
    </section>

    <!-- paste canonical <footer> + <script> from _shell.md -->
  </body>
  </html>
  ```
  Use the homepage `.card` markup exactly; wrap the product name in an `<a href="product.html">` so the grid links to the product page. Add a `.badge.badge-sale` inside `.swatch` for the "Sale" item.

- [ ] **Step 4: Run the verification recipe on `collection.html`** (incl. nav/footer drift check). Confirm cards render identically to the homepage grid, filterbar sticks under the nav, mobile collapses to 1–2 columns via the existing `.grid3` breakpoints.

- [ ] **Step 5: Commit.**
  ```bash
  git add collection.html assets/theme.css assets/theme.js
  git commit -m "Add collection/listing page with filter bar and pagination"
  ```

---

### Task 4: Product detail page

**Files:**
- Create: `product.html`
- Modify: `assets/theme.css` (append "PRODUCT PAGE"), `assets/theme.js` (append gallery/variant/accordion/qty handlers)

**Interfaces:**
- Consumes: shell; `.eyebrow .btn .btn-solid .grid3 .card .pillar` from `theme.css`.
- Produces: `.pdp .gallery .thumbs .thumb .pdp-info .opt .swatches .swatch-dot .sizes .size-pill .qty .btn-block .acc .acc-item .acc-trigger .acc-panel` and the `.qty` stepper (reused by `cart.html`).

- [ ] **Step 1: Append the product-page components to `assets/theme.css`.**
  ```css
  /* ================= PRODUCT PAGE ================= */
  .pdp { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(28px, 4vw, 64px); align-items: start; }
  .gallery .main { aspect-ratio: 4/5; background: #f4f2ec; border: 1px solid var(--bone-d);
    border-radius: 4px; overflow: hidden; }
  .gallery .main img { width: 100%; height: 100%; object-fit: cover; }
  .thumbs { display: flex; gap: 12px; margin-top: 12px; }
  .thumb { width: 72px; aspect-ratio: 4/5; border: 1.5px solid var(--bone-d); border-radius: 2px;
    overflow: hidden; cursor: pointer; background: #f4f2ec; padding: 0; }
  .thumb.is-active { border-color: var(--pine); }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .pdp-info .eyebrow { color: var(--sand-text); }
  .pdp-info h1 { font-family: var(--f-display); text-transform: uppercase;
    font-size: clamp(1.9rem, 3.4vw, 2.8rem); line-height: 1; margin-top: 10px; letter-spacing: .01em; }
  .pdp-info .price { font-family: var(--f-mono); font-size: 1.3rem; margin-top: 12px; }
  .pdp-info .lede { color: #5b5345; margin: 18px 0 0; max-width: 46ch; }
  .opt { margin-top: 26px; }
  .opt .opt-label { font-family: var(--f-mono); font-size: .68rem; letter-spacing: .16em;
    text-transform: uppercase; color: var(--sand-text); display: block; margin-bottom: 12px; }
  .swatches { display: flex; gap: 12px; }
  .swatch-dot { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--bone-d);
    cursor: pointer; transition: transform .15s; padding: 0; }
  .swatch-dot:hover { transform: scale(1.08); }
  .swatch-dot.is-active { outline: 2px solid var(--pine); outline-offset: 2px; }
  .swatch-dot.sw-ink { background: var(--ink); }
  .swatch-dot.sw-bone { background: var(--bone); }
  .swatch-dot.sw-pine { background: var(--pine); }
  .swatch-dot.sw-sand { background: var(--sand); }
  .sizes { display: flex; gap: 10px; flex-wrap: wrap; }
  .size-pill { font-family: var(--f-mono); font-size: .78rem; letter-spacing: .06em; min-width: 46px;
    text-align: center; padding: .7em .6em; border: 1.5px solid var(--bone-d); border-radius: 2px;
    background: #fff; color: var(--ink); cursor: pointer; transition: border-color .2s, background .2s, color .2s; }
  .size-pill:hover { border-color: var(--pine); }
  .size-pill.is-active { background: var(--pine); color: var(--bone); border-color: var(--pine); }
  .size-pill[aria-disabled="true"] { opacity: .4; cursor: not-allowed; text-decoration: line-through; }
  .qty { display: inline-flex; align-items: center; border: 1.5px solid var(--ink); border-radius: 2px; }
  .qty button { width: 42px; height: 42px; background: transparent; border: 0; font-family: var(--f-mono);
    font-size: 1.1rem; cursor: pointer; color: var(--ink); }
  .qty button:hover { background: var(--bone-d); }
  .qty input { width: 44px; text-align: center; border: 0; border-inline: 1.5px solid var(--ink);
    font-family: var(--f-mono); font-size: .9rem; padding: .6em 0; background: transparent; -moz-appearance: textfield; }
  .qty input::-webkit-outer-spin-button, .qty input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .btn-block { width: 100%; justify-content: center; margin-top: 24px; }
  .acc { border-top: 1px solid var(--bone-d); margin-top: 34px; }
  .acc-item { border-bottom: 1px solid var(--bone-d); }
  .acc-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px;
    background: none; border: 0; padding: 18px 0; cursor: pointer; font-family: var(--f-body);
    font-weight: 600; font-size: 1rem; color: var(--ink); text-align: left; }
  .acc-trigger .ico { font-family: var(--f-mono); transition: transform .25s; }
  .acc-trigger[aria-expanded="true"] .ico { transform: rotate(45deg); }
  .acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
  .acc-item.is-open .acc-panel { grid-template-rows: 1fr; }
  .acc-panel-inner { overflow: hidden; color: #5b5345; }
  .acc-panel-inner p { margin: 0 0 18px; }
  @media (max-width: 900px) { .pdp { grid-template-columns: 1fr; } }
  ```

- [ ] **Step 2: Append the product behaviour to `assets/theme.js`.**
  ```js
  /* PDP gallery — click a thumb to swap the main image */
  document.querySelectorAll('.gallery').forEach(function (g) {
    var main = g.querySelector('.main img');
    g.querySelectorAll('.thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        g.querySelectorAll('.thumb').forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
        if (main) main.src = t.querySelector('img').src;
      });
    });
  });
  /* Variant pickers — single-select highlight (mockup) */
  document.querySelectorAll('.swatches, .sizes').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var opt = e.target.closest('.swatch-dot, .size-pill');
      if (!opt || opt.getAttribute('aria-disabled') === 'true') return;
      group.querySelectorAll('.is-active').forEach(function (x) { x.classList.remove('is-active'); });
      opt.classList.add('is-active');
    });
  });
  /* Accordion */
  document.querySelectorAll('.acc-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc-item');
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  /* Quantity stepper */
  document.querySelectorAll('.qty').forEach(function (q) {
    var input = q.querySelector('input');
    q.querySelector('.dec').addEventListener('click', function () {
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    });
    q.querySelector('.inc').addEventListener('click', function () {
      input.value = (parseInt(input.value, 10) || 1) + 1;
    });
  });
  ```

- [ ] **Step 3: Create `product.html`** (featured product: Signature Block Polo, £37.99).
  ```html
  <!doctype html><html lang="en"><head>
    <!-- canonical head from _shell.md --><title>Signature Block Polo — S3 Clothing</title>
  </head><body>
    <!-- canonical nav -->
    <section class="section wrap">
      <p class="crumbs" style="color:var(--sand-text);margin-bottom:28px">
        <a href="index.html">Home</a><span class="sep">/</span>
        <a href="collection.html">On Course</a><span class="sep">/</span>Signature Block Polo</p>
      <div class="pdp">
        <div class="gallery">
          <div class="main"><img src="fad824_236eeeb7fd4743568e5cbca667edcc9c~mv2.png" alt="S3 Signature Block Polo, front" /></div>
          <div class="thumbs">
            <button class="thumb is-active"><img src="fad824_236eeeb7fd4743568e5cbca667edcc9c~mv2.png" alt="View 1" /></button>
            <button class="thumb"><img src="fad824_a6884e0d89e9421d86b187391539938e~mv2.png" alt="View 2" /></button>
            <button class="thumb"><img src="fad824_696bb5dae61844c9bb1b9315016b4593~mv2.png" alt="View 3" /></button>
          </div>
        </div>
        <div class="pdp-info">
          <p class="eyebrow">On course · Polo</p>
          <h1>Signature Block Polo</h1>
          <p class="price">£37.99</p>
          <p class="lede">Our bestselling colour-block polo, cut for movement and finished for the clubhouse — recycled performance fabric that plays as long as you do.</p>
          <div class="opt"><span class="opt-label">Colour</span>
            <div class="swatches">
              <button class="swatch-dot sw-ink is-active" aria-label="Black"></button>
              <button class="swatch-dot sw-bone" aria-label="Bone"></button>
              <button class="swatch-dot sw-pine" aria-label="Pine"></button>
              <button class="swatch-dot sw-sand" aria-label="Sand"></button>
            </div>
          </div>
          <div class="opt"><span class="opt-label">Size</span>
            <div class="sizes">
              <button class="size-pill">XS</button><button class="size-pill is-active">S</button>
              <button class="size-pill">M</button><button class="size-pill">L</button>
              <button class="size-pill" aria-disabled="true">XL</button>
            </div>
          </div>
          <div class="opt"><span class="opt-label">Quantity</span>
            <div class="qty"><button class="dec" aria-label="Decrease">–</button>
              <input type="text" value="1" aria-label="Quantity" /><button class="inc" aria-label="Increase">+</button></div>
          </div>
          <a class="btn btn-solid btn-block" href="cart.html">Add to bag <span class="arw">→</span></a>
          <div class="acc">
            <div class="acc-item is-open"><button class="acc-trigger" aria-expanded="true">Details <span class="ico">+</span></button>
              <div class="acc-panel"><div class="acc-panel-inner"><p>Signature block-colour polo in a four-way-stretch recycled piqué. Ribbed collar, three-button placket, embroidered S3 mark.</p></div></div></div>
            <div class="acc-item"><button class="acc-trigger" aria-expanded="false">Materials <span class="ico">+</span></button>
              <div class="acc-panel"><div class="acc-panel-inner"><p>92% recycled polyester, 8% elastane. Low-impact dyes. Machine washable at 30°.</p></div></div></div>
            <div class="acc-item"><button class="acc-trigger" aria-expanded="false">Sizing &amp; care <span class="ico">+</span></button>
              <div class="acc-panel"><div class="acc-panel-inner"><p>Regular fit. Model is 6'1" wearing M. Wash cold, hang dry, do not iron the print.</p></div></div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sustainability mini-callout: reuse one .pillar inside a wrap -->
    <section class="sustain"><div class="wrap" style="padding-block:clamp(40px,6vw,72px)">
      <div class="pillars"><div class="pillar"><span class="k">Made responsibly</span>
        <h4>Recycled &amp; recyclable</h4><p>Spun from recycled fibres, built to be played in for seasons.</p></div>
        <div class="pillar"><span class="k">Low impact</span><h4>Made with less</h4><p>Low-impact dyes, considered manufacturing.</p></div>
        <div class="pillar"><span class="k">Longevity</span><h4>Built to last rounds</h4><p>The most sustainable kit is the kit you keep.</p></div></div>
    </div></section>

    <!-- "Complete the round" — homepage card grid with 3 related products -->
    <section class="section wrap"><div class="sec-head"><div><h2>Complete<br />the round</h2></div></div>
      <div class="grid3">
        <!-- 3 .card blocks: S3 Tour Mid Layer £44.99, Signature Full-Zip £37.99, GeoLine Performance Polo £38.99 -->
      </div>
    </section>
    <!-- canonical footer + script -->
  </body></html>
  ```
  Reuse the homepage `.card` markup verbatim for the three related products.

- [ ] **Step 4: Run the verification recipe on `product.html`.** Click each thumb (main swaps), colour/size select (single highlight), accordion toggles, qty steps 1↔n. Confirm the layout collapses to one column at ≤900px.

- [ ] **Step 5: Commit.**
  ```bash
  git add product.html assets/theme.css assets/theme.js
  git commit -m "Add product detail page with gallery, variants, accordion"
  ```

---

### Task 5: Cart page

**Files:**
- Create: `cart.html`
- Modify: `assets/theme.css` (append "CART")

**Interfaces:**
- Consumes: shell; `.btn .btn-solid .btn-block .qty` (qty stepper + its JS already exist from Task 4).
- Produces: `.cart .line-items .line-item .summary .ship-bar .ship-note .cart-empty`.

- [ ] **Step 1: Append the cart components to `assets/theme.css`.**
  ```css
  /* ================= CART ================= */
  .cart { display: grid; grid-template-columns: 1.6fr .9fr; gap: clamp(28px, 4vw, 56px); align-items: start; }
  .line-items { border-top: 1px solid var(--bone-d); }
  .line-item { display: grid; grid-template-columns: 88px 1fr auto; gap: 18px; padding: 22px 0;
    border-bottom: 1px solid var(--bone-d); align-items: center; }
  .line-item .li-thumb { width: 88px; aspect-ratio: 4/5; border-radius: 2px; overflow: hidden; background: #f4f2ec; }
  .line-item .li-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .line-item .li-name { font-weight: 600; font-size: 1.02rem; }
  .line-item .li-variant { font-family: var(--f-mono); font-size: .66rem; letter-spacing: .12em;
    text-transform: uppercase; color: var(--sand-text); margin-top: 4px; }
  .line-item .li-controls { display: flex; align-items: center; gap: 18px; margin-top: 12px; }
  .line-item .li-remove { font-family: var(--f-mono); font-size: .62rem; letter-spacing: .12em;
    text-transform: uppercase; color: var(--sand-text); background: none; border: 0; cursor: pointer; }
  .line-item .li-remove:hover { color: var(--ink); }
  .line-item .li-price { font-family: var(--f-mono); font-size: .95rem; text-align: right; align-self: start; }
  .summary { background: #fff; border: 1px solid var(--bone-d); border-radius: 4px;
    padding: clamp(22px, 2.6vw, 32px); position: sticky; top: 96px; }
  .summary h2 { font-family: var(--f-display); text-transform: uppercase; font-size: 1.5rem; margin-bottom: 18px; }
  .summary .row { display: flex; justify-content: space-between; font-family: var(--f-mono);
    font-size: .82rem; padding: 10px 0; color: #5b5345; }
  .summary .row.total { border-top: 1px solid var(--bone-d); margin-top: 8px; padding-top: 16px;
    color: var(--ink); font-size: 1rem; }
  .ship-bar { height: 6px; border-radius: 3px; background: var(--bone-d); overflow: hidden; margin: 14px 0 6px; }
  .ship-bar i { display: block; height: 100%; background: var(--flag); }
  .ship-note { font-family: var(--f-mono); font-size: .64rem; letter-spacing: .1em;
    text-transform: uppercase; color: var(--sand-text); }
  .cart-empty { text-align: center; padding: clamp(48px, 8vw, 96px) 0; }
  .cart-empty h2 { font-family: var(--f-display); text-transform: uppercase; font-size: clamp(2rem,5vw,3rem); }
  .cart-empty p { color: #5b5345; margin: 14px 0 26px; }
  @media (max-width: 900px) { .cart { grid-template-columns: 1fr; } }
  ```

- [ ] **Step 2: Create `cart.html`** (filled state; empty state as a commented block).
  ```html
  <!doctype html><html lang="en"><head>
    <!-- canonical head --><title>Your bag — S3 Clothing</title></head><body>
    <!-- canonical nav -->
    <section class="page-head"><div class="wrap">
      <p class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>Your bag</p>
      <h1 style="margin-top:14px">Your bag</h1></div></section>
    <section class="section wrap">
      <div class="cart">
        <div class="line-items">
          <!-- repeat .line-item per product -->
          <div class="line-item">
            <div class="li-thumb"><img src="fad824_236eeeb7fd4743568e5cbca667edcc9c~mv2.png" alt="Signature Block Polo" /></div>
            <div>
              <div class="li-name">Signature Block Polo</div>
              <div class="li-variant">Black · M</div>
              <div class="li-controls">
                <div class="qty"><button class="dec" aria-label="Decrease">–</button>
                  <input type="text" value="1" aria-label="Quantity" /><button class="inc" aria-label="Increase">+</button></div>
                <button class="li-remove">Remove</button>
              </div>
            </div>
            <div class="li-price">£37.99</div>
          </div>
          <div class="line-item">
            <div class="li-thumb"><img src="fad824_696bb5dae61844c9bb1b9315016b4593~mv2.png" alt="S3 Tour Mid Layer" /></div>
            <div><div class="li-name">S3 Tour Mid Layer</div><div class="li-variant">Pink · S</div>
              <div class="li-controls"><div class="qty"><button class="dec" aria-label="Decrease">–</button>
                <input type="text" value="1" aria-label="Quantity" /><button class="inc" aria-label="Increase">+</button></div>
                <button class="li-remove">Remove</button></div></div>
            <div class="li-price">£44.99</div>
          </div>
        </div>
        <aside class="summary">
          <h2>Summary</h2>
          <div class="row"><span>Subtotal</span><span>£82.98</span></div>
          <div class="row"><span>Shipping</span><span>£3.95</span></div>
          <div class="ship-bar"><i style="width:85%"></i></div>
          <p class="ship-note">£17.02 from free UK delivery</p>
          <div class="row total"><span>Total</span><span>£86.93</span></div>
          <a class="btn btn-solid btn-block" href="#">Checkout <span class="arw">→</span></a>
        </aside>
      </div>
      <!-- EMPTY STATE (swap in to preview): 
      <div class="cart-empty"><h2>Your bag is empty</h2>
        <p>Nothing in the bag yet — let's fix that.</p>
        <a class="btn btn-solid" href="collection.html">Shop on course <span class="arw">→</span></a></div>
      -->
    </section>
    <!-- canonical footer + script -->
  </body></html>
  ```

- [ ] **Step 3: Run the verification recipe on `cart.html`.** Confirm qty steppers work (JS from Task 4), summary sticks, free-delivery bar reads sensibly (threshold £75 from the ticker copy), collapses to one column at ≤900px. Briefly swap in the empty-state block to confirm it renders, then revert.

- [ ] **Step 4: Commit.**
  ```bash
  git add cart.html assets/theme.css
  git commit -m "Add cart page with line items, summary, free-delivery bar"
  ```

---

### Task 6: Search results page

**Files:**
- Create: `search.html`
- Modify: `assets/theme.css` (append "SEARCH")

**Interfaces:**
- Consumes: shell; `.page-head .grid3 .card .pager` and the filter components from Task 3.
- Produces: `.searchbox .no-results`.

- [ ] **Step 1: Append search components to `assets/theme.css`.**
  ```css
  /* ================= SEARCH ================= */
  .searchbox { display: flex; gap: 10px; max-width: 560px; margin-top: 18px; }
  .searchbox input { flex: 1; border: 1.5px solid rgba(243,238,227,.5); background: rgba(10,24,19,.4);
    border-radius: 2px; padding: .9em 1.1em; font-family: var(--f-body); font-size: 1rem; color: var(--bone); }
  .searchbox input::placeholder { color: var(--sage); }
  .no-results { text-align: center; padding: clamp(48px, 8vw, 96px) 0; color: #5b5345; }
  .no-results h2 { font-family: var(--f-display); text-transform: uppercase; color: var(--ink);
    font-size: clamp(1.8rem,4vw,2.6rem); margin-bottom: 12px; }
  ```

- [ ] **Step 2: Create `search.html`** with a pine `.page-head` containing the search field, a result count, the `.grid3` of matching `.card`s (reuse 3–4 real products), and a commented `.no-results` block.
  ```html
  <!-- in .page-head .wrap -->
  <h1 style="margin-top:14px">Search</h1>
  <form class="searchbox" onsubmit="return false;">
    <label for="q" style="position:absolute;left:-9999px">Search</label>
    <input id="q" type="search" placeholder="Search the range — polos, mid-layers…" value="polo" />
    <button class="btn btn-solid" type="submit">Search</button>
  </form>
  <!-- below: <section class="section wrap"> with <p class="eyebrow">3 results for "polo"</p>, a .grid3, and a commented .no-results variant -->
  ```

- [ ] **Step 3: Run the verification recipe on `search.html`.** Confirm the search field reads well on pine, results grid matches the collection grid, no-results variant renders when swapped in.

- [ ] **Step 4: Commit.**
  ```bash
  git add search.html assets/theme.css
  git commit -m "Add search results page with results and no-results states"
  ```

---

### Task 7: About / brand story page

**Files:**
- Create: `about.html`

**Interfaces:**
- Consumes: shell; `.band .band-stage .band-cap .sustain .pillars .pillar .split .sec-head` — all existing homepage components, no new CSS.

- [ ] **Step 1: Create `about.html` entirely from existing homepage blocks.**
  Compose: a pine `.page-head` ("Our Story", eyebrow "Sweet Spot Styles · Designed in Britain"); a copy `.section wrap` with a `.sec-head` + brand-story paragraphs; the homepage `.band` image band ("Out on the course"); the full `.sustain` section (copied verbatim from `index.html`, kept under `id="sustain"`); and a `#contact` anchor block with the social links (Instagram/TikTok/Facebook) reusing `.foot-social` styling. No new classes — if anything seems to need one, stop and reconsider.

- [ ] **Step 2: Run the verification recipe on `about.html`** (token audit must pass with zero new CSS; nav/footer drift check). Confirm every block matches its homepage counterpart.

- [ ] **Step 3: Commit.**
  ```bash
  git add about.html
  git commit -m "Add about/brand story page from existing components"
  ```

---

### Task 8: Account (login / register) page

**Files:**
- Create: `account.html`
- Modify: `assets/theme.css` (append "FORMS / AUTH")

**Interfaces:**
- Consumes: shell; `.btn .btn-solid`.
- Produces: `.field .auth .panel` (reusable form fields).

- [ ] **Step 1: Append form/auth components to `assets/theme.css`.**
  ```css
  /* ================= FORMS / AUTH ================= */
  .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
  .field label { font-family: var(--f-mono); font-size: .66rem; letter-spacing: .14em;
    text-transform: uppercase; color: var(--sand-text); }
  .field input { border: 1.5px solid var(--bone-d); border-radius: 2px; padding: .9em 1.1em;
    font-family: var(--f-body); font-size: 1rem; color: var(--ink); background: #fff; }
  .field input:focus { border-color: var(--pine); outline: none; }
  .auth { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 4vw, 56px); }
  .auth .panel { background: #fff; border: 1px solid var(--bone-d); border-radius: 4px; padding: clamp(26px, 3vw, 44px); }
  .auth h2 { font-family: var(--f-display); text-transform: uppercase; font-size: 1.8rem; margin-bottom: 20px; }
  @media (max-width: 780px) { .auth { grid-template-columns: 1fr; } }
  ```

- [ ] **Step 2: Create `account.html`** with a pine `.page-head` ("Account") and a `.section wrap` containing the `.auth` split: a **Log in** panel (email, password, full-width `.btn-solid` "Log in") and a **Create account** panel (first name, last name, email, password, `.btn-solid` "Create account"). Use the `.field` component for every input; all inputs labelled.

- [ ] **Step 3: Run the verification recipe on `account.html`.** Confirm the two panels sit side by side on desktop, stack at ≤780px, focus ring shows on inputs.

- [ ] **Step 4: Commit.**
  ```bash
  git add account.html assets/theme.css
  git commit -m "Add account login/register page with shared form fields"
  ```

---

### Task 9: 404 page

**Files:**
- Create: `404.html`
- Modify: `assets/theme.css` (append "404")

**Interfaces:**
- Consumes: shell; `.btn .btn-solid`.
- Produces: `.notfound`.

- [ ] **Step 1: Append the 404 component to `assets/theme.css`.**
  ```css
  /* ================= 404 ================= */
  .notfound { background: var(--pine); color: var(--bone); min-height: 70vh; display: flex;
    flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: var(--gut); }
  .notfound .code { font-family: var(--f-mono); color: var(--sand); letter-spacing: .2em; text-transform: uppercase; }
  .notfound h1 { font-family: var(--f-display); text-transform: uppercase;
    font-size: clamp(3rem, 10vw, 7rem); line-height: .9; margin: 14px 0; }
  .notfound h1 em { font-style: normal; color: var(--flag); }
  .notfound p { color: #cdd9d0; max-width: 40ch; margin: 0 0 26px; }
  ```

- [ ] **Step 2: Create `404.html`.**
  ```html
  <!doctype html><html lang="en"><head>
    <!-- canonical head --><title>Out of bounds — S3 Clothing</title></head><body>
    <!-- canonical nav -->
    <section class="notfound">
      <p class="code">Error 404 · Lost ball</p>
      <h1>Out of <em>bounds.</em></h1>
      <p>That page took a wild swing into the trees. Let's get you back on the fairway.</p>
      <a class="btn btn-solid" href="index.html">Back to the clubhouse <span class="arw">→</span></a>
    </section>
    <!-- canonical footer + script -->
  </body></html>
  ```

- [ ] **Step 3: Run the verification recipe on `404.html`** (nav/footer drift check). Confirm full-pine screen, Anton oversized heading, flag-yellow CTA.

- [ ] **Step 4: Commit.**
  ```bash
  git add 404.html assets/theme.css
  git commit -m "Add on-brand 404 page"
  ```

---

## Final verification (after all tasks)

- [ ] **Cross-screen consistency pass.** Open all 8 screens + homepage; confirm one coherent visual system (palette, type scale, spacing, component reuse).
- [ ] **Repo-wide token audit:** `! grep -rnE '#[0-9a-fA-F]{3,6}' --include=*.html .` and `! grep -rn 'font-family' --include=*.html .` — only `index.html`'s remaining inline `style=""` attributes (if any) and the SVG `fill`/colour attributes are acceptable; flag anything else.
- [ ] **Nav/footer drift:** run the diff check (Task 2 Step 3) for every screen against `index.html`. Expected: no output.
- [ ] **Links resolve:** every nav/CTA/breadcrumb `href` points at a file that exists.
- [ ] **Responsive:** screenshot each screen at 390px; confirm clean collapse.
- [ ] Final commit if any fixes were needed.

## Self-Review Notes

- **Spec coverage:** theme.css extraction (Task 1) ✓; homepage price fix (Task 1) ✓; collection (Task 3) ✓; product (Task 4) ✓; cart incl. empty state (Task 5) ✓; search incl. no-results (Task 6) ✓; about (Task 7) ✓; account (Task 8) ✓; 404 (Task 9) ✓; real data (Global Constraints + tasks) ✓; consistency/verification mechanism (Verification recipe + final pass) ✓; shared nav/footer (Task 2) ✓; theme.js for interactions (Tasks 1/4) ✓.
- **Component reuse:** `.qty` defined once (Task 4), reused by cart (Task 5); filter components (Task 3) reused by search (Task 6); `.field` (Task 8) generalises the newsletter input idiom.
- **Drawer cart** deferred to the Shopify phase per spec (out of scope here).
