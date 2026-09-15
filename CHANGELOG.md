# Change Log

## 2026-09-15 — Rebuild second section to match reference layout

### Added

- Replaced the "Scale with intention." stat-grid section with a new `.workplace-section`: an intro paragraph pair plus a small tagline, a large image panel with split overlay text, and a three-tile stats row, matching a client-provided reference screenshot.
- Moved the client-committed building photo (`A9zn6w26_1237uyk_1d4.jpg`, added directly on `main`) into `client/public/images/piraeus-workplace.jpg` and wired it in as the section's media.
- Per explicit client request, the section text is a literal copy from the reference (Lower Manhattan / 250 Broadway / 648,000 sf / 31 floors / 2021), not adapted to the Piraeus project — flagged to the client as a content mismatch before implementing as asked.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-15 — Card-stack scroll effect for the second section

### Added

- Made the hero (`.hero-panel`) sticky so it stays pinned as the page scrolls.
- Gave the following section (`.stats-section` / "The project") rounded top corners and a lifting shadow so it visually slides up and over the pinned hero like a card sliding onto another card.

### Validation

```bash
pnpm check
pnpm build
```

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
