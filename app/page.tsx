import { Page } from '@/components/basic'
import LivePreviewPage from '@/components/payloadcms/LivePreviewPage'
import type { ProjectGridItem } from '@/components/home/projects/ProjectGrid'
import { sortProjects } from '@/components/home/projects/ProjectGrid'
import { fetchPayloadJson, getPayloadCmsPublicUrl, getPayloadCmsUrl, isLivePreviewEnabled } from '@/helpers/payloadcms/api'
import { getContents, hasProjectGridBlock } from '@/helpers/payloadcms/getContent'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

export const dynamic = 'force-dynamic';

const PAGE_DEPTH = 3

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(
  { searchParams }: { searchParams: SearchParams },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  if (!getPayloadCmsUrl()) {
    return {
      title: "Jacky FAN - Frontend Developer in Hong Kong",
      description: "I build websites and eat computer bugs 😉",
    };
  }

  try {
    const resolvedSearchParams = await searchParams
    const livePreview = isLivePreviewEnabled(resolvedSearchParams.livePreview)
    const data = await fetchPayloadJson<{ docs?: Array<{ pageTitle?: string; metaDesc?: string }> }>(
      `pages?where[url][equals]=/&depth=${PAGE_DEPTH}`,
      livePreview ? { cache: 'no-store' } : { next: { revalidate: 3600 } },
    );
    const { docs } = data ?? {};
    const page = docs?.[0];

    if (!page?.pageTitle || !page?.metaDesc) {
      return {
        title: "Jacky FAN - Frontend Developer in Hong Kong",
        description: "I build websites and eat computer bugs 😉",
      };
    }

    return {
      title: `Jacky FAN - Frontend Developer in Hong Kong`,
      description: page.metaDesc,
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Jacky FAN - Frontend Developer in Hong Kong",
      description: "I build websites and eat computer bugs 😉",
    };
  }
}

async function getData() {
  return getDataForPreview(false)
}

async function getProjectGridItems(livePreview: boolean) {
  if (!getPayloadCmsUrl()) {
    return [] as ProjectGridItem[]
  }

  const data = await fetchPayloadJson<{ docs?: ProjectGridItem[] }>(
    'projects?depth=1',
    livePreview ? { cache: 'no-store' } : { next: { revalidate: 3600 } },
  )

  return sortProjects(data?.docs ?? [])
}

async function getDataForPreview(livePreview: boolean) {
  if (!getPayloadCmsUrl()) {
    return { docs: [] } as any;
  }

  const data = await fetchPayloadJson<{ docs?: unknown[] }>(
    `pages?where[url][equals]=/&depth=${PAGE_DEPTH}`,
    livePreview ? { cache: 'no-store' } : { next: { revalidate: 3600 } },
  );

  return data ?? { docs: [] };
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  if (!getPayloadCmsUrl()) {
    return (
      <Page reserveNavbarHeight={false}>
        <div className="py-16 text-center">
          <p className="text-lg md:text-xl">Content API not configured. Set PAYLOAD_CMS_URL to load dynamic content.</p>
        </div>
      </Page>
    );
  }

  try {
    const resolvedSearchParams = await searchParams
    const livePreview = isLivePreviewEnabled(resolvedSearchParams.livePreview)
    const { docs } = await getDataForPreview(livePreview);
    const page = docs?.[0];

    if (!page) {
      notFound();
    }

    const projectGridItems = hasProjectGridBlock(page?.contents)
      ? await getProjectGridItems(livePreview)
      : []

    return (
      <Page reserveNavbarHeight={false}>
        {livePreview ? (
          <LivePreviewPage
            depth={PAGE_DEPTH}
            initialPage={page as Record<string, unknown>}
            projectGridItems={projectGridItems}
            serverURL={getPayloadCmsPublicUrl() ?? getPayloadCmsUrl()!}
          />
        ) : (
          getContents(page?.contents, { projectGridItems })
        )}
      </Page>
    )
  } catch (error) {
    console.error("Error rendering home page:", error);
    notFound();
  }
}
