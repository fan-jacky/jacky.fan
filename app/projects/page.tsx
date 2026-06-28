import { generateCmsPageMetadata, renderCmsPageRoute } from '@/helpers/payloadcms/pages'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props) {
  return generateCmsPageMetadata('/projects', searchParams, 'Projects - Jacky FAN', 'Projects by Jacky FAN.')
}

export default async function ProjectsPage({ searchParams }: Props) {
  return renderCmsPageRoute({ url: '/projects', searchParams })
}