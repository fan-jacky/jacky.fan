# Jacky Fan CMS (Payload)

Payload CMS replaces the previous Strapi instance while keeping the same content shape documented in `cms-structure.md`. Collections and globals now mirror the Strapi types: Pages, Projects, Site Settings (global), and Project Page Settings (global) with all reusable blocks/fields defined as Payload blocks.

## Data model (mirrors Strapi)
- Pages: `pageTitle`, `url`, `contents` (rich blocks: headings, buttons, grids, contact form, 3D letter, hero, about-me), `metaDesc`, `enableBgHeading`.
- Projects: `title`, `alias`, `date`, `desc`, `tags`, `img`, `links[]`, `contents` (project carousel + project content blocks).
- Globals: `project_page_settings` (project hero label/title/subtitle + meta), `site_settings` (branding, menu items → Page relation, footer text, toggles, quick links).
- Uploads: `media` collection, shared across blocks.

## Environment
Copy `.env.example` to `.env` and set the secrets:

```
DATABASE_URL=mongodb://mongo/payload
PAYLOAD_SECRET=your-long-secret
```

- For local development without Docker, the CMS falls back to `mongodb://127.0.0.1/payload` when `DATABASE_URL` is omitted.
- Set `DATABASE_URL` explicitly if your local MongoDB runs elsewhere.
- In local development, the CMS falls back to a fixed dev-only secret if `PAYLOAD_SECRET` is omitted.
- Set `PAYLOAD_SECRET` explicitly for shared environments and all non-development deployments.

## Production Docker stack
The only production compose file for this repository is `../docker-compose.yml` in the repo root.

From the repo root:

1) Build and start: `docker compose up -d --build`
2) Open the admin UI at http://localhost:3001/admin
3) Logs: `docker compose logs -f cms`
4) Stop: `docker compose down`

The root compose file builds this CMS from `cms/Dockerfile` and runs MongoDB alongside it.

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
