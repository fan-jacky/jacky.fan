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

function getAllowedOrigins() {
  const origins = new Set<string>([
    defaultFrontendUrl,
    'http://127.0.0.1:3000',
    defaultCmsUrl,
    'http://127.0.0.1:3001',
  ])

  if (process.env.LIVE_PREVIEW_URL) {
    origins.add(process.env.LIVE_PREVIEW_URL)
  }

  if (process.env.PAYLOAD_SERVER_URL) {
    origins.add(process.env.PAYLOAD_SERVER_URL)
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
      url: ({ data }) => {
        const frontendUrl = process.env.LIVE_PREVIEW_URL || defaultFrontendUrl
        const previewPath = typeof data?.url === 'string' && data.url.trim() ? data.url.trim() : '/'
        const normalizedPath = previewPath.startsWith('/') ? previewPath : `/${previewPath}`
        const previewUrl = new URL(normalizedPath, frontendUrl)

        previewUrl.searchParams.set('livePreview', 'true')

        return previewUrl.toString()
      },
      collections: ['pages'],
    },
  },
  serverURL: process.env.PAYLOAD_SERVER_URL || defaultCmsUrl,
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
