import { getRequestContext } from '@cloudflare/next-on-pages'
import { sites as fallbackSites } from '@/src/data/sites'
import { normalizeRowToSite } from '@/src/utils/siteUtils'

export const runtime = 'edge'

export async function GET(_req, ctx) {
  const raw = (await ctx?.params)?.abbr
  const abbr = typeof raw === 'string' ? raw.replace(/\.html$/i, '') : raw
  if (!abbr) {
    return Response.json({ error: 'abbrlink required' }, { status: 400 })
  }

  // Production/Cloudflare: require D1
  let isCloudflareRuntime = true
  let env
  try { ({ env } = getRequestContext()) } catch { isCloudflareRuntime = false }

  if (isCloudflareRuntime) {
    try {
      const db = env?.DB || ((globalThis && (globalThis.DB || globalThis.env?.DB)) || null)
      if (!db || typeof db.prepare !== 'function') {
        return Response.json({ error: 'DB binding not available' }, { status: 503 })
      }
      const row = await db.prepare(
        `SELECT * FROM sites WHERE isShow = 1 AND (abbrlink = ? OR slug = ? OR id = ?) LIMIT 1`
      ).bind(abbr, abbr, abbr).first()
      const site = normalizeRowToSite(row)
      if (site?.url) return Response.json(site)
      return Response.json({ error: 'Not found' }, { status: 404 })
    } catch (error) {
      return Response.json({ error: 'Failed to get site', message: String(error?.message || error) }, { status: 500 })
    }
  }

  // Local dev fallback: mock specific abbr and try bundled data by id/slug
  if (Array.isArray(fallbackSites) && fallbackSites.length > 0) {
    // Special local mock for 824079b
    if (abbr === 'test') {
      const origin = (() => { try { return new URL(_req.url).origin } catch { return '' } })()      
      return Response.json({
        id: '824079b',
        url: 'https://w3cay.com',
                  title: { en: 'Local Mock Demo' },
    
      })
    }
    const match = fallbackSites.find(s => s.id === abbr || s.slug === abbr)
    if (match) return Response.json(match)
  }
  return Response.json({ error: 'Not found' }, { status: 404 })
}
