export type MockupKind = 'blog' | 'portfolio' | 'terminal' | 'code'

export type StaticPortfolioProject = {
  slug: string
  title: string
  shortDescription: string
  heroDescription: string
  tags: string[]
  mockup: MockupKind
  overview: string[]
  scope: Array<{ label: string; value: string }>
  features: Array<{ title: string; description: string }>
  stack: string[]
  links: Array<{ href: string; label: string }>
}

export const staticProjects: StaticPortfolioProject[] = [
  {
    slug: 'technical-blog',
    title: 'Technical Blog',
    shortDescription: 'Editorial blog with dark mode, RSS, and Payload CMS integration.',
    heroDescription:
      'A developer blog with editorial design, dark mode, and RSS — built to share what I learn, powered by a headless CMS.',
    tags: ['Nuxt 3', 'Payload CMS', 'TypeScript', 'RSS', 'Dark Mode'],
    mockup: 'blog',
    overview: [
      'After years of reading other developers\' blogs, I decided to build one from scratch so I could control the reading experience, the stack, and the publishing workflow.',
      'The site focuses on readable typography, clean structure, and a self-hosted CMS setup that keeps content ownership local while still making publishing easy.',
      'It also serves as a testing ground for patterns around content modeling, frontend performance, and long-form technical writing.',
    ],
    scope: [
      { label: 'Timeline', value: '3 months' },
      { label: 'Articles', value: '15+ published' },
      { label: 'Design', value: 'Editorial' },
      { label: 'CMS', value: 'Self-hosted' },
      { label: 'Status', value: 'Active' },
    ],
    features: [
      {
        title: 'Editorial typography',
        description: 'A warm, high-contrast reading layout with tuned spacing for long-form posts and code snippets.',
      },
      {
        title: 'Dark mode',
        description: 'System-aware theme support with a manual toggle so reading works day or night.',
      },
      {
        title: 'RSS feed',
        description: 'Auto-generated feeds so readers can subscribe without depending on social platforms.',
      },
      {
        title: 'SSR with Nuxt 3',
        description: 'Fast first paint and indexable content with a modern developer experience.',
      },
      {
        title: 'Self-hosted CMS',
        description: 'Payload CMS running on owned infrastructure, keeping both data and workflow flexible.',
      },
      {
        title: 'Responsive layouts',
        description: 'A reading experience that holds up from narrow mobile screens to wide desktop monitors.',
      },
    ],
    stack: ['Nuxt 3', 'TypeScript', 'Payload CMS', 'Tailwind CSS', 'Node.js', 'Docker'],
    links: [
      { href: 'https://blog.jacky.fan', label: 'Visit the blog' },
      { href: '/contact', label: 'Work with me' },
    ],
  },
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    shortDescription: 'Modern portfolio with warm editorial design and subtle animations.',
    heroDescription:
      'A more intentional redesign of my personal site, focused on clearer storytelling, stronger typography, and calmer motion.',
    tags: ['Next.js', 'Tailwind', 'Payload CMS'],
    mockup: 'portfolio',
    overview: [
      'This version was built to present work with more confidence and less clutter. The goal was to make the site feel designed rather than assembled.',
      'Compared to the previous iteration, the visual system is tighter: a warmer palette, stronger type hierarchy, and components that feel related across pages.',
    ],
    scope: [
      { label: 'Role', value: 'Design + Development' },
      { label: 'Focus', value: 'Brand refresh' },
      { label: 'Framework', value: 'Next.js' },
      { label: 'Motion', value: 'Subtle' },
      { label: 'Status', value: 'Live' },
    ],
    features: [
      { title: 'Intentional layout', description: 'Sections are paced to tell a clearer story about skills, work, and contact.' },
      { title: 'Shared design system', description: 'Global tokens and reusable patterns keep every page visually consistent.' },
      { title: 'Accessible motion', description: 'Animations reinforce hierarchy without making the UI feel noisy or brittle.' },
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Payload CMS'],
    links: [{ href: '/contact', label: 'Discuss a redesign' }],
  },
  {
    slug: 'minecraft-server',
    title: 'Minecraft Server',
    shortDescription: 'Self-hosted Minecraft server using Docker Compose.',
    heroDescription:
      'A self-hosted multiplayer setup focused on predictable deployment, maintenance, and lightweight operational tooling.',
    tags: ['Docker', 'DevOps'],
    mockup: 'terminal',
    overview: [
      'This project started as a small server for friends and became a practical exercise in container orchestration, backups, and uptime monitoring.',
      'The emphasis was not just on getting a game server running, but on making it maintainable enough to trust over time.',
    ],
    scope: [
      { label: 'Infrastructure', value: 'Docker Compose' },
      { label: 'Monitoring', value: 'Basic health checks' },
      { label: 'Audience', value: 'Private community' },
      { label: 'Status', value: 'Maintained' },
    ],
    features: [
      { title: 'Containerized runtime', description: 'Repeatable setup with clear environment boundaries and version control.' },
      { title: 'Operational hygiene', description: 'Backups, logs, and restart flows were treated as first-class concerns.' },
      { title: 'Low-friction maintenance', description: 'The stack is simple enough to maintain without requiring heavyweight tooling.' },
    ],
    stack: ['Docker Compose', 'Linux', 'Nginx'],
    links: [{ href: '/contact', label: 'Ask about infra work' }],
  },
  {
    slug: 'portfolio-v1',
    title: 'Portfolio v1',
    shortDescription: 'First iteration with Locomotive Scroll and DaisyUI.',
    heroDescription:
      'The first full pass at a personal site, mixing visual experiments with a production deployment mindset.',
    tags: ['Next.js', 'DaisyUI'],
    mockup: 'portfolio',
    overview: [
      'This project established the base content model, project structure, and deployment flow that later redesigns could build on.',
      'It also helped surface which interactions were actually valuable and which were just visual noise.',
    ],
    scope: [
      { label: 'Iteration', value: 'v1' },
      { label: 'UI stack', value: 'DaisyUI' },
      { label: 'Motion', value: 'Experimental' },
      { label: 'Status', value: 'Archived' },
    ],
    features: [
      { title: 'Fast iteration', description: 'A flexible base for testing layout and interaction ideas quickly.' },
      { title: 'CMS integration', description: 'Established a pattern for content-driven pages and project entries.' },
      { title: 'Animation experiments', description: 'Explored scroll-heavy presentation patterns before simplifying later.' },
    ],
    stack: ['Next.js', 'DaisyUI', 'Locomotive Scroll'],
    links: [{ href: '/projects', label: 'See newer work' }],
  },
  {
    slug: 'force-use-npm',
    title: 'force-use-npm',
    shortDescription: 'Enforce a specific package manager in your project.',
    heroDescription:
      'A small developer tooling package that makes repository package-manager expectations explicit and enforceable.',
    tags: ['Node.js', 'Dev Tooling'],
    mockup: 'code',
    overview: [
      'Tiny tooling projects are a good way to solve recurring workflow annoyances with a clear boundary and a measurable result.',
      'This one prevents accidental mismatches in package manager usage, reducing avoidable install and lockfile churn.',
    ],
    scope: [
      { label: 'Type', value: 'Package' },
      { label: 'Audience', value: 'Developers' },
      { label: 'Complexity', value: 'Small utility' },
      { label: 'Status', value: 'Published' },
    ],
    features: [
      { title: 'Lightweight enforcement', description: 'Minimal setup with an immediate signal when the wrong tool is used.' },
      { title: 'Repository hygiene', description: 'Cuts down on accidental lockfile divergence across teams.' },
      { title: 'Clear intent', description: 'Encodes project expectations directly into the developer workflow.' },
    ],
    stack: ['Node.js', 'npm', 'CLI'],
    links: [{ href: '/contact', label: 'Discuss tooling work' }],
  },
  {
    slug: 'game-server-infra',
    title: 'Game Server Infra',
    shortDescription: 'Self-hosted game servers on Linux — setup and maintenance.',
    heroDescription:
      'A broader self-hosting effort covering setup, reverse proxying, service management, and long-running maintenance.',
    tags: ['Self-hosting', 'Linux'],
    mockup: 'terminal',
    overview: [
      'This work spans more than a single app: service orchestration, proxies, backups, and the boring tasks that make self-hosting reliable.',
      'It reflects the same bias I bring to frontend work: smooth experience comes from getting fundamentals right.',
    ],
    scope: [
      { label: 'Environment', value: 'Linux VPS / homelab' },
      { label: 'Services', value: 'Multiple game stacks' },
      { label: 'Ops model', value: 'Hands-on maintenance' },
      { label: 'Status', value: 'Ongoing' },
    ],
    features: [
      { title: 'Service orchestration', description: 'Repeatable setup patterns for containers and supporting infrastructure.' },
      { title: 'Practical monitoring', description: 'Enough visibility to keep things healthy without overbuilding observability.' },
      { title: 'Maintenance workflows', description: 'Updates and recovery paths are designed to be routine, not dramatic.' },
    ],
    stack: ['Linux', 'Docker', 'Nginx', 'Systemd'],
    links: [{ href: '/contact', label: 'Talk infrastructure' }],
  },
]

export function getStaticProject(slug: string) {
  return staticProjects.find((project) => project.slug === slug)
}