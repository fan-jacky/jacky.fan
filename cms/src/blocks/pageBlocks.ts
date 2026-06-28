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
      defaultValue: false,
      label: 'Add top padding',
    },
  ],
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

export const pageStatsSection: Block = {
  slug: 'pageStatsSection',
  labels: {
    singular: 'Stats Section',
    plural: 'Stats Sections',
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
      label: 'Stats',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Value',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
      ],
    },
  ],
}

export const pageTechStackSection: Block = {
  slug: 'pageTechStackSection',
  labels: {
    singular: 'Tech Stack Section',
    plural: 'Tech Stack Sections',
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
          name: 'name',
          type: 'text',
          required: true,
          label: 'Name',
        },
      ],
    },
  ],
}

export const pageCtaSection: Block = {
  slug: 'pageCtaSection',
  labels: {
    singular: 'CTA Section',
    plural: 'CTA Sections',
  },
  fields: [
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'dark',
      label: 'Tone',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Tinted', value: 'tinted' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'centered',
      type: 'checkbox',
      defaultValue: false,
      label: 'Center content',
    },
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

export const pageProfileSection: Block = {
  slug: 'pageProfileSection',
  labels: {
    singular: 'Profile Section',
    plural: 'Profile Sections',
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
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
      label: 'Body',
    },
    {
      name: 'sidebarTitle',
      type: 'text',
      label: 'Sidebar Title',
    },
    {
      name: 'details',
      type: 'array',
      label: 'Details',
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
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'label',
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
      ],
    },
  ],
}

export const pageSkillBarsSection: Block = {
  slug: 'pageSkillBarsSection',
  labels: {
    singular: 'Skill Bars Section',
    plural: 'Skill Bars Sections',
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
      name: 'groups',
      type: 'array',
      minRows: 1,
      label: 'Groups',
      fields: [
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          label: 'Skills',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Skill',
            },
            {
              name: 'value',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
              label: 'Percentage',
            },
          ],
        },
      ],
    },
  ],
}

export const pageCardGridSection: Block = {
  slug: 'pageCardGridSection',
  labels: {
    singular: 'Card Grid Section',
    plural: 'Card Grid Sections',
  },
  fields: [
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'tinted',
      label: 'Tone',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Tinted', value: 'tinted' },
        { label: 'Dark', value: 'dark' },
      ],
    },
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

export const pageContactMethodsSection: Block = {
  slug: 'pageContactMethodsSection',
  labels: {
    singular: 'Contact Methods Section',
    plural: 'Contact Methods Sections',
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
      name: 'methods',
      type: 'array',
      minRows: 1,
      label: 'Methods',
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
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
    {
      name: 'cardTitle',
      type: 'text',
      label: 'Card Title',
    },
    {
      name: 'cardDescription',
      type: 'textarea',
      label: 'Card Description',
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
  pageStatsSection,
  pageTechStackSection,
  pageCtaSection,
  pageProfileSection,
  pageSkillBarsSection,
  pageCardGridSection,
  pageContactMethodsSection,
]
