import { getRequestContext } from '@cloudflare/next-on-pages'

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

// NOTE: Schema creation is handled via D1 migrations; API should not modify schema.

export async function GET() {
  // Only use Cloudflare D1. If unavailable/empty, return 404.
  try {
    let db = null
    try {
      const { env } = getRequestContext()
      db = env?.DB || null
    } catch (_) {
      // not in Cloudflare runtime during local Next dev (wrangler pages dev will inject DB)
    }
    db = db || ((globalThis && (globalThis.DB || globalThis.env?.DB)) || null)
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
// old fallback implementation removed (duplicated exports)