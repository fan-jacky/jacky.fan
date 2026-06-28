import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { projectContentBlocks } from '../blocks/projectBlocks'
import { revalidateFrontendTag } from '../utilities/revalidateFrontend'

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

const CARD_STYLE_OPTIONS = [
  { label: 'Blog', value: 'blog' },
  { label: 'Portfolio', value: 'portfolio' },
  { label: 'Terminal', value: 'terminal' },
  { label: 'Code', value: 'code' },
]

const PROJECTS_TAG = 'projects'

const revalidateProjectsGrid: CollectionAfterChangeHook = async ({ req }) => {
  try {
    await revalidateFrontendTag(PROJECTS_TAG)
  } catch (error) {
    req.payload.logger.error(
      `Failed to revalidate frontend projects cache: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Portfolio projects with metadata, tags, and dynamic content.',
  },
  hooks: {
    afterChange: [revalidateProjectsGrid],
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
      name: 'cardStyle',
      type: 'select',
      required: true,
      defaultValue: 'portfolio',
      label: 'Project Card Style',
      options: CARD_STYLE_OPTIONS,
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
