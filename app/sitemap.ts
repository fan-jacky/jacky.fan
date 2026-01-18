import type { MetadataRoute } from 'next'

const PAYLOAD_CMS_URL = process.env.PAYLOAD_CMS_URL;
const api = PAYLOAD_CMS_URL ? `${PAYLOAD_CMS_URL}/api/` : null;
const siteUrl = "https://jacky.fan";

async function getData(path: string) {
    if (!api) {
        return { docs: [] } as any;
    }

    const res = await fetch(`${api}${path}`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const json = await res.json();

    return json;
}

async function getPages () {
    let data = await getData("pages?limit=1000");

    return data.docs.map((page: any) => {
        return {
            url: `${siteUrl}${page.url}`,
            lastModified: new Date(page.updatedAt),
            changeFrequency: 'monthly',
            priority: 0.8,
        }
    });
}

async function getProjectPages () {
    let data = await getData("projects?limit=1000");

    return data.docs.map((project: any) => {
        return {
            url: `${siteUrl}/projects/${project.alias}`,
            lastModified: new Date(project.updatedAt),
            changeFrequency: 'monthly',
            priority: 0.8,
        }
    });
}
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    if (!PAYLOAD_CMS_URL) {
        // Fallback minimal sitemap when content API is not configured
        return [{ url: siteUrl, changeFrequency: 'monthly', priority: 1 }];
    }

    const pages = await getPages();
    const projectPages = await getProjectPages();

    return [
        ...pages,
        ...projectPages,
    ]
}