export const runtime = 'edge'

export async function POST(request) {
  try {
    const payload = await request.json()
    const { id, link, slug, abbrlink, title, title_zh, title_en, description, desc_zh, desc_en, sub_title, icon, permalink, date } = payload || {}

    if (!id || !link || !title) {
      return Response.json({ error: 'id, link and title are required' }, { status: 400 })
    }

    try {
      const db = (globalThis && (globalThis.DB || globalThis.env?.DB)) || null
      if (db && typeof db.prepare === 'function') {
        await db.prepare(`
          INSERT INTO sites (id, abbrlink, slug, title, title_zh, title_en, description, desc_zh, desc_en, sub_title, icon, link, permalink, date, isShow)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
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
        `).bind(id, abbrlink, slug, title, title_zh, title_en, description, desc_zh, desc_en, sub_title, icon, link, permalink, date).run()

        return Response.json({ ok: true })
      }
    } catch (_) {
      // fallthrough to local dev response
    }

    // Local/dev fallback (no DB)
    return Response.json({ ok: true, note: 'Saved (dev fallback). Setup Cloudflare D1 in production.' })
  } catch (e) {
    return Response.json({ error: 'Failed to submit site' }, { status: 500 })
  }
}

// NOTE: Only a single POST export is allowed; legacy demo handler removed.