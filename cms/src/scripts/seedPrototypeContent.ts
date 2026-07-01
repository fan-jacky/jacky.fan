import { pathToFileURL } from 'url'

import { getPayload } from 'payload'

import configPromise from '../payload.config'

import { seedTechIcons } from './seedTechIcons'

type RichTextNode = {
  type: string
  [key: string]: unknown
}

function textNode(text: string, format = 0): RichTextNode {
  return {
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

function paragraph(children: RichTextNode[]): RichTextNode {
  return {
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  }
}

function heading(text: string, tag: 'h2' | 'h3' = 'h2'): RichTextNode {
  return {
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    type: 'heading',
    version: 1,
  }
}

function richTextFromNodes(nodes: RichTextNode[]) {
  return {
    root: {
      children: nodes,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root' as const,
      version: 1,
    },
  }
}

function richTextParagraphs(paragraphs: string[]) {
  return richTextFromNodes(paragraphs.map((item) => paragraph([textNode(item)])))
}

const pages = [
  {
    pageTitle: 'Jacky FAN',
    url: '/',
    metaDesc: 'Jacky FAN - Frontend Developer in Hong Kong. Building performant, accessible web experiences.',
    enableBgHeading: true,
    contents: [
      {
        blockType: 'pageHeroSection',
        title: 'Jacky Fan',
        desc: 'Crafting performant, accessible, and visually compelling web experiences with TypeScript, React, and Vue.',
        arrowText: 'View my work',
        arrowLink: '/projects',
      },
      {
        blockType: 'pageButton',
        name: 'Get in touch',
        url: '/contact',
        external: false,
      },
      {
        blockType: 'pageProjectGrid',
        label: 'Selected Work',
        title: 'Projects',
        subtitle: 'A few things I\'ve built - from tools to full websites.',
      },
      {
        blockType: 'pageStatsSection',
        label: 'By the Numbers',
        title: 'Experience',
        subtitle: 'What the last few years have looked like.',
        items: [
          { value: '4+', label: 'Years Experience' },
          { value: '20+', label: 'Projects Shipped' },
          { value: '15+', label: 'Articles Written' },
        ],
      },
      {
        blockType: 'pageTechStackSection',
        label: 'Tech Stack',
        title: 'What I Use',
        subtitle: 'Tools and technologies I reach for daily.',
        items: [
          { name: 'React' },
          { name: 'Vue' },
          { name: 'TypeScript' },
          { name: 'Next.js' },
          { name: 'Nuxt' },
          { name: 'Tailwind' },
          { name: 'Payload' },
          { name: 'Docker' },
          { name: 'Node.js' },
        ],
      },
      {
        blockType: 'pageCtaSection',
        tone: 'dark',
        label: 'Get in Touch',
        title: 'Let\'s work together',
        subtitle: 'I\'m always open to new projects, collaborations, or just a chat.',
        primaryButtonText: 'Get in touch',
        primaryButtonUrl: '/contact',
        primaryButtonExternal: false,
        secondaryButtonText: 'More about me',
        secondaryButtonUrl: '/about',
        secondaryButtonExternal: false,
      },
    ],
  },
  {
    pageTitle: 'Projects',
    url: '/projects',
    metaDesc: 'Projects by Jacky FAN.',
    enableBgHeading: true,
    contents: [
      {
        blockType: 'pageProjectGrid',
        label: 'My Work',
        title: 'Projects',
        subtitle: 'A showcase of what I\'ve built - websites, tools, and experiments.',
        topPadding: true,
      },
    ],
  },
  {
    pageTitle: 'About',
    url: '/about',
    metaDesc: 'About Jacky FAN - Frontend Developer in Hong Kong.',
    enableBgHeading: true,
    contents: [
      {
        blockType: 'pageProfileSection',
        label: 'Get to Know Me',
        title: 'About',
        subtitle: 'A frontend developer passionate about building things for the web.',
        topPadding: true,
        body: richTextParagraphs([
          'Hi, I\'m Jacky Fan - a Frontend Developer based in Hong Kong. I build responsive, accessible web experiences with TypeScript, React, Vue, and modern JavaScript frameworks.',
          'Currently expanding toward full-stack with Next.js, Nuxt, and Payload CMS. I believe in clean maintainable code and things that last.',
          'Beyond code, I\'m a street photographer (Ricoh GR IIIx) and self-hosting enthusiast. This blend of technical and creative thinking shapes everything I build.',
        ]),
        sidebarTitle: 'Details',
        details: [
          { label: 'Location', value: 'Hong Kong' },
          { label: 'Role', value: 'Frontend Developer' },
          { label: 'Focus', value: 'React, Vue, TypeScript' },
          { label: 'CMS', value: 'Payload CMS' },
          { label: 'Gear', value: 'Ricoh GR IIIx' },
        ],
        socialLinks: [
          { label: 'GitHub', url: 'https://github.com/redfrogsss' },
          { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jacky-fan-dev/' },
          { label: 'Blog', url: 'https://blog.jacky.fan' },
        ],
      },
      {
        blockType: 'pageSkillBarsSection',
        label: 'What I Work With',
        title: 'Core Skills',
        subtitle: 'Technologies I use daily to build and ship.',
        groups: [
          {
            items: [
              { label: 'TypeScript', value: 90 },
              { label: 'React', value: 85 },
              { label: 'Vue / Nuxt', value: 80 },
            ],
          },
          {
            items: [
              { label: 'Next.js', value: 75 },
              { label: 'Tailwind', value: 90 },
              { label: 'Docker', value: 60 },
            ],
          },
        ],
      },
      {
        blockType: 'pageCardGridSection',
        tone: 'dark',
        label: 'Beyond the Screen',
        title: 'What I Love',
        subtitle: 'When I\'m not writing code, you\'ll find me here.',
        items: [
          {
            iconText: 'PH',
            title: 'Street Photography',
            desc: 'I carry a Ricoh GR IIIx everywhere - the 40mm lens sees the city the way I do. Hong Kong streets, geometry, light, and unexpected moments. Photography keeps my eye sharp and my creative side alive.',
          },
          {
            iconText: 'SV',
            title: 'Self-Hosting',
            desc: 'I run my own servers - blogs, game servers, home automation. Docker Compose, Nginx reverse proxies, and a homelab that\'s always growing. Self-hosting taught me Linux, networking, and the satisfaction of building things that just work.',
          },
        ],
      },
      {
        blockType: 'pageCardGridSection',
        tone: 'tinted',
        label: 'How I Work',
        title: 'Principles',
        subtitle: 'The values that guide how I build.',
        items: [
          {
            iconText: '01',
            title: 'Clean & Maintainable',
            desc: 'I write code that the next developer can pick up and understand in minutes. Consistent patterns, clear naming, and just enough comments where they matter.',
          },
          {
            iconText: '02',
            title: 'Performance First',
            desc: 'Lighthouse scores and Core Web Vitals are not afterthoughts. Fast sites respect the user\'s time.',
          },
          {
            iconText: '03',
            title: 'Always Learning',
            desc: 'I\'m currently expanding from frontend into full-stack with Next.js, Nuxt, and Payload CMS. The web moves fast, staying curious is the only way to keep up.',
          },
        ],
      },
      {
        blockType: 'pageCtaSection',
        tone: 'default',
        centered: true,
        label: 'Let\'s Talk',
        title: 'Want to work together?',
        subtitle: 'I\'m always open to interesting projects, collaborations, or just a good conversation about tech and photography.',
        primaryButtonText: 'Get in touch',
        primaryButtonUrl: '/contact',
        secondaryButtonText: 'View my work',
        secondaryButtonUrl: '/projects',
      },
    ],
  },
  {
    pageTitle: 'Contact',
    url: '/contact',
    metaDesc: 'Get in touch with Jacky FAN.',
    enableBgHeading: true,
    contents: [
      {
        blockType: 'pageContactMethodsSection',
        label: 'Let\'s Talk',
        title: 'Contact',
        subtitle: 'I\'d love to hear from you - collaboration, project ideas, or just to say hi.',
        topPadding: true,
        methods: [
          { label: 'Email', value: 'contact@jacky.fan', url: 'mailto:contact@jacky.fan' },
          { label: 'GitHub', value: '@redfrogsss', url: 'https://github.com/redfrogsss' },
          { label: 'LinkedIn', value: 'jacky-fan-dev', url: 'https://www.linkedin.com/in/jacky-fan-dev/' },
          { label: 'Blog', value: 'blog.jacky.fan', url: 'https://blog.jacky.fan' },
        ],
        cardTitle: 'Let\'s build something',
        cardDescription: 'Always excited to collaborate on meaningful projects. Drop me a message!',
      },
    ],
  },
] as const

const projects = [
  {
    title: 'Technical Blog',
    alias: 'technical-blog',
    date: '2026-01-15T00:00:00.000Z',
    desc: 'A developer blog with editorial design, dark mode, and RSS - built to share what I learn, powered by a headless CMS.',
    tags: ['Personal Blog', 'AI'],
    cardStyle: 'blog',
    links: [
      { name: 'Visit the blog', links: 'https://blog.jacky.fan' },
      { name: 'Work with me', links: '/contact' },
    ],
    contents: [
      {
        blockType: 'projectOverviewSection',
        label: 'Overview',
        title: 'Why a blog?',
        subtitle: 'I wanted a space to document my learning, share technical insights, and experiment with modern frontend tooling - all in one place.',
        content: richTextFromNodes([
          paragraph([textNode('After years of reading other developers\' blogs, I decided to start my own. The goal was simple: '), textNode('write about things I learn as I learn them', 1), textNode(' - React patterns, TypeScript tricks, Docker workflows, and self-hosting adventures.')]),
          paragraph([textNode('But I did not want to use a hosted platform. I wanted full control over the design, the reading experience, and the stack. That meant '), textNode('building from scratch', 1), textNode(' with Nuxt 3 and Payload CMS.')]),
          paragraph([textNode('The result is an editorial blog with warm typography, generous whitespace, and a distraction-free reading mode - exactly the kind of reading experience I wish more technical blogs had.')]),
        ]),
        scopeTitle: 'Project Scope',
        scopeItems: [
          { label: 'Timeline', value: '3 months' },
          { label: 'Articles', value: '15+ published' },
          { label: 'Design', value: 'Editorial' },
          { label: 'CMS', value: 'Self-hosted' },
          { label: 'Status', value: 'Active' },
        ],
      },
      {
        blockType: 'projectsCarousel',
        label: 'Screenshots',
        title: 'A look inside',
        subtitle: 'From the article feed to individual posts - every page designed for readability.',
        name: 'Technical Blog Gallery',
        items: [
          { desc: 'Article grid - card-based layout with featured images' },
          { desc: 'Article detail - clean reading layout with wide prose column' },
          { desc: 'Development and build - fast DX with Nuxt 3 and Payload' },
          { desc: 'Payload CMS admin - self-hosted content management' },
        ],
      },
      {
        blockType: 'projectFeatureGridSection',
        label: 'Key Features',
        title: 'What makes it shine',
        subtitle: 'Every detail designed for a great reading and writing experience.',
        items: [
          { iconText: '01', title: 'Editorial Typography', desc: 'Inter for body text with carefully tuned line-height and spacing. Mono font for code blocks. Generous whitespace that lets content breathe.' },
          { iconText: '02', title: 'Dark Mode', desc: 'System-preference-aware dark mode with manual toggle. Every color variable re-mapped for comfortable nighttime reading.' },
          { iconText: '03', title: 'RSS Feed', desc: 'Auto-generated RSS feed with full article content so readers can subscribe with any feed reader.' },
          { iconText: '04', title: 'SSR with Nuxt 3', desc: 'Server-side rendering for instant first paint and SEO-friendly content. Pages load fast and index well.' },
          { iconText: '05', title: 'Self-Hosted CMS', desc: 'Payload CMS running on my own server with full data ownership and a clean admin UI for content creation.' },
          { iconText: '06', title: 'Responsive Design', desc: 'Adaptive grid layouts that flow from 3-column desktop to single-column mobile. Same great reading experience everywhere.' },
        ],
      },
      {
        blockType: 'projectTechStackSection',
        label: 'Tech Stack',
        title: 'Built with',
        subtitle: 'A modern stack chosen for performance, developer experience, and longevity.',
        items: [
          { label: 'Nuxt 3' },
          { label: 'TypeScript' },
          { label: 'Payload CMS' },
          { label: 'Tailwind CSS' },
          { label: 'Node.js' },
          { label: 'Docker' },
        ],
        primaryButtonText: 'Visit the blog',
        primaryButtonUrl: 'https://blog.jacky.fan',
        primaryButtonExternal: true,
        secondaryButtonText: 'Work with me',
        secondaryButtonUrl: '/contact',
      },
      {
        blockType: 'projectCtaSection',
        label: 'Continue Exploring',
        title: 'Want to see more?',
        subtitle: 'Browse the full project gallery or get in touch - I\'m always building something new.',
        primaryButtonText: 'Browse all projects',
        primaryButtonUrl: '/projects',
        secondaryButtonText: 'Get in touch',
        secondaryButtonUrl: '/contact',
      },
    ],
  },
  {
    title: 'Portfolio v2',
    alias: 'portfolio-v2',
    date: '2026-02-01T00:00:00.000Z',
    desc: 'Modern portfolio with warm editorial design and responsive layout.',
    tags: ['Personal Website'],
    cardStyle: 'portfolio',
    links: [{ name: 'Discuss a redesign', links: '/contact' }],
    contents: [
      {
        blockType: 'projectOverviewSection',
        label: 'Overview',
        title: 'Why this redesign?',
        subtitle: 'A more intentional version of my portfolio focused on clarity and visual rhythm.',
        content: richTextParagraphs([
          'This version was built to present work with more confidence and less clutter. The goal was to make the site feel designed rather than assembled.',
          'Compared to the previous iteration, the visual system is tighter: a warmer palette, stronger type hierarchy, and components that feel related across pages.',
        ]),
        scopeTitle: 'Project Scope',
        scopeItems: [
          { label: 'Role', value: 'Design + Development' },
          { label: 'Focus', value: 'Brand refresh' },
          { label: 'Framework', value: 'Next.js' },
          { label: 'Motion', value: 'Subtle' },
          { label: 'Status', value: 'Live' },
        ],
      },
      {
        blockType: 'projectFeatureGridSection',
        label: 'Key Features',
        title: 'What changed',
        subtitle: 'A smaller set of stronger decisions.',
        items: [
          { iconText: '01', title: 'Intentional layout', desc: 'Sections are paced to tell a clearer story about skills, work, and contact.' },
          { iconText: '02', title: 'Shared design system', desc: 'Global tokens and reusable patterns keep every page visually consistent.' },
          { iconText: '03', title: 'Accessible motion', desc: 'Animations reinforce hierarchy without making the UI feel noisy or brittle.' },
        ],
      },
      {
        blockType: 'projectTechStackSection',
        label: 'Tech Stack',
        title: 'Built with',
        subtitle: 'Modern frontend tools with a CMS-backed content model.',
        items: [
          { label: 'Next.js' },
          { label: 'TypeScript' },
          { label: 'Tailwind CSS' },
          { label: 'Payload CMS' },
        ],
        primaryButtonText: 'Discuss a redesign',
        primaryButtonUrl: '/contact',
      },
    ],
  },
  {
    title: 'Minecraft Server',
    alias: 'minecraft-server',
    date: '2025-12-01T00:00:00.000Z',
    desc: 'Self-hosted Minecraft server using Docker Compose.',
    tags: ['Side Project'],
    cardStyle: 'terminal',
    links: [{ name: 'Ask about infra work', links: '/contact' }],
    contents: [
      {
        blockType: 'projectOverviewSection',
        label: 'Overview',
        title: 'Why host it myself?',
        subtitle: 'A practical ops project disguised as a game server.',
        content: richTextParagraphs([
          'This project started as a small server for friends and became a practical exercise in container orchestration, backups, and uptime monitoring.',
          'The emphasis was not just on getting a game server running, but on making it maintainable enough to trust over time.',
        ]),
        scopeTitle: 'Project Scope',
        scopeItems: [
          { label: 'Infrastructure', value: 'Docker Compose' },
          { label: 'Monitoring', value: 'Basic health checks' },
          { label: 'Audience', value: 'Private community' },
          { label: 'Status', value: 'Maintained' },
        ],
      },
      {
        blockType: 'projectFeatureGridSection',
        label: 'Key Features',
        title: 'Operational highlights',
        subtitle: 'The parts that made it maintainable.',
        items: [
          { iconText: '01', title: 'Containerized runtime', desc: 'Repeatable setup with clear environment boundaries and version control.' },
          { iconText: '02', title: 'Operational hygiene', desc: 'Backups, logs, and restart flows were treated as first-class concerns.' },
          { iconText: '03', title: 'Low-friction maintenance', desc: 'The stack is simple enough to maintain without requiring heavyweight tooling.' },
        ],
      },
      {
        blockType: 'projectTechStackSection',
        label: 'Tech Stack',
        title: 'Built with',
        subtitle: 'Simple tools, stable operations.',
        items: [
          { label: 'Docker Compose' },
          { label: 'Linux' },
          { label: 'Nginx' },
        ],
        primaryButtonText: 'Ask about infra work',
        primaryButtonUrl: '/contact',
      },
    ],
  },
  {
    title: 'Portfolio v1',
    alias: 'portfolio-v1',
    date: '2025-07-01T00:00:00.000Z',
    desc: 'First iteration with Locomotive Scroll and DaisyUI.',
    tags: ['Personal Website'],
    cardStyle: 'portfolio',
    links: [{ name: 'See newer work', links: '/projects' }],
    contents: [
      {
        blockType: 'projectOverviewSection',
        label: 'Overview',
        title: 'What version one taught me',
        subtitle: 'The first pass that set the baseline.',
        content: richTextParagraphs([
          'This project established the base content model, project structure, and deployment flow that later redesigns could build on.',
          'It also helped surface which interactions were actually valuable and which were just visual noise.',
        ]),
        scopeTitle: 'Project Scope',
        scopeItems: [
          { label: 'Iteration', value: 'v1' },
          { label: 'UI stack', value: 'DaisyUI' },
          { label: 'Motion', value: 'Experimental' },
          { label: 'Status', value: 'Archived' },
        ],
      },
      {
        blockType: 'projectFeatureGridSection',
        label: 'Key Features',
        title: 'Core takeaways',
        subtitle: 'The foundations that still mattered later.',
        items: [
          { iconText: '01', title: 'Fast iteration', desc: 'A flexible base for testing layout and interaction ideas quickly.' },
          { iconText: '02', title: 'CMS integration', desc: 'Established a pattern for content-driven pages and project entries.' },
          { iconText: '03', title: 'Animation experiments', desc: 'Explored scroll-heavy presentation patterns before simplifying later.' },
        ],
      },
      {
        blockType: 'projectTechStackSection',
        label: 'Tech Stack',
        title: 'Built with',
        subtitle: 'A first-generation portfolio stack.',
        items: [
          { label: 'Next.js' },
          { label: 'DaisyUI' },
          { label: 'Locomotive Scroll' },
        ],
        primaryButtonText: 'See newer work',
        primaryButtonUrl: '/projects',
      },
    ],
  },
  {
    title: 'force-use-npm',
    alias: 'force-use-npm',
    date: '2025-10-01T00:00:00.000Z',
    desc: 'Enforce a specific package manager in your project.',
    tags: ['Side Project'],
    cardStyle: 'code',
    links: [{ name: 'Discuss tooling work', links: '/contact' }],
    contents: [
      {
        blockType: 'projectOverviewSection',
        label: 'Overview',
        title: 'Why build a tiny tool?',
        subtitle: 'Small utilities can remove recurring team friction.',
        content: richTextParagraphs([
          'Tiny tooling projects are a good way to solve recurring workflow annoyances with a clear boundary and a measurable result.',
          'This one prevents accidental mismatches in package manager usage, reducing avoidable install and lockfile churn.',
        ]),
        scopeTitle: 'Project Scope',
        scopeItems: [
          { label: 'Type', value: 'Package' },
          { label: 'Audience', value: 'Developers' },
          { label: 'Complexity', value: 'Small utility' },
          { label: 'Status', value: 'Published' },
        ],
      },
      {
        blockType: 'projectFeatureGridSection',
        label: 'Key Features',
        title: 'What it solves',
        subtitle: 'A narrow tool with a clear purpose.',
        items: [
          { iconText: '01', title: 'Lightweight enforcement', desc: 'Minimal setup with an immediate signal when the wrong tool is used.' },
          { iconText: '02', title: 'Repository hygiene', desc: 'Cuts down on accidental lockfile divergence across teams.' },
          { iconText: '03', title: 'Clear intent', desc: 'Encodes project expectations directly into the developer workflow.' },
        ],
      },
      {
        blockType: 'projectTechStackSection',
        label: 'Tech Stack',
        title: 'Built with',
        subtitle: 'Plain Node.js and CLI ergonomics.',
        items: [
          { label: 'Node.js' },
          { label: 'npm' },
          { label: 'CLI' },
        ],
        primaryButtonText: 'Discuss tooling work',
        primaryButtonUrl: '/contact',
      },
    ],
  },
  {
    title: 'Game Server Infra',
    alias: 'game-server-infra',
    date: '2025-11-01T00:00:00.000Z',
    desc: 'Self-hosted game servers on Linux - setup and maintenance.',
    tags: ['Side Project'],
    cardStyle: 'terminal',
    links: [{ name: 'Talk infrastructure', links: '/contact' }],
    contents: [
      {
        blockType: 'projectOverviewSection',
        label: 'Overview',
        title: 'Why this work matters',
        subtitle: 'Reliable self-hosting is mostly fundamentals.',
        content: richTextParagraphs([
          'This work spans more than a single app: service orchestration, proxies, backups, and the boring tasks that make self-hosting reliable.',
          'It reflects the same bias I bring to frontend work: smooth experience comes from getting fundamentals right.',
        ]),
        scopeTitle: 'Project Scope',
        scopeItems: [
          { label: 'Environment', value: 'Linux VPS / homelab' },
          { label: 'Services', value: 'Multiple game stacks' },
          { label: 'Ops model', value: 'Hands-on maintenance' },
          { label: 'Status', value: 'Ongoing' },
        ],
      },
      {
        blockType: 'projectFeatureGridSection',
        label: 'Key Features',
        title: 'What it includes',
        subtitle: 'Ops work that keeps services dependable.',
        items: [
          { iconText: '01', title: 'Service orchestration', desc: 'Repeatable setup patterns for containers and supporting infrastructure.' },
          { iconText: '02', title: 'Practical monitoring', desc: 'Enough visibility to keep things healthy without overbuilding observability.' },
          { iconText: '03', title: 'Maintenance workflows', desc: 'Updates and recovery paths are designed to be routine, not dramatic.' },
        ],
      },
      {
        blockType: 'projectTechStackSection',
        label: 'Tech Stack',
        title: 'Built with',
        subtitle: 'Foundational infrastructure tools.',
        items: [
          { label: 'Linux' },
          { label: 'Docker' },
          { label: 'Nginx' },
          { label: 'Systemd' },
        ],
        primaryButtonText: 'Talk infrastructure',
        primaryButtonUrl: '/contact',
      },
    ],
  },
] as const

async function upsertPage(payload: Awaited<ReturnType<typeof getPayload>>, page: (typeof pages)[number]) {
  const existing = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    where: {
      url: {
        equals: page.url,
      },
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    ...page,
    _status: 'published',
  }

  if (existing.docs.length > 1) {
    for (const duplicate of existing.docs.slice(1)) {
      await payload.delete({
        id: duplicate.id,
        collection: 'pages',
        overrideAccess: true,
      })
    }
  }

  if (existing.docs[0]) {
    return payload.update({
      id: existing.docs[0].id,
      collection: 'pages',
      data,
      draft: false,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'pages',
    data,
    draft: false,
    overrideAccess: true,
  })
}

async function upsertProject(payload: Awaited<ReturnType<typeof getPayload>>, project: (typeof projects)[number]) {
  const existing = await payload.find({
    collection: 'projects',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    where: {
      alias: {
        equals: project.alias,
      },
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    ...project,
    _status: 'published',
  }

  if (existing.docs.length > 1) {
    for (const duplicate of existing.docs.slice(1)) {
      await payload.delete({
        id: duplicate.id,
        collection: 'projects',
        overrideAccess: true,
      })
    }
  }

  if (existing.docs[0]) {
    return payload.update({
      id: existing.docs[0].id,
      collection: 'projects',
      data,
      draft: false,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'projects',
    data,
    draft: false,
    overrideAccess: true,
  })
}

export async function seedPrototypeContent() {
  const config = await configPromise
  const payload = await getPayload({ config })

  const pageDocs = new Map<string, string>()

  for (const page of pages) {
    const doc = await upsertPage(payload, page)
    pageDocs.set(page.url, String(doc.id))
  }

  for (const project of projects) {
    await upsertProject(payload, project)
  }

  await payload.updateGlobal({
    slug: 'site_settings',
    data: {
      sitename: 'Jacky FAN',
      siteDesc: 'Frontend Developer in Hong Kong',
      siteLogoText: 'Jacky FAN',
      menuItem: [
        { name: 'Home', page: pageDocs.get('/') },
        { name: 'Projects', page: pageDocs.get('/projects') },
        { name: 'About', page: pageDocs.get('/about') },
      ],
      footerText: richTextParagraphs(['Hong Kong frontend developer building thoughtful web experiences.']),
      showNightModeToggle: true,
      showMenuQuickLinksMenu: true,
      quickLinks: [
        { name: 'GitHub', url: 'https://github.com/redfrogsss' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jacky-fan-dev/' },
        { name: 'Blog', url: 'https://blog.jacky.fan' },
      ],
      _status: 'published',
    },
    draft: false,
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'project_page_settings',
    data: {
      label: 'My Work',
      title: 'Projects',
      subtitle: 'A showcase of what I\'ve built - websites, tools, and experiments.',
      topPadding: true,
      metaTitle: 'Projects - Jacky FAN',
      metaDesc: 'Projects by Jacky FAN.',
      _status: 'published',
    },
    draft: false,
    overrideAccess: true,
  })

  payload.logger.info('Prototype content seeded into Payload CMS.')

  // Seed tech icons for the "What I Use" section
  try {
    await seedTechIcons()
  } catch (err) {
    payload.logger.warn(`Failed to seed tech icons: ${err instanceof Error ? err.message : String(err)}`)
  }
}

async function main() {
  await seedPrototypeContent()
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch((error) => {
      console.error(error)
      process.exitCode = 1
    })
    .finally(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
}