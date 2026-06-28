import { SectionContainer } from "@/components/basic";
import { resolvePayloadMediaUrl } from "@/helpers/payloadcms/api";
import { getRichTextBlocks } from "@/helpers/payloadcms/getRichTextBlocks";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
  label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  name?: string | null;
  items?: Array<{
    media?: string | ProjectMedia | null;
    desc?: string | null;
  }> | null;
};

type ProjectOverviewBlock = {
  blockType?: "projectOverviewSection";
  label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  content?: {
    root?: {
      children?: any[];
    };
  } | any[] | null;
  scopeTitle?: string | null;
  scopeItems?: Array<{
    label?: string | null;
    value?: string | null;
  }> | null;
};

type ProjectFeatureGridBlock = {
  blockType?: "projectFeatureGridSection";
  label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  items?: Array<{
    iconText?: string | null;
    title?: string | null;
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

type ProjectTechStackBlock = {
  blockType?: "projectTechStackSection";
  label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  items?: Array<{
    label?: string | null;
  }> | null;
  primaryButtonText?: string | null;
  primaryButtonUrl?: string | null;
  primaryButtonExternal?: boolean | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  secondaryButtonExternal?: boolean | null;
};

type ProjectCtaBlock = {
  blockType?: "projectCtaSection";
  label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  primaryButtonText?: string | null;
  primaryButtonUrl?: string | null;
  primaryButtonExternal?: boolean | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  secondaryButtonExternal?: boolean | null;
};

export type ProjectDocument = {
  slug?: string | null;
  alias?: string | null;
  title?: string | null;
  desc?: string | null;
  tags?: string[] | null;
  img?: string | ProjectMedia | null;
  cardStyle?: string | null;
  links?: ProjectLink[] | null;
  contents?: Array<ProjectOverviewBlock | ProjectCarouselBlock | ProjectFeatureGridBlock | ProjectContentsBlock | ProjectTechStackBlock | ProjectCtaBlock | null> | null;
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

  const overviewSection = contents.find((block): block is ProjectOverviewBlock => block?.blockType === "projectOverviewSection")
  const featureSection = contents.find((block): block is ProjectFeatureGridBlock => block?.blockType === "projectFeatureGridSection")
  const stackSection = contents.find((block): block is ProjectTechStackBlock => block?.blockType === "projectTechStackSection")
  const ctaSection = contents.find((block): block is ProjectCtaBlock => block?.blockType === "projectCtaSection")

  const richSections = contents
    .filter((block): block is ProjectContentsBlock => block?.blockType === "projectContents")
    .map((block, index) => ({
      name: block.name ?? `Section ${index + 1}`,
      content: richText(block.contents),
    }))

  const galleryItems = contents
    .filter((block): block is ProjectCarouselBlock => block?.blockType === "projectsCarousel")
    .flatMap((block) => block.items ?? [])

  const overviewContent = richText(overviewSection?.content)
  const displayScope = (overviewSection?.scopeItems ?? []).filter((item): item is { label: string; value: string } => Boolean(item?.label && item?.value))
  const displayFeatures = (featureSection?.items ?? []).filter((item): item is { iconText?: string | null; title: string; desc: string } => Boolean(item?.title && item?.desc))
  const displayStack = (stackSection?.items ?? []).map((item) => item?.label).filter((item): item is string => Boolean(item))
  const primaryLinks = links.filter((link) => link?.links).map((link) => ({ href: link.links as string, label: link.name ?? 'Open link' }))

  const stackButtons = [
    stackSection?.primaryButtonText && stackSection?.primaryButtonUrl
      ? { href: stackSection.primaryButtonUrl, label: stackSection.primaryButtonText, external: Boolean(stackSection.primaryButtonExternal), primary: true }
      : null,
    stackSection?.secondaryButtonText && stackSection?.secondaryButtonUrl
      ? { href: stackSection.secondaryButtonUrl, label: stackSection.secondaryButtonText, external: Boolean(stackSection.secondaryButtonExternal), primary: false }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; external: boolean; primary: boolean }>

  const ctaButtons = [
    ctaSection?.primaryButtonText && ctaSection?.primaryButtonUrl
      ? { href: ctaSection.primaryButtonUrl, label: ctaSection.primaryButtonText, external: Boolean(ctaSection.primaryButtonExternal), primary: true }
      : null,
    ctaSection?.secondaryButtonText && ctaSection?.secondaryButtonUrl
      ? { href: ctaSection.secondaryButtonUrl, label: ctaSection.secondaryButtonText, external: Boolean(ctaSection.secondaryButtonExternal), primary: false }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; external: boolean; primary: boolean }>

  return (
    <>
      <section className="slide project-detail-hero">
        <div className="geo-circle sm" style={{ top: '10%', right: '8%' }}></div>
        <div className="container">
          <Link href="/projects" className="project-detail-back">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Projects
          </Link>
          <div className="project-detail-tags">
            {tags.map((tag, index) => <span key={`${tag}-${index}`} className="project-detail-tag">{tag}</span>)}
          </div>
          <h2 className="slide-headline reveal" style={{ marginBottom: '0.5rem' }}>{title}</h2>
          <p className="project-detail-subtitle reveal">{desc}</p>
          <div className="project-detail-mockup reveal">
            {imageUrl ? (
              <div className="screenshot-frame-body">
                <Image src={imageUrl} alt={title ?? 'Project image'} fill unoptimized className="object-cover object-top" />
              </div>
            ) : (
              <div className="detail-mockup-content">
                <div className="dm-hero"><div className="dm-h1"></div></div>
                <div className="dm-grid">
                  <div className="dm-col"><div className="dm-img"></div><div className="dm-line"></div></div>
                  <div className="dm-col"><div className="dm-img"></div><div className="dm-line"></div></div>
                  <div className="dm-col"><div className="dm-img"></div><div className="dm-line"></div></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="slide slide-tinted">
        <div className="geo-dots" style={{ top: 0, right: 0, width: '280px', height: '100%' }}></div>
        <div className="container">
          <span className="slide-label reveal">{overviewSection?.label ?? 'Overview'}</span>
          <h2 className="slide-headline reveal">{overviewSection?.title ?? 'Why this project?'}</h2>
          <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>{overviewSection?.subtitle ?? 'The context, constraints, and value behind the work.'}</p>
          <div className="about-grid reveal">
            <div className="about-bio">
              {overviewContent.length > 0
                ? overviewContent.map((contentBlock: any, contentIndex: number) => getRichTextBlocks(contentBlock, {}, contentIndex))
                : desc ? <p>{desc}</p> : null}
            </div>
            <aside className="about-sidebar">
              <div className="info-card reveal">
                <h3>{overviewSection?.scopeTitle ?? 'Project Scope'}</h3>
                <ul className="info-list">
                  {displayScope.map((item) => (
                    <li key={`${item.label}-${item.value}`}><span className="info-label">{item.label}</span><span className="info-value">{item.value}</span></li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {galleryItems.length > 0 && (
        <section className="slide">
          <div className="geo-circle md" style={{ bottom: '-30px', right: '-40px' }}></div>
          <div className="container">
            <span className="slide-label reveal">{contents.find((block): block is ProjectCarouselBlock => block?.blockType === 'projectsCarousel')?.label ?? 'Screenshots'}</span>
            <h2 className="slide-headline reveal">{contents.find((block): block is ProjectCarouselBlock => block?.blockType === 'projectsCarousel')?.title ?? 'A look inside'}</h2>
            <p className="slide-subtitle reveal" style={{ marginBottom: '2.5rem' }}>{contents.find((block): block is ProjectCarouselBlock => block?.blockType === 'projectsCarousel')?.subtitle ?? 'Key screens and visuals from the implementation.'}</p>
            <div className="screenshot-gallery reveal-stagger">
              {galleryItems.map((item, index) => {
                const mediaUrl = resolvePayloadMediaUrl(typeof item?.media === 'string' ? item.media : item?.media?.url ?? '')

                return (
                  <div className="screenshot-frame" key={index}>
                    <div className="screenshot-frame-body">
                      {mediaUrl ? (
                        <Image src={mediaUrl} alt={item?.desc ?? 'Project screenshot'} fill unoptimized className="object-cover object-top" />
                      ) : (
                        <div className="screenshot-placeholder">
                          <div className="ph-grid">
                            <div className="ph-col"><div className="ph-img"></div><div className="ph-line"></div></div>
                            <div className="ph-col"><div className="ph-img"></div><div className="ph-line"></div></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="screenshot-caption">{item?.desc ?? 'Project media'}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {displayFeatures.length > 0 && (
        <section className="slide slide-tinted">
          <div className="geo-dots" style={{ top: 0, right: 0, width: '240px', height: '100%' }}></div>
          <div className="container">
            <span className="slide-label reveal">{featureSection?.label ?? 'Key Features'}</span>
            <h2 className="slide-headline reveal">{featureSection?.title ?? 'What makes it shine'}</h2>
            <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>{featureSection?.subtitle ?? 'The parts of the implementation worth calling out.'}</p>
            <div className="project-features reveal-stagger">
              {displayFeatures.map((feature, index) => (
                <div className="project-feature" key={`${feature.title}-${index}`}>
                  <div className="project-feature-icon"><span>{feature.iconText ?? index + 1}</span></div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {richSections.length > 0 && (
        <SectionContainer extraClassName="py-12 md:py-16" topSpacing={false}>
          <div className="container">
            <span className="slide-label reveal">Build Notes</span>
            <h2 className="slide-headline reveal">Implementation details</h2>
            <div className="about-bio reveal" style={{ maxWidth: '760px' }}>
              {richSections.map((section, index) => (
                <div key={`${section.name}-${index}`} style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>{section.name}</h3>
                  <article className="prose max-w-none">
                    {section.content.map((contentBlock: any, contentIndex: number) => getRichTextBlocks(contentBlock, {}, contentIndex))}
                  </article>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      )}

      {displayStack.length > 0 && (
        <section className="slide">
          <div className="geo-circle md" style={{ top: 0, left: '-40px' }}></div>
          <div className="container">
            <span className="slide-label reveal">{stackSection?.label ?? 'Tech Stack'}</span>
            <h2 className="slide-headline reveal">{stackSection?.title ?? 'Built with'}</h2>
            <p className="slide-subtitle reveal" style={{ marginBottom: '2.5rem' }}>{stackSection?.subtitle ?? 'The tools chosen for performance, DX, and maintainability.'}</p>
            <div className="tech-detail-grid reveal-stagger">
              {displayStack.map((item) => <div className="tech-detail-item" key={item}><span>{item}</span></div>)}
            </div>
            {(stackButtons.length > 0 || primaryLinks.length > 0) && (
              <div className="reveal" style={{ marginTop: '3rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {(stackButtons.length > 0 ? stackButtons : primaryLinks).map((link, index) => (
                  <Link key={`${link.href}-${index}`} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener' : undefined} className={link.primary || index === 0 ? 'btn btn-primary' : 'btn btn-outline'}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {ctaSection && (
        <section className="slide slide-dark">
          <div className="geo-circle lg" style={{ borderColor: 'rgba(245,243,239,0.06)', top: '-80px', right: '-80px' }}></div>
          <div className="geo-accent" style={{ top: 'auto', bottom: '-100px', left: '-80px' }}></div>
          <div className="container">
            <span className="slide-label reveal" style={{ color: 'rgba(245,243,239,0.5)' }}>{ctaSection.label}</span>
            <h2 className="slide-headline reveal">{ctaSection.title}</h2>
            <p className="slide-subtitle reveal" style={{ marginBottom: '2rem' }}>{ctaSection.subtitle}</p>
            <div className="reveal" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {ctaButtons.map((link, index) => (
                <Link key={`${link.href}-${index}`} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} className={link.primary ? 'btn btn-primary' : 'btn btn-outline'}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}