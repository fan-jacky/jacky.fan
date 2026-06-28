import { generateCmsPageMetadata, renderCmsPageRoute } from '@/helpers/payloadcms/pages'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props) {
  return generateCmsPageMetadata('/contact', searchParams, 'Contact - Jacky FAN', 'Get in touch with Jacky FAN.')
}

export default async function ContactPage({ searchParams }: Props) {
  return renderCmsPageRoute({ url: '/contact', searchParams })
}