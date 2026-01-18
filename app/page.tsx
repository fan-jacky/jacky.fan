import { Page } from '@/components/basic'
import { getContents } from '@/helpers/strapi/getContent'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

export const dynamic = 'force-dynamic';
const PAYLOAD_CMS_URL = process.env.PAYLOAD_CMS_URL;

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  if (!PAYLOAD_CMS_URL) {
    return {
      title: "Jacky FAN - Frontend Developer in Hong Kong",
      description: "I build websites and eat computer bugs 😉",
    };
  }

  try {
    const endpoint = `${PAYLOAD_CMS_URL}/api/pages?where[url][equals]=/&depth=3`;
    const { docs } = await fetch(endpoint, { next: { revalidate: 3600 } }).then((res) => res.json());
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
  if (!PAYLOAD_CMS_URL) {
    return { docs: [] } as any;
  }

  const res = await fetch(
    `${PAYLOAD_CMS_URL}/api/pages?where[url][equals]=/&depth=3`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch page data");
  }

  return res.json();
}

export default async function Home() {
  if (!PAYLOAD_CMS_URL) {
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
