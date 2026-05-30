import { Page, SectionContainer } from "@/components/basic";
import BgHeading from "@/components/visual/bgHeading";
import { fetchPayloadJson, getPayloadCmsUrl } from "@/helpers/payloadcms/api";
import { getContents } from "@/helpers/payloadcms/getContent";
import type { Metadata, ResolvingMetadata } from 'next';
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const url = slug;

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

    const data = await fetchPayloadJson<{ docs?: Array<{ pageTitle?: string; metaDesc?: string }> }>(`pages?where[url][equals]=/${url}`);
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

async function getData(url: string) {
    if (!getPayloadCmsUrl()) {
        return { docs: [] } as any;
    }

    const data = await fetchPayloadJson<{ docs?: unknown[] }>(`pages?where[url][equals]=/${url}`);
    return data ?? { docs: [] };
}


async function checkPageExist(params: { slug: string }) {

    if (!params?.slug) {
        redirect("/404");
    }

    const { docs } = await getData(params.slug);

    if (docs.length == 0) {
        revalidatePath(`/${params.slug}`);
        redirect("/404?from=" + params.slug);
    }
}

export default async function NormalPage ({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (!getPayloadCmsUrl()) {
        return (
            <Page>
                <SectionContainer>
                    <p className="text-lg md:text-xl">Content API not configured. Set PAYLOAD_CMS_URL to load this page.</p>
                </SectionContainer>
            </Page>
        );
    }

    await checkPageExist({ slug });

    const { docs } = await getData(slug);
    const page = docs[0];

    return (
        <>
            <Page>
                {getContents(page.contents)}
            </Page>
            {page.enableBgHeading && <BgHeading title={page.pageTitle} />}
        </>

    );
}