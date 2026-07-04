import { getPayload } from 'payload'
import configPromise from '../payload.config'

// Icon mapping: normalized label key -> icon media ID
// These IDs are from the production CMS (seeded by seedTechIcons.ts)
const ICON_MAP: Record<string, string> = {
  react: '6a46643bdd83a093312ba1e7',
  'react native': '6a46643bdd83a093312ba1e7',
  vue: '6a46643bdd83a093312ba1e3',
  'vue.js': '6a46643bdd83a093312ba1e3',
  typescript: '6a46643bdd83a093312ba1df',
  'next.js': '6a46643bdd83a093312ba1db',
  nextjs: '6a46643bdd83a093312ba1db',
  nuxt: '6a46643bdd83a093312ba1d7',
  'nuxt.js': '6a46643bdd83a093312ba1d7',
  nuxtjs: '6a46643bdd83a093312ba1d7',
  'nuxt content': '6a46643bdd83a093312ba1d7',
  tailwind: '6a46643bdd83a093312ba1d3',
  'tailwind css': '6a46643bdd83a093312ba1d3',
  payload: '6a46643bdd83a093312ba1cf',
  'payload cms': '6a46643bdd83a093312ba1cf',
  docker: '6a46643bdd83a093312ba1cb',
  'node.js': '6a46643bdd83a093312ba1c7',
  nodejs: '6a46643bdd83a093312ba1c7',
}

function findIconId(label: string): string | null {
  const key = label.trim().toLowerCase()
  if (ICON_MAP[key]) return ICON_MAP[key]

  // Partial match — e.g. "React Three Fiber" contains "react"
  for (const [mapKey, iconId] of Object.entries(ICON_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return iconId
    }
  }
  return null
}

export async function updateProjectTechIcons() {
  const config = await configPromise
  const payload = await getPayload({ config })

  const projects = await payload.find({
    collection: 'projects',
    depth: 2,
    limit: 50,
    overrideAccess: true,
  })

  let updatedCount = 0
  let iconCount = 0

  for (const project of projects.docs) {
    const contents = (project.contents ?? []) as any[]
    let changed = false

    const newContents = contents.map((block: any) => {
      if (
        block.blockType === 'projectTechStackSection' &&
        Array.isArray(block.items)
      ) {
        const newItems = block.items.map((item: any) => {
          const label = item.label ?? ''
          const iconId = findIconId(label)
          if (iconId && !item.icon) {
            changed = true
            iconCount++
            payload.logger.info(
              `  ${project.title}: "${label}" -> icon ${iconId}`,
            )
            return { ...item, icon: iconId }
          }
          return { ...item }
        })
        return { ...block, items: newItems }
      }
      return { ...block }
    })

    if (changed) {
      await payload.update({
        collection: 'projects',
        id: project.id,
        data: { contents: newContents, _status: 'published' },
        overrideAccess: true,
      })
      updatedCount++
      payload.logger.info(`  -> Updated ${project.title}`)
    } else {
      payload.logger.info(`  ${project.title}: no changes needed`)
    }
  }

  payload.logger.info(
    `Done: ${iconCount} icons set across ${updatedCount} projects`,
  )
}

// Allow running standalone
async function main() {
  await updateProjectTechIcons()
  process.exit(0)
}

// Check if this is the main module
const isMainModule =
  process.argv[1] &&
  (process.argv[1].endsWith('updateProjectTechIcons.ts') ||
    process.argv[1].endsWith('updateProjectTechIcons.js'))

if (isMainModule) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
