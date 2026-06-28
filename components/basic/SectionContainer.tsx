export default function SectionContainer({
    children,
    id = "",
    extraClassName = "",
    topSpacing = true,
    bottomSpacing = true,
    extendRightSpacing = false
}: {
    children?: React.ReactNode,
    id?: string,
    extraClassName?: string,
    topSpacing?: boolean,
    bottomSpacing?: boolean
    extendRightSpacing?: boolean
}) {

    const getSpacing = () => {

        if (topSpacing && bottomSpacing) {
            return `my-12 md:my-16`;
        } else if (topSpacing) {
            return `mt-12 md:mt-16`;
        } else if (bottomSpacing) {
            return `mb-12 md:mb-16`;
        } else {
            return "";
        }
    }

    const getRightSpacing = () => {
        if (!extendRightSpacing) {
            return "xl:pr-[30%] 2xl:pr-[20%]";
        } else {
            return "";
        }
    }

    return (
        <section id={id} className={`section-shell ${extraClassName}`}>
            <div className={`section-shell__container container ${getSpacing()} ${getRightSpacing()}`}>
                {children}
            </div>
        </section>
    );
}