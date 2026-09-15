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

## Hero video

The homepage hero uses the provided Bunny CDN public MP4:

`https://piraeusgate.b-cdn.net/kling_20260915_VIDEO__4577_0.mp4`

Implementation details:

- The video is in the `#top` hero section in `Home.tsx`.
- It is `autoPlay`, `muted`, `loop`, `playsInline`, and `preload="metadata"`.
- The existing `/images/piraeus-hero.jpg` remains the `poster` fallback.
- Keep the `.hero-image` class and `.hero-wash` overlay intact so text contrast and crop remain consistent.
- Do not download or commit the 45 MB Bunny video into the repository.

## Motion system

The current motion is intentionally editorial and restrained:

- `Home.tsx` uses `IntersectionObserver` to reveal each non-hero section as it enters the viewport.
- The hero image/video receives a small requestAnimationFrame-throttled scroll parallax through the `--hero-scroll` CSS variable.
- Building and residence media use React `key` values plus `.slide-media` to replay slide-in transitions when the active tab changes.
- Motion is disabled or simplified under `prefers-reduced-motion: reduce`.
- Keep transitions focused on `opacity` and `transform`; avoid adding layout animations.

## Content and behavior constraints

- Project facts are intentionally labeled **indicative** where not formally confirmed.
- Do not convert indicative investment language into guarantees or financial claims.
- Keep the masterplan and residence selectors functional.
- Keep the inquiry form as a frontend-only interaction unless an approved backend/CRM integration is requested.
- Preserve the current WhatsApp and email CTA behavior unless the client provides confirmed contact details.

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
