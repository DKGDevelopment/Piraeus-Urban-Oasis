# Claude Code Handoff Notes

## Project

This repository is the **Urban Piraeus Oasis** investor-facing marketing website. It is a React 19 + Vite + Tailwind 4 frontend intended for deployment on Vercel.

## Source of truth

- Main page: `client/src/pages/Home.tsx`
- Global design system and responsive styling: `client/src/index.css`
- HTML metadata and font loading: `client/index.html`
- Vercel build configuration: `vercel.json`
- Approved/local poster assets: `client/public/images/`

Do not replace the current visual system with a generic template. Preserve the editorial Mediterranean design language: warm sand and paper backgrounds, deep ink green, terracotta accents, Cormorant Garamond display typography, DM Sans utility typography, generous whitespace, asymmetric grids, and understated borders.

## Header and hero layout

The header is a solid two-row `.site-header` (a dark `.utility-bar` strip above a `.site-nav` row with a dark CTA block) sitting in normal document flow above the hero, not overlaid on it. The hero (`.hero-panel`) is sized to `calc(100vh - <header height>)` (106px desktop, 66px mobile) so the header and hero together exactly fill the screen on landing, with the video reaching the bottom edge and no gap before the next section.

The hero is intentionally minimal right now (per client direction, being rebuilt step by step): just the video and a bottom-left `.hero-copy` overlay headline. The previous Masterplan/Residences/Location toggle and bottom-right residence/location widget cards were removed — don't re-add them without the client asking again.

If you change header height (add/remove a row, resize the nav), update the `calc(100vh - ...)` value in `.hero-panel` (both the desktop rule and the `@media (max-width: 800px)` override) to match, or the hero will stop filling the full screen.

**Card-stack scroll effect — do not reintroduce `overflow: hidden` on `.site-shell` (or any other ancestor of `.hero-panel`).** `position: sticky` breaks the moment any ancestor between the sticky element and the true document scroll root has `overflow` other than `visible`, even if that ancestor never actually overflows. This shipped broken for a while because `.site-shell` had `overflow: hidden` (originally added to hide an unrelated horizontal-overflow bug in the hero `<video>`). The fix: clip horizontal overflow locally on `.hero-panel` itself (`overflow: hidden` on the sticky element is fine — it's the element's *ancestors* that must stay `visible`), not on any wrapping container. If a future full-bleed element causes horizontal scroll, clip it at its own nearest non-ancestor-of-sticky wrapper, not on `html`, `body`, or `.site-shell`.

Also: the scroll-reveal fade (`.motion-ready > section:not(.hero-panel)`, see Motion system below) used to animate `opacity` from 0 to 1. Since the hero stays sticky-pinned behind literally every section on the page (its containing block, `.site-shell`, spans the full document), that fade let the hero show through **every** section's entrance transition, not just the card-stack ones — this was initially only patched for `.workplace-section`/`.location-gallery`/`.location-map-section`, which wasn't enough. The reveal is now transform-only site-wide (no opacity animation at all on `section:not(.hero-panel)`) — don't reintroduce an opacity fade on any section without first checking it doesn't let the hero bleed through.

**Card-stack section height must match `.hero-panel`'s height exactly, at every breakpoint.** The sticky hero stays pinned at `top: 0` with a fixed height (`calc(100vh - 106px)` desktop / `calc(100vh - 66px)` mobile) for effectively the whole remaining page scroll (its containing block, `.site-shell`, spans the full document, so it never really "runs out" of sticky range). That means any full-bleed section meant to fully cover it must be **at least as tall as the hero's own height at that breakpoint** — if it's shorter, the hero peeks out below it. This bit `.location-gallery` and `.location-map-section` on mobile (they used `82vh`, shorter than the hero's `calc(100vh - 66px)`); both now use the identical `calc(100vh - 66px)` formula on mobile (and `calc(100vh - 106px)` / `100vh`-based sizing already matched on desktop). If you add another full-bleed card-stack section, or change the hero's height formula, keep them in sync.

## Hero video

The homepage hero uses the provided Bunny CDN public MP4:

`https://piraeusgate.b-cdn.net/kling_20260915_VIDEO__4577_0.mp4`

Implementation details:

- The video is in the `#top` hero section in `Home.tsx`.
- It is `autoPlay`, `muted`, `loop`, `playsInline`, and `preload="auto"`.
- There is intentionally no `poster` image — the client asked for the loading placeholder to be removed, so the video element shows the `.hero-panel` background color until the video can play.
- Keep the `.hero-image` class intact so crop/fit stays consistent.
- Do not download or commit the 45 MB Bunny video into the repository.

## Motion system

The current motion is intentionally editorial and restrained:

- `Home.tsx` uses `IntersectionObserver` to reveal each non-hero section as it enters the viewport.
- The hero image/video receives a small requestAnimationFrame-throttled scroll parallax through the `--hero-scroll` CSS variable.
- Building and residence media use React `key` values plus `.slide-media` to replay slide-in transitions when the active tab changes.
- Motion is disabled or simplified under `prefers-reduced-motion: reduce`.
- Keep transitions focused on `opacity` and `transform`; avoid adding layout animations.

## Section 3 — location gallery

The former "vision panel" (`.vision-panel`, "Quality living, within reach.", the OASIS OASIS outline-word watermark) has been fully replaced at the client's direction with `.location-gallery`: a full-viewport-height (`100vh` desktop, `calc(100vh - 66px)` mobile — see the card-stack height note above), edge-to-edge, auto-rotating image slideshow (4s interval, crossfade).

- `locationImages` in `Home.tsx` now uses the client's real photos, moved from the repo root (where the client committed them directly to `main`) into `client/public/images/`: `piraeus-location-marina-zea.jpg` (Marina Zea), `piraeus-location-port.jpg` (Piraeus Port), `piraeus-location-tower.jpg` (Piraeus Tower), `piraeus-location-karaiskaki.jpg` (Karaiskaki).
- The section keeps the same card-stack sticky/overlap treatment (border-radius top corners + shadow) as the sections around it — don't drop that when editing.
- Each slide has a `label` (top-right, large bold white sans-serif, `.location-gallery-label`) crossfading in sync with its image: Marina Zeas, Piraeus Port, Piraeus Tower, Karaiskaki Stadium — in that mapping, not list order. Matches a client-provided reference style (bold white text bleeding off the top-right of a full-bleed photo).
- Slide navigation is `.location-gallery-nav`: a fixed-order, bottom-center stacked list of all four location names (not dots). The active slide's name is bold/white/larger; the rest are dim — matching a client-provided reference where the current item is wherever it falls in that fixed order (e.g. the last item in the list when it's the active slide). Clicking a name jumps to that slide.

## Section 4 — interactive location map

Replaced the decorative fake-map illustration (`.map-card`, `.map-grid`, `.map-orbit`, `.map-pin`, etc.) and the "Why Piraeus" text column with `LocationMap`, a real full-viewport-height (same card-stack height rules as above) interactive Google Map, at the client's explicit direction ("our current location section sucks").

- **`client/src/components/Map.tsx`** exports `MapView`, a thin wrapper that lazy-loads the Google Maps JavaScript API (`https://maps.googleapis.com/maps/api/js?key=...`) using `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`, then renders a `google.maps.Map` into a full-size div. This file originally shipped as unused scaffold boilerplate wired to a third-party "Frontend Forge" proxy (`VITE_FRONTEND_FORGE_API_KEY`, `forge.butterfly-effect.dev`) that the client has no access to — it's been rewritten to hit Google's API directly with the client's own key. It was not used anywhere else in the app before this.
- **The API key** lives only in the client's Vercel project env vars (and their own local `.env.local`, gitignored) — never hardcoded here, never pasted into chat. It's a `VITE_`-prefixed var, so it's intentionally bundled into the client JS; the actual security boundary is the HTTP-referrer domain restriction the client set on the key in Google Cloud Console, not secrecy. If the key is ever missing/invalid/blocked, `MapView` calls `onError`, and `LocationMap` falls back to `.location-map-fallback` (a plain gradient) so the section still renders cleanly instead of showing a broken/blank map. Every failure path (missing key, script load failure, `new google.maps.Map()` throwing) logs a `[LocationMap]`-prefixed `console.error` first — if the map ever shows the fallback in production, check the browser console for that log before guessing at the cause. `VITE_` env vars are baked in at **build time**, not read at runtime — the key must be set for the right Vercel Environment (Production/Preview) and a fresh deployment triggered after adding/changing it, or the bundle won't have it.
- **`mapPoints`** in `Home.tsx`: the project site ("Urban Piraeus Oasis") uses client-confirmed coordinates (37.94734210830303, 23.656522176345334). The other four points are the same POIs used in the section-3 gallery (Piraeus Tower, Karaiskaki Stadium, Piraeus Port, Marina Zeas), and now also use client-confirmed coordinates.
- **`mapStyle`** is a custom muted/desaturated `google.maps.MapTypeStyle[]` matching the site's sand/paper palette — don't swap in a default Google style, it'll clash.
- The overlay panel (`.location-map-panel`, top-left, dark) shows the active location's name as a heading, a clickable list of the *other* locations, and an "Open Google Map" button (deep-links to `google.com/maps/search` for the active point). Clicking a name pans/zooms the map and re-styles markers (active = larger, terracotta; others = smaller, ink) — matches a client-provided reference screenshot's map/panel/selector layout.

## Section 5 — masterplan

Replaced the interactive masterplan diagram (building selector, `buildings` array, `.masterplan-section`/`.building-block`/`.masterplan-label` illustration) with a single full-bleed image, at the client's explicit direction ("remove everything and replace it with the image").

- `images.masterplan` → `client/public/images/piraeus-masterplan.jpg`, moved from a file the client committed directly to `main` under "Masterplan Piraeus Gate."
- The section is now just `.masterplan-image-section` containing one `<img>` — no text, no interactivity, no building data.
- Keeps the same card-stack sticky/overlap treatment (top border-radius + shadow, height matching the hero at every breakpoint) as the sections above it.
- The `buildings` array, `activeBuilding` state, and the `lightbox` state/modal (whose only trigger was the removed masterplan building-detail panel) were all dead code once this shipped — removed along with their CSS.

## Section between masterplan and residences — scroll-locked horizontal gallery

Added `#area-gallery` (`.area-scroll-outer`) directly after the masterplan section, at the client's request for a horizontal-scrolling image strip (reference: a "02 Floor" style gallery layout). Scope was explicitly narrowed by the client to just the scroll mechanic — no floor-number watermark, no floor-plan thumbnail, no caption text.

- Mechanic: `.area-scroll-outer` is a tall wrapper (height set in JS to `track.scrollWidth + window.innerHeight`, giving a ~1:1 scroll-to-translate feel) containing a `position: sticky` `.area-scroll-sticky` (pinned full-viewport while its parent scrolls underneath it) wrapping `.area-scroll-track`, a flex row of images. The same scroll listener that drives the hero parallax (`Home.tsx`, in the big `useEffect`) also computes `progress = -outer.getBoundingClientRect().top / (outer.offsetHeight - innerHeight)` each frame and sets `track.style.transform = translateX(-progress * maxOffset)`. Once the track finishes translating, normal vertical scroll continues into the next section — no wheel-event hijacking, no `preventDefault`.
- `outer.style.height` is (re)computed on mount, on `resize`, and on `load` (images can change layout after paint) — keep that in sync if the item count or width changes.
- `areaGalleryImages` in `Home.tsx` uses the client's real photos: seven historical black-and-white images of Piraeus (harbor, streets, cafés, the old electric railway), committed directly to `main` under "Old Piraeus v1" and moved into `client/public/images/` as `piraeus-old-01.png` through `piraeus-old-07.webp`.
- Keeps the same card-stack sticky/overlap treatment (top border-radius + shadow) as the surrounding full-bleed sections. Its own internal `position: sticky` is independent of that — don't confuse the two.
- `.area-scroll-sticky` is a flex column: `.area-scroll-copy` (fixed, non-scrolling intro text) sits above `.area-scroll-track` (the horizontally-translating strip, `flex: 1 1 auto`). Each `.area-scroll-item` is a small-to-medium thumbnail (`clamp(220px, 20vw, 380px)` wide, `44%` tall — doubled once from an initial `clamp(110px, 10vw, 190px)`/`22%` at the client's request) with wide gaps between them (`clamp(60px, 9vw, 160px)`) — the client wants small, sparse images, not full-bleed. `nth-child(odd)`/`nth-child(even)` alternate `align-self: flex-start`/`flex-end` so the strip staggers between the top and bottom of the section as it scrolls, per the client's reference. Don't re-enlarge these to full-bleed without the client asking again — that was tried and reverted once already.
- `.area-scroll-copy` holds the client-provided intro copy about Piraeus Gate's history as a **single continuous paragraph, one column, centered, spanning the full width of the section's padding** (not split into two paragraphs or two columns, not capped to a narrow column), in the site's serif display face (`var(--serif)`, Cormorant Garamond) at a large body size (`clamp(22px, 2.3vw, 34px)`) — matches a client-provided reference screenshot's typography. Don't reintroduce a multi-paragraph/multi-column layout or a narrow max-width here without the client asking again.

## Section 5 (removed) — residences

The `#residences` section ("Find your right size.", a studio/1-bed/2-bed/3-bed switcher with an indicative floor-plan placeholder) was removed entirely at the client's request. Removed along with it: the `residences` array, `activeResidence` state, the `ChevronRight` icon import (had no other use), the nav links to `#residences` (desktop + mobile), and all of its CSS (`.rhythm-section`, `.rhythm-head`, `.space-switcher`, `.space-feature`, `.space-image`, `.space-copy`, `.residence-section`, `.plan-placeholder`, `.plan-room`, `.light-disclaimer`, the `.slide-media`/`.space-copy h3` reveal animations and their keyframes). The remaining `.section-kicker` numbers (investors, rationale, timeline, developer) were renumbered down by one (05→04, 06→05, 07→06, 08→07) to stay sequential. Don't re-add a residence typology selector without the client asking again.

## Section 7 (removed) — about DKG Development

The `.developer-section` ("About DKG Development", "Built on delivery.", the four-pillar Residential/Hospitality/Investment/Greece-network row) was removed entirely at the client's request, directly before `#contact`. Removed along with it: all of its CSS (`.developer-section`, `.developer-grid`, `.developer-pillars`, `.pillar-plus`) plus the now-dead `.text-link`/`.light-link` utility classes (had no other use). No section kicker renumbering was needed since it was the last numbered section before contact. Don't re-add a developer/about section without the client asking again.

## /explore — 3D site viewer (phase 1 of the unit-selection flow)

A separate route (`client/src/pages/Explore.tsx`, lazy-loaded from `App.tsx` via wouter so three.js never ships on the homepage) renders the architect's model with `@react-three/fiber` + `drei`. Linked from the desktop and mobile nav ("Explore 3D"). Agreed roadmap with the client: 3D building/floor pick → 2D floor plan for unit pick → unit details panel → documents room → down-payment explainer → agreement form → payment. Only building selection exists so far.

- **Model:** `https://piraeusgate.b-cdn.net/azel-web-v2.glb` (Bunny CDN, same pull zone as the hero video; CORS must be enabled there for `glb`). Source is `azel.glb` (165 MB) on the GitHub release `Release001` — never commit either to the repo. When the model changes, upload under a **new filename** rather than overwriting, so the CDN cache can't serve a stale copy, and update `MODEL_URL`.
- **Compression pipeline (important):** do NOT use `gltf-transform optimize` defaults — its join/flatten/palette steps merge the 218 named nodes into 9 and destroy building selection. Use `@gltf-transform/core` + `functions` with only `dedup, prune, resample, weld, textureCompress(webp, 2048), reorder, quantize` + `EXTMeshoptCompression`. Skip `simplify` (only saved ~3.5 MB and the geometry is already coarse). Also, the architect's export sets `baseColorFactor` to black on textured materials (and on the untextured `*_COLOR_BRICKS*` materials), which renders them black — reset textured ones to white and give the brick ones a brick colour during compression. Result: ~24 MB.
- **Building identity comes from node names**, e.g. `R01_ARCHITECTURAL_PROPOSAL_N3_WALLS__M0008` → `N3`, `PRESERVED_BUILDINGS_K1_…` → `K1` (`buildingOf()`). Five new buildings N1–N5 plus preserved K1/K2. Floors and units are **not** separate objects in the model — each building is split by material only — which is why the agreed approach is 3D for building/floor and a 2D floor plan for units.
- The model is Z-up and georeferenced (nodes sit ~2,600 m from origin with ×79 scale), so framing is computed at runtime from bounding boxes after `scene.updateMatrixWorld(true)` — bounds measured before that are wrong.
- Non-building meshes get a no-op `raycast` so clicks only test building geometry (the scene is ~2.7M triangles). Clicks after an orbit drag (`event.delta > 4`) are ignored. Materials on building meshes are cloned so the terracotta emissive highlight doesn't bleed into other buildings sharing a material.
- `CameraRig` reads its goal from a ref (not the render closure), snaps to a three-quarter site view on first load, then eases to the selected building, fitting the bounding sphere to the narrower of the horizontal/vertical FOV so portrait phones don't crop it. It stops animating once settled so it never fights the user's orbit/zoom.
- **Unit types (placeholder for management review):** selecting a new building (N1–N5) lists the four unit types from the client's indicative pricing sheet (`unitTypes` in `Explore.tsx`: Studio 30–38 m² / €120–190k, 1-Bed 40–55 m² / €160–275k, 2-Bed 56–75 m² / €224–375k, 3-Bed 76–92 m² / €304–460k, at €4,000–5,000/m²). The ranges are identical for every building and labelled Indicative — the client doesn't yet know floors per building or the floor plans. Replace with a real per-unit list (ID, building, floor, type, m², price, availability) once provided. K1/K2 show "Preserved building. Details to follow."
- No external HDR/environment fetch — lighting is a hemisphere + directional light so the page has no third-party runtime dependency beyond Bunny.

## Content and behavior constraints

- Project facts are intentionally labeled **indicative** where not formally confirmed.
- Do not convert indicative investment language into guarantees or financial claims.
- Keep the inquiry form as a frontend-only interaction unless an approved backend/CRM integration is requested.
- Preserve the current WhatsApp and email CTA behavior unless the client provides confirmed contact details.
- The `#overview` section (`.workplace-section`) is a work in progress being brought over from reference copy to real Piraeus content piece by piece, at the client's direction. The intro paragraphs, stats tiles (Gross buildable area 26,480 m² / Total floors 10 / To be delivered Q4 2028), the large `.workplace-address` watermark ("60 Omiridou Skylitsi"), and the image overlay ("A community" / "that works") are now client-approved copy; the tagline ("Every Morning Looks Different.") is still literal reference copy from the original screenshot and doesn't describe this project. Don't silently rewrite the remaining reference text to match the project — check with the client first, the same way this was flagged before implementing.
- `.workplace-address` bleeds edge-to-edge via negative horizontal margins matching the section's own padding, and relies on the card-stack sticky/overlap effect (see below) to get visually cut off at the bottom as the next section slides over it, the same way the reference screenshot's "250 Broadway" watermark is cropped. Don't add `overflow: hidden` height clipping to fake that — it happens naturally from the scroll stacking.

## Validation

Run before committing:

```bash
pnpm check
pnpm build
```

The build outputs the Vite site to `dist/public` and the server bundle to `dist/index.js`. Vercel uses the configuration in `vercel.json`.

## Change notes

- `0dcab08`: Initial investor-focused Urban Piraeus Oasis site synced to this repository.
- `573496a`: Added the Bunny CDN hero video with the existing hero image as poster fallback.
- `e9aa064`: Added editorial scroll reveals, subtle hero parallax, and keyed slide transitions for building/residence selectors.

When making future changes, add a short entry to `CHANGELOG.md` and update this file if architecture, media, deployment, or motion behavior changes.
