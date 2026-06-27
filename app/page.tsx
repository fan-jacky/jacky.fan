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
  title: 'Jacky FAN - Frontend Developer in Hong Kong',
  description: 'Crafting performant, accessible, and visually compelling web experiences.',
}

async function getFeaturedProjects() {
  if (!getPayloadCmsUrl()) {
    return staticProjects.slice(0, 3)
  }

  try {
    const data = await fetchPayloadJson<{ docs?: CmsProjectCard[] }>('projects?depth=1')
    const docs = data?.docs ?? []

    if (docs.length === 0) {
      return staticProjects.slice(0, 3)
    }

    return docs.slice(0, 3).map((doc) => {
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
    return staticProjects.slice(0, 3)
  }
}

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

const techItems = ['React', 'Vue', 'TypeScript', 'Next.js', 'Nuxt', 'Tailwind', 'Payload', 'Docker', 'Node.js']

export default async function Home() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <Page reserveNavbarHeight={false}>
      <PortfolioEnhancements />

      <section className="slide hero-slide">
        <div className="hero-graphic">
          <div className="outer"></div><div className="mid"></div><div className="inner"></div>
          <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <span className="slide-label">Frontend Developer · Hong Kong</span>
            <h1>Jacky Fan</h1>
            <p className="slide-subtitle" style={{ marginBottom: '2rem' }}>
              Crafting performant, accessible, and visually compelling web experiences with TypeScript, React, and Vue.
            </p>
            <div className="reveal visible cta-row">
              <Link href="/projects" className="btn btn-primary">View my work <span>→</span></Link>
              <Link href="/contact" className="btn btn-outline">Get in touch</Link>
            </div>
          </div>
        </div>
        <div className="hero-scroll"><span>Scroll</span><div className="hero-scroll-line"></div></div>
      </section>

      <section className="slide slide-tinted">
        <div className="geo-circle md"></div>
        <div className="container">
          <span className="slide-label reveal">Selected Work</span>
          <h2 className="slide-headline reveal">Projects</h2>
          <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>A few things I&apos;ve built — from tools to full websites.</p>
          <div className="projects-grid reveal-stagger">
            {featuredProjects.map((project) => (
              <Link href={`/projects/${project.slug}`} className="project-card" key={project.slug}>
                <HomeProjectMockup kind={project.mockup} />
                <div className="project-card-body">
                  <div className="project-card-tags">
                    {project.tags.slice(0, 3).map((tag) => <span key={tag} className="project-card-tag">{tag}</span>)}
                  </div>
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-desc">{project.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="slide">
        <div className="geo-circle sm"></div>
        <div className="container">
          <span className="slide-label reveal">By the Numbers</span>
          <h2 className="slide-headline reveal">Experience</h2>
          <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>What the last few years have looked like.</p>
          <div className="stats-grid reveal-stagger">
            <div><div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>4+</div><div className="stat-label">Years Experience</div></div>
            <div><div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>20+</div><div className="stat-label">Projects Shipped</div></div>
            <div><div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>15+</div><div className="stat-label">Articles Written</div></div>
          </div>
        </div>
      </section>

      <section className="slide slide-tinted">
        <div className="geo-dots" style={{ top: 0, right: 0, width: '300px', height: '100%' }}></div>
        <div className="container">
          <span className="slide-label reveal">Tech Stack</span>
          <h2 className="slide-headline reveal">What I Use</h2>
          <p className="slide-subtitle reveal" style={{ marginBottom: '2.5rem' }}>Tools and technologies I reach for daily.</p>
          <div className="tech-strip-wrap reveal">
            <div className="tech-strip">
              {[...techItems, ...techItems].map((item, index) => (
                <div className="tech-item" key={`${item}-${index}`}>
                  <div className="tech-item-icon"><span>{item.slice(0, 1)}</span></div>
                  <span className="tech-item-name">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="slide slide-dark">
        <div className="geo-circle lg" style={{ borderColor: 'rgba(245,243,239,0.06)', top: '-80px', right: '-80px' }}></div>
        <div className="geo-accent" style={{ top: 'auto', bottom: '-100px', right: '-80px' }}></div>
        <div className="container">
          <span className="slide-label reveal" style={{ color: 'rgba(245,243,239,0.5)' }}>Get in Touch</span>
          <h2 className="slide-headline reveal">Let&apos;s work together</h2>
          <p className="slide-subtitle reveal" style={{ marginBottom: '2rem' }}>I&apos;m always open to new projects, collaborations, or just a chat.</p>
          <div className="reveal" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary">Get in touch <span>→</span></Link>
            <Link href="/about" className="btn btn-outline">More about me</Link>
          </div>
        </div>
      </section>
    </Page>
  )
}
