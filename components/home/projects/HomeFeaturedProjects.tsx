import Image from "next/image";
import Link from 'next/link'

import { resolvePayloadMediaUrl } from "@/helpers/payloadcms/api";

import type { ProjectGridItem } from './ProjectGrid'

function HomeProjectMockup({ kind }: { kind: 'blog' | 'portfolio' | 'terminal' | 'code' }) {
  const isDark = kind === 'terminal'

  return (
    <div
      className="project-card__image"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, var(--bg-dark-soft) 0%, var(--bg-dark) 100%)'
          : 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      }}
    />
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

        const mediaPath = typeof project.img === 'string'
          ? project.img
          : project.img?.thumbnailURL ?? project.img?.url ?? '';
        const imageUrl = resolvePayloadMediaUrl(mediaPath);

        return (
          <Link href={`/projects/${project.alias}`} className="project-card" key={project.alias}>
            {imageUrl ? (
              <div className="project-card__image">
                <Image
                  src={imageUrl}
                  alt={project.title}
                  fill
                  className="project-card__image-asset"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
            ) : (
              <HomeProjectMockup kind={project.cardStyle ?? 'portfolio'} />
            )}
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