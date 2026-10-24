import { fetchPayloadJson, getPayloadCmsUrl } from './api';
import type { PageDocument, PageMeta, ProjectDocument, ProjectGridItem } from './types';

const PAGE_DEPTH = 3;
const PROJECT_DETAIL_DEPTH = 2;

export { PAGE_DEPTH, PROJECT_DETAIL_DEPTH };

export type SiteSettings = {
  siteLogoText?: string | null;
  sitename?: string | null;
  siteDesc?: string | null;
  showNightModeToggle?: boolean | null;
  menuItem?: any[];
  quickLinks?: Array<{ name?: string | null; url?: string | null }>;
};

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!getPayloadCmsUrl()) return null;

  try {
    return await fetchPayloadJson<SiteSettings>('globals/site_settings?depth=2');
  } catch (error) {
    console.error('Failed to load site settings for page chrome.', error);
    return null;
  }
}

export async function fetchPage(url: string): Promise<PageDocument | null> {
  if (!getPayloadCmsUrl()) return null;

  const data = await fetchPayloadJson<{ docs?: PageDocument[] }>(
    `pages?where[url][equals]=${encodeURIComponent(url)}&depth=${PAGE_DEPTH}`,
  );

  return data?.docs?.[0] ?? null;
}

export async function fetchAllPages(): Promise<PageDocument[] | null> {
  if (!getPayloadCmsUrl()) return null;

  const data = await fetchPayloadJson<{ docs?: PageDocument[] }>(`pages?limit=1000&depth=${PAGE_DEPTH}`);
  return data?.docs ?? [];
}

export async function fetchProjectGridItems(): Promise<ProjectGridItem[]> {
  if (!getPayloadCmsUrl()) return [];

  const data = await fetchPayloadJson<{ docs?: ProjectGridItem[] }>('projects?depth=1');
  return data?.docs ?? [];
}

export async function fetchProjectByAlias(alias: string): Promise<ProjectDocument | null> {
  if (!getPayloadCmsUrl()) return null;

  const data = await fetchPayloadJson<{ docs?: ProjectDocument[] }>(
    `projects?where[alias][equals]=${alias}&depth=${PROJECT_DETAIL_DEPTH}`,
  );

  return data?.docs?.[0] ?? null;
}

export async function fetchAllProjects(): Promise<ProjectDocument[] | null> {
  if (!getPayloadCmsUrl()) return null;

  const data = await fetchPayloadJson<{ docs?: ProjectDocument[] }>(`projects?limit=1000&depth=${PROJECT_DETAIL_DEPTH}`);
  return data?.docs ?? [];
}

/** Routes rendered by their own dedicated Astro pages — excluded from the [slug] catch-all. */
export const RESERVED_PAGE_URLS = new Set(['/', '/about', '/contact', '/projects']);

export function buildPageMeta(
  page: PageDocument | null,
  url: string,
  fallbackTitle: string,
  fallbackDescription: string,
): PageMeta {
  if (!page?.pageTitle || !page?.metaDesc) {
    return { title: fallbackTitle, description: fallbackDescription };
  }

  const title = url === '/' ? page.pageTitle : `${page.pageTitle} - Jacky FAN`;

  return { title, description: page.metaDesc };
}

export function defaultMeta(): PageMeta {
  return {
    title: 'Jacky FAN',
    description: 'I build websites and eat computer bugs 😉',
  };
}
