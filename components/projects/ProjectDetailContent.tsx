import FadeInBottom from "@/components/animation/FadeInBottom";
import { ActiveLink, SectionContainer } from "@/components/basic";
import Tabs from "@/components/Tabs";
import { Heading } from "@/components/visual";
import BgHeading from "@/components/visual/bgHeading";
import { resolvePayloadMediaUrl } from "@/helpers/payloadcms/api";
import { getRichTextBlocks } from "@/helpers/payloadcms/getRichTextBlocks";
import { ArrowLeftIcon, LinkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

type ProjectMedia = {
  url?: string | null;
};

type ProjectLink = {
  name?: string | null;
  links?: string | null;
};

type ProjectCarouselBlock = {
  blockType?: "projectsCarousel";
  name?: string | null;
  items?: Array<{
    media?: string | ProjectMedia | null;
    desc?: string | null;
  }> | null;
};

type ProjectContentsBlock = {
  blockType?: "projectContents";
  name?: string | null;
  contents?: {
    root?: {
      children?: any[];
    };
  } | any[] | null;
};

export type ProjectDocument = {
  title?: string | null;
  desc?: string | null;
  tags?: string[] | null;
  img?: string | ProjectMedia | null;
  links?: ProjectLink[] | null;
  contents?: Array<ProjectCarouselBlock | ProjectContentsBlock | null> | null;
};

const richText = (value: any) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (value.root?.children) return value.root.children;
  return [];
};

export default function ProjectDetailContent({ project }: { project: ProjectDocument }) {
  const { title, desc, img } = project;
  const tags = project.tags ?? [];
  const links = project.links ?? [];
  const contents = project.contents ?? [];
  const imageUrl = resolvePayloadMediaUrl(typeof img === "string" ? img : img?.url ?? "");

  const tabData = contents
    .map((block, index: number) => {
      if (!block) {
        return null;
      }

      if (block.blockType === "projectContents") {
        return {
          name: block.name ?? `Section ${index + 1}`,
          content: (
            <article className="prose text-md md:text-xl leading-6 md:leading-8 text-base-content">
              {richText(block.contents).map((contentBlock: any, contentIndex: number) =>
                getRichTextBlocks(contentBlock, {}, contentIndex),
              )}
            </article>
          ),
        };
      }

      if (block.blockType === "projectsCarousel") {
        return {
          name: block.name ?? `Gallery ${index + 1}`,
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {block.items?.map((item, itemIndex: number) => {
                const mediaUrl = resolvePayloadMediaUrl(
                  typeof item?.media === "string" ? item.media : item?.media?.url ?? "",
                );

                return (
                  <div key={itemIndex} className="card bg-base-200 shadow-sm">
                    {mediaUrl && (
                      <div className="relative w-full aspect-video">
                        <Image
                          src={mediaUrl}
                          alt={item?.desc ?? "project media"}
                          fill
                          unoptimized
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    {item?.desc && <div className="p-4 text-sm">{item.desc}</div>}
                  </div>
                );
              })}
            </div>
          ),
        };
      }

      return null;
    })
    .filter((item): item is { name: string; content: JSX.Element } => item !== null);

  return (
    <>
      <SectionContainer
        extendRightSpacing={true}
        extraClassName="bg-base-300 -mt-1 z-40 py-12 md:py-6"
        topSpacing={false}
      >
        <FadeInBottom>
          <div className="mb-4 md:mb-8">
            <ActiveLink href="/projects" className="btn btn-outline w-fit">
              <ArrowLeftIcon className="h-[1em]" />
              Back
            </ActiveLink>
          </div>

          <div className="flex flex-col xl:flex-row gap-x-4 gap-y-8">
            <div className="w-full xl:w-2/5">
              <Heading topTitle="My Project" leftTitle={title ?? undefined} />
              <div className="flex flex-row flex-wrap gap-2 mb-4 xl:mb-8">
                {tags.map((tag, index: number) => (
                  <div className="badge badge-lg badge-primary badge-outline" key={index}>
                    {tag}
                  </div>
                ))}
              </div>
              <p className="mb-4 xl:mb-8">{desc}</p>
              <div className="flex flex-row flex-wrap gap-2">
                {links.map((link, index: number) =>
                  link?.links ? (
                    <Link
                      href={link.links}
                      target="_blank"
                      className={`btn ${index == 0 ? "btn-primary" : index == 1 ? "btn-secondary" : "btn-outline"}`}
                      key={`${link.name ?? "project-link"}-${index}`}
                    >
                      <LinkIcon className="h-[1em]" />
                      {link.name}
                    </Link>
                  ) : null,
                )}
              </div>
            </div>
            <div className="w-full xl:w-3/5">
              <figure className="block aspect-video border-red-400 border-1 rounded-2xl bg-base-content relative">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    fill
                    unoptimized
                    alt={title ?? "Project image"}
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base-100">
                    No image
                  </div>
                )}
              </figure>
            </div>
          </div>
        </FadeInBottom>
      </SectionContainer>

      {tabData.length > 0 && <Tabs data={tabData} />}
      {title && <BgHeading title={title} />}
    </>
  );
}