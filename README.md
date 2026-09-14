# Urban Piraeus Oasis

Investor-facing marketing website for Urban Piraeus Oasis, a planned large-scale residential development in Piraeus, Greece.

The site is structured around the CIO's indicative brief:

- Development overview and project facts
- Vision and Piraeus location rationale
- Interactive seven-building masterplan
- Residence typologies
- Initial investor allocation
- Investment rationale and indicative timeline
- Developer profile placeholder
- Investor inquiry form and WhatsApp CTA

## Local development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Validation

```bash
pnpm check
pnpm build
```

## Vercel

The repository includes `vercel.json` with the Vite build command and `dist/public` output directory. The site is ready to be connected to Vercel using the `main` branch.

## Content notes

All project facts that have not been formally confirmed are labeled as **indicative**. Replace the generated architectural imagery in `client/public/images/` with approved project renders when available. Replace the developer profile placeholder and inquiry routing details with confirmed corporate information before public launch.
