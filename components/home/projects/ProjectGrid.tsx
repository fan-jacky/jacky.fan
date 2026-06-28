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
            <div className="project-card-image mockup-terminal">
                <div className="mockup-terminal-lines">
                    <div className="cmd"><span className="prompt">$</span> docker compose up -d</div>
                    <div className="cmd"><span className="out">[+] Running 3/3</span></div>
                    <div className="cmd"><span className="out">Server healthy</span></div>
                    <div className="cmd"><span className="prompt">$</span> docker stats <span className="hl">--no-stream</span></div>
                    <div className="cmd"><span className="out">mc-server 0.12% 1.2GiB</span></div>
                </div>
            </div>
        );
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
        );
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
        <div className="projects-grid reveal-stagger">
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
                            <div className="project-card-image">
                                <Image
                                    src={imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                />
                            </div>
                        ) : (
                            <ProjectMockup kind={item.cardStyle ?? 'portfolio'} />
                        )}
                        <div className="project-card-body">
                            <div className="project-card-tags">
                                {(item.tags ?? []).slice(0, 3).map((tag) => (
                                    <span key={tag} className="project-card-tag">{tag}</span>
                                ))}
                            </div>
                            <h3 className="project-card-title">{item.title}</h3>
                            <p className="project-card-desc">{item.desc}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
