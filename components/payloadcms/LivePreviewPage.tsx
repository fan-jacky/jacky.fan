'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'

import type { ProjectGridItem } from '@/components/home/projects/ProjectGrid'
import BgHeading from '@/components/visual/bgHeading'
import { getContents } from '@/helpers/payloadcms/getContent'
import type { PageContentType } from '@/interfaces/ContentBlockProps'

type PageDocument = {
  contents?: PageContentType[] | null
  enableBgHeading?: boolean | null
  pageTitle?: string | null
}

type LivePreviewPageProps = {
  depth: number
  initialPage: PageDocument
  projectGridItems?: ProjectGridItem[]
  serverURL: string
  showBgHeading?: boolean
}

export default function LivePreviewPage({
  depth,
  initialPage,
  projectGridItems,
  serverURL,
  showBgHeading = false,
}: LivePreviewPageProps) {
  const { data } = useLivePreview<PageDocument>({
    depth,
    initialData: initialPage,
    serverURL,
  })

  return (
    <>
      {getContents(data?.contents, { projectGridItems })}
      {showBgHeading && data?.enableBgHeading && data?.pageTitle ? (
        <BgHeading title={data.pageTitle} />
      ) : null}
    </>
  )
}