import { Page } from '@/components/basic'
import { getContents } from '@/helpers/payloadcms/getContent'
import { fetchPayloadJson, getPayloadCmsUrl } from '@/helpers/payloadcms/api'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  if (!getPayloadCmsUrl()) {
    return {
      title: "Jacky FAN - Frontend Developer in Hong Kong",
      description: "I build websites and eat computer bugs 😉",
    };
  }

  try {
    const data = await fetchPayloadJson<{ docs?: Array<{ pageTitle?: string; metaDesc?: string }> }>(
      'pages?where[url][equals]=/&depth=3',
      { next: { revalidate: 3600 } },
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
  if (!getPayloadCmsUrl()) {
    return { docs: [] } as any;
  }

  const data = await fetchPayloadJson<{ docs?: unknown[] }>(
    'pages?where[url][equals]=/&depth=3',
    { next: { revalidate: 3600 } },
  );

  return data ?? { docs: [] };
}

export default async function Home() {
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
    const { docs } = await getData();
    const page = docs?.[0];

    if (!page) {
      notFound();
    }

    return (
      <Page reserveNavbarHeight={false}>
        {getContents(page?.contents)}
      </Page>
    )
  } catch (error) {
    console.error("Error rendering home page:", error);
    notFound();
  }
}
