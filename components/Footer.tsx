import Link from 'next/link'

import { getRichTextBlocks } from '@/helpers/payloadcms/getRichTextBlocks'

const fallbackFooterLinks = [
    { href: 'https://github.com/redfrogsss', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/jacky-fan-dev/', label: 'LinkedIn' },
    { href: 'https://blog.jacky.fan', label: 'Blog' },
]

type FooterLink = {
    href: string
    label: string
}

const richText = (value: any) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (value.root?.children) return value.root.children
    return []
}

export default function Footer({ siteSetting }: { siteSetting: any }) {
    const year = new Date().getFullYear()
    const footerLinks: FooterLink[] = siteSetting?.quickLinks?.length
        ? siteSetting.quickLinks.map((link: any): FooterLink => ({ href: link.url, label: link.name }))
        : fallbackFooterLinks
    const footerCopy = richText(siteSetting?.footerText)
    const siteName = siteSetting?.sitename ?? 'Jacky FAN'
    const siteDesc = siteSetting?.siteDesc ?? 'Frontend Developer in Hong Kong'

    return (
        <footer className="site-footer">
            <div className="container">
                <div>
                    <span className="footer-info">&copy; 2023&ndash;{year} {siteName}</span>
                    <div className="footer-copy">
                        {footerCopy.length > 0
                            ? footerCopy.map((block: any, index: number) => getRichTextBlocks(block, {}, index))
                            : siteDesc}
                    </div>
                </div>
                <div className="footer-links">
                    {footerLinks.map((link) => (
                        <Link key={link.href} href={link.href} target="_blank" rel="noopener">
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    )
}
