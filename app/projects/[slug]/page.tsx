import { Page, SectionContainer } from "@/components/basic";
import PortfolioEnhancements from "@/components/portfolio/PortfolioEnhancements";
import { getStaticProject } from "@/components/portfolio/data";
import LivePreviewProject from "@/components/payloadcms/LivePreviewProject";
import ProjectDetail from "@/components/projects/ProjectDetail";
import type { ProjectDocument } from "@/components/projects/ProjectDetailContent";
import {
    fetchPayloadJson,
    getPayloadCmsPublicUrl,
    getPayloadCmsUrl,
    isLivePreviewEnabled,
} from "@/helpers/payloadcms/api";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from 'next'

const PAGE_DEPTH = 2;

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata( { params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const alias = slug;
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
  
        const data = await fetchPayloadJson<{ docs?: Array<{ title?: string; desc?: string }> }>(
            `projects?where[alias][equals]=${alias}&depth=${PAGE_DEPTH}`,
            livePreview ? { cache: 'no-store' } : undefined,
        );
    const { docs } = data ?? {};
    const project = docs?.[0];

  if (!project || !project.title) return {
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
    title: `${project.title} - Jacky FAN`,
    description: project.desc ?? "",
    openGraph: {
        title: `${project.title} - Jacky FAN`,
        description: project.desc ?? "",
        siteName: 'Jacky FAN',
        locale: 'en_US',
        type: 'website',
    },
  }
}

async function getData(alias: string, livePreview = false) {
    if (!getPayloadCmsUrl()) {
        return { docs: [] } as any;
    }

        const data = await fetchPayloadJson<{ docs?: ProjectDocument[] }>(
            `projects?where[alias][equals]=${alias}&depth=${PAGE_DEPTH}`,
            livePreview ? { cache: 'no-store' } : undefined,
        );
    return data ?? { docs: [] };
}

function mapStaticProjectToDocument(project: NonNullable<ReturnType<typeof getStaticProject>>): ProjectDocument {
    return {
        alias: project.slug,
        title: project.title,
        desc: project.shortDescription,
        tags: project.tags,
        links: project.links.map((link) => ({
            name: link.label,
            links: link.href,
        })),
    }
}

export default async function ProjectDescPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { slug } = await params;
    const alias = slug;
        const resolvedSearchParams = await searchParams;
        const livePreview = isLivePreviewEnabled(resolvedSearchParams.livePreview);

    if (!getPayloadCmsUrl()) {
        const staticProject = getStaticProject(alias)

        if (!staticProject) {
            return <div className="min-h-screen w-screen flex flex-col gap-4 items-center justify-center">
                <p className="text-xl md:text-2xl w-fit">Project Not Found</p>
                <Link href="/projects" className="btn btn-primary">Back to Projects</Link>
            </div>;
        }

        return (
            <Page>
                <PortfolioEnhancements />
                <ProjectDetail project={mapStaticProjectToDocument(staticProject)} />
            </Page>
        )
    }

    const { docs } = await getData(alias, livePreview);
    const project = docs?.[0];

    if (!project) {
        return <div className="min-h-screen w-screen flex flex-col gap-4 items-center justify-center">
        <p className="text-xl md:text-2xl w-fit">😵 Project Not Found 😵</p>
        <Link href="/" className="btn">Back to Home Page</Link>
    </div>;
    }

    return livePreview ? (
      <LivePreviewProject
        depth={PAGE_DEPTH}
        initialProject={project}
        serverURL={getPayloadCmsPublicUrl() ?? getPayloadCmsUrl()!}
      />
    ) : (
      <ProjectDetail project={project} />
    );
}
