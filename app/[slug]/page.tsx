import { Page, SectionContainer } from "@/components/basic";
import LivePreviewPage from "@/components/payloadcms/LivePreviewPage";
import type { ProjectGridItem } from "@/components/home/projects/ProjectGrid";
import { sortProjects } from "@/components/home/projects/ProjectGrid";
import { fetchPayloadJson, getPayloadCmsPublicUrl, getPayloadCmsUrl, isLivePreviewEnabled } from "@/helpers/payloadcms/api";
import { getContents, hasProjectGridBlock } from "@/helpers/payloadcms/getContent";
import type { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation'

const PAGE_DEPTH = 3;
const PROJECTS_TAG = 'projects';

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const url = slug;
    const resolvedSearchParams = await searchParams;
    const livePreview = isLivePreviewEnabled(resolvedSearchParams.livePreview);

    if (!getPayloadCmsUrl()) {
        return {
            title: "Jacky FAN",
            description: "I build websites and eat computer bugs 😉",
            openGraph: {
                title: "Jacky FAN",
                description: "I build websites and eat computer bugs 😉",
                siteName: 'Jacky FAN',
                locale: 'en_US',
                type: 'website',
            },
        };
    }

    const data = await fetchPayloadJson<{ docs?: Array<{ pageTitle?: string; metaDesc?: string }> }>(
        `pages?where[url][equals]=/${url}&depth=${PAGE_DEPTH}`,
        livePreview ? { cache: 'no-store' } : undefined,
    );
    const { docs } = data ?? {};

    if (!docs || !docs[0] || !docs[0].pageTitle || !docs[0].metaDesc) return {
        title: "Jacky FAN",
        description: "I build websites and eat computer bugs 😉",
        openGraph: {
            title: "Jacky FAN",
            description: "I build websites and eat computer bugs 😉",
            siteName: 'Jacky FAN',
            locale: 'en_US',
            type: 'website',
        },
    };

    return {
        title: `${docs[0].pageTitle} - Jacky FAN`,
        description: docs[0].metaDesc,
        openGraph: {
            title: `${docs[0].pageTitle} - Jacky FAN`,
            description: docs[0].metaDesc,
            siteName: 'Jacky FAN',
            locale: 'en_US',
            type: 'website',
        },
    }
}

async function getData(url: string, livePreview = false) {
    if (!getPayloadCmsUrl()) {
        return { docs: [] } as any;
    }

    const data = await fetchPayloadJson<{ docs?: unknown[] }>(
        `pages?where[url][equals]=/${url}&depth=${PAGE_DEPTH}`,
        livePreview ? { cache: 'no-store' } : undefined,
    );
    return data ?? { docs: [] };
}

async function getProjectGridItems(livePreview = false) {
    if (!getPayloadCmsUrl()) {
        return [] as ProjectGridItem[];
    }

    const data = await fetchPayloadJson<{ docs?: ProjectGridItem[] }>(
        'projects?depth=1',
        livePreview ? { cache: 'no-store' } : { next: { revalidate: 3600, tags: [PROJECTS_TAG] } },
    );

    return sortProjects(data?.docs ?? []);
}

export default async function NormalPage ({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const livePreview = isLivePreviewEnabled(resolvedSearchParams.livePreview);

    if (!getPayloadCmsUrl()) {
        return (
            <Page reserveNavbarHeight={false}>
                <SectionContainer>
                    <p className="text-lg md:text-xl">Content API not configured. Set PAYLOAD_CMS_URL to load this page.</p>
                </SectionContainer>
            </Page>
        );
    }

    const { docs } = await getData(slug, livePreview);

    if (!slug || docs.length === 0) {
        redirect(slug ? "/404?from=" + slug : "/404");
    }

    const page = docs[0];
    const projectGridItems = hasProjectGridBlock(page?.contents)
        ? await getProjectGridItems(livePreview)
        : [];

    return (
        <Page>
            {livePreview ? (
                <LivePreviewPage
                    depth={PAGE_DEPTH}
                    initialPage={page as Record<string, unknown>}
                    projectGridItems={projectGridItems}
                    serverURL={getPayloadCmsPublicUrl() ?? getPayloadCmsUrl()!}
                    showBgHeading={true}
                />
            ) : (
                getContents(page.contents, { projectGridItems })
            )}
        </Page>

    );
}