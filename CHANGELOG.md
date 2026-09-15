# Change Log

## 2026-09-15 — Hero rebuild and simplification

### Added

- Rebuilt the header into a solid two-row `.site-header` (utility strip + nav row) sitting above the hero, sized so header + hero fill the full screen on landing.
- Added a bottom-left `.hero-copy` overlay headline directly on the video ("Where Business Comes Together").

### Removed

- Removed the Masterplan/Residences/Location hero toggle and the bottom-right residence/location widget cards, per client direction to rebuild the hero step by step.
- Removed the `poster` image and `.hero-wash` gradient overlay from the hero video at the client's request; the video now shows the `.hero-panel` background color while loading instead of a placeholder image.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-15 — Motion and Bunny CDN hero video

### Added

- Added the provided Bunny CDN MP4 as the homepage hero background video.
- Kept `/images/piraeus-hero.jpg` as the poster and loading fallback.
- Added viewport-based editorial section reveals using `IntersectionObserver`.
- Added throttled hero parallax using `requestAnimationFrame` and the `--hero-scroll` CSS variable.
- Added keyed slide-in transitions for masterplan building media and residence media when their selectors change.
- Added reduced-motion behavior that removes parallax and non-essential animations.
- Added `CLAUDE.md` with implementation constraints and handoff instructions.

### Preserved

- Existing typography, palette, navigation, section order, spacing, CTA behavior, investor narrative, masterplan selector, residence selector, and inquiry form.
- Bunny video remains external; do not download it into the repository.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-14 — Initial site sync

- Synced the investor-focused Urban Piraeus Oasis React/Vite site into `DKGDevelopment/Piraeus-Urban-Oasis`.
- Added Vercel configuration and deployment documentation.
