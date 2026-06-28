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
      name: 'label',
      type: 'text',
      label: 'Eyebrow Label',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
    },
    {
      name: 'topPadding',
      type: 'checkbox',
      defaultValue: true,
      label: 'Add top padding',
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
    },
    {
      name: 'metaDesc',
      type: 'textarea',
      label: 'Meta Description',
    },
  ],
}
