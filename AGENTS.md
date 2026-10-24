# Astro site (Astro 7, static output)

Static-generated frontend for jacky.fan. Content comes from the Payload CMS in `cms/` (a separate pnpm workspace package) and is fetched at **build time** — `astro build` requires a reachable CMS (`PAYLOAD_CMS_URL`) or pages will be missing.

- Routes live in `src/pages/` (`[slug].astro` is a catch-all for CMS pages; `projects/[slug].astro` for CMS projects).
- CMS block renderers are HTML-string functions in `src/lib/cms/blocks.ts`, `src/lib/cms/project-detail.ts` and `src/lib/cms/rich-text.ts` — shared between build-time rendering and the client-side live-preview re-render (`src/scripts/live-preview.ts`).
- All interactivity is vanilla JS in `src/scripts/` (locomotive-scroll, reveal animations, count-up, theme toggle, three.js letter).
- Styling: Tailwind 3 + daisyUI via PostCSS (`tailwind.config.js`) + SCSS partials in `src/styles/`.
- Deploy: `dist/` is served as Cloudflare Workers static assets (`wrangler deploy`) or by the nginx container in `docker-compose.yml` (build the site on the host first — `script/deploy.sh` does this).
- Contact form and reCAPTCHA were removed (no longer in use); live preview is kept via `@payloadcms/live-preview`.
