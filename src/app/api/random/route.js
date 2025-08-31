import { getRequestContext } from '@cloudflare/next-on-pages'
import { sites as fallbackSites } from '@/src/data/sites'
import { normalizeRowToSite } from '@/src/utils/siteUtils'

export const runtime = 'edge'

// NOTE: Schema creation is handled via D1 migrations; API should not modify schema.

export async function GET() {
  // Production/Cloudflare: require D1; Local (non-CF runtime): fallback to default data
  let isCloudflareRuntime = true
  let env
  try {
    ;({ env } = getRequestContext())
  } catch {
    isCloudflareRuntime = false
  }

  if (isCloudflareRuntime) {
    try {
      const db = env?.DB || ((globalThis && (globalThis.DB || globalThis.env?.DB)) || null)
      if (!db || typeof db.prepare !== 'function') {
        return Response.json({ error: 'DB binding not available' }, { status: 503 })
      }
      const row = await db.prepare(
        `SELECT * FROM sites WHERE isShow = 1 ORDER BY random() LIMIT 1`
      ).first()
      const site = normalizeRowToSite(row)
      if (site?.url) return Response.json(site)
      return Response.json({ error: 'No site available' }, { status: 404 })
    } catch (error) {
      return Response.json({ error: 'Failed to get random site', message: String(error?.message || error) }, { status: 500 })
    }
  }

  // Local (non-CF) fallback for development only
  if (Array.isArray(fallbackSites) && fallbackSites.length > 0) {
    const idx = Math.floor(Math.random() * fallbackSites.length)
    return Response.json(fallbackSites[idx])
  }
  return Response.json({ error: 'No site available' }, { status: 404 })
}
// old fallback implementation removed (duplicated exports)