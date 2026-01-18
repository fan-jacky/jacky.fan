import FadeInBottom from "@/components/animation/FadeInBottom";
import { SectionContainer } from "@/components/basic";
import ProjectBlock from "@/components/home/projects/ProjectBlock";

const PAYLOAD_CMS_URL = process.env.PAYLOAD_CMS_URL;

async function getData() {
    if (!PAYLOAD_CMS_URL) {
        return { docs: [] } as any;
    }

    const res = await fetch(`${PAYLOAD_CMS_URL}/api/projects?depth=1`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function ProjectGrid() {
    const { docs } = await getData();
    const sortedData = (docs ?? []).sort((a: any) => new Date(a.date ?? '').getTime() - new Date().getTime());

    return (
        <SectionContainer extendRightSpacing={true} topSpacing={false}>
            <FadeInBottom>
                <div className="flex flex-wrap flex-row">
                    {sortedData.map((item: any, index: number) => {
                        const imageUrl = typeof item.img === 'string' ? item.img : item.img?.url;
                        return (
                            <div
                                className="w-full md:w-1/2 xl:w-1/3 grow-0 shrink p-3"
                                key={index}
                            >
                                <ProjectBlock
                                    name={item.title}
                                    description={item.desc}
                                    link={`/projects/${item.alias}`}
                                    key={index}
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
