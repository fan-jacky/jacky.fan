import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import configPromise from '../payload.config'

const icons: [string, string][] = [
  ['React', 'react.svg'],
  ['Vue', 'vue.svg'],
  ['TypeScript', 'typescript.svg'],
  ['Next.js', 'nextjs.svg'],
  ['Nuxt', 'nuxt.svg'],
  ['Tailwind', 'tailwind.svg'],
  ['Payload', 'payload.svg'],
  ['Docker', 'docker.svg'],
  ['Node.js', 'nodejs.svg'],
]

export async function seedTechIcons() {
  const config = await configPromise
  const payload = await getPayload({ config })

  // Upload each icon as media
  const iconMap = new Map<string, string>() // name -> media id
  const iconsDir = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    '../../public/icons',
  )

  for (const [name, filename] of icons) {
    const filePath = path.join(iconsDir, filename)
    const buffer = fs.readFileSync(filePath)

    // Check if media already exists
    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: `icon-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` } },
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      // Delete existing to re-upload
      for (const doc of existing.docs) {
        await payload.delete({
          collection: 'media',
          id: doc.id,
          overrideAccess: true,
        })
      }
    }

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: `icon-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      },
      file: {
        data: buffer,
        mimetype: 'image/svg+xml',
        name: filename,
        size: buffer.length,
      },
      overrideAccess: true,
    })

    iconMap.set(name, String(media.id))
    console.log(`Uploaded ${name} icon: ${media.id}`)
  }

  // Find the home page
  const pages = await payload.find({
    collection: 'pages',
    where: { url: { equals: '/' } },
    overrideAccess: true,
  })

  if (pages.docs.length === 0) {
    console.error('Home page not found')
    return
  }

  const homePage = pages.docs[0]
  const contents = [...(homePage.contents || [])]

  // Find and update the tech stack section
  let updated = false
  for (let i = 0; i < contents.length; i++) {
    const block = contents[i] as any
    if (block.blockType === 'pageTechStackSection') {
      const items = block.items || []
      const updatedItems = items.map((item: any) => {
        const iconId = iconMap.get(item.name)
        if (iconId) {
          return { ...item, icon: iconId }
        }
        return item
      })
      contents[i] = { ...block, items: updatedItems }
      updated = true
    }
  }

  if (!updated) {
    console.error('Tech stack section not found in home page')
    return
  }

  await payload.update({
    collection: 'pages',
    id: homePage.id,
    data: { contents },
    overrideAccess: true,
  })

  console.log('Updated home page tech stack icons')
}

// Direct execution disabled — seed is called via the API route instead.
// To seed manually, uncomment below or POST /api/seed-prototype
// seedTechIcons()
//   .then(() => {
//     console.log('Done')
//     process.exit(0)
//   })
//   .catch((err) => {
//     console.error(err)
//     process.exit(1)
//   })
