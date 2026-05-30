import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { revalidateFrontendTag, SITE_SETTINGS_TAG } from '../utilities/revalidateFrontend'

const revalidateSiteSettings: GlobalAfterChangeHook = async ({ req }) => {
  try {
    await revalidateFrontendTag(SITE_SETTINGS_TAG)
  } catch (error) {
    req.payload.logger.error(
      `Failed to revalidate frontend site settings cache: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

export const SiteSettings: GlobalConfig = {
  slug: 'site_settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'sitename',
      type: 'text',
      label: 'Site Name',
    },
    {
      name: 'siteDesc',
      type: 'textarea',
      label: 'Site Description',
    },
    {
      name: 'siteLogoText',
      type: 'text',
      label: 'Logo Text',
    },
    {
      name: 'menuItem',
      type: 'array',
      label: 'Menu Items',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Page',
        },
      ],
    },
    {
      name: 'footerText',
      type: 'richText',
      label: 'Footer Text',
      editor: lexicalEditor(),
    },
    {
      name: 'showNightModeToggle',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      label: 'Show Night Mode Toggle',
    },
    {
      name: 'showMenuQuickLinksMenu',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      label: 'Show Quick Links Menu',
    },
    {
      name: 'quickLinks',
      type: 'array',
      label: 'Quick Links',
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
      ],
    },
  ],
}
