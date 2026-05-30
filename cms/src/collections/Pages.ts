import type { CollectionConfig } from 'payload'

import { pageBlocks } from '../blocks/pageBlocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'pageTitle',
    description: 'Flexible pages composed from dynamic content blocks.',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      label: 'Page Title',
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL Path',
      admin: {
        description: 'Path segment used by the frontend, e.g. /about.',
      },
    },
    {
      name: 'contents',
      label: 'Contents',
      type: 'blocks',
      blocks: pageBlocks,
    },
    {
      name: 'metaDesc',
      type: 'textarea',
      label: 'Meta Description',
    },
    {
      name: 'enableBgHeading',
      type: 'checkbox',
      label: 'Enable Background Heading',
      required: true,
      defaultValue: true,
    },
  ],
}
