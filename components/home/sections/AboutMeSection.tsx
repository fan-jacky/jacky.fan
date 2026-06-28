import Link from "next/link";
import FadeInBottom from "../../animation/FadeInBottom";
import { resolvePayloadMediaUrl } from "@/helpers/payloadcms/api";

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
        <section id="about" className="slide" style={{ paddingTop: "9rem" }}>
            <div className="geo-circle sm" style={{ top: "15%", right: "6%" }}></div>
            <div className="container">
                <FadeInBottom>
                    <span className="slide__label">{props.topTitle}</span>
                    <h1 className="slide__headline">{props.leftTitle} {props.rightTitle}</h1>
                </FadeInBottom>

                <FadeInBottom>
                    <div className="about-bio">
                        {props.contents}
                    </div>
                </FadeInBottom>

                {props.techs && props.techs.length > 0 ? (
                    <FadeInBottom>
                        <div className="tech-strip-wrap" style={{ marginTop: "2.5rem" }}>
                            <div className="tech-strip">
                                {[...props.techs, ...props.techs].map((tech, index) => {
                                    const iconUrl = tech.icon?.url ? resolvePayloadMediaUrl(tech.icon.url) : '';
                                    return (
                                        <div key={index} className="tech-item">
                                            <div className="tech-item-icon">
                                                {iconUrl ? (
                                                    <img src={iconUrl} alt={tech.icon?.alt || tech.title} width="24" height="24" />
                                                ) : (
                                                    <span>{tech.title.slice(0, 1)}</span>
                                                )}
                                            </div>
                                            <span className="tech-item-name">{tech.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </FadeInBottom>
                ) : null}

                {props.btnText && props.btnLinks ? (
                    <FadeInBottom>
                        <div style={{ marginTop: "2rem" }}>
                            <Link href={props.btnLinks} className="btn btn-primary">
                                {props.btnText} <span>→</span>
                            </Link>
                        </div>
                    </FadeInBottom>
                ) : null}
            </div>
        </section>
    );
}
