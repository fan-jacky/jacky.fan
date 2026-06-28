import { generateCmsPageMetadata, renderCmsPageRoute } from '@/helpers/payloadcms/pages'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props) {
  return generateCmsPageMetadata('/about', searchParams, 'About - Jacky FAN', 'About Jacky FAN - Frontend Developer in Hong Kong.')
}

export default async function AboutPage({ searchParams }: Props) {
  return renderCmsPageRoute({ url: '/about', searchParams })
}