# Change Log

## 2026-09-16 — Fix hero video bleeding through every section on scroll

### Fixed

- The sticky hero stays pinned behind the entire rest of the page (its containing block spans the whole document), so the scroll-reveal fade-in (opacity 0 → 1) was letting the hero show/play through *every* section's entrance transition, not just the three sections patched for this earlier. Removed the opacity animation from the reveal entirely (transform-only slide-up now, site-wide) so no section can ever show the hero through it.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Restyle section 2 intro paragraphs and widen the text column

### Changed

- `.workplace-copy p` now uses bold sans-serif (was regular-weight body copy) at a larger size, matching a client-provided reference screenshot.
- Widened the intro paragraph column from a 620px cap to 38% of the section width, so its right edge lines up with the left edge of the image panel below it (which is 62% wide).

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Replace section 4 with an interactive Google Map

### Added

- Replaced the decorative fake-map illustration and "Why Piraeus" text column in section 4 with `LocationMap`: a full-viewport-height, custom-styled interactive Google Map (client-provided reference layout) with a dark overlay panel — active location name, a clickable list of the other locations, and an "Open Google Map" button. Clicking a name pans/zooms the map and re-highlights the marker.
- Reuses the four section-3 gallery locations (Piraeus Tower, Karaiskaki Stadium, Piraeus Port, Marina Zeas) plus the project site itself, with indicative coordinates.
- Rewrote the previously-unused `client/src/components/Map.tsx` scaffold component (`MapView`) to load the Google Maps JS API directly with the client's own `VITE_GOOGLE_MAPS_API_KEY`, instead of the inert third-party "Frontend Forge" proxy it shipped wired to.
- Falls back to a plain gradient block if the API key is missing/invalid, rather than a broken map.

### Fixed

- The section-3 (`.location-gallery`) and section-4 (`.location-map-section`) full-bleed heights on mobile (`82vh`) were shorter than the sticky hero's own height (`calc(100vh - 66px)`), letting the hero peek out below them. Both now use the identical formula as the hero so they fully cover it at every breakpoint.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Fix card-stack scroll effect (was broken since it shipped)

### Fixed

- The section-1→section-2 (and section-2→section-3) "card sliding over another card" scroll effect wasn't actually working: `.site-shell` had `overflow: hidden`, and any ancestor of a `position: sticky` element with non-`visible` overflow disables its stickiness. Removed that rule.
- That `overflow: hidden` had been silently hiding an unrelated bug: the hero `<video>` renders ~32px wider than its container (an `object-fit: cover` sizing quirk on absolutely-positioned `<video>`), causing horizontal page overflow once the ancestor clipping was removed. Fixed at the source by clipping locally on `.hero-panel` itself instead (safe — overflow on the sticky element doesn't affect its own positioning, only on its ancestors does).
- With sticky genuinely working, the existing scroll-reveal fade-in (opacity 0 → 1) on `.workplace-section` and `.location-gallery` briefly let the pinned hero show through mid-transition. Excluded both from the opacity fade (kept always-opaque, transform-only reveal) so the card-stack effect reads as a crisp opaque slide, not a ghosted cross-fade.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Replace section 3 gallery dots with a name-list nav

### Changed

- Replaced the small dot indicators at the bottom of the location gallery with a stacked, bottom-center list of all four location names (clickable). The active slide's name is bold, white, and larger; the others are dim, matching a client-provided reference screenshot.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Add location name overlay labels to section 3 gallery

### Added

- Added a bold white top-right overlay label to each gallery slide (Marina Zeas / Piraeus Port / Piraeus Tower / Karaiskaki Stadium), crossfading in sync with its image, matching a client-provided reference screenshot's style.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Wire real location photos into the section 3 gallery

### Changed

- Replaced the section 3 gallery's placeholder residence photos with the client's real location images (`4_D-MarinZea.jpg`, `Piraeus Port.jpg`, `Piraeus Tower.jpg`, `karaiskaki-kanaliena.jpg`), which the client committed directly to `main`. Moved them into `client/public/images/` as `piraeus-location-marina-zea.jpg`, `piraeus-location-port.jpg`, `piraeus-location-tower.jpg`, and `piraeus-location-karaiskaki.jpg`, and gave each slide a descriptive alt tag.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Replace section 3 with full-screen rotating image gallery

### Added

- Replaced the "Quality living, within reach." vision panel with `.location-gallery`: a full-viewport-height, edge-to-edge image slideshow that auto-advances every 4 seconds (crossfade) with clickable dot indicators. Keeps the same card-stack sticky/overlap treatment as the surrounding sections.

### Changed

- `locationImages` currently reuses the existing residence photos as placeholders. The client is committing real photos directly to `main` under "Location Piraeus Urban Oasis" — swap them in once available (see CLAUDE.md).

### Removed

- Removed the now-unused `.ink-section`, `.vision-panel`, `.intro-grid`, `.intro-copy`, `.intro-title`, and `.outline-words` styles, which were exclusive to the replaced section.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Enlarge section 2 address watermark

### Changed

- Increased the `.workplace-address` font size (~10.3vw, capped at 170px) so "60 Omiridou Skylitsi" spans edge-to-edge at both narrow and wide desktop widths, without the last letter clipping off.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Add address watermark to section 2

### Added

- Added a large, faint, bold sans-serif "60 Omiridou Skylitsi" watermark below the stats row in `.workplace-section`, bleeding edge-to-edge, matching the "250 Broadway" watermark in the client's reference screenshot. It gets naturally cropped by the next section sliding over it via the existing card-stack scroll effect.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Restyle section 2 stats numbers to match reference, then revert font

### Changed

- Switched the `.workplace-stats` value font from the site's serif display face to a bold sans-serif, matching the client's reference screenshot.
- Added thin vertical divider lines between the three stat tiles, and widened the "To be delivered" column so "Q4 2028" stays on one line.
- Client didn't like the sans-serif swap, so reverted the stat values back to the site's serif display face. Kept the divider lines and the nowrap/column-width fix.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Improve contrast of section 2 image overlay text

### Fixed

- The "A Workplace" / "That Works" overlay text on the `.workplace-media` image was hard to read against the light building facade. Added a soft dark gradient band behind the text plus a stronger text-shadow for legibility.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Update section 2 stats tiles to Piraeus figures

### Changed

- Replaced the three stats tiles in `.workplace-section` (previously "Rentable area 648,000 sf" / "Total floors 31" / "Year renovated 2021") with client-provided Piraeus figures: Gross buildable area 26,480 m², Total floors 10, To be delivered Q4 2028.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Update section 2 intro copy to Piraeus content

### Changed

- Replaced the two intro paragraphs in `.workplace-section` (previously literal "250 Broadway" / Lower Manhattan reference copy) with client-provided Piraeus Urban Oasis copy. The tagline, image overlay text, and stats tiles remain reference copy for now.

### Validation

```bash
pnpm check
pnpm build
```

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
