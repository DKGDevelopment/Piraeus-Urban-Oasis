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

Also: the scroll-reveal fade (`.motion-ready > section:not(.hero-panel)`, see Motion system below) animates `opacity` from 0 to 1, which — now that sticky actually works — would let the pinned hero (and earlier card-stack sections) show through card-stack sections mid-transition. `.workplace-section` and `.location-gallery` are excluded from the opacity fade (kept at `opacity: 1` always, transform-only reveal) for this reason. Any new card-stack section (border-radius top corners + box-shadow, sliding over the sticky hero) needs the same exclusion added to that override rule.

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

The former "vision panel" (`.vision-panel`, "Quality living, within reach.", the OASIS OASIS outline-word watermark) has been fully replaced at the client's direction with `.location-gallery`: a full-viewport-height (`100vh` desktop, `82vh` mobile), edge-to-edge, auto-rotating image slideshow (4s interval, crossfade), with small dot indicators at the bottom that are also clickable to jump to a slide.

- `locationImages` in `Home.tsx` now uses the client's real photos, moved from the repo root (where the client committed them directly to `main`) into `client/public/images/`: `piraeus-location-marina-zea.jpg` (Marina Zea), `piraeus-location-port.jpg` (Piraeus Port), `piraeus-location-tower.jpg` (Piraeus Tower), `piraeus-location-karaiskaki.jpg` (Karaiskaki).
- The section keeps the same card-stack sticky/overlap treatment (border-radius top corners + shadow) as the sections around it — don't drop that when editing.
- Each slide has a `label` (top-right, large bold white sans-serif, `.location-gallery-label`) crossfading in sync with its image: Marina Zeas, Piraeus Port, Piraeus Tower, Karaiskaki Stadium — in that mapping, not list order. Matches a client-provided reference style (bold white text bleeding off the top-right of a full-bleed photo).
- Slide navigation is `.location-gallery-nav`: a fixed-order, bottom-center stacked list of all four location names (not dots). The active slide's name is bold/white/larger; the rest are dim — matching a client-provided reference where the current item is wherever it falls in that fixed order (e.g. the last item in the list when it's the active slide). Clicking a name jumps to that slide.

## Content and behavior constraints

- Project facts are intentionally labeled **indicative** where not formally confirmed.
- Do not convert indicative investment language into guarantees or financial claims.
- Keep the masterplan and residence selectors functional.
- Keep the inquiry form as a frontend-only interaction unless an approved backend/CRM integration is requested.
- Preserve the current WhatsApp and email CTA behavior unless the client provides confirmed contact details.
- The `#overview` section (`.workplace-section`) is a work in progress being brought over from reference copy to real Piraeus content piece by piece, at the client's direction. The intro paragraphs, stats tiles (Gross buildable area 26,480 m² / Total floors 10 / To be delivered Q4 2028), and the large `.workplace-address` watermark ("60 Omiridou Skylitsi") are now Piraeus-specific; the tagline ("Every Morning Looks Different.") and the image overlay ("A Workplace" / "That Works") are still literal reference copy from the original screenshot and don't describe this project. Don't silently rewrite the remaining reference text to match the project — check with the client first, the same way this was flagged before implementing.
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
