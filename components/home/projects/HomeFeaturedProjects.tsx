import Link from 'next/link'

import type { ProjectGridItem } from './ProjectGrid'

function HomeProjectMockup({ kind }: { kind: 'blog' | 'portfolio' | 'terminal' | 'code' }) {
  if (kind === 'terminal') {
    return (
      <div className="project-card__image project-mockup project-mockup--terminal">
        <div className="project-mockup__terminal-lines">
          <div className="project-mockup__terminal-command"><span className="project-mockup__terminal-prompt">$</span> docker compose up -d</div>
          <div className="project-mockup__terminal-command"><span className="project-mockup__terminal-output">[+] Running 3/3</span></div>
          <div className="project-mockup__terminal-command"><span className="project-mockup__terminal-output">Server healthy</span></div>
          <div className="project-mockup__terminal-command"><span className="project-mockup__terminal-prompt">$</span> docker stats <span className="project-mockup__terminal-highlight">--no-stream</span></div>
          <div className="project-mockup__terminal-command"><span className="project-mockup__terminal-output">mc-server 0.12% 1.2GiB</span></div>
        </div>
      </div>
    )
  }

  if (kind === 'portfolio' || kind === 'code') {
    return (
      <div className="project-card__image project-mockup project-mockup--browser">
        <div className="project-mockup__portfolio-hero">
          <div className="project-mockup__hero-panel"><div className="project-mockup__title-line" style={kind === 'code' ? { width: '25%' } : undefined}></div></div>
          <div className="project-mockup__grid">
            <div className="project-mockup__grid-column"><div className="project-mockup__image-bar"></div><div className="project-mockup__text-bar"></div></div>
            <div className="project-mockup__grid-column"><div className="project-mockup__image-bar"></div><div className="project-mockup__text-bar"></div></div>
            <div className="project-mockup__grid-column"><div className="project-mockup__image-bar"></div><div className="project-mockup__text-bar"></div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="project-card__image project-mockup project-mockup--browser">
      <div className="project-mockup__blog-lines">
        <div className="project-mockup__line project-mockup__line--wide"></div>
        <div className="project-mockup__line project-mockup__line--small"></div>
        <div className="project-mockup__blog-grid">
          <div className="project-mockup__blog-card"><div className="project-mockup__thumb"></div><div className="project-mockup__card-title-line"></div></div>
          <div className="project-mockup__blog-card"><div className="project-mockup__thumb"></div><div className="project-mockup__card-title-line"></div></div>
          <div className="project-mockup__blog-card"><div className="project-mockup__thumb"></div><div className="project-mockup__card-title-line"></div></div>
        </div>
      </div>
    </div>
  )
}

const HOMEPAGE_PRIORITY: Record<string, number> = {
  'technical-blog': 0,
  'portfolio-v2': 1,
  'minecraft-server': 2,
}

function sortHomepageProjects(projects: ProjectGridItem[]) {
  return [...projects].sort((left, right) => {
    const leftPriority = HOMEPAGE_PRIORITY[left.alias ?? ''] ?? Number.MAX_SAFE_INTEGER
    const rightPriority = HOMEPAGE_PRIORITY[right.alias ?? ''] ?? Number.MAX_SAFE_INTEGER

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority
    }

    return new Date(right.date ?? '').getTime() - new Date(left.date ?? '').getTime()
  })
}

export default function HomeFeaturedProjects({ projects = [] }: { projects?: ProjectGridItem[] }) {
  const featuredProjects = sortHomepageProjects(projects).slice(0, 3)

  return (
    <div className="project-list project-list--featured reveal-stagger">
      {featuredProjects.map((project) => {
        if (!project.alias || !project.title || !project.desc) {
          return null
        }

        return (
          <Link href={`/projects/${project.alias}`} className="project-card" key={project.alias}>
            <HomeProjectMockup kind={project.cardStyle ?? 'portfolio'} />
            <div className="project-card__body">
              <div className="project-card__tags">
                {(project.tags ?? []).slice(0, 3).map((tag) => <span key={tag} className="project-card__tag">{tag}</span>)}
              </div>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__description">{project.desc}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}