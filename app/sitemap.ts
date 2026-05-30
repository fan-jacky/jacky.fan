import type { MetadataRoute } from 'next'
import { fetchPayloadJson, getPayloadCmsUrl } from '@/helpers/payloadcms/api'

const siteUrl = "https://jacky.fan";

async function getData(path: string) {
    if (!getPayloadCmsUrl()) {
        return { docs: [] } as any;
    }

    const data = await fetchPayloadJson<{ docs?: unknown[] }>(path);
    return data ?? { docs: [] };
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
    if (!getPayloadCmsUrl()) {
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