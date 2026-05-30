# Jacky Fan CMS (Payload)

Payload CMS replaces the previous Strapi instance while keeping the same content shape documented in `cms-structure.md`. Collections and globals now mirror the Strapi types: Pages, Projects, Site Settings (global), and Project Page Settings (global) with all reusable blocks/fields defined as Payload blocks.

## Data model (mirrors Strapi)
- Pages: `pageTitle`, `url`, `contents` (rich blocks: headings, buttons, grids, contact form, 3D letter, hero, about-me), `metaDesc`, `enableBgHeading`.
- Projects: `title`, `alias`, `date`, `desc`, `tags`, `img`, `links[]`, `contents` (project carousel + project content blocks).
- Globals: `project_page_settings` (titles, desc, meta), `site_settings` (branding, menu items → Page relation, footer text, toggles, quick links).
- Uploads: `media` collection, shared across blocks.

## Environment
Copy `.env.example` to `.env` and set the secrets:

```
DATABASE_URL=mongodb://mongo/payload
PAYLOAD_SECRET=your-long-secret
```

- For local development without Docker, point `DATABASE_URL` to `mongodb://127.0.0.1/payload` (with a locally running MongoDB).
- `PAYLOAD_SECRET` is required by Payload auth. Generate a new value for non-development use.

## Running with Docker Compose (production-style)
Prereqs: Docker + Docker Compose, `pnpm` available for local tooling if you need to regenerate types.

1) Build and start: `docker compose up -d --build`
2) First-time admin user: open http://localhost:3000/admin and follow the UI to create the initial user.
3) Logs: `docker compose logs -f payload`
4) Stop: `docker compose down`

The `payload` service builds from the Dockerfile (standalone Next.js output) and uses the `mongo` service defined in the same compose file.

## Local development (optional)
- `pnpm install`
- Ensure MongoDB is available at `DATABASE_URL`
- `pnpm dev` (or `pnpm payload` for the Payload-only server)

## Strapi → Payload mapping notes
- All Strapi dynamic zones are represented as Payload `blocks` with identical field names and defaults where present.
- Project tags are predefined as a multi-select list to match the Strapi tag taxonomy.
- Menu items and quick links remain repeatable arrays; menu items keep a one-to-one relation to Pages.

## Regenerate Payload types
After schema changes: `pnpm run generate:types` (updates `src/payload-types.ts`).

## Useful scripts
- `pnpm dev` — start the Next/Payload dev server
- `pnpm build && pnpm start` — production build & run
- `pnpm payload` — access Payload CLI
