import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const pageRichText: Block = {
  slug: 'pageRichText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
  ],
}

export const pageHeading: Block = {
  slug: 'pageHeading',
  labels: {
    singular: 'Page Heading',
    plural: 'Page Headings',
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
      name: 'colorReverse',
      type: 'checkbox',
      defaultValue: false,
      label: 'Reverse Colors',
    },
  ],
}

export const pageButton: Block = {
  slug: 'pageButton',
  labels: {
    singular: 'Button',
    plural: 'Buttons',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Label',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL',
    },
    {
      name: 'external',
      type: 'checkbox',
      defaultValue: false,
      label: 'Open in new tab',
    },
  ],
}

export const pageProjectGrid: Block = {
  slug: 'pageProjectGrid',
  labels: {
    singular: 'Project Grid',
    plural: 'Project Grids',
  },
  fields: [],
}

export const pageContactForm: Block = {
  slug: 'pageContactForm',
  labels: {
    singular: 'Contact Form',
    plural: 'Contact Forms',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: '📫 Contact Me',
      label: 'Form Title',
    },
  ],
}

export const pageThreeDLetter: Block = {
  slug: 'pageThreeDLetter',
  labels: {
    singular: '3D Letter',
    plural: '3D Letters',
  },
  fields: [
    {
      name: 'enable',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      label: 'Enable',
    },
  ],
}

export const pageHeroSection: Block = {
  slug: 'pageHeroSection',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'desc',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'arrowText',
      type: 'text',
      label: 'Arrow Text',
    },
    {
      name: 'arrowLink',
      type: 'text',
      label: 'Arrow Link',
    },
  ],
}

export const pageAboutMeSection: Block = {
  slug: 'pageAboutMeSection',
  labels: {
    singular: 'About Me Section',
    plural: 'About Me Sections',
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
      name: 'contents',
      type: 'richText',
      editor: lexicalEditor(),
      label: 'Contents',
    },
    {
      name: 'techs',
      type: 'array',
      label: 'Tech Blocks',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Icon',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
      ],
    },
    {
      name: 'btnText',
      type: 'text',
      label: 'Button Text',
    },
    {
      name: 'btnLinks',
      type: 'text',
      label: 'Button Link',
    },
  ],
}

export const pageBlocks: Block[] = [
  pageRichText,
  pageHeading,
  pageButton,
  pageProjectGrid,
  pageContactForm,
  pageThreeDLetter,
  pageHeroSection,
  pageAboutMeSection,
]
