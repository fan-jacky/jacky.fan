import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Page, SectionContainer } from '@/components/basic'
import type { ProjectGridItem } from '@/components/home/projects/ProjectGrid'
import { sortProjects } from '@/components/home/projects/ProjectGrid'
import LivePreviewPage from '@/components/payloadcms/LivePreviewPage'
import PortfolioEnhancements from '@/components/portfolio/PortfolioEnhancements'

import { fetchPayloadJson, getPayloadCmsPublicUrl, getPayloadCmsUrl, isLivePreviewEnabled } from './api'
import { getContents, hasProjectGridBlock } from './getContent'

export const PAGE_DEPTH = 3
const PROJECTS_TAG = 'projects'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

type CmsPageDocument = {
  pageTitle?: string | null
  metaDesc?: string | null
  enableBgHeading?: boolean | null
  url?: string | null
  contents?: any[] | null
}

type CmsPageResponse = {
  docs?: CmsPageDocument[]
}

function getDefaultMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'Jacky FAN',
      locale: 'en_US',
      type: 'website',
    },
  }
}

async function getCmsPage(url: string, livePreview = false) {
  if (!getPayloadCmsUrl()) {
    return null
  }

  const data = await fetchPayloadJson<CmsPageResponse>(
    `pages?where[url][equals]=${encodeURIComponent(url)}&depth=${PAGE_DEPTH}`,
    livePreview ? { cache: 'no-store' } : undefined,
  )

  return data?.docs?.[0] ?? null
}

async function getProjectGridItems(livePreview = false) {
  if (!getPayloadCmsUrl()) {
    return [] as ProjectGridItem[]
  }

  const data = await fetchPayloadJson<{ docs?: ProjectGridItem[] }>(
    'projects?depth=1',
    livePreview ? { cache: 'no-store' } : { next: { revalidate: 3600, tags: [PROJECTS_TAG] } },
  )

  return sortProjects(data?.docs ?? [])
}

export async function generateCmsPageMetadata(
  url: string,
  searchParams: SearchParams,
  fallbackTitle: string,
  fallbackDescription: string,
) {
  const resolvedSearchParams = await searchParams
  const livePreview = isLivePreviewEnabled(resolvedSearchParams.livePreview)

  const page = await getCmsPage(url, livePreview)

  if (!page?.pageTitle || !page?.metaDesc) {
    return getDefaultMetadata(fallbackTitle, fallbackDescription)
  }

  const metadataTitle = url === '/' ? page.pageTitle : `${page.pageTitle} - Jacky FAN`

  return getDefaultMetadata(metadataTitle, page.metaDesc)
}

export async function renderCmsPageRoute({
  url,
  searchParams,
  reserveNavbarHeight = true,
}: {
  url: string
  searchParams: SearchParams
  reserveNavbarHeight?: boolean
}) {
  const resolvedSearchParams = await searchParams
  const livePreview = isLivePreviewEnabled(resolvedSearchParams.livePreview)

  if (!getPayloadCmsUrl()) {
    return (
      <Page reserveNavbarHeight={reserveNavbarHeight}>
        <SectionContainer>
          <p className="text-lg md:text-xl">Content API not configured. Set PAYLOAD_CMS_URL to load this page.</p>
        </SectionContainer>
      </Page>
    )
  }

  const page = await getCmsPage(url, livePreview)

  if (!page) {
    notFound()
  }

  const projectGridItems = hasProjectGridBlock(page.contents)
    ? await getProjectGridItems(livePreview)
    : []

  return (
    <Page reserveNavbarHeight={reserveNavbarHeight}>
      <PortfolioEnhancements />
      {livePreview ? (
        <LivePreviewPage
          depth={PAGE_DEPTH}
          initialPage={page}
          projectGridItems={projectGridItems}
          serverURL={getPayloadCmsPublicUrl() ?? getPayloadCmsUrl()!}
          showBgHeading={true}
        />
      ) : (
        getContents(page.contents, { pageUrl: page.url ?? url, projectGridItems })
      )}
    </Page>
  )
}