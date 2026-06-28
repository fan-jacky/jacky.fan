import Link from "next/link";

export default function HeroSection({ title, desc, arrowText = "", arrowLink = "" }: { title: string, desc: string, arrowText: string, arrowLink: string }) {
    return (
        <section className="slide" style={{ paddingTop: "9rem" }}>
            <div className="geo-circle sm" style={{ top: "15%", right: "6%" }}></div>
            <div className="container">
                <span className="slide__label reveal">{title}</span>
                <h1 className="slide__headline reveal">{title}</h1>
                <p className="slide__subtitle reveal" style={{ marginBottom: "2rem" }}>{desc}</p>
                {arrowText && arrowLink ? (
                    <div className="reveal">
                        <Link href={arrowLink} className="btn btn-primary">
                            {arrowText} <span>→</span>
                        </Link>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
