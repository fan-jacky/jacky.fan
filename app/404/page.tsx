import Link from "next/link";

export default function Error404Page () {
    return <div className="not-found-page">
        <p className="not-found-page__title">😵 404 Not Found 😵</p>
        <Link href="/" className="btn btn-primary not-found-page__link">Back to Home Page</Link>
    </div>;
}