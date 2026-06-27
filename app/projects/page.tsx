import Link from 'next/link'

import { Page } from '@/components/basic'
import PortfolioEnhancements from '@/components/portfolio/PortfolioEnhancements'
import { staticProjects } from '@/components/portfolio/data'
import { fetchPayloadJson, getPayloadCmsUrl } from '@/helpers/payloadcms/api'

type CmsProjectCard = {
  alias?: string | null
  title?: string | null
  desc?: string | null
  tags?: string[] | null
}

export const metadata = {
  title: 'Projects - Jacky FAN',
  description: 'Projects by Jacky FAN.',
}

function Mockup({ kind }: { kind: 'blog' | 'portfolio' | 'terminal' | 'code' }) {
  if (kind === 'terminal') {
    return (
      <div className="project-card-image mockup-terminal">
        <div className="mockup-terminal-lines">
          <div className="cmd"><span className="prompt">$</span> docker compose up -d</div>
          <div className="cmd"><span className="out">[+] Running 3/3</span></div>
          <div className="cmd"><span className="out">Active services healthy</span></div>
          <div className="cmd"><span className="prompt">$</span> uptime</div>
          <div className="cmd"><span className="out">up 45 days, load 0.02</span></div>
        </div>
      </div>
    )
  }

  if (kind === 'code') {
    return (
      <div className="project-card-image mockup-browser">
        <div className="mockup-portfolio-hero">
          <div className="hero-mock"><div className="h1-line" style={{ width: '25%' }}></div></div>
          <div className="grid-mock">
            <div className="col"><div className="img-bar"></div><div className="t-bar"></div></div>
            <div className="col"><div className="img-bar"></div><div className="t-bar"></div></div>
            <div className="col"><div className="img-bar"></div><div className="t-bar"></div></div>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'portfolio') {
    return (
      <div className="project-card-image mockup-browser">
        <div className="mockup-portfolio-hero">
          <div className="hero-mock"><div className="h1-line"></div></div>
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

async function getProjectCards() {
  if (!getPayloadCmsUrl()) {
    return staticProjects
  }

  try {
    const data = await fetchPayloadJson<{ docs?: CmsProjectCard[] }>('projects?depth=1')
    const docs = data?.docs ?? []

    if (docs.length === 0) {
      return staticProjects
    }

    return docs.map((doc) => {
      const fallback = staticProjects.find((project) => project.slug === doc.alias)

      return {
        slug: doc.alias ?? fallback?.slug ?? 'project',
        title: doc.title ?? fallback?.title ?? 'Project',
        shortDescription: doc.desc ?? fallback?.shortDescription ?? 'Project details coming soon.',
        tags: doc.tags?.length ? doc.tags : fallback?.tags ?? [],
        mockup: fallback?.mockup ?? 'portfolio',
      }
    })
  } catch {
    return staticProjects
  }
}

export default async function ProjectsPage() {
  const projects = await getProjectCards()

  return (
    <Page>
      <PortfolioEnhancements />

      <section className="slide" style={{ paddingTop: '9rem' }}>
        <div className="geo-circle sm" style={{ top: '10%', right: '8%' }}></div>
        <div className="container">
          <span className="slide-label reveal">My Work</span>
          <h1 className="slide-headline reveal">Projects</h1>
          <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>
            A showcase of what I&apos;ve built — websites, tools, and experiments.
          </p>
          <div className="projects-grid reveal-stagger">
            {projects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="project-card">
                <Mockup kind={project.mockup} />
                <div className="project-card-body">
                  <div className="project-card-tags">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="project-card-tag">{tag}</span>
                    ))}
                  </div>
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-desc">{project.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}