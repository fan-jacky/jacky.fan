import React from "react";
import { Navbar, Footer } from "@/components";
import LocomotiveScrollWrappper from '@/components/animation/LocomotiveScrollWrapper'
import PageEnterAnimation from "../animation/PageEnterAnimation";
import { fetchPayloadJson, getPayloadCmsUrl } from "@/helpers/payloadcms/api";
import { SITE_SETTINGS_TAG } from "@/helpers/payloadcms/cache";

async function getData() {
    if (!getPayloadCmsUrl()) return null;

    return fetchPayloadJson('globals/site_settings?depth=2', {
        next: {
            revalidate: 3600,
            tags: [SITE_SETTINGS_TAG],
        },
    });
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
