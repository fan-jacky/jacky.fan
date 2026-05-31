import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { ProjectPageSettings } from './globals/ProjectPageSettings'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const defaultFrontendUrl = 'http://localhost:3000'
const defaultCmsUrl = 'http://localhost:3001'
const isProduction = process.env.NODE_ENV === 'production'

const frontendUrl = process.env.LIVE_PREVIEW_URL || (!isProduction ? defaultFrontendUrl : undefined)
const cmsUrl =
  process.env.PAYLOAD_SERVER_URL ||
  process.env.NEXT_PUBLIC_PAYLOAD_CMS_URL ||
  (!isProduction ? defaultCmsUrl : undefined)

function getLivePreviewPath({
  collectionConfig,
  data,
}: {
  collectionConfig?: { slug?: string } | null
  data?: { alias?: unknown; url?: unknown } | null
}) {
  if (collectionConfig?.slug === 'projects') {
    const alias = typeof data?.alias === 'string' ? data.alias.trim() : ''

    if (alias) {
      return `/projects/${alias}`
    }
  }

  if (typeof data?.url === 'string' && data.url.trim()) {
    return data.url.trim()
  }

  return '/'
}

function getAllowedOrigins() {
  const origins = new Set<string>()

  if (!isProduction) {
    origins.add(defaultFrontendUrl)
    origins.add('http://127.0.0.1:3000')
    origins.add(defaultCmsUrl)
    origins.add('http://127.0.0.1:3001')
  }

  if (frontendUrl) {
    origins.add(frontendUrl)
  }

  if (cmsUrl) {
    origins.add(cmsUrl)
  }

  return Array.from(origins)
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ collectionConfig, data }) => {
        const resolvedFrontendUrl = frontendUrl || defaultFrontendUrl
        const previewPath = getLivePreviewPath({ collectionConfig, data })
        const normalizedPath = previewPath.startsWith('/') ? previewPath : `/${previewPath}`
        const previewUrl = new URL(normalizedPath, resolvedFrontendUrl)

        previewUrl.searchParams.set('livePreview', 'true')

        return previewUrl.toString()
      },
      collections: ['pages', 'projects'],
    },
  },
  serverURL: cmsUrl,
  cors: getAllowedOrigins(),
  csrf: getAllowedOrigins(),
  collections: [Users, Media, Pages, Projects],
  editor: lexicalEditor(),
  globals: [ProjectPageSettings, SiteSettings],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
