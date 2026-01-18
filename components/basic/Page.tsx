import React from "react";
import { Navbar, Footer } from "@/components";
import LocomotiveScrollWrappper from '@/components/animation/LocomotiveScrollWrapper'
import PageEnterAnimation from "../animation/PageEnterAnimation";

const PAYLOAD_CMS_URL = process.env.PAYLOAD_CMS_URL;

async function getData() {
    if (!PAYLOAD_CMS_URL) return null;

    const res = await fetch(`${PAYLOAD_CMS_URL}/api/globals/site_settings?depth=2`, { next: { revalidate: 3600 } });

    if (!res.ok) {
        throw new Error("Failed to fetch site settings");
    }

    return res.json();
}

export default async function Page({ children, reserveNavbarHeight = true }: { children?: React.ReactNode, reserveNavbarHeight?: boolean }) {

    const siteSetting = await getData();

    return (
        <main className="relative">
            <Navbar siteSetting={siteSetting} />
            <PageEnterAnimation />
            <LocomotiveScrollWrappper>
                <div className={`min-h-screen text-md md:text-xl ${reserveNavbarHeight ? "page" : ""}`}>
                    {children}
                </div>
                <Footer siteSetting={siteSetting} />
            </LocomotiveScrollWrappper>
        </main>
    );
}
