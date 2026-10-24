import { resolvePayloadMediaUrl } from './api';
import { getRichTextBlocks, richTextNodes, attr } from './rich-text';
import type { ProjectGridItem } from './types';

// ── Shared section primitives (ports of React components) ──────────

function sectionContainer(inner: string, opts: { topSpacing?: boolean; bottomSpacing?: boolean; extendRightSpacing?: boolean; id?: string; extraClassName?: string } = {}) {
    const { topSpacing = true, bottomSpacing = true, extendRightSpacing = false, id = '', extraClassName = '' } = opts;

    let spacing = '';
    if (topSpacing && bottomSpacing) spacing = 'my-12 md:my-16';
    else if (topSpacing) spacing = 'mt-12 md:mt-16';
    else if (bottomSpacing) spacing = 'mb-12 md:mb-16';

    const rightSpacing = extendRightSpacing ? '' : 'xl:pr-[30%] 2xl:pr-[20%]';

    return `<section${id ? ` id="${attr(id)}"` : ''} class="section-shell${extraClassName ? ` ${extraClassName}` : ''}"><div class="section-shell__container container ${spacing} ${rightSpacing}">${inner}</div></section>`;
}

function fadeReveal(inner: string): string {
    return `<div class="fade-reveal">${inner}</div>`;
}

function countUp(end: number, suffix = ''): string {
    const style = 'font-size: 4rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.04em; line-height: 1;';
    return `<div data-countup="${end}" data-countup-suffix="${attr(suffix)}" style="${style}">0${attr(suffix)}</div>`;
}

function heading(topTitle?: string | null, leftTitle?: string | null, rightTitle?: string | null, colorReverse?: boolean | null): string {
    const eyebrow = topTitle
        ? `<span class="heading-block__eyebrow"><hr class="heading-block__rule" />${escapeText(topTitle)}</span>`
        : '';
    const parts = colorReverse
        ? `<span class="heading-block__text">${escapeText(leftTitle ?? '')}</span> <span class="heading-block__accent">${escapeText(rightTitle ?? '')}</span>`
        : `<span class="heading-block__accent">${escapeText(leftTitle ?? '')}</span> <span class="heading-block__text">${escapeText(rightTitle ?? '')}</span>`;
    return `<h2 class="heading-block">${eyebrow}${parts}</h2>`;
}

function bgHeading(title = ''): string {
    const words = title.split(' ');
    const lines = words.map((word) => `<span class="bg-heading__line">${escapeText(word)}</span>`).join('');
    return `<div class="bg-heading" aria-hidden="true"><span class="bg-heading__text">${lines}</span></div>`;
}

function escapeText(value: string | null | undefined): string {
    return attr(value);
}

// ── Inline SVG icons (ported from getContent.tsx) ───────────────────

const UserAvatarIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5" /><path d="M3 21c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke-linecap="round" /></svg>';

const GitHubIcon = () => '<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>';

const LinkedInIcon = () => '<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg>';

const BlogIcon = () => '<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5a.5.5 0 01.5-.5h3a.5.5 0 010 1H9.5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h4a.5.5 0 000-1H9.5zm0 3a.5.5 0 000 1h4a.5.5 0 000-1H9.5zm-8 2.5A1.5 1.5 0 013 9h3A1.5 1.5 0 017.5 10.5v3A1.5 1.5 0 016 15H3a1.5 1.5 0 01-1.5-1.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5H3zm6.5.5a.5.5 0 01.5-.5h3a.5.5 0 010 1H9.5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h4a.5.5 0 000-1H9.5z" /></svg>';

const EmailIcon = () => '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" stroke-linecap="round" stroke-linejoin="round" /></svg>';

const CheckIcon = () => '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" stroke-linecap="round" stroke-linejoin="round" /></svg>';

const PhotographyIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M4 9h2.5M17.5 9H20"/></svg>';

const ServerIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/><line x1="8" y1="18" x2="16" y2="18"/><line x1="8" y1="6" x2="16" y2="6"/></svg>';

const CleanCodeIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h14"/><circle cx="17" cy="12" r="3"/><path d="M19 10l2 2-2 2"/></svg>';

const LightningIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>';

const ClockIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';

const ArrowSmallDownIcon = () => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="h-6 w-6 text-content -rotate-90"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75" /></svg>';

function SocialIcon(label?: string | null): string {
    switch (label) {
        case 'GitHub': return GitHubIcon();
        case 'LinkedIn': return LinkedInIcon();
        case 'Blog': return BlogIcon();
        default: return `<span>${escapeText(label?.slice(0, 2).toUpperCase())}</span>`;
    }
}

function ContactMethodIcon(label?: string | null): string {
    switch (label) {
        case 'Email': return EmailIcon();
        case 'GitHub': return GitHubIcon();
        case 'LinkedIn': return LinkedInIcon();
        case 'Blog': return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
        default: return `<span>${escapeText(label?.slice(0, 1))}</span>`;
    }
}

function CardGridIcon(tone?: string, title?: string | null): string | null {
    if (tone === 'dark') {
        if (title?.includes('Photography')) return PhotographyIcon();
        if (title?.includes('Hosting')) return ServerIcon();
    }

    if (title?.includes('Clean')) return CleanCodeIcon();
    if (title?.includes('Performance')) return LightningIcon();
    if (title?.includes('Learning')) return ClockIcon();

    return null;
}

// ── Project grids ───────────────────────────────────────────────────

const PROJECTS_PAGE_PRIORITY: Record<string, number> = {
    'technical-blog': 0,
    'portfolio-v2': 1,
    'minecraft-server': 2,
    'portfolio-v1': 3,
    'force-use-npm': 4,
    'game-server-infra': 5,
};

const HOMEPAGE_PRIORITY: Record<string, number> = {
    'technical-blog': 0,
    'portfolio-v2': 1,
    'minecraft-server': 2,
};

export function sortProjects(projects: ProjectGridItem[]) {
    return [...projects].sort(
        (left, right) => new Date(left.date ?? '').getTime() - new Date(right.date ?? '').getTime(),
    );
}

function projectMockup(kind: string): string {
    const isDark = kind === 'terminal';
    const background = isDark
        ? 'linear-gradient(135deg, var(--bg-dark-soft) 0%, var(--bg-dark) 100%)'
        : 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)';
    return `<div class="project-card__image" style="background: ${background}"></div>`;
}

function projectCard(item: ProjectGridItem, titleTag: 'h3' | 'span'): string {
    const mediaPath = typeof item.img === 'string'
        ? item.img
        : item.img?.thumbnailURL ?? item.img?.url ?? '';
    const imageUrl = resolvePayloadMediaUrl(mediaPath);

    const image = imageUrl
        ? `<div class="project-card__image"><img src="${attr(imageUrl)}" alt="${attr(item.title)}" loading="lazy" class="project-card__image-asset" /></div>`
        : projectMockup(item.cardStyle ?? 'portfolio');

    const tags = (item.tags ?? []).slice(0, 3)
        .map((tag) => `<span class="project-card__tag">${escapeText(tag)}</span>`)
        .join('');

    const title = titleTag === 'h3'
        ? `<h3 class="project-card__title">${escapeText(item.title)}</h3>`
        : `<span class="project-card__title">${escapeText(item.title)}</span>`;

    return `<a href="/projects/${attr(item.alias)}" class="project-card">${image}<div class="project-card__body"><div class="project-card__tags">${tags}</div>${title}<p class="project-card__description">${escapeText(item.desc)}</p></div></a>`;
}

function projectGrid(projects: ProjectGridItem[] = []): string {
    const orderedProjects = [...projects].sort((left, right) => {
        const leftPriority = PROJECTS_PAGE_PRIORITY[left.alias ?? ''] ?? Number.MAX_SAFE_INTEGER;
        const rightPriority = PROJECTS_PAGE_PRIORITY[right.alias ?? ''] ?? Number.MAX_SAFE_INTEGER;

        if (leftPriority !== rightPriority) {
            return leftPriority - rightPriority;
        }

        return new Date(right.date ?? '').getTime() - new Date(left.date ?? '').getTime();
    });

    const cards = orderedProjects
        .filter((item) => item.alias && item.title && item.desc)
        .map((item) => projectCard(item, 'span'))
        .join('');

    return `<div class="project-list reveal-stagger">${cards}</div>`;
}

function homeFeaturedProjects(projects: ProjectGridItem[] = []): string {
    const featuredProjects = [...projects]
        .sort((left, right) => {
            const leftPriority = HOMEPAGE_PRIORITY[left.alias ?? ''] ?? Number.MAX_SAFE_INTEGER;
            const rightPriority = HOMEPAGE_PRIORITY[right.alias ?? ''] ?? Number.MAX_SAFE_INTEGER;

            if (leftPriority !== rightPriority) {
                return leftPriority - rightPriority;
            }

            return new Date(right.date ?? '').getTime() - new Date(left.date ?? '').getTime();
        })
        .slice(0, 3);

    const cards = featuredProjects
        .filter((project) => project.alias && project.title && project.desc)
        .map((project) => projectCard(project, 'h3'))
        .join('');

    return `<div class="project-list project-list--featured reveal-stagger">${cards}</div>`;
}

// ── Block renderer ──────────────────────────────────────────────────

function getSectionToneClass(tone?: string) {
    if (tone === 'dark') return 'slide slide--dark';
    if (tone === 'tinted') return 'slide slide--tinted';
    return 'slide';
}

function renderButtonLink(text?: string | null, url?: string | null, external?: boolean | null, className = 'btn btn-primary'): string {
    if (!text || !url) return '';

    if (external) {
        return `<a href="${attr(url)}" class="${className}" target="_blank" rel="noopener noreferrer">${escapeText(text)}</a>`;
    }

    return `<a href="${attr(url)}" class="${className}">${escapeText(text)}</a>`;
}

export function hasProjectGridBlock(data: any[] | null | undefined): boolean {
    if (!data || !Array.isArray(data)) return false;

    return data.some((block: any) => {
        const type = block?.__component ?? block?.blockType;

        return type === 'page.project-grid' || type === 'pageProjectGrid';
    });
}

export type GetContentsOptions = {
    projectGridItems?: ProjectGridItem[];
    pageUrl?: string;
};

export function getContents(data: any[] | null | undefined, options: GetContentsOptions = {}): string {
    if (!data || !Array.isArray(data)) return '';

    const elements: string[] = [];

    for (let i = 0; i < data.length; i += 1) {
        const block: any = data[i];
        const type = block?.__component ?? block?.blockType;
        const nextBlock: any = data[i + 1];
        const nextType = nextBlock?.__component ?? nextBlock?.blockType;

        switch (type) {
            case 'page.page-rich-text':
            case 'pageRichText': {
                const classes = [
                    'prose max-w-none',
                    'prose-p:text-md prose-p:md:text-xl prose-p:md:8 prose-p:!leading-8 prose-p:text-base-content',
                    'prose-h2:text-xl prose-h2:md:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:md:mt-16 prose-h2:mb-4 prose-h2:md:mb-8',
                    'prose-h3:text-lg prose-h3:md:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:md:mt-16 prose-h3:mb-4 prose-h3:md:mb-8',
                    'prose-ul:list-disc prose-ul:text-md prose-ul:md:text-xl prose-ul:ps-8 prose-ul:!leading-8 prose-ul:mb-4 prose-ul:md:mb-8 prose-ul:text-base-content',
                    'prose-li:m-0 prose-li:p-0',
                    'prose-a:link prose-a:link-primary',
                ].join(' ');

                const inner = richTextNodes(block.content).map((c: any) => getRichTextBlocks(c)).join('');
                elements.push(sectionContainer(fadeReveal(`<div class="rich-content ${classes}">${inner}</div>`)));
                break;
            }

            case 'page.page-heading':
            case 'pageHeading':
                elements.push(sectionContainer(fadeReveal(heading(block.topTitle, block.leftTitle, block.rightTitle, block.colorReverse)), { bottomSpacing: false }));
                break;

            case 'page.button':
            case 'pageButton': {
                if (options.pageUrl === '/' && (data[i - 1] as any)?.__component === 'pageHeroSection') {
                    break;
                }

                const buttonContent = `${escapeText(block.name)}${ArrowSmallDownIcon()}`;

                if (block.external) {
                    elements.push(sectionContainer(fadeReveal(`<a href="${attr(block.url)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">${buttonContent}</a>`), { topSpacing: false, bottomSpacing: false }));
                    break;
                }
                elements.push(sectionContainer(fadeReveal(`<a href="${attr(block.url)}" class="btn btn-primary">${buttonContent}</a>`)));
                break;
            }

            case 'page.project-grid':
            case 'pageProjectGrid':
                elements.push(
                    `<section class="slide slide--tinted"${block.topPadding ? ' style="padding-top: 9rem"' : ''}>` +
                    `<div class="${block.topPadding ? 'geo-circle sm' : 'geo-circle md'}"${block.topPadding ? ' style="top: 10%; right: 8%"' : ''}></div>` +
                    `<div class="container">` +
                    `${block.label ? `<span class="slide__label reveal">${escapeText(block.label)}</span>` : ''}` +
                    `${block.title ? (block.topPadding ? `<h1 class="slide__headline reveal">${escapeText(block.title)}</h1>` : `<h2 class="slide__headline reveal">${escapeText(block.title)}</h2>`) : ''}` +
                    `${block.subtitle ? `<p class="slide__subtitle reveal" style="margin-bottom: 3rem">${escapeText(block.subtitle)}</p>` : ''}` +
                    `${options.pageUrl === '/'
                        ? homeFeaturedProjects(options.projectGridItems ?? [])
                        : projectGrid(options.projectGridItems ?? [])}` +
                    `</div></section>`,
                );
                break;

            case 'page.contact-form':
            case 'pageContactForm':
                // Contact form removed — block intentionally skipped.
                break;

            case 'page.3-d-letter':
            case 'pageThreeDLetter':
                if (block.enable) {
                    elements.push('<div data-letter3d class="!hidden xl:!grid place-items-center h-full w-2/3 absolute -right-[20vw] -z-10"><div class="w-full h-full float-y"><div class="letter3d-canvas w-full h-full"></div></div></div>');
                }
                break;

            case 'page.hero-section':
            case 'pageHeroSection': {
                if (options.pageUrl === '/') {
                    const secondaryCta = nextType === 'pageButton' ? nextBlock : null;

                    const secondaryBtn = secondaryCta
                        ? `<a href="${attr(secondaryCta.url)}" class="btn btn-outline" style="margin-left: 0.75rem">${escapeText(secondaryCta.name)}</a>`
                        : '';

                    elements.push(
                        `<section class="slide hero-slide">` +
                        `<div class="hero-graphic"><div class="outer"></div><div class="mid"></div><div class="inner"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>` +
                        `<div class="container"><div class="hero-content">` +
                        `<span class="slide__label">Frontend Developer · Hong Kong</span>` +
                        `<h1>${escapeText(block.title)}</h1>` +
                        `<p class="slide__subtitle" style="margin-bottom: 2rem">${escapeText(block.desc)}</p>` +
                        `<div class="reveal"><a href="${attr(block.arrowLink)}" class="btn btn-primary">${escapeText(block.arrowText)} <span>→</span></a>${secondaryBtn}</div>` +
                        `</div></div>` +
                        `<div class="hero-scroll"><span>Scroll</span><div class="hero-scroll-line"></div></div>` +
                        `</section>`,
                    );

                    if (secondaryCta) {
                        i += 1;
                    }

                    break;
                }

                const arrowBtn = block.arrowText && block.arrowLink
                    ? `<div class="reveal"><a href="${attr(block.arrowLink)}" class="btn btn-primary">${escapeText(block.arrowText)} <span>→</span></a></div>`
                    : '';

                elements.push(
                    `<section class="slide" style="padding-top: 9rem">` +
                    `<div class="geo-circle sm" style="top: 15%; right: 6%"></div>` +
                    `<div class="container">` +
                    `<span class="slide__label reveal">${escapeText(block.title)}</span>` +
                    `<h1 class="slide__headline reveal">${escapeText(block.title)}</h1>` +
                    `<p class="slide__subtitle reveal" style="margin-bottom: 2rem">${escapeText(block.desc)}</p>` +
                    arrowBtn +
                    `</div></section>`,
                );
                break;
            }

            case 'page.about-me-section':
            case 'pageAboutMeSection': {
                const contents = richTextNodes(block.contents).map((c: any) => getRichTextBlocks(c)).join('');

                const techs = (block.techs ?? []);
                const techStrip = techs.length > 0
                    ? fadeReveal(
                        `<div class="tech-strip-wrap" style="margin-top: 2.5rem"><div class="tech-strip">` +
                        [...techs, ...techs].map((tech: any, index: number) => {
                            const iconUrl = tech.icon?.url ? resolvePayloadMediaUrl(tech.icon.url) : '';
                            const icon = iconUrl
                                ? `<img src="${attr(iconUrl)}" alt="${attr(tech.icon?.alt || tech.title)}" width="24" height="24" />`
                                : `<span>${escapeText(tech.title?.slice(0, 1))}</span>`;
                            return `<div class="tech-item"><div class="tech-item-icon">${icon}</div><span class="tech-item-name">${escapeText(tech.title)}</span></div>`;
                        }).join('') +
                        `</div></div>`,
                    )
                    : '';

                const btn = block.btnText && block.btnLinks
                    ? fadeReveal(`<div style="margin-top: 2rem"><a href="${attr(block.btnLinks)}" class="btn btn-primary">${escapeText(block.btnText)} <span>→</span></a></div>`)
                    : '';

                elements.push(
                    `<section id="about" class="slide" style="padding-top: 9rem">` +
                    `<div class="geo-circle sm" style="top: 15%; right: 6%"></div>` +
                    `<div class="container">` +
                    fadeReveal(`<span class="slide__label">${escapeText(block.topTitle)}</span><h2 class="slide__headline">${escapeText(block.leftTitle)} ${escapeText(block.rightTitle)}</h2>`) +
                    fadeReveal(`<div class="about-bio">${contents}</div>`) +
                    techStrip +
                    btn +
                    `</div></section>`,
                );
                break;
            }

            case 'page.stats-section':
            case 'pageStatsSection': {
                const items = (block.items ?? []).map((item: any) => {
                    const match = String(item.value).match(/^(\d+)(\+?)$/);
                    const num = match ? parseInt(match[1], 10) : 0;
                    const suffix = match?.[2] ?? '';

                    const valueHtml = num > 0
                        ? countUp(num, suffix)
                        : `<div style="font-size: 4rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.04em; line-height: 1">${escapeText(item.value)}</div>`;

                    return `<div>${valueHtml}<div class="stat-label">${escapeText(item.label)}</div></div>`;
                }).join('');

                elements.push(
                    `<section class="slide">` +
                    `<div class="geo-circle sm"></div>` +
                    `<div class="container">` +
                    `${block.label ? `<span class="slide__label reveal">${escapeText(block.label)}</span>` : ''}` +
                    `${block.title ? `<h2 class="slide__headline reveal">${escapeText(block.title)}</h2>` : ''}` +
                    `${block.subtitle ? `<p class="slide__subtitle reveal" style="margin-bottom: 3rem">${escapeText(block.subtitle)}</p>` : ''}` +
                    `<div class="stats-grid reveal-stagger">${items}</div>` +
                    `</div></section>`,
                );
                break;
            }

            case 'page.tech-stack-section':
            case 'pageTechStackSection': {
                const items = (block.items ?? []).filter((item: any) => item.name);

                const strip = [...items, ...items].map((item: any) => {
                    const iconUrl = item.icon?.url ? resolvePayloadMediaUrl(item.icon.url) : '';
                    const icon = iconUrl
                        ? `<img src="${attr(iconUrl)}" alt="${attr(item.icon?.alt || item.name)}" width="24" height="24" />`
                        : `<span>${escapeText(item.name?.slice(0, 1))}</span>`;
                    return `<div class="tech-item"><div class="tech-item-icon">${icon}</div><span class="tech-item-name">${escapeText(item.name)}</span></div>`;
                }).join('');

                elements.push(
                    `<section class="slide slide--tinted">` +
                    `<div class="geo-dots" style="top: 0; right: 0; width: 300px; height: 100%"></div>` +
                    `<div class="container">` +
                    `${block.label ? `<span class="slide__label reveal">${escapeText(block.label)}</span>` : ''}` +
                    `${block.title ? `<h2 class="slide__headline reveal">${escapeText(block.title)}</h2>` : ''}` +
                    `${block.subtitle ? `<p class="slide__subtitle reveal" style="margin-bottom: 2.5rem">${escapeText(block.subtitle)}</p>` : ''}` +
                    `<div class="tech-strip-wrap reveal"><div class="tech-strip">${strip}</div></div>` +
                    `</div></section>`,
                );
                break;
            }

            case 'page.cta-section':
            case 'pageCtaSection': {
                const sectionClassName = [
                    getSectionToneClass(block.tone),
                    'slide--cta',
                    block.centered ? 'slide--cta-centered' : null,
                ].filter(Boolean).join(' ');
                const isDark = block.tone === 'dark';
                const textAlign = block.centered ? ' style="text-align: center"' : '';
                const subtitleStyle = block.centered ? 'margin: 0 auto 2rem' : 'margin-bottom: 2rem';
                const actionsClassName = block.centered ? 'reveal cta-row cta-row--centered' : 'reveal cta-row';

                const darkDeco = isDark
                    ? '<div class="geo-circle lg" style="border-color: rgba(245,243,239,0.06); top: -80px; right: -80px"></div><div class="geo-accent" style="top: auto; bottom: -100px; right: -80px"></div>'
                    : '';

                const label = block.label
                    ? `<span class="slide__label reveal"${isDark ? ' style="color: rgba(245,243,239,0.5)"' : ''}>${escapeText(block.label)}</span>`
                    : '';

                elements.push(
                    `<section class="${sectionClassName}"${textAlign}>` +
                    darkDeco +
                    `<div class="container">` +
                    label +
                    `${block.title ? `<h2 class="slide__headline reveal">${escapeText(block.title)}</h2>` : ''}` +
                    `${block.subtitle ? `<p class="slide__subtitle reveal" style="${subtitleStyle}">${escapeText(block.subtitle)}</p>` : ''}` +
                    `<div class="${actionsClassName}">` +
                    renderButtonLink(block.primaryButtonText, block.primaryButtonUrl, block.primaryButtonExternal, 'btn btn-primary') +
                    renderButtonLink(block.secondaryButtonText, block.secondaryButtonUrl, block.secondaryButtonExternal, 'btn btn-outline') +
                    `</div></div></section>`,
                );
                break;
            }

            case 'page.profile-section':
            case 'pageProfileSection': {
                const body = richTextNodes(block.body).map((c: any) => getRichTextBlocks(c)).join('');

                const details = (block.details ?? []).map((detail: any, detailIndex: number) =>
                    `<li><span class="info-label">${escapeText(detail.label)}</span><span class="info-value">${escapeText(detail.value)}</span></li>`,
                ).join('');

                const socialLinks = (block.socialLinks ?? []).length > 0
                    ? `<div class="social-links">${(block.socialLinks ?? []).map((link: any) =>
                        `<a href="${attr(link.url)}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${attr(link.label)}">${SocialIcon(link.label)}</a>`,
                    ).join('')}</div>`
                    : '';

                elements.push(
                    `<section class="slide"${block.topPadding ? ' style="padding-top: 9rem"' : ''}>` +
                    `<div class="geo-circle sm" style="top: 15%; right: 6%"></div>` +
                    `<div class="container">` +
                    `${block.label ? `<span class="slide__label reveal">${escapeText(block.label)}</span>` : ''}` +
                    `${block.title ? (block.topPadding ? `<h1 class="slide__headline reveal">${escapeText(block.title)}</h1>` : `<h2 class="slide__headline reveal">${escapeText(block.title)}</h2>`) : ''}` +
                    `${block.subtitle ? `<p class="slide__subtitle reveal" style="margin-bottom: 3rem">${escapeText(block.subtitle)}</p>` : ''}` +
                    `<div class="about-grid">` +
                    `<div class="about-bio reveal">${body}</div>` +
                    `<aside class="about-sidebar" style="position: sticky; top: 100px">` +
                    `<div class="info-card reveal">` +
                    `<div class="about-avatar">${UserAvatarIcon()}</div>` +
                    `${block.sidebarTitle ? `<p class="info-card__title">${escapeText(block.sidebarTitle)}</p>` : ''}` +
                    `<ul class="info-list">${details}</ul>` +
                    socialLinks +
                    `</div></aside></div></div></section>`,
                );
                break;
            }

            case 'page.skill-bars-section':
            case 'pageSkillBarsSection': {
                const groups = (block.groups ?? []).map((group: any) =>
                    `<div class="skill-bar-group">${(group.items ?? []).map((item: any) =>
                        `<div class="skill-bar"><span class="skill-bar-label">${escapeText(item.label)}</span><div class="skill-bar-track"><div class="skill-bar-fill" style="width: ${Number(item.value) || 0}%"></div></div></div>`,
                    ).join('')}</div>`,
                ).join('');

                elements.push(
                    `<section class="slide slide--tinted">` +
                    `<div class="geo-dots" style="top: 0; right: 0; width: 240px; height: 100%"></div>` +
                    `<div class="container">` +
                    `${block.label ? `<span class="slide__label reveal">${escapeText(block.label)}</span>` : ''}` +
                    `${block.title ? `<h2 class="slide__headline reveal">${escapeText(block.title)}</h2>` : ''}` +
                    `${block.subtitle ? `<p class="slide__subtitle reveal" style="margin-bottom: 2.5rem">${escapeText(block.subtitle)}</p>` : ''}` +
                    `<div class="skills-grid reveal">${groups}</div>` +
                    `</div></section>`,
                );
                break;
            }

            case 'page.card-grid-section':
            case 'pageCardGridSection': {
                const sectionClassName = getSectionToneClass(block.tone);
                const isDark = block.tone === 'dark';
                const cardClassName = isDark ? 'passion-card' : 'principle-card';
                const iconClassName = isDark ? 'passion-icon' : 'principle-icon';
                const titleClassName = isDark ? 'passion-title' : undefined;
                const descClassName = isDark ? 'passion-desc' : undefined;
                const gridClassName = isDark ? 'passions-grid reveal-stagger' : 'principles-grid reveal-stagger';

                const deco = isDark
                    ? '<div class="geo-circle lg" style="border-color: rgba(245,243,239,0.06); top: -80px; right: -80px"></div><div class="geo-accent" style="bottom: -100px; right: -80px"></div>'
                    : '<div class="geo-dots" style="top: 0; left: 0; width: 200px; height: 100%"></div>';

                const label = block.label
                    ? `<span class="slide__label reveal"${isDark ? ' style="color: rgba(245,243,239,0.6)"' : ''}>${escapeText(block.label)}</span>`
                    : '';

                const cards = (block.items ?? []).map((item: any, itemIndex: number) => {
                    const icon = CardGridIcon(block.tone, item.title) ?? `<span>${escapeText(item.iconText || `${itemIndex + 1}`)}</span>`;
                    const titleTag = isDark && titleClassName
                        ? `<h3 class="${titleClassName}">${escapeText(item.title)}</h3>`
                        : `<h3>${escapeText(item.title)}</h3>`;
                    const desc = descClassName
                        ? `<p class="${descClassName}">${escapeText(item.desc)}</p>`
                        : `<p>${escapeText(item.desc)}</p>`;
                    return `<div class="${cardClassName}"><div class="${iconClassName}">${icon}</div>${titleTag}${desc}</div>`;
                }).join('');

                elements.push(
                    `<section class="${sectionClassName}">` +
                    deco +
                    `<div class="container">` +
                    label +
                    `${block.title ? `<h2 class="slide__headline reveal">${escapeText(block.title)}</h2>` : ''}` +
                    `${block.subtitle ? `<p class="slide__subtitle reveal" style="margin-bottom: 3rem">${escapeText(block.subtitle)}</p>` : ''}` +
                    `<div class="${gridClassName}">${cards}</div>` +
                    `</div></section>`,
                );
                break;
            }

            case 'page.contact-methods-section':
            case 'pageContactMethodsSection': {
                const methods = (block.methods ?? []).map((method: any) => {
                    const external = method.url.startsWith('http');
                    const targetAttr = external ? ' target="_blank" rel="noopener noreferrer"' : '';
                    return `<a href="${attr(method.url)}"${targetAttr} class="contact-method"><div class="contact-method-icon">${ContactMethodIcon(method.label)}</div><div class="contact-method-text"><div class="contact-method-label">${escapeText(method.label)}</div><div class="contact-method-value">${escapeText(method.value)}</div></div></a>`;
                }).join('');

                elements.push(
                    `<section class="slide"${block.topPadding ? ' style="padding-top: 9rem"' : ''}>` +
                    `<div class="geo-circle lg" style="top: -100px; right: -100px"></div>` +
                    `<div class="geo-circle sm" style="bottom: 10%; left: 8%"></div>` +
                    `<div class="container">` +
                    `${block.label ? `<span class="slide__label reveal">${escapeText(block.label)}</span>` : ''}` +
                    `${block.title ? (block.topPadding ? `<h1 class="slide__headline reveal">${escapeText(block.title)}</h1>` : `<h2 class="slide__headline reveal">${escapeText(block.title)}</h2>`) : ''}` +
                    `${block.subtitle ? `<p class="slide__subtitle reveal" style="margin-bottom: 3rem">${escapeText(block.subtitle)}</p>` : ''}` +
                    `<div class="contact-grid">` +
                    `<div class="reveal"><div class="contact-methods">${methods}</div></div>` +
                    `<div class="reveal" style="display: flex; align-items: center; justify-content: center">` +
                    `<div class="contact-card">` +
                    `<div style="margin-bottom: 1rem">${CheckIcon()}</div>` +
                    `${block.cardTitle ? `<p style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1.25rem; font-weight: 600">${escapeText(block.cardTitle)}</p>` : ''}` +
                    `${block.cardDescription ? `<p style="color: var(--text-muted); font-size: 0.9375rem; line-height: 1.6; max-width: 260px">${escapeText(block.cardDescription)}</p>` : ''}` +
                    `</div></div></div></div></section>`,
                );
                break;
            }

            default:
                break;
        }
    }

    return elements.join('');
}

export { bgHeading };
