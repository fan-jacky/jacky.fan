/**
 * Content block types from Strapi
 */

export type PageContentType = 
  | PageRichTextBlock
  | PageHeadingBlock
  | PageButtonBlock
  | PageProjectGridBlock
  | PageContactFormBlock
  | Page3DLetterBlock
  | PageHeroSectionBlock
  | PageAboutMeSectionBlock
  | PageStatsSectionBlock
  | PageTechStackSectionBlock
  | PageCtaSectionBlock
  | PageProfileSectionBlock
  | PageSkillBarsSectionBlock
  | PageCardGridSectionBlock
  | PageContactMethodsSectionBlock;

export interface PageRichTextBlock {
  __component: 'page.page-rich-text';
  content: any[];
}

export interface PageHeadingBlock {
  __component: 'page.page-heading';
  topTitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  colorReverse?: boolean;
}

export interface PageButtonBlock {
  __component: 'page.button';
  name: string;
  url: string;
  external: boolean;
}

export interface PageProjectGridBlock {
  __component: 'page.project-grid';
  label?: string;
  title?: string;
  subtitle?: string;
  topPadding?: boolean;
}

export interface PageContactFormBlock {
  __component: 'page.contact-form';
  title: string;
}

export interface Page3DLetterBlock {
  __component: 'page.3-d-letter';
  enable: boolean;
}

export interface PageHeroSectionBlock {
  __component: 'page.hero-section';
  title: string;
  desc: string;
  arrowText: string;
  arrowLink: string;
}

export interface PageAboutMeSectionBlock {
  __component: 'page.about-me-section';
  topTitle: string;
  leftTitle: string;
  rightTitle: string;
  contents: any[];
  techs: any[];
  btnLinks: string;
  btnText: string;
}

export interface PageStatsSectionBlock {
  __component: 'page.stats-section';
  label?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{
    value: string;
    label: string;
  }>;
}

export interface PageTechStackSectionBlock {
  __component: 'page.tech-stack-section';
  label?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{
    name: string;
  }>;
}

export interface PageCtaSectionBlock {
  __component: 'page.cta-section';
  tone?: 'default' | 'tinted' | 'dark';
  centered?: boolean;
  label?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  primaryButtonExternal?: boolean;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  secondaryButtonExternal?: boolean;
}

export interface PageProfileSectionBlock {
  __component: 'page.profile-section';
  label?: string;
  title?: string;
  subtitle?: string;
  topPadding?: boolean;
  body?: any[];
  sidebarTitle?: string;
  details?: Array<{
    label: string;
    value: string;
  }>;
  socialLinks?: Array<{
    label: string;
    url: string;
  }>;
}

export interface PageSkillBarsSectionBlock {
  __component: 'page.skill-bars-section';
  label?: string;
  title?: string;
  subtitle?: string;
  groups?: Array<{
    items?: Array<{
      label: string;
      value: number;
    }>;
  }>;
}

export interface PageCardGridSectionBlock {
  __component: 'page.card-grid-section';
  tone?: 'default' | 'tinted' | 'dark';
  label?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{
    iconText?: string;
    title: string;
    desc: string;
  }>;
}

export interface PageContactMethodsSectionBlock {
  __component: 'page.contact-methods-section';
  label?: string;
  title?: string;
  subtitle?: string;
  topPadding?: boolean;
  methods?: Array<{
    label: string;
    value: string;
    url: string;
  }>;
  cardTitle?: string;
  cardDescription?: string;
}
