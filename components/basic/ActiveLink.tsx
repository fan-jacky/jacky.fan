'use client'

import { PageExitContext } from '@/contexts/PageExitContext';
import { useRouter } from 'next/navigation'
import { AnchorHTMLAttributes, MouseEventHandler, ReactNode, useContext } from 'react'

type ActiveLinkProps = {
    children?: ReactNode
    href: string
    className?: string
} & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>

function ActiveLink({ children, href, className = "", target, rel }: ActiveLinkProps) {
    const router = useRouter()

    const { pageExit, setPageExit } = useContext(PageExitContext);

    const handleClick: MouseEventHandler = (e) => {

        if (!href.startsWith("/") && !href.includes(window.location.origin)) return;    // use default behavior for external links

        e.preventDefault();
        if (window.location.pathname == href) return;
        
        setPageExit(!pageExit);

        setTimeout(() => {
            router.push(href);
        }, 700);
    }

    return (
        <a href={href} onClick={handleClick} target={target} rel={rel} className={className}>
            {children}
        </a>
    )
}

export default ActiveLink