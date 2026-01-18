'use client'

import { useContext, useEffect, useRef, useState } from "react";
import ToggleDayNight from "./ToggleDayNight";
import { LocomotiveScrollPositionContext } from "@/contexts/LocomotiveScrollPositionContext";
import Link from "next/link";
import { ActiveLink } from "./basic";
import { Bars3Icon } from "@heroicons/react/24/outline";

const extractPageUrl = (page: any): string | undefined => {
    if (!page) return undefined;
    if (typeof page === "string") return undefined;
    if (page?.url) return page.url;
    if (page?.slug) return `/${page.slug}`;
    return undefined;
};

export default function Navbar({ siteSetting }: { siteSetting: any }) {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isTop, setIsTop] = useState(true);

    const { scrollPos } = useContext(LocomotiveScrollPositionContext);

    const navbarRef = useRef<HTMLDivElement | null>(null);

    if (!siteSetting) {
        return null;
    }

    const menuItems = siteSetting.menuItem ?? [];
    const quickLinks = siteSetting.quickLinks ?? [];

    useEffect(() => {
        const navbarHeight = navbarRef.current?.offsetHeight ?? 0;
        document.querySelector("html")?.style.setProperty("--navbar-height", `${navbarHeight}px`);
    }, [])

    useEffect(() => {
        const currentScrollPos = scrollPos?.scroll.y ?? 0;
        const navbarHeight = navbarRef.current?.offsetHeight ?? 0;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos <= navbarHeight);

        setPrevScrollPos(currentScrollPos);
        setIsTop(currentScrollPos <= navbarHeight);
    }, [scrollPos])

    return (
        <div className={`navbar bg-base-300 fixed z-50 transition-all w-screen ${visible ? "translate-y-0" : "-translate-y-[110%]"} ${isTop ? "shadow-none" : "shadow-md"}`} ref={navbarRef}>
            <div className="flex-1">
                <ActiveLink href="/" className="btn btn-ghost normal-case text-xl">
                    <span className="text-primary font-dosis font-semibold">{siteSetting.siteLogoText}</span>
                </ActiveLink>
            </div>
            <div className="flex-none hidden md:flex md:mx-5">
                <ul className="menu menu-horizontal px-1">
                    {siteSetting.showNightModeToggle && <li className="hidden md:flex"><ToggleDayNight /></li>}
                    {menuItems?.filter((item: any) => extractPageUrl(item.page)).map((item: any, index: number) => (
                        <li key={index} className="hidden md:flex">
                            <ActiveLink href={extractPageUrl(item.page) ?? "#"}>{item.name}</ActiveLink>
                        </li>
                    ))}
                    {siteSetting.showMenuQuickLinksMenu &&
                        <li className="hidden md:flex">
                            <details>
                                <summary>
                                    Quick Links
                                </summary>
                                <ul className="p-2 bg-base-100">
                                    {quickLinks?.map((link: any, index: number) => (
                                        <li key={index}>
                                            <Link href={link.url} target="_blank">{link.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </li>
                    }
                </ul>
            </div>
            <div className="flex-none flex md:hidden md:mx-5">
                <div className="drawer">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button" aria-label="Open Mobile Menu">
                            <Bars3Icon className="h-5 w-5 text-base-content" />
                        </label>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content ml-0">

                            <p className="ml-4 my-4 font-bold">Pages</p>
                            {menuItems?.filter((item: any) => extractPageUrl(item.page)).map((item: any, index: number) => (
                                <li key={index}>
                                    <ActiveLink href={extractPageUrl(item.page) ?? "#"}>{item.name}</ActiveLink>
                                </li>
                            ))}

                            {siteSetting.showMenuQuickLinksMenu && <>
                                <hr className="border-base-content my-4 ml-4 mr-8" />
                                <p className="ml-4 my-4 font-bold">Quick Links</p>
                            </>}
                            {siteSetting.showMenuQuickLinksMenu && quickLinks?.map((link: any, index: number) => (
                                <li key={index}>
                                    <Link href={link.url} target="_blank">{link.name}</Link>
                                </li>
                            ))}

                            {siteSetting.showNightModeToggle && <>
                                <hr className="border-base-content my-4 ml-4 mr-8" />
                                <li><ToggleDayNight /></li>
                            </>}
                        </ul>
                    </div>
                </div>
            </div>

        </div>

    );
}
