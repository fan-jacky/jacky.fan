import { resolvePayloadMediaUrl } from './api';
import { getRichTextBlocks, richTextNodes, attr, escapeHtml } from './rich-text';
import type { ProjectDocument } from './types';

function sectionContainer(inner: string, opts: { topSpacing?: boolean; extraClassName?: string } = {}) {
  const { topSpacing = true, extraClassName = '' } = opts;
  const spacing = topSpacing ? 'my-12 md:my-16' : 'mb-12 md:mb-16';
  return `<section class="section-shell${extraClassName ? ` ${extraClassName}` : ''}"><div class="section-shell__container container ${spacing} xl:pr-[30%] 2xl:pr-[20%]">${inner}</div></section>`;
}

export function renderProjectDetail(project: ProjectDocument): string {
  const { title, desc, img } = project;
  const tags = project.tags ?? [];
  const links = project.links ?? [];
  const contents = project.contents ?? [];
  const imageUrl = resolvePayloadMediaUrl(typeof img === 'string' ? img : img?.url ?? '');

  const overviewSection = contents.find((block: any) => block?.blockType === 'projectOverviewSection');
  const featureSection = contents.find((block: any) => block?.blockType === 'projectFeatureGridSection');
  const stackSection = contents.find((block: any) => block?.blockType === 'projectTechStackSection');
  const ctaSection = contents.find((block: any) => block?.blockType === 'projectCtaSection');

  const richSections = contents
    .filter((block: any) => block?.blockType === 'projectContents')
    .map((block: any, index: number) => ({
      name: block.name ?? `Section ${index + 1}`,
      content: richTextNodes(block.contents),
    }));

  const carouselBlocks = contents.filter((block: any) => block?.blockType === 'projectsCarousel');
  const galleryItems = carouselBlocks.flatMap((block: any) => block.items ?? []);

  const overviewContent = richTextNodes(overviewSection?.content);
  const displayScope = (overviewSection?.scopeItems ?? []).filter((item: any) => item?.label && item?.value);
  const displayFeatures = (featureSection?.items ?? []).filter((item: any) => item?.title && item?.desc);
  const displayStack = (stackSection?.items ?? []).map((item: any) => ({
    label: item?.label ?? '',
    iconUrl: item?.icon ? resolvePayloadMediaUrl(typeof item.icon === 'string' ? item.icon : item.icon?.url ?? '') : '',
  })).filter((item: any) => item.label);
  const primaryLinks = links.filter((link) => link?.links).map((link) => ({ href: link.links as string, label: link.name ?? 'Open link', primary: false }));

  const stackButtons = [
    stackSection?.primaryButtonText && stackSection?.primaryButtonUrl
      ? { href: stackSection.primaryButtonUrl, label: stackSection.primaryButtonText, external: Boolean(stackSection.primaryButtonExternal), primary: true }
      : null,
    stackSection?.secondaryButtonText && stackSection?.secondaryButtonUrl
      ? { href: stackSection.secondaryButtonUrl, label: stackSection.secondaryButtonText, external: Boolean(stackSection.secondaryButtonExternal), primary: false }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; external: boolean; primary: boolean }>;

  const ctaButtons = [
    ctaSection?.primaryButtonText && ctaSection?.primaryButtonUrl
      ? { href: ctaSection.primaryButtonUrl, label: ctaSection.primaryButtonText, external: Boolean(ctaSection.primaryButtonExternal), primary: true }
      : null,
    ctaSection?.secondaryButtonText && ctaSection?.secondaryButtonUrl
      ? { href: ctaSection.secondaryButtonUrl, label: ctaSection.secondaryButtonText, external: Boolean(ctaSection.secondaryButtonExternal), primary: false }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; external: boolean; primary: boolean }>;

  const parts: string[] = [];

  // ── Hero ──
  const heroImage = imageUrl
    ? `<div class="browser-frame__body"><img src="${attr(imageUrl)}" alt="${attr(title ?? 'Project image')}" class="object-cover object-top" style="position: absolute; inset: 0; width: 100%; height: 100%;" /></div>`
    : '<div class="project-detail__mockup-gradient"></div>';

  parts.push(
    `<section class="slide project-detail project-detail--hero">` +
    `<div class="geo-circle sm" style="top: 10%; right: 8%"></div>` +
    `<div class="container">` +
    `<a href="/projects" class="project-detail__back-link"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="project-detail__back-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>Back to Projects</a>` +
    `<div class="project-detail__tags">${tags.map((tag, index) => `<span class="project-detail__tag">${escapeHtml(tag ?? '')}</span>`).join('')}</div>` +
    `<h2 class="slide__headline reveal" style="margin-bottom: 0.5rem">${escapeHtml(title ?? '')}</h2>` +
    `<p class="project-detail__subtitle reveal">${escapeHtml(desc ?? '')}</p>` +
    `<div class="project-detail__mockup reveal">${heroImage}</div>` +
    `</div></section>`,
  );

  // ── Overview ──
  const overviewBody = overviewContent.length > 0
    ? overviewContent.map((contentBlock: any) => getRichTextBlocks(contentBlock)).join('')
    : desc ? `<p>${escapeHtml(desc)}</p>` : '';

  parts.push(
    `<section class="slide slide--tinted">` +
    `<div class="geo-dots" style="top: 0; right: 0; width: 280px; height: 100%"></div>` +
    `<div class="container">` +
    `<span class="slide__label reveal">${escapeHtml(overviewSection?.label ?? 'Overview')}</span>` +
    `<h2 class="slide__headline reveal">${escapeHtml(overviewSection?.title ?? 'Why this project?')}</h2>` +
    `<p class="slide__subtitle reveal" style="margin-bottom: 3rem">${escapeHtml(overviewSection?.subtitle ?? 'The context, constraints, and value behind the work.')}</p>` +
    `<div class="about-grid reveal">` +
    `<div class="about-bio">${overviewBody}</div>` +
    `<aside class="about-sidebar">` +
    `<div class="info-card reveal">` +
    `<h3>${escapeHtml(overviewSection?.scopeTitle ?? 'Project Scope')}</h3>` +
    `<ul class="info-list">${displayScope.map((item: any) => `<li><span class="info-label">${escapeHtml(item.label)}</span><span class="info-value">${escapeHtml(item.value)}</span></li>`).join('')}</ul>` +
    `</div></aside></div></div></section>`,
  );

  // ── Gallery ──
  if (galleryItems.length > 0) {
    const carouselBlock = carouselBlocks[0];
    const gallery = galleryItems.map((item: any, index: number) => {
      const mediaUrl = resolvePayloadMediaUrl(typeof item?.media === 'string' ? item.media : item?.media?.url ?? '');
      const isVideo = mediaUrl ? /\.(webm|mp4)(\?|$)/i.test(mediaUrl) : false;

      let body: string;
      if (mediaUrl && isVideo) {
        body = `<video src="${attr(mediaUrl)}" autoplay loop muted playsinline class="browser-frame__video"></video>`;
      } else if (mediaUrl) {
        body = `<img src="${attr(mediaUrl)}" alt="${attr(item?.desc ?? 'Project screenshot')}" class="object-cover object-top" style="position: absolute; inset: 0; width: 100%; height: 100%;" loading="lazy" />`;
      } else {
        body = '<div class="browser-frame__placeholder"><div class="browser-frame__placeholder-grid"><div class="browser-frame__placeholder-column"><div class="browser-frame__placeholder-image"></div><div class="browser-frame__placeholder-line"></div></div><div class="browser-frame__placeholder-column"><div class="browser-frame__placeholder-image"></div><div class="browser-frame__placeholder-line"></div></div></div></div>';
      }

      return `<div class="browser-frame"><div class="browser-frame__body">${body}</div><div class="browser-frame__caption">${escapeHtml(item?.desc ?? 'Project media')}</div></div>`;
    }).join('');

    parts.push(
      `<section class="slide">` +
      `<div class="geo-circle md" style="bottom: -30px; right: -40px"></div>` +
      `<div class="container">` +
      `<span class="slide__label reveal">${escapeHtml(carouselBlock?.label ?? 'Screenshots')}</span>` +
      `<h2 class="slide__headline reveal">${escapeHtml(carouselBlock?.title ?? 'A look inside')}</h2>` +
      `<p class="slide__subtitle reveal" style="margin-bottom: 2.5rem">${escapeHtml(carouselBlock?.subtitle ?? 'Key screens and visuals from the implementation.')}</p>` +
      `<div class="browser-frame-gallery reveal-stagger">${gallery}</div>` +
      `</div></section>`,
    );
  }

  // ── Features ──
  if (displayFeatures.length > 0) {
    const features = displayFeatures.map((feature: any, index: number) =>
      `<div class="project-feature"><div class="project-feature-icon"><span>${escapeHtml(feature.iconText ?? String(index + 1))}</span></div><h4>${escapeHtml(feature.title)}</h4><p>${escapeHtml(feature.desc)}</p></div>`,
    ).join('');

    parts.push(
      `<section class="slide slide--tinted">` +
      `<div class="geo-dots" style="top: 0; right: 0; width: 240px; height: 100%"></div>` +
      `<div class="container">` +
      `<span class="slide__label reveal">${escapeHtml(featureSection?.label ?? 'Key Features')}</span>` +
      `<h2 class="slide__headline reveal">${escapeHtml(featureSection?.title ?? 'What makes it shine')}</h2>` +
      `<p class="slide__subtitle reveal" style="margin-bottom: 3rem">${escapeHtml(featureSection?.subtitle ?? 'The parts of the implementation worth calling out.')}</p>` +
      `<div class="project-features reveal-stagger">${features}</div>` +
      `</div></section>`,
    );
  }

  // ── Build notes ──
  if (richSections.length > 0) {
    const sections = richSections.map((section) =>
      `<div style="margin-bottom: 2rem"><h3 style="margin-bottom: 1rem">${escapeHtml(section.name)}</h3><article class="prose max-w-none">${section.content.map((contentBlock: any) => getRichTextBlocks(contentBlock)).join('')}</article></div>`,
    ).join('');

    parts.push(
      sectionContainer(
        `<span class="slide__label reveal">Build Notes</span>` +
        `<h2 class="slide__headline reveal">Implementation details</h2>` +
        `<div class="about-bio reveal" style="max-width: 760px">${sections}</div>`,
        { topSpacing: false, extraClassName: 'py-12 md:py-16' },
      ),
    );
  }

  // ── Tech stack ──
  if (displayStack.length > 0) {
    const stackItems = displayStack.map((item: any) =>
      item.iconUrl
        ? `<div class="tech-stack-grid__item"><img src="${attr(item.iconUrl)}" alt="${attr(item.label)}" width="24" height="24" loading="lazy" /><span>${escapeHtml(item.label)}</span></div>`
        : `<div class="tech-stack-grid__item"><span class="tech-stack-grid__icon-placeholder">${escapeHtml(item.label.slice(0, 2).toUpperCase())}</span><span>${escapeHtml(item.label)}</span></div>`,
    ).join('');

    const buttons = (stackButtons.length > 0 ? stackButtons : primaryLinks).map((link, index) => {
      const external = link.href.startsWith('http');
      const cls = link.primary || index === 0 ? 'btn btn-primary' : 'btn btn-outline';
      const targetAttr = external ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${attr(link.href)}"${targetAttr} class="${cls}">${escapeHtml(link.label)}</a>`;
    }).join('');

    const buttonsRow = (stackButtons.length > 0 || primaryLinks.length > 0)
      ? `<div class="reveal" style="margin-top: 3rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center">${buttons}</div>`
      : '';

    parts.push(
      `<section class="slide">` +
      `<div class="geo-circle md" style="top: 0; left: -40px"></div>` +
      `<div class="container">` +
      `<span class="slide__label reveal">${escapeHtml(stackSection?.label ?? 'Tech Stack')}</span>` +
      `<h2 class="slide__headline reveal">${escapeHtml(stackSection?.title ?? 'Built with')}</h2>` +
      `<p class="slide__subtitle reveal" style="margin-bottom: 2.5rem">${escapeHtml(stackSection?.subtitle ?? 'The tools chosen for performance, DX, and maintainability.')}</p>` +
      `<div class="tech-stack-grid reveal-stagger">${stackItems}</div>` +
      buttonsRow +
      `</div></section>`,
    );
  }

  // ── CTA ──
  if (ctaSection) {
    const buttons = ctaButtons.map((link) => {
      const cls = link.primary ? 'btn btn-primary' : 'btn btn-outline';
      const targetAttr = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${attr(link.href)}"${targetAttr} class="${cls}">${escapeHtml(link.label)}</a>`;
    }).join('');

    parts.push(
      `<section class="slide slide--dark">` +
      `<div class="geo-circle lg" style="border-color: rgba(245,243,239,0.06); top: -80px; right: -80px"></div>` +
      `<div class="geo-accent" style="top: auto; bottom: -100px; left: -80px"></div>` +
      `<div class="container">` +
      `<span class="slide__label reveal" style="color: rgba(245,243,239,0.5)">${escapeHtml(ctaSection.label ?? '')}</span>` +
      `<h2 class="slide__headline reveal">${escapeHtml(ctaSection.title ?? '')}</h2>` +
      `<p class="slide__subtitle reveal" style="margin-bottom: 2rem">${escapeHtml(ctaSection.subtitle ?? '')}</p>` +
      `<div class="reveal" style="display: flex; gap: 0.75rem; flex-wrap: wrap">${buttons}</div>` +
      `</div></section>`,
    );
  }

  return parts.join('');
}

export type { ProjectDocument };
