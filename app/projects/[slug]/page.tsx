import FadeInBottom from "@/components/animation/FadeInBottom";
import { ActiveLink, Page, SectionContainer } from "@/components/basic";
import { Heading } from "@/components/visual";
import Image from "next/image";
import { ArrowLeftIcon, LinkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Tabs from "@/components/Tabs";
import BgHeading from "@/components/visual/bgHeading";
import { getRichTextBlocks } from "@/helpers/strapi/getRichTextBlocks";
import type { Metadata, ResolvingMetadata } from 'next'

const PAYLOAD_CMS_URL = process.env.PAYLOAD_CMS_URL;

const richText = (value: any) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (value.root?.children) return value.root.children;
    return [];
};

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata( { params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const alias = slug;

    if (!PAYLOAD_CMS_URL) {
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
  
    const endpoint = `${PAYLOAD_CMS_URL}/api/projects?where[alias][equals]=${alias}&depth=2`;
    const { docs } = await fetch(endpoint).then((res) => res.json());
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

async function getData(alias: string) {
    if (!PAYLOAD_CMS_URL) {
        return { docs: [] } as any;
    }

    const res = await fetch(`${PAYLOAD_CMS_URL}/api/projects?where[alias][equals]=${alias}&depth=2`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function ProjectDescPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const alias = slug;

    if (!PAYLOAD_CMS_URL) {
        return (
            <Page>
                <SectionContainer>
                    <p className="text-lg md:text-xl">Content API not configured. Set PAYLOAD_CMS_URL to load this project.</p>
                </SectionContainer>
            </Page>
        );
    }

    const { docs } = await getData(alias);
    const project = docs?.[0];

    if (!project) {
        return <div className="min-h-screen w-screen flex flex-col gap-4 items-center justify-center">
        <p className="text-xl md:text-2xl w-fit">😵 Project Not Found 😵</p>
        <Link href="/" className="btn">Back to Home Page</Link>
    </div>;
    }

    const { title, desc, tags = [], img, links = [], contents = [] } = project;
    const imageUrl = typeof img === 'string' ? img : img?.url;

    const tabData = (contents || []).map((block: any, index: number) => {
        const blockType = block?.blockType;

        if (blockType === 'projectContents') {
            return {
                name: block.name ?? `Section ${index + 1}`,
                content: (
                    <article className="prose text-md md:text-xl leading-6 md:leading-8 text-base-content">
                        {richText(block.contents).map((c: any, idx: number) => getRichTextBlocks(c, {}, idx))}
                    </article>
                )
            };
        }

        if (blockType === 'projectsCarousel') {
            return {
                name: block.name ?? `Gallery ${index + 1}`,
                content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {block.items?.map((item: any, i: number) => {
                            const mediaUrl = typeof item.media === 'string' ? item.media : item.media?.url;
                            return (
                                <div key={i} className="card bg-base-200 shadow-sm">
                                    {mediaUrl && (
                                        <div className="relative w-full aspect-video">
                                            <Image src={mediaUrl} alt={item?.desc ?? 'project media'} fill className="object-cover rounded-t-lg" />
                                        </div>
                                    )}
                                    {item?.desc && <div className="p-4 text-sm">{item.desc}</div>}
                                </div>
                            );
                        })}
                    </div>
                )
            }
        }

        return null;
    }).filter(Boolean);

    return (
        <>
            <Page>
                <SectionContainer extendRightSpacing={true} extraClassName="bg-base-300 -mt-1 z-40 py-12 md:py-6" topSpacing={false}>
                    <FadeInBottom>
                        <div className="mb-4 md:mb-8">
                            <ActiveLink href="/projects" className="btn btn-outline w-fit">
                                <ArrowLeftIcon className="h-[1em]" />
                                Back
                            </ActiveLink>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-x-4 gap-y-8">
                            <div className="w-full xl:w-2/5">
                                <Heading topTitle="My Project" leftTitle={title} />
                                <div className="flex flex-row flex-wrap gap-2 mb-4 xl:mb-8">
                                    {tags.map((tag: any, i: number) => <div className="badge badge-lg badge-primary badge-outline" key={i}>{tag}</div>)}
                                </div>
                                <p className="mb-4 xl:mb-8">
                                    {desc}
                                </p>
                                <div className="flex flex-row flex-wrap gap-2">
                                    {links.map((link: any, i: number) => <Link href={link.links} target="_blank" className={`btn ${i == 0 ? "btn-primary" : i == 1 ? "btn-secondary" : "btn-outline"}`} key={i}>
                                        <LinkIcon className="h-[1em]" />
                                        {link.name}
                                    </Link>)}
                                </div>

                            </div>
                            <div className="w-full xl:w-3/5">
                                <figure className="block aspect-video border-red-400 border-1 rounded-2xl bg-base-content relative">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            fill={true}
                                            alt={title ?? "Project image"}
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-base-100">No image</div>
                                    )}
                                </figure>
                            </div>
                        </div>
                    </FadeInBottom>
                </SectionContainer>

                {tabData.length > 0 && <Tabs data={tabData} />}

            </Page>
            {title && <BgHeading title={title} />}
        </>
    );
}
