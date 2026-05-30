import FadeInBottom from "@/components/animation/FadeInBottom";
import { SectionContainer } from "@/components/basic";
import ProjectBlock from "@/components/home/projects/ProjectBlock";
import { resolvePayloadMediaUrl } from "@/helpers/payloadcms/api";

export type ProjectGridItem = {
    alias?: string;
    date?: string;
    desc?: string;
    img?: string | { url?: string | null } | null;
    title?: string;
};

export function sortProjects(projects: ProjectGridItem[]) {
    return [...projects].sort(
        (left, right) => new Date(left.date ?? '').getTime() - new Date(right.date ?? '').getTime(),
    );
}

export default function ProjectGrid({ projects = [] }: { projects?: ProjectGridItem[] }) {
    return (
        <SectionContainer extendRightSpacing={true} topSpacing={false}>
            <FadeInBottom>
                <div className="flex flex-wrap flex-row">
                    {projects.map((item, index) => {
                        const imageUrl = resolvePayloadMediaUrl(typeof item.img === 'string' ? item.img : item.img?.url ?? '');

                        if (!item.alias || !item.title || !item.desc || !imageUrl) {
                            return null;
                        }

                        return (
                            <div
                                className="w-full md:w-1/2 xl:w-1/3 grow-0 shrink p-3"
                                key={item.alias ?? index}
                            >
                                <ProjectBlock
                                    name={item.title}
                                    description={item.desc}
                                    link={`/projects/${item.alias}`}
                                    img={imageUrl}
                                />
                            </div>
                        );
                    })}
                </div>
            </FadeInBottom>
        </SectionContainer>
    );
}
