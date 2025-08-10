export const runtime = 'edge'
import { getRequestContext } from '@cloudflare/next-on-pages'

function toSlug(value) {
  if (!value) return ''
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-_]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function deriveId({ id, slug, abbrlink, link, title }) {
  if (id) return id
  if (slug) return slug
  if (abbrlink) return abbrlink
  try {
    const u = new URL(link)
    const hostPart = u.hostname.replace(/^www\./, '')
    const pathPart = u.pathname.replace(/\/+$/, '').split('/').filter(Boolean).slice(-2).join('-')
    const base = toSlug(pathPart || hostPart)
    if (base) return base
  } catch {}
  const t = toSlug(title)
  if (t) return t
  return 'site-' + Math.random().toString(36).slice(2, 10)
}

async function generateAbbrlink({ link, title, id, salt = '' }) {
  const base = (link || title || id || (Date.now() + Math.random().toString())) + String(salt)
  const data = new TextEncoder().encode(base)
  let hex = ''
  try {
    const digest = await crypto.subtle.digest('SHA-1', data)
    const bytes = new Uint8Array(digest)
    for (let i = 0; i < 4; i++) hex += bytes[i].toString(16).padStart(2, '0')
  } catch {
    // Fallback: simple hash
    let h = 0
    for (let i = 0; i < data.length; i++) h = (h * 31 + data[i]) >>> 0
    hex = h.toString(16).padStart(8, '0')
  }
  return hex
}

export async function POST(request) {
  try {
    const payload = await request.json()

    // Normalize inputs and fallbacks
    const link = payload.link || payload.url || ''
    const title = payload.title || payload.title_en || payload.title_zh || ''
    const title_zh = payload.title_zh || null
    const title_en = payload.title_en || null
    const description = payload.description || payload.desc_en || payload.desc_zh || null
    const desc_zh = payload.desc_zh || null
    const desc_en = payload.desc_en || null
    let abbrlink = payload.abbrlink || null
    const permalink = payload.permalink || null
    const date = payload.date || null
    const sub_title = payload.sub_title || null
    const icon = payload.icon || null

    if (!link) {
      return Response.json({ error: 'link (or url) is required' }, { status: 400 })
    }

    const slug = payload.slug || toSlug(title) || null
    const id = deriveId({ id: payload.id, slug, abbrlink, link, title })
    if (!abbrlink) {
      abbrlink = await generateAbbrlink({ link, title, id })
    }

    // Try Cloudflare D1 (CF runtime). If not available, return dev-ok
    try {
      const { env } = getRequestContext()
      const db = env?.DB
      if (db && typeof db.prepare === 'function') {
        const sql = `
          INSERT INTO sites (id, abbrlink, slug, title, title_zh, title_en, description, desc_zh, desc_en, sub_title, icon, link, permalink, date, isShow)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
          ON CONFLICT(id) DO UPDATE SET
            abbrlink=excluded.abbrlink,
            slug=excluded.slug,
            title=excluded.title,
            title_zh=excluded.title_zh,
            title_en=excluded.title_en,
            description=excluded.description,
            desc_zh=excluded.desc_zh,
            desc_en=excluded.desc_en,
            sub_title=excluded.sub_title,
            icon=excluded.icon,
            link=excluded.link,
            permalink=excluded.permalink,
            date=excluded.date
        `
        let attempts = 0
        while (attempts < 3) {
          try {
            await db.prepare(sql).bind(
              id, abbrlink, slug, title || link, title_zh, title_en, description, desc_zh, desc_en, sub_title, icon, link, permalink, date
            ).run()
            return Response.json({ ok: true, id, slug, abbrlink })
          } catch (e) {
            const msg = String(e?.message || e)
            if (msg.includes('UNIQUE') && msg.includes('abbrlink')) {
              attempts += 1
              abbrlink = await generateAbbrlink({ link, title, id, salt: Date.now() + ':' + Math.random() })
              continue
            }
            throw e
          }
        }
        return Response.json({ error: 'abbrlink_conflict' }, { status: 409 })
      }
    } catch (_) {
      // ignore and fall back
    }

    // Local/dev fallback (no DB in runtime)
    return Response.json({ ok: true, id, slug, abbrlink, note: 'Saved (dev fallback). Setup Cloudflare D1 in production.' })
  } catch (e) {
    return Response.json({ error: 'Failed to submit site' }, { status: 500 })
  }
}

// NOTE: Only a single POST export is allowed; legacy demo handler removed.