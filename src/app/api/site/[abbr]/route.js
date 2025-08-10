import { getRequestContext } from '@cloudflare/next-on-pages'
import { sites as fallbackSites } from '@/src/data/sites'

export const runtime = 'edge'

function normalizeRowToSite(row) {
  if (!row) return null
  const id = row.id || row.slug || row.abbrlink || row.link || row.permalink
  const url = row.link || row.permalink
  const titleEn = row.title_en || row.title || ''
  const titleZh = row.title_zh || row.title || ''
  const descEn = row.desc_en || row.description || row.sub_title || ''
  const descZh = row.desc_zh || row.description || row.sub_title || ''
  return {
    id,
    url,
    title: { en: titleEn, zh: titleZh },
    pitch: { en: descEn, zh: descZh },
    icon: row.icon || null,
    slug: row.slug || null,
    abbrlink: row.abbrlink || null,
    permalink: row.permalink || null,
    date: row.date || null,
  }
}

export async function GET(_req, { params }) {
  const abbr = params?.abbr
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
        title: { en: 'Local Mock Demo', zh: '本地Mock演示' },
        pitch: { en: 'This is a locally mocked post for development.', zh: '本地开发环境下的模拟站点，便于预览与调试。' },
      })
    }
    const match = fallbackSites.find(s => s.id === abbr || s.slug === abbr)
    if (match) return Response.json(match)
  }
  return Response.json({ error: 'Not found' }, { status: 404 })
}
