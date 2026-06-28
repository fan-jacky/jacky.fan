import FloatingArrow from "../FloatingArrow";

export default function HeroSection({ title, desc, arrowText = "", arrowLink = "" }: { title: string, desc: string, arrowText: string, arrowLink: string }) {

    return (
        <section
            id="hero"
            className="hero-panel"
        >
            <div className="hero-panel__container container">
                <div className="hero-panel__content">
                    <div className="hero-panel__inner">
                        <h1 className="hero-panel__title">{title}</h1>
                        <hr className="hero-panel__rule" />

                        <p className="hero-panel__description">{desc}</p>
                    </div>
                </div>
            </div>
            <FloatingArrow text={arrowText} link={arrowLink} />
        </section>
    );
}