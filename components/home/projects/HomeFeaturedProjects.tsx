import Link from 'next/link'

import type { ProjectGridItem } from './ProjectGrid'

function HomeProjectMockup({ kind }: { kind: 'blog' | 'portfolio' | 'terminal' | 'code' }) {
  if (kind === 'terminal') {
    return (
      <div className="project-card-image mockup-terminal">
        <div className="mockup-terminal-lines">
          <div className="cmd"><span className="prompt">$</span> docker compose up -d</div>
          <div className="cmd"><span className="out">[+] Running 3/3</span></div>
          <div className="cmd"><span className="out">Server healthy</span></div>
          <div className="cmd"><span className="prompt">$</span> docker stats <span className="hl">--no-stream</span></div>
          <div className="cmd"><span className="out">mc-server 0.12% 1.2GiB</span></div>
        </div>
      </div>
    )
  }

  if (kind === 'portfolio' || kind === 'code') {
    return (
      <div className="project-card-image mockup-browser">
        <div className="mockup-portfolio-hero">
          <div className="hero-mock"><div className="h1-line" style={kind === 'code' ? { width: '25%' } : undefined}></div></div>
          <div className="grid-mock">
            <div className="col"><div className="img-bar"></div><div className="t-bar"></div></div>
            <div className="col"><div className="img-bar"></div><div className="t-bar"></div></div>
            <div className="col"><div className="img-bar"></div><div className="t-bar"></div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="project-card-image mockup-browser">
      <div className="mockup-blog-lines">
        <div className="line wide"></div>
        <div className="line sm"></div>
        <div className="blog-grid">
          <div className="blog-card"><div className="thumb"></div><div className="title-line"></div></div>
          <div className="blog-card"><div className="thumb"></div><div className="title-line"></div></div>
          <div className="blog-card"><div className="thumb"></div><div className="title-line"></div></div>
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
    <div className="projects-grid reveal-stagger">
      {featuredProjects.map((project) => {
        if (!project.alias || !project.title || !project.desc) {
          return null
        }

        return (
          <Link href={`/projects/${project.alias}`} className="project-card" key={project.alias}>
            <HomeProjectMockup kind={project.cardStyle ?? 'portfolio'} />
            <div className="project-card-body">
              <div className="project-card-tags">
                {(project.tags ?? []).slice(0, 3).map((tag) => <span key={tag} className="project-card-tag">{tag}</span>)}
              </div>
              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-desc">{project.desc}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}