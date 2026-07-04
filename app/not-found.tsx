import Link from "next/link";
import Page from "@/components/basic/Page";

export default async function NotFoundPage() {
  return (
    <Page reserveNavbarHeight={false}>
      <section className="slide not-found-page" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - var(--navbar-height))", paddingTop: 0, paddingBottom: 0 }}>
        <div className="geo-circle lg" style={{ top: "-80px", right: "-80px" }}></div>
        <div className="geo-circle sm" style={{ bottom: "10%", left: "8%" }}></div>
        <div className="container">
          <span className="slide__label reveal">Error</span>
          <h1 className="slide__headline reveal" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 1, marginBottom: "0.5rem" }}>404</h1>
          <p className="slide__subtitle reveal" style={{ maxWidth: "480px", margin: "0 auto 1rem" }}>Page not found</p>
          <p className="reveal" style={{ maxWidth: "480px", margin: "0 auto 2rem", color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6 }}>
            The page you requested does not exist or is no longer available.
          </p>
          <div className="reveal">
            <Link href="/" className="btn btn-primary">Back to home</Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
