'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'

import ProjectDetailContent, { type ProjectDocument } from '@/components/projects/ProjectDetailContent'

type LivePreviewProjectProps = {
  depth: number
  initialProject: ProjectDocument
  serverURL: string
}

export default function LivePreviewProject({
  depth,
  initialProject,
  serverURL,
}: LivePreviewProjectProps) {
  const { data } = useLivePreview<ProjectDocument>({
    depth,
    initialData: initialProject,
    serverURL,
  })

  return <ProjectDetailContent project={data ?? initialProject} />
}