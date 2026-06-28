import React from "react";
import { Navbar, Footer } from "@/components";
import { fetchPayloadJson, getPayloadCmsUrl } from "@/helpers/payloadcms/api";
import { SITE_SETTINGS_TAG } from "@/helpers/payloadcms/cache";

async function getData() {
    if (!getPayloadCmsUrl()) return null;

    try {
        return await fetchPayloadJson('globals/site_settings?depth=2', {
            next: {
                revalidate: 3600,
                tags: [SITE_SETTINGS_TAG],
            },
        });
    } catch (error) {
        console.error('Failed to load site settings for page chrome.', error);
        return null;
    }
}

export default async function Page({ children, reserveNavbarHeight = true }: { children?: React.ReactNode, reserveNavbarHeight?: boolean }) {

    const siteSetting = await getData();

    return (
        <main className="page-shell">
            <Navbar siteSetting={siteSetting} />
                <div className={`page-shell__content portfolio-main ${reserveNavbarHeight ? "page" : ""}`}>
                    {children}
                </div>
                <Footer siteSetting={siteSetting} />
        </main>
    );
}
