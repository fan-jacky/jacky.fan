export default function Heading({
    topTitle,
    leftTitle = "",
    rightTitle = "",
    colorReverse
}: {
    topTitle?: string;
    leftTitle?: string;
    rightTitle?: string;
    colorReverse?: boolean
}) {
    return (
        <h2 className="heading-block">
            {topTitle &&
                <span className="heading-block__eyebrow">
                    <hr className="heading-block__rule" />
                    {topTitle}
                </span>
            }
            {colorReverse ? 
                <><span className="heading-block__text">{leftTitle}</span> <span className="heading-block__accent">{rightTitle}</span></>
            :
                <><span className="heading-block__accent">{leftTitle}</span> <span className="heading-block__text">{rightTitle}</span></>
            }
        </h2>
    );

}