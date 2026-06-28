import { generateCmsPageMetadata, renderCmsPageRoute } from '@/helpers/payloadcms/pages'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props) {
  return generateCmsPageMetadata(
    '/',
    searchParams,
    'Jacky FAN - Frontend Developer in Hong Kong',
    'Crafting performant, accessible, and visually compelling web experiences.',
  )
}

export default async function Home({ searchParams }: Props) {
  return renderCmsPageRoute({ url: '/', searchParams, reserveNavbarHeight: false })
}
