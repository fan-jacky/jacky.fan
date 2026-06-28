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

export const projectOverviewSection: Block = {
  slug: 'projectOverviewSection',
  labels: {
    singular: 'Project Overview Section',
    plural: 'Project Overview Sections',
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
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor: lexicalEditor(),
    },
    {
      name: 'scopeTitle',
      type: 'text',
      label: 'Scope Title',
    },
    {
      name: 'scopeItems',
      type: 'array',
      label: 'Scope Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Value',
        },
      ],
    },
  ],
}

export const projectFeatureGridSection: Block = {
  slug: 'projectFeatureGridSection',
  labels: {
    singular: 'Project Feature Grid Section',
    plural: 'Project Feature Grid Sections',
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
      name: 'items',
      type: 'array',
      minRows: 1,
      label: 'Items',
      fields: [
        {
          name: 'iconText',
          type: 'text',
          label: 'Icon Text',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'desc',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
      ],
    },
  ],
}

export const projectTechStackSection: Block = {
  slug: 'projectTechStackSection',
  labels: {
    singular: 'Project Tech Stack Section',
    plural: 'Project Tech Stack Sections',
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
      name: 'items',
      type: 'array',
      minRows: 1,
      label: 'Stack Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
      ],
    },
    {
      name: 'primaryButtonText',
      type: 'text',
      label: 'Primary Button Text',
    },
    {
      name: 'primaryButtonUrl',
      type: 'text',
      label: 'Primary Button URL',
    },
    {
      name: 'primaryButtonExternal',
      type: 'checkbox',
      defaultValue: false,
      label: 'Primary Button Opens in New Tab',
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      label: 'Secondary Button Text',
    },
    {
      name: 'secondaryButtonUrl',
      type: 'text',
      label: 'Secondary Button URL',
    },
    {
      name: 'secondaryButtonExternal',
      type: 'checkbox',
      defaultValue: false,
      label: 'Secondary Button Opens in New Tab',
    },
  ],
}

export const projectCtaSection: Block = {
  slug: 'projectCtaSection',
  labels: {
    singular: 'Project CTA Section',
    plural: 'Project CTA Sections',
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
      name: 'primaryButtonText',
      type: 'text',
      label: 'Primary Button Text',
    },
    {
      name: 'primaryButtonUrl',
      type: 'text',
      label: 'Primary Button URL',
    },
    {
      name: 'primaryButtonExternal',
      type: 'checkbox',
      defaultValue: false,
      label: 'Primary Button Opens in New Tab',
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      label: 'Secondary Button Text',
    },
    {
      name: 'secondaryButtonUrl',
      type: 'text',
      label: 'Secondary Button URL',
    },
    {
      name: 'secondaryButtonExternal',
      type: 'checkbox',
      defaultValue: false,
      label: 'Secondary Button Opens in New Tab',
    },
  ],
}

export const projectContentBlocks: Block[] = [
  projectOverviewSection,
  projectsCarousel,
  projectFeatureGridSection,
  projectContents,
  projectTechStackSection,
  projectCtaSection,
]
