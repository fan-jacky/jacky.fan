import type { CollectionConfig } from 'payload'

import { projectContentBlocks } from '../blocks/projectBlocks'

const TAG_OPTIONS = [
  'Web',
  'School Projects',
  'Movie Streaming',
  'Workshop',
  'Todo App',
  'Side Project',
  'Personal Website',
  'AI',
  'Final Year Project',
  'Mobile App',
  'Personal Blog',
  'Strapi CMS',
]

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Portfolio projects with metadata, tags, and dynamic content.',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Project Title',
    },
    {
      name: 'alias',
      type: 'text',
      label: 'Alias / Slug',
      unique: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Completion Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'desc',
      type: 'textarea',
      label: 'Short Description',
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      label: 'Tags',
      options: TAG_OPTIONS.map((value) => ({ value, label: value })),
    },
    {
      name: 'img',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail',
    },
    {
      name: 'links',
      type: 'array',
      label: 'Project Links',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'links',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
    {
      name: 'contents',
      label: 'Contents',
      type: 'blocks',
      blocks: projectContentBlocks,
    },
  ],
}
