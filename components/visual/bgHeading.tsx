export default function BgHeading({ title = "" }: { title?: string }) {

    const displayTitle = title.split(" ");

    return (
        <div className="bg-heading" aria-hidden="true">
            <span className="bg-heading__text">{displayTitle.map((word, i) => <span className="bg-heading__line" key={i}>{word}</span>)}</span>
        </div>
    );
}