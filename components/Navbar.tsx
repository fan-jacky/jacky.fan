'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const fallbackNavItems = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
]

type NavItem = {
    href: string
    label: string
}

const extractPageUrl = (page: any): string | undefined => {
    if (!page || typeof page === 'string') {
        return undefined
    }

    if (page.url) {
        return page.url
    }

    if (page.slug) {
        return `/${page.slug}`
    }

    return undefined
}

const resolveTheme = () => {
    const savedTheme = window.localStorage.getItem('theme')
    if (savedTheme === 'dark') {
        return 'dark'
    }

    if (savedTheme === 'light') {
        return 'light'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
        return
    }

    document.documentElement.removeAttribute('data-theme')
}

export default function Navbar({ siteSetting }: { siteSetting: any }) {
    const pathname = usePathname()
    const headerRef = useRef<HTMLElement | null>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const syncNavbarHeight = () => {
            const navbarHeight = headerRef.current?.offsetHeight ?? 64
            document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`)
        }

        syncNavbarHeight()
        window.addEventListener('resize', syncNavbarHeight)

        return () => window.removeEventListener('resize', syncNavbarHeight)
    }, [])

    useEffect(() => {
        const nextTheme = resolveTheme()
        applyTheme(nextTheme)
    }, [])

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10)

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const toggleTheme = () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        applyTheme(nextTheme)

        window.localStorage.setItem('theme', nextTheme)
    }

    const logoText = siteSetting?.siteLogoText ?? 'Jacky FAN'
    const navItems: NavItem[] = siteSetting?.menuItem
        ?.map((item: any): Partial<NavItem> => ({ href: extractPageUrl(item?.page), label: item?.name }))
        .filter((item: Partial<NavItem>): item is NavItem => Boolean(item.href && item.label)) ?? fallbackNavItems
    const showThemeToggle = siteSetting?.showNightModeToggle ?? true

    return (
        <>
            <a href="#main-content" className="skip-link">
                Skip to content
            </a>
            <header className={`site-header${isScrolled ? ' scrolled' : ''}`} id="siteHeader" ref={headerRef}>
                <div className="container">
                    <Link href="/" className="site-logo">
                        <span className="site-logo-dot"></span>
                        {logoText}
                    </Link>

                    <nav className="site-nav" aria-label="Primary navigation">
                        <div className="site-nav-links">
                              {navItems.map((item: NavItem) => {
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={isActive ? 'active' : undefined}
                                        aria-current={isActive ? 'page' : undefined}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                            <Link
                                href="/contact"
                                className={pathname === '/contact' ? 'site-nav-cta active' : 'site-nav-cta'}
                                aria-current={pathname === '/contact' ? 'page' : undefined}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </div>

                        {showThemeToggle ? (
                            <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle dark mode">
                                <svg className="icon-sun" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <circle cx="8" cy="8" r="3" fill="currentColor" />
                                    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.929 2.929l1.06 1.06m8.486 8.486l1.06 1.06M2.929 13.071l1.06-1.06m8.486-8.486l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                <svg className="icon-moon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="M13.5 10.5a6 6 0 01-7.5-7.5A6 6 0 1013.5 10.5z" fill="currentColor" />
                                </svg>
                            </button>
                        ) : null}

                        <button
                            className="mobile-nav-toggle"
                            type="button"
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-site-nav"
                            aria-label="Toggle navigation menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </nav>
                </div>

                <div className={`mobile-nav-panel${isMobileMenuOpen ? ' mobile-nav-panel-open' : ''}`} id="mobile-site-nav">
                      {navItems.map((item: NavItem) => {
                        const isActive = pathname === item.href

                        return (
                            <Link key={item.href} href={item.href} className={isActive ? 'active' : undefined} aria-current={isActive ? 'page' : undefined}>
                                {item.label}
                            </Link>
                        )
                    })}
                    <Link href="/contact" className={pathname === '/contact' ? 'site-nav-cta active' : 'site-nav-cta'} aria-current={pathname === '/contact' ? 'page' : undefined}>
                        Contact
                    </Link>
                </div>
            </header>
        </>
    )
}
