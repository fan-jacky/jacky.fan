import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const projectsCarousel: Block = {
  slug: 'projectsCarousel',
  labels: {
    singular: 'Projects Carousel',
    plural: 'Projects Carousels',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Carousel Name',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Media',
        },
        {
          name: 'desc',
          type: 'text',
          label: 'Description',
        },
      ],
    },
  ],
}

export const projectContents: Block = {
  slug: 'projectContents',
  labels: {
    singular: 'Project Content Block',
    plural: 'Project Content Blocks',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Section Name',
    },
    {
      name: 'contents',
      type: 'richText',
      label: 'Contents',
      editor: lexicalEditor(),
    },
  ],
}

export const projectContentBlocks: Block[] = [projectsCarousel, projectContents]
