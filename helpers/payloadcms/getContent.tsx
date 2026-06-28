import FadeInBottom from "@/components/animation/FadeInBottom";
import CountUp from "@/components/animation/CountUp";
import { getRichTextBlocks } from "./getRichTextBlocks";
import { Heading } from "@/components/visual";
import { resolvePayloadMediaUrl } from "./api";
import Link from "next/link";
import { ActiveLink, SectionContainer } from "@/components/basic";
import { ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import { HomeFeaturedProjects, ProjectGrid } from "@/components/home/projects";
import { ContactForm, Letter3D } from "@/components/home";
import { AboutMeSection, HeroSection } from "@/components/home/sections";
import type { PageContentType } from "@/interfaces/ContentBlockProps";
import type { ProjectGridItem } from "@/components/home/projects/ProjectGrid";

const richText = (value: any) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (value.root?.children) return value.root.children;
    return [];
};

function UserAvatarIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="5" />
            <path d="M3 21c0-4.97 4.03-9 9-9s9 4.03 9 9" strokeLinecap="round" />
        </svg>
    );
}

function GitHubIcon() {
    return <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
}

function LinkedInIcon() {
    return <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg>;
}

function BlogIcon() {
    return <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5a.5.5 0 01.5-.5h3a.5.5 0 010 1H9.5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h4a.5.5 0 000-1H9.5zm0 3a.5.5 0 000 1h4a.5.5 0 000-1H9.5zm-8 2.5A1.5 1.5 0 013 9h3A1.5 1.5 0 017.5 10.5v3A1.5 1.5 0 016 15H3a1.5 1.5 0 01-1.5-1.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5H3zm6.5.5a.5.5 0 01.5-.5h3a.5.5 0 010 1H9.5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h4a.5.5 0 000-1H9.5z" /></svg>;
}

function EmailIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CheckIcon() {
    return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function PhotographyIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M4 9h2.5M17.5 9H20"/></svg>;
}

function ServerIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/><line x1="8" y1="18" x2="16" y2="18"/><line x1="8" y1="6" x2="16" y2="6"/></svg>;
}

function CleanCodeIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h10M4 18h14"/><circle cx="17" cy="12" r="3"/><path d="M19 10l2 2-2 2"/></svg>;
}

function LightningIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>;
}

function ClockIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}

function SocialIcon({ label }: { label?: string | null }) {
    switch (label) {
        case 'GitHub':
            return <GitHubIcon />;
        case 'LinkedIn':
            return <LinkedInIcon />;
        case 'Blog':
            return <BlogIcon />;
        default:
            return <span>{label?.slice(0, 2).toUpperCase()}</span>;
    }
}

function ContactMethodIcon({ label }: { label?: string | null }) {
    switch (label) {
        case 'Email':
            return <EmailIcon />;
        case 'GitHub':
            return <GitHubIcon />;
        case 'LinkedIn':
            return <LinkedInIcon />;
        case 'Blog':
            return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
        default:
            return <span>{label?.slice(0, 1)}</span>;
    }
}

function CardGridIcon({ tone, title }: { tone?: string; title?: string | null }) {
    if (tone === 'dark') {
        if (title?.includes('Photography')) return <PhotographyIcon />;
        if (title?.includes('Hosting')) return <ServerIcon />;
    }

    if (title?.includes('Clean')) return <CleanCodeIcon />;
    if (title?.includes('Performance')) return <LightningIcon />;
    if (title?.includes('Learning')) return <ClockIcon />;

    return null;
}

type GetContentsOptions = {
    projectGridItems?: ProjectGridItem[];
    pageUrl?: string;
};

function getSectionToneClass(tone?: string) {
    if (tone === "dark") return "slide slide--dark";
    if (tone === "tinted") return "slide slide--tinted";
    return "slide";
}

function renderButtonLink(text?: string, url?: string, external?: boolean, className = "btn btn-primary") {
    if (!text || !url) return null;

    if (external) {
        return (
            <Link href={url} className={className} target="_blank" rel="noopener noreferrer">
                {text}
            </Link>
        );
    }

    return (
        <Link href={url} className={className}>
            {text}
        </Link>
    );
}

function hasProjectGridBlock(data: PageContentType[] | null | undefined) {
    if (!data || !Array.isArray(data)) return false;

    return data.some((block: any) => {
        const type = block?.__component ?? block?.blockType;

        return type === "page.project-grid" || type === "pageProjectGrid";
    });
}

function getContents(data: PageContentType[] | null | undefined, options: GetContentsOptions = {}) {
    if (!data || !Array.isArray(data)) return null;

    const elements: React.ReactNode[] = [];

    for (let i = 0; i < data.length; i += 1) {
        const block: any = data[i];
        const type = block?.__component ?? block?.blockType;
        const nextBlock: any = data[i + 1];
        const nextType = nextBlock?.__component ?? nextBlock?.blockType;

        switch (type) {
            case "page.page-rich-text":
            case "pageRichText": {
                const classes = [
                    "prose max-w-none",
                    "prose-p:text-md prose-p:md:text-xl prose-p:md:8 prose-p:!leading-8 prose-p:text-base-content",
                    "prose-h2:text-xl prose-h2:md:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:md:mt-16 prose-h2:mb-4 prose-h2:md:mb-8",
                    "prose-h3:text-lg prose-h3:md:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:md:mt-16 prose-h3:mb-4 prose-h3:md:mb-8",
                    "prose-ul:list-disc prose-ul:text-md prose-ul:md:text-xl prose-ul:ps-8 prose-ul:!leading-8 prose-ul:mb-4 prose-ul:md:mb-8 prose-ul:text-base-content",
                    "prose-li:m-0 prose-li:p-0",
                    "prose-a:link prose-a:link-primary"
                ].join(" ");

                elements.push(
                    <SectionContainer key={i}>
                        <FadeInBottom>
                            <div className={`rich-content ${classes}`}>
                                {richText(block.content).map((c: any, idx: number) => getRichTextBlocks(c, {}, idx))}
                            </div>
                        </FadeInBottom>
                    </SectionContainer>
                );
                break;
            }

            case "page.page-heading":
            case "pageHeading":
                elements.push(
                    <SectionContainer bottomSpacing={false} key={i}>
                        <FadeInBottom>
                            <Heading 
                                topTitle={block.topTitle} 
                                leftTitle={block.leftTitle} 
                                rightTitle={block.rightTitle} 
                                colorReverse={block.colorReverse}
                            />
                        </FadeInBottom>
                    </SectionContainer>
                );
                break;

            case "page.button":
            case "pageButton": {
                if (options.pageUrl === "/" && (data[i - 1] as any)?.__component === "pageHeroSection") {
                    break;
                }

                const buttonContent = (
                    <>
                        {block.name}
                        <ArrowSmallDownIcon className="h-6 w-6 text-content -rotate-90" />
                    </>
                );

                if (block.external) {
                    elements.push(
                        <SectionContainer topSpacing={false} bottomSpacing={false} key={i}>
                            <FadeInBottom>
                                <Link href={block.url} className="btn btn-primary">
                                    {buttonContent}
                                </Link>
                            </FadeInBottom>
                        </SectionContainer>
                    );
                    break;
                }
                elements.push(
                    <SectionContainer key={i}>
                        <FadeInBottom>
                            <ActiveLink href={block.url} className="btn btn-primary">
                                {buttonContent}
                            </ActiveLink>
                        </FadeInBottom>
                    </SectionContainer>
                );
                break;
            }

            case "page.project-grid":
            case "pageProjectGrid":
                elements.push(
                    <section className="slide slide--tinted" key={i} style={block.topPadding ? { paddingTop: "9rem" } : undefined}>
                        <div className={block.topPadding ? "geo-circle sm" : "geo-circle md"} style={block.topPadding ? { top: '10%', right: '8%' } : undefined}></div>
                        <div className="container">
                            {block.label ? <span className="slide__label reveal">{block.label}</span> : null}
                            {block.title ? (block.topPadding ? <h1 className="slide__headline reveal">{block.title}</h1> : <h2 className="slide__headline reveal">{block.title}</h2>) : null}
                            {block.subtitle ? <p className="slide__subtitle reveal" style={{ marginBottom: "3rem" }}>{block.subtitle}</p> : null}
                            {options.pageUrl === "/"
                                ? <HomeFeaturedProjects projects={options.projectGridItems} />
                                : <ProjectGrid projects={options.projectGridItems} />}
                        </div>
                    </section>
                );
                break;

            case "page.contact-form":
            case "pageContactForm":
                elements.push(
                    <section className="slide" key={i}>
                        <div className="container">
                            <FadeInBottom>
                                {block.title ? <h2 className="slide__headline">{block.title}</h2> : null}
                                <ContactForm />
                            </FadeInBottom>
                        </div>
                    </section>
                );
                break;

            case "page.3-d-letter":
            case "pageThreeDLetter":
                if (block.enable) {
                    elements.push(<Letter3D key={i} />);
                }
                break;

            case "page.hero-section":
            case "pageHeroSection": {
                if (options.pageUrl === "/") {
                    const secondaryCta = nextType === "pageButton" ? nextBlock : null;

                    elements.push(
                        <section className="slide hero-slide" key={i}>
                            <div className="hero-graphic">
                                <div className="outer"></div><div className="mid"></div><div className="inner"></div>
                                <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                            </div>
                            <div className="container">
                                <div className="hero-content">
                                    <span className="slide__label">Frontend Developer · Hong Kong</span>
                                    <h1>{block.title}</h1>
                                    <p className="slide__subtitle" style={{ marginBottom: '2rem' }}>{block.desc}</p>
                                    <div className="reveal">
                                        <Link href={block.arrowLink} className="btn btn-primary">{block.arrowText} <span>→</span></Link>
                                        {secondaryCta ? <Link href={secondaryCta.url} className="btn btn-outline" style={{ marginLeft: '0.75rem' }}>{secondaryCta.name}</Link> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="hero-scroll"><span>Scroll</span><div className="hero-scroll-line"></div></div>
                        </section>
                    );

                    if (secondaryCta) {
                        i += 1;
                    }

                    break;
                }

                elements.push(
                    <HeroSection 
                        title={block.title} 
                        desc={block.desc} 
                        arrowText={block.arrowText} 
                        arrowLink={block.arrowLink} 
                        key={i}
                    />
                );
                break;
            }

            case "page.about-me-section":
            case "pageAboutMeSection":
                elements.push(
                    <AboutMeSection
                        topTitle={block.topTitle}
                        leftTitle={block.leftTitle}
                        rightTitle={block.rightTitle}
                        contents={richText(block.contents).map((c: any, idx: number) => getRichTextBlocks(c, {}, idx))}
                        techs={block.techs}
                        btnLinks={block.btnLinks}
                        btnText={block.btnText}
                        key={i}
                    />
                );
                break;

            case "page.stats-section":
            case "pageStatsSection":
                elements.push(
                    <section className="slide" key={i}>
                        <div className="geo-circle sm"></div>
                        <div className="container">
                            {block.label ? <span className="slide__label reveal">{block.label}</span> : null}
                            {block.title ? <h2 className="slide__headline reveal">{block.title}</h2> : null}
                            {block.subtitle ? <p className="slide__subtitle reveal" style={{ marginBottom: "3rem" }}>{block.subtitle}</p> : null}
                            <div className="stats-grid reveal-stagger">
                                {(block.items ?? []).map((item: any, itemIndex: number) => {
                                    const match = String(item.value).match(/^(\d+)(\+?)$/);
                                    const num = match ? parseInt(match[1], 10) : 0;
                                    const suffix = match?.[2] ?? '';

                                    return (
                                        <div key={`${item.label}-${itemIndex}`}>
                                            {num > 0 ? (
                                                <CountUp end={num} suffix={suffix} />
                                            ) : (
                                                <div style={{ fontSize: "4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>{item.value}</div>
                                            )}
                                            <div className="stat-label">{item.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
                break;

            case "page.tech-stack-section":
            case "pageTechStackSection": {
                const items = (block.items ?? []).filter((item: any) => item.name);

                elements.push(
                    <section className="slide slide--tinted" key={i}>
                        <div className="geo-dots" style={{ top: 0, right: 0, width: "300px", height: "100%" }}></div>
                        <div className="container">
                            {block.label ? <span className="slide__label reveal">{block.label}</span> : null}
                            {block.title ? <h2 className="slide__headline reveal">{block.title}</h2> : null}
                            {block.subtitle ? <p className="slide__subtitle reveal" style={{ marginBottom: "2.5rem" }}>{block.subtitle}</p> : null}
                            <div className="tech-strip-wrap reveal">
                                <div className="tech-strip">
                                    {[...items, ...items].map((item: any, itemIndex: number) => {
                                        const iconUrl = item.icon?.url ? resolvePayloadMediaUrl(item.icon.url) : '';
                                        return (
                                            <div className="tech-item" key={`${item.name}-${itemIndex}`}>
                                                <div className="tech-item-icon">
                                                    {iconUrl ? (
                                                        <img src={iconUrl} alt={item.icon?.alt || item.name} width="24" height="24" />
                                                    ) : (
                                                        <span>{item.name?.slice(0, 1)}</span>
                                                    )}
                                                </div>
                                                <span className="tech-item-name">{item.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                );
                break;
            }

            case "page.cta-section":
            case "pageCtaSection": {
                const sectionClassName = [
                    getSectionToneClass(block.tone),
                    "slide--cta",
                    block.centered ? "slide--cta-centered" : null,
                ].filter(Boolean).join(" ");
                const isDark = block.tone === "dark";
                const textAlign = block.centered ? { textAlign: "center" as const } : undefined;
                const subtitleStyle = block.centered
                    ? { margin: "0 auto 2rem" }
                    : { marginBottom: "2rem" };
                const actionsClassName = block.centered ? "reveal cta-row cta-row--centered" : "reveal cta-row";

                elements.push(
                    <section className={sectionClassName} key={i} style={textAlign}>
                        {isDark ? <div className="geo-circle lg" style={{ borderColor: "rgba(245,243,239,0.06)", top: "-80px", right: "-80px" }}></div> : null}
                        {isDark ? <div className="geo-accent" style={{ top: "auto", bottom: "-100px", right: "-80px" }}></div> : null}
                        <div className="container">
                            {block.label ? <span className="slide__label reveal" style={isDark ? { color: "rgba(245,243,239,0.5)" } : undefined}>{block.label}</span> : null}
                            {block.title ? <h2 className="slide__headline reveal">{block.title}</h2> : null}
                            {block.subtitle ? <p className="slide__subtitle reveal" style={subtitleStyle}>{block.subtitle}</p> : null}
                            <div className={actionsClassName}>
                                {renderButtonLink(block.primaryButtonText, block.primaryButtonUrl, block.primaryButtonExternal, "btn btn-primary")}
                                {renderButtonLink(block.secondaryButtonText, block.secondaryButtonUrl, block.secondaryButtonExternal, "btn btn-outline")}
                            </div>
                        </div>
                    </section>
                );
                break;
            }

            case "page.profile-section":
            case "pageProfileSection":
                elements.push(
                    <section className="slide" key={i} style={block.topPadding ? { paddingTop: "9rem" } : undefined}>
                        <div className="geo-circle sm" style={{ top: "15%", right: "6%" }}></div>
                        <div className="container">
                            {block.label ? <span className="slide__label reveal">{block.label}</span> : null}
                            {block.title ? (block.topPadding ? <h1 className="slide__headline reveal">{block.title}</h1> : <h2 className="slide__headline reveal">{block.title}</h2>) : null}
                            {block.subtitle ? <p className="slide__subtitle reveal" style={{ marginBottom: "3rem" }}>{block.subtitle}</p> : null}
                            <div className="about-grid">
                                <div className="about-bio reveal">
                                    {richText(block.body).map((c: any, idx: number) => getRichTextBlocks(c, {}, idx))}
                                </div>
                                <aside className="about-sidebar" style={{ position: "sticky", top: "100px" }}>
                                    <div className="info-card reveal">
                                        <div className="about-avatar">
                                            <UserAvatarIcon />
                                        </div>
                                        {block.sidebarTitle ? <p className="info-card__title">{block.sidebarTitle}</p> : null}
                                        <ul className="info-list">
                                            {(block.details ?? []).map((detail: any, detailIndex: number) => (
                                                <li key={`${detail.label}-${detailIndex}`}>
                                                    <span className="info-label">{detail.label}</span>
                                                    <span className="info-value">{detail.value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {(block.socialLinks ?? []).length > 0 ? (
                                            <div className="social-links">
                                                {(block.socialLinks ?? []).map((link: any, linkIndex: number) => (
                                                    <Link key={`${link.label}-${linkIndex}`} href={link.url} className="social-link" target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                                                        <SocialIcon label={link.label} />
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </section>
                );
                break;

            case "page.skill-bars-section":
            case "pageSkillBarsSection":
                elements.push(
                    <section className="slide slide--tinted" key={i}>
                        <div className="geo-dots" style={{ top: 0, right: 0, width: "240px", height: "100%" }}></div>
                        <div className="container">
                            {block.label ? <span className="slide__label reveal">{block.label}</span> : null}
                            {block.title ? <h2 className="slide__headline reveal">{block.title}</h2> : null}
                            {block.subtitle ? <p className="slide__subtitle reveal" style={{ marginBottom: "2.5rem" }}>{block.subtitle}</p> : null}
                            <div className="skills-grid reveal">
                                {(block.groups ?? []).map((group: any, groupIndex: number) => (
                                    <div className="skill-bar-group" key={groupIndex}>
                                        {(group.items ?? []).map((item: any, itemIndex: number) => (
                                            <div className="skill-bar" key={`${item.label}-${itemIndex}`}>
                                                <span className="skill-bar-label">{item.label}</span>
                                                <div className="skill-bar-track">
                                                    <div className="skill-bar-fill" style={{ width: `${item.value}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
                break;

            case "page.card-grid-section":
            case "pageCardGridSection": {
                const sectionClassName = getSectionToneClass(block.tone);
                const isDark = block.tone === "dark";
                const cardClassName = block.tone === "dark" ? "passion-card" : "principle-card";
                const iconClassName = block.tone === "dark" ? "passion-icon" : "principle-icon";
                const titleClassName = block.tone === "dark" ? "passion-title" : undefined;
                const descClassName = block.tone === "dark" ? "passion-desc" : undefined;
                const gridClassName = block.tone === "dark" ? "passions-grid reveal-stagger" : "principles-grid reveal-stagger";

                elements.push(
                    <section className={sectionClassName} key={i}>
                        {isDark ? <div className="geo-circle lg" style={{ borderColor: "rgba(245,243,239,0.06)", top: "-80px", right: "-80px" }}></div> : null}
                        {isDark ? <div className="geo-accent" style={{ bottom: "-100px", right: "-80px" }}></div> : <div className="geo-dots" style={{ top: 0, left: 0, width: "200px", height: "100%" }}></div>}
                        <div className="container">
                            {block.label ? <span className="slide__label reveal" style={isDark ? { color: "rgba(245,243,239,0.6)" } : undefined}>{block.label}</span> : null}
                            {block.title ? <h2 className="slide__headline reveal">{block.title}</h2> : null}
                            {block.subtitle ? <p className="slide__subtitle reveal" style={{ marginBottom: "3rem" }}>{block.subtitle}</p> : null}
                            <div className={gridClassName}>
                                {(block.items ?? []).map((item: any, itemIndex: number) => (
                                    <div className={cardClassName} key={`${item.title}-${itemIndex}`}>
                                        <div className={iconClassName}>
                                            {CardGridIcon({ tone: block.tone, title: item.title }) ?? <span>{item.iconText || `${itemIndex + 1}`}</span>}
                                        </div>
                                        {<h3 className={block.tone === 'dark' ? titleClassName : undefined}>{item.title}</h3>}
                                        <p className={descClassName}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
                break;
            }

            case "page.contact-methods-section":
            case "pageContactMethodsSection":
                elements.push(
                    <section className="slide" key={i} style={block.topPadding ? { paddingTop: "9rem" } : undefined}>
                        <div className="geo-circle lg" style={{ top: "-100px", right: "-100px" }}></div>
                        <div className="geo-circle sm" style={{ bottom: "10%", left: "8%" }}></div>
                        <div className="container">
                            {block.label ? <span className="slide__label reveal">{block.label}</span> : null}
                            {block.title ? (block.topPadding ? <h1 className="slide__headline reveal">{block.title}</h1> : <h2 className="slide__headline reveal">{block.title}</h2>) : null}
                            {block.subtitle ? <p className="slide__subtitle reveal" style={{ marginBottom: "3rem" }}>{block.subtitle}</p> : null}
                            <div className="contact-grid">
                                <div className="reveal">
                                    <div className="contact-methods">
                                        {(block.methods ?? []).map((method: any, methodIndex: number) => (
                                            <Link key={`${method.label}-${methodIndex}`} href={method.url} target={method.url.startsWith("http") ? "_blank" : undefined} rel={method.url.startsWith("http") ? "noopener noreferrer" : undefined} className="contact-method">
                                                <div className="contact-method-icon"><ContactMethodIcon label={method.label} /></div>
                                                <div className="contact-method-text"><div className="contact-method-label">{method.label}</div><div className="contact-method-value">{method.value}</div></div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div className="contact-card">
                                        <div style={{ marginBottom: "1rem" }}><CheckIcon /></div>
                                        {block.cardTitle ? <p style={{ marginBottom: "0.5rem", color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 600 }}>{block.cardTitle}</p> : null}
                                        {block.cardDescription ? <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: "260px" }}>{block.cardDescription}</p> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
                break;

            default:
                break;
        }
    }

    return elements;
}

export { getContents, hasProjectGridBlock };
