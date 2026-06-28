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
        );
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
        );
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
    );
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
                            <h3 className="project-card__title">{item.title}</h3>
                            <p className="project-card__description">{item.desc}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
