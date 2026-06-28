import { ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import Magnifier3D from "../Magnifier3D";
import FadeInBottom from "../../animation/FadeInBottom";
import Image from "next/image";
import { SectionContainer, ActiveLink } from "@/components/basic";
import Link from "next/link";

interface AboutMeSectionProps {
    topTitle: string;
    leftTitle: string;
    rightTitle: string;
    contents: any;
    techs: {
        title: string;
        icon: any;
    }[];
    btnText: string;
    btnLinks: string;
}

export default function AboutMeSection(props: AboutMeSectionProps) {

    return (
        <SectionContainer id="about" extraClassName="about-section">
            <FadeInBottom>
                <h2 className="heading-block about-section__heading">
                    <span className="heading-block__eyebrow">
                        <hr className="heading-block__rule" />
                        {props.topTitle}
                    </span>
                    <span className="heading-block__accent">{props.leftTitle}</span> <span className="heading-block__text">{props.rightTitle}</span>
                </h2>
            </FadeInBottom>

            <FadeInBottom>
                 <div className="about-section__body prose max-w-none">
                    {props.contents}
                 </div>
            </FadeInBottom>

            <FadeInBottom>
                <div className="about-section__tech-list">
                    {props.techs.map((tech, index) => {
                        const iconUrl = typeof tech.icon === "string" ? tech.icon : tech.icon?.url;
                        return (
                            <div key={index} className="about-section__tech-item">
                                {iconUrl && (
                                    <Image src={iconUrl} alt={tech.title} className="about-section__tech-icon" width={64} height={64} />
                                )}
                                <p className="about-section__tech-title">
                                    {tech.title}
                                </p>
                            </div>
                        );
                    })}

                </div>
            </FadeInBottom>

            <FadeInBottom>
                <ActiveLink href={props.btnLinks} className="btn btn-primary about-section__cta">
                    {props.btnText}
                    <ArrowSmallDownIcon className="about-section__cta-icon" />
                </ActiveLink>
            </FadeInBottom>

            <Magnifier3D />
        </SectionContainer>
    );
}