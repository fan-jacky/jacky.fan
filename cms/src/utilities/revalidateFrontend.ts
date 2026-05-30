const defaultFrontendUrl = 'http://localhost:3000'

export const SITE_SETTINGS_TAG = 'site-settings'

function getFrontendUrl(): string | null {
  const configuredUrl = process.env.LIVE_PREVIEW_URL?.trim()

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '')
  }

  if (process.env.NODE_ENV !== 'production') {
    return defaultFrontendUrl
  }

  return null
}

function getRevalidateSecret(): string | null {
  return process.env.REVALIDATE_SECRET ?? process.env.PAYLOAD_SECRET ?? null
}

export async function revalidateFrontendTag(tag: string): Promise<void> {
  const frontendUrl = getFrontendUrl()

  if (!frontendUrl) return

  const endpoint = new URL('/api/revalidate', frontendUrl)
  const secret = getRevalidateSecret()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (secret) {
    headers['x-revalidate-secret'] = secret
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tag }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Revalidate request failed (${response.status}): ${errorText}`)
  }
}