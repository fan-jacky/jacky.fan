import { getContents, hasProjectGridBlock } from './blocks';
import { fetchPage, fetchProjectGridItems, buildPageMeta, defaultMeta } from './pages';
import type { PageDocument, PageMeta } from './types';

export type RenderedCmsPage = {
  meta: PageMeta;
  html: string;
  page: PageDocument | null;
};

/** 404 page content (ports app/not-found.tsx). */
export function notFoundContent(): string {
  return (
    '<section class="slide not-found-page" style="text-align: center; display: flex; align-items: center; justify-content: center; min-height: calc(100vh - var(--navbar-height)); padding-top: 0; padding-bottom: 0">' +
    '<div class="geo-circle lg" style="top: -80px; right: -80px"></div>' +
    '<div class="geo-circle sm" style="bottom: 10%; left: 8%"></div>' +
    '<div class="container">' +
    '<span class="slide__label" style="opacity: 1; transform: none">Error</span>' +
    '<h1 class="slide__headline" style="font-size: clamp(4rem, 10vw, 8rem); line-height: 1; margin-bottom: 0.5rem">404</h1>' +
    '<p class="slide__subtitle" style="max-width: 480px; margin: 0 auto 1rem">Page not found</p>' +
    '<p style="max-width: 480px; margin: 0 auto 2rem; color: var(--text-muted); font-size: 1rem; line-height: 1.6">The page you requested does not exist or is no longer available.</p>' +
    '<div><a href="/" class="btn btn-primary">Back to home</a></div>' +
    '</div></section>'
  );
}

/** Fallback shown when the CMS is not configured (ports renderCmsPageRoute). */
export function cmsNotConfiguredContent(): string {
  return '<p class="text-lg md:text-xl">Content API not configured. Set PAYLOAD_CMS_URL to load this page.</p>';
}

/** Project Not Found fallback (ports projects/[slug] without CMS). */
export function projectNotFoundContent(message: string, linkHref: string, linkLabel: string, linkClass = 'btn btn-primary'): string {
  return (
    `<div class="min-h-screen w-screen flex flex-col gap-4 items-center justify-center">` +
    `<p class="text-xl md:text-2xl w-fit">${message}</p>` +
    `<a href="${linkHref}" class="${linkClass}">${linkLabel}</a>` +
    `</div>`
  );
}

/**
 * Render a CMS-driven route at build time (ports renderCmsPageRoute for a
 * fixed searchParams = no live preview).
 */
export async function renderCmsPage(
  url: string,
  fallbackTitle: string,
  fallbackDescription: string,
  opts: { reserveNavbarHeight?: boolean } = {},
): Promise<RenderedCmsPage> {
  const page = await fetchPage(url);
  const meta = buildPageMeta(page, url, fallbackTitle, fallbackDescription);

  if (!page) {
    return { meta, html: cmsNotConfiguredContent(), page: null };
  }

  const projectGridItems = hasProjectGridBlock(page.contents) ? await fetchProjectGridItems() : [];

  return {
    meta,
    html: getContents(page.contents, { pageUrl: page.url ?? url, projectGridItems }),
    page,
  };
}

/** Metadata for the [slug] catch-all (ports app/[slug]/page.tsx generateMetadata). */
export function slugMeta(page: PageDocument | null | undefined): PageMeta {
  if (!page?.pageTitle || !page?.metaDesc) return defaultMeta();
  return { title: `${page.pageTitle} - Jacky FAN`, description: page.metaDesc };
}
