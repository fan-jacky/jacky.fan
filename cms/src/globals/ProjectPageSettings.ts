import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

export const ProjectPageSettings: GlobalConfig = {
  slug: 'project_page_settings',
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'topTitle',
      type: 'text',
      label: 'Top Title',
    },
    {
      name: 'leftTitle',
      type: 'text',
      label: 'Left Title',
    },
    {
      name: 'rightTitle',
      type: 'text',
      label: 'Right Title',
    },
    {
      name: 'desc',
      type: 'richText',
      label: 'Description',
      editor: lexicalEditor(),
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
    },
  ],
}
