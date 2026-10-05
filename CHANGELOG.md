# Change Log

## 2026-10-05 — Show indicative unit types per building on /explore

### Added

- Selecting a new building (N1–N5) in the 3D viewer now lists the four unit types (Studio, 1-, 2-, 3-Bedroom) with indicative size and ticket ranges from the client's pricing sheet, for management review. Same ranges for every building until floor counts, floor plans and a per-unit list are available. Preserved buildings K1/K2 show "Details to follow."

### Validation

```bash
pnpm check
pnpm build
```

## 2026-10-05 — Add /explore 3D site viewer with building selection

### Added

- New lazy-loaded `/explore` route (wouter) rendering the architect's model with three.js / react-three-fiber: orbit/zoom, loading progress bar, error fallback, and a building list (N1–N5, preserved K1/K2). Selecting a building from the list or by clicking it in 3D highlights it in terracotta and eases the camera to frame it. Phone layout stacks the 3D view above the list.
- "Explore 3D" link in the desktop and mobile nav.
- Model served from Bunny CDN (`azel-web-v2.glb`, ~24 MB), compressed from the 165 MB release asset with a pipeline that preserves per-building node names and fixes the source export's black base colours.

### Validation

```bash
pnpm check
pnpm build
```

Verified in headless Chromium: model loads, site view framing, building highlight and camera move, phone layout.

## 2026-09-16 — Remove the "About DKG Development" section

### Removed

- Removed `.developer-section` ("About DKG Development", "Built on delivery.", the four-pillar row) entirely at the client's request, along with its dedicated CSS (`.developer-section`, `.developer-grid`, `.developer-pillars`, `.pillar-plus`) and the now-unused `.text-link`/`.light-link` utility classes.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Remove the residences section and update hero/overview copy

### Removed

- Removed the `#residences` section entirely at the client's request: the studio/1-bed/2-bed/3-bed switcher, its `residences` data array, `activeResidence` state, the now-unused `ChevronRight` icon import, nav links to `#residences` (desktop + mobile), and all of its dedicated CSS (`.rhythm-section`, `.rhythm-head`, `.space-switcher`, `.space-feature`, `.space-image`, `.space-copy`, `.residence-section`, `.plan-placeholder`, `.plan-room`, `.light-disclaimer`, and the now-orphaned `.slide-media`/`.space-copy h3` reveal animations/keyframes). Renumbered the remaining section kickers (investors, rationale, timeline, developer) to stay sequential.

### Changed

- Hero headline: "Where Business Comes Together" → "Where People Come Together".
- Section 2 image overlay text: "A Workplace" / "That Works" → "A community" / "that works".

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Center and widen the gallery intro copy

### Changed

- The Piraeus Gate history paragraph in `.area-scroll-copy` was left-aligned and capped to a 1400px column. Center-aligned it and removed the max-width so it spans side to side within the section's padding.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Fix Piraeus Tower/Karaiskaki/Port/Marina Zeas pin coordinates

### Fixed

- The four POI markers on the section-4 map (Piraeus Tower, Karaiskaki Stadium, Piraeus Port, Marina Zeas) used approximate placeholder coordinates. Updated to client-confirmed coordinates.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Wire in real historical Piraeus photos for the gallery

### Changed

- Replaced the placeholder images in the horizontal-scroll gallery with the client's seven historical black-and-white Piraeus photos (harbor views, street scenes, the old electric railway), committed directly to `main` under "Old Piraeus v1". Moved into `client/public/images/` as `piraeus-old-01.png` through `piraeus-old-07.webp`.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Double the gallery thumbnail size

### Changed

- Doubled `.area-scroll-item` width/height (`clamp(110px, 10vw, 190px)`/`22%` → `clamp(220px, 20vw, 380px)`/`44%`) at the client's request. Still small/staggered, just bigger.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Revert gallery images to small, staggered thumbnails

### Fixed

- Misread an earlier note as "images too small" and enlarged them to near-full-bleed. The client's actual direction was the opposite: small thumbnail-sized images (~1/10 the section size), alternating top/bottom as they scroll. Reverted to small `.area-scroll-item`s with wide gaps and alternating `align-self` (odd = top, even = bottom) for the staggered look.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Fix gallery intro copy layout to match reference

### Fixed

- The Piraeus Gate history copy was laid out as two paragraphs in a two-column grid; the client's reference showed a single continuous paragraph, one column, at a larger size. Merged into one `<p>` and switched to a single-column block at the correct size/line-height.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Enlarge horizontal gallery images and add intro copy

### Fixed

- The horizontal-scroll gallery images were too small relative to the section (roughly 1:10 scale, wide gaps, reading as a marquee). Each image is now near-full-viewport-width with a tight 6px gap, matching the intended full-bleed feel.

### Added

- Added the client-provided intro copy about Piraeus Gate's history to the top of the section, in the site's serif display face (Cormorant Garamond) at a larger body size, matching a client-provided reference screenshot's typography.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Add scroll-locked horizontal image gallery after the masterplan

### Added

- New `#area-gallery` section directly after the masterplan: a horizontal image strip that scrolls sideways as the user scrolls vertically (sticky-pinned track, no wheel hijacking), releasing into the next section once it finishes. Matches the scroll mechanic from a client-provided reference, without the floor-number watermark/floor-plan thumbnail/caption elements from that reference (explicitly out of scope for now).
- Currently uses existing site photos as placeholders; the client is providing their own images for this section next.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Replace section 5 masterplan diagram with a single image

### Changed

- Replaced the interactive masterplan section (building selector, illustrated diagram, building-detail panel) with a single full-bleed image, at the client's request. Moved the client-committed file ("Masterplan Piraeus Gate.") into `client/public/images/piraeus-masterplan.jpg`.
- The section keeps the same card-stack sticky/overlap treatment (rounded top corners, shadow, height matched to the hero) as the sections above it.

### Removed

- Removed the `buildings` array, `activeBuilding` state, and all masterplan diagram CSS (`.masterplan-section`, `.masterplan-layout`, `.building-block` and its position variants, `.masterplan-label`, `.building-detail`, etc).
- Removed the `lightbox` state and modal, which had no remaining trigger once the masterplan building-detail panel was removed.

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Fix Urban Piraeus Oasis pin coordinates

### Fixed

- The site marker on the section-4 map used an approximate placeholder coordinate. Updated to the client-confirmed coordinates (37.94734210830303, 23.656522176345334).

### Validation

```bash
pnpm check
pnpm build
```

## 2026-09-16 — Log map failures instead of failing silently

### Fixed

- `MapView`'s failure paths (missing/invalid API key, script load failure, `google.maps.Map` construction throwing) previously called `onError` with no logging, so a broken map in production looked identical to a silent no-op — nothing in the console to diagnose it by. All three paths now log a `[LocationMap]`-prefixed `console.error` first.

### Validation

```bash
pnpm check
pnpm build
```

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
