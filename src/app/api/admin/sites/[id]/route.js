export const runtime = 'edge'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { updateMock, deleteMock } from '@/src/app/api/admin/mockStore'

function filterUpdatable(payload) {
  const allowed = new Set(['title','title_en','title_zh','description','desc_en','desc_zh','sub_title','icon','link','permalink','date','slug','abbrlink','isShow'])
  const updates = {}
  for (const [k, v] of Object.entries(payload || {})) {
    if (allowed.has(k) && v !== undefined) updates[k] = v
  }
  return updates
}

export async function PATCH(request, { params }) {
  const id = params?.id
  const url = new URL(request.url)
  const token = request.headers.get('x-admin-token') || url.searchParams.get('token') || ''

  let env
  try { ({ env } = getRequestContext()) } catch {}
  const expected = env?.ADMIN_TOKEN || process.env.ADMIN_TOKEN || ''
  if (!expected || token !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const db = env?.DB
  const useMock = !db || typeof db.prepare !== 'function'

  let body
  try { body = await request.json() } catch { body = {} }
  const updates = filterUpdatable(body)
  if (!id || Object.keys(updates).length === 0) {
    return Response.json({ error: 'nothing to update' }, { status: 400 })
  }

  if (useMock) {
    const ok = updateMock(id, updates)
    return ok ? Response.json({ ok: true, mock: true }) : Response.json({ error: 'not found' }, { status: 404 })
  } else {
    const setSql = Object.keys(updates).map(k => `${k} = ?`).join(', ')
    const values = Object.values(updates)
    await db.prepare(`UPDATE sites SET ${setSql} WHERE id = ?`).bind(...values, id).run()
    return Response.json({ ok: true })
  }
}

export async function DELETE(request, { params }) {
  const id = params?.id
  const url = new URL(request.url)
  const token = request.headers.get('x-admin-token') || url.searchParams.get('token') || ''

  let env
  try { ({ env } = getRequestContext()) } catch {}
  const expected = env?.ADMIN_TOKEN || process.env.ADMIN_TOKEN || ''
  if (!expected || token !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const db = env?.DB
  const useMock = !db || typeof db.prepare !== 'function'

  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  if (useMock) {
    const ok = deleteMock(id)
    return ok ? Response.json({ ok: true, mock: true }) : Response.json({ error: 'not found' }, { status: 404 })
  } else {
    await db.prepare(`DELETE FROM sites WHERE id = ?`).bind(id).run()
    return Response.json({ ok: true })
  }
}
