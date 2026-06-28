import Image from "next/image";
import Link from "next/link";

import { resolvePayloadMediaUrl } from "@/helpers/payloadcms/api";

type ProjectMedia = {
    url?: string | null;
    thumbnailURL?: string | null;
};

export type ProjectGridItem = {
    alias?: string;
    cardStyle?: 'blog' | 'portfolio' | 'terminal' | 'code';
    date?: string;
    desc?: string;
    img?: string | ProjectMedia | null;
    tags?: string[];
    title?: string;
};

const PROJECTS_PAGE_PRIORITY: Record<string, number> = {
    'technical-blog': 0,
    'portfolio-v2': 1,
    'minecraft-server': 2,
    'portfolio-v1': 3,
    'force-use-npm': 4,
    'game-server-infra': 5,
};

function ProjectMockup({ kind }: { kind: 'blog' | 'portfolio' | 'terminal' | 'code' }) {
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

export function sortProjects(projects: ProjectGridItem[]) {
    return [...projects].sort(
        (left, right) => new Date(left.date ?? '').getTime() - new Date(right.date ?? '').getTime(),
    );
}

export default function ProjectGrid({ projects = [] }: { projects?: ProjectGridItem[] }) {
    const orderedProjects = [...projects].sort((left, right) => {
        const leftPriority = PROJECTS_PAGE_PRIORITY[left.alias ?? ''] ?? Number.MAX_SAFE_INTEGER;
        const rightPriority = PROJECTS_PAGE_PRIORITY[right.alias ?? ''] ?? Number.MAX_SAFE_INTEGER;

        if (leftPriority !== rightPriority) {
            return leftPriority - rightPriority;
        }

        return new Date(right.date ?? '').getTime() - new Date(left.date ?? '').getTime();
    });

    return (
        <div className="project-list reveal-stagger">
            {orderedProjects.map((item) => {
                if (!item.alias || !item.title || !item.desc) {
                    return null;
                }

                const mediaPath = typeof item.img === 'string'
                    ? item.img
                    : item.img?.thumbnailURL ?? item.img?.url ?? '';
                const imageUrl = resolvePayloadMediaUrl(mediaPath);

                return (
                    <Link href={`/projects/${item.alias}`} className="project-card" key={item.alias}>
                        {imageUrl ? (
                            <div className="project-card__image">
                                <Image
                                    src={imageUrl}
                                    alt={item.title}
                                    fill
                                    className="project-card__image-asset"
                                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                />
                            </div>
                        ) : (
                            <ProjectMockup kind={item.cardStyle ?? 'portfolio'} />
                        )}
                        <div className="project-card__body">
                            <div className="project-card__tags">
                                {(item.tags ?? []).slice(0, 3).map((tag) => (
                                    <span key={tag} className="project-card__tag">{tag}</span>
                                ))}
                            </div>
                            <span className="project-card__title">{item.title}</span>
                            <p className="project-card__description">{item.desc}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
