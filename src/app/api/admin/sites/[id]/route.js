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

function getProvidedToken(request) {
  const url = new URL(request.url)
  const headerToken = request.headers.get('x-admin-token') || ''
  const auth = request.headers.get('authorization') || ''
  const queryToken = url.searchParams.get('token') || ''
  let bearer = ''
  if (auth.toLowerCase().startsWith('bearer ')) bearer = auth.slice(7)
  const token = (headerToken || bearer || queryToken || '').trim()
  return token
}

function getLockInfo(request) {
  const cookie = request.headers.get('cookie') || ''
  const m = /(?:^|; )admin_lock_until=([^;]+)/.exec(cookie)
  const until = m ? parseInt(decodeURIComponent(m[1]), 10) : 0
  const now = Date.now()
  return { locked: Number.isFinite(until) && until > now, until }
}

function buildLockHeaders(until) {
  const maxAge = Math.max(0, Math.floor((until - Date.now()) / 1000))
  const cookie = [
    `admin_lock_until=${encodeURIComponent(String(until))}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Secure',
    `Max-Age=${maxAge}`,
  ].join('; ')
  return { 'set-cookie': cookie, 'x-lock-until': String(until) }
}

function getFailInfo(request) {
  const cookie = request.headers.get('cookie') || ''
  const m = /(?:^|; )admin_fail_count=([^;]+)/.exec(cookie)
  const count = m ? parseInt(decodeURIComponent(m[1]), 10) : 0
  return Number.isFinite(count) && count > 0 ? count : 0
}

function buildFailHeaders(count) {
  const cookie = [
    `admin_fail_count=${encodeURIComponent(String(count))}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Secure',
    'Max-Age=3600',
  ].join('; ')
  return { 'set-cookie': cookie, 'x-fail-count': String(count) }
}

function buildClearFailHeaders() {
  const cookie = [
    'admin_fail_count=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0'
  ].join('; ')
  return { 'set-cookie': cookie }
}

export async function PATCH(request, { params }) {
  const lock = getLockInfo(request)
  if (lock.locked) {
    const headers = buildLockHeaders(lock.until)
    return new Response(JSON.stringify({ error: 'locked', until: lock.until }), { status: 403, headers: { 'content-type': 'application/json', ...headers } })
  }
  const id = params?.id
  const url = new URL(request.url)
  const token = getProvidedToken(request)

  let env
  try { ({ env } = getRequestContext()) } catch {}
  const expected = String(env?.ADMIN_TOKEN || process.env.ADMIN_TOKEN || '').trim()
  if (!expected || token !== expected) {
    const prev = getFailInfo(request)
    const curr = prev + 1
    if (curr >= 3) {
      const until = Date.now() + 60 * 60 * 1000
      const headers = buildLockHeaders(until)
      return new Response(JSON.stringify({ error: 'unauthorized', until }), { status: 401, headers: { 'content-type': 'application/json', ...headers } })
    }
    const headers = buildFailHeaders(curr)
    return new Response(JSON.stringify({ error: 'unauthorized', attemptsLeft: 3 - curr }), { status: 401, headers: { 'content-type': 'application/json', ...headers } })
  }

  const clearFailHeaders = buildClearFailHeaders()

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
    return ok ? new Response(JSON.stringify({ ok: true, mock: true }), { status: 200, headers: { 'content-type': 'application/json', ...clearFailHeaders } }) : Response.json({ error: 'not found' }, { status: 404 })
  } else {
    const setSql = Object.keys(updates).map(k => `${k} = ?`).join(', ')
    const values = Object.values(updates)
    await db.prepare(`UPDATE sites SET ${setSql} WHERE id = ?`).bind(...values, id).run()
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json', ...clearFailHeaders } })
  }
}

export async function DELETE(request, { params }) {
  const lock = getLockInfo(request)
  if (lock.locked) {
    const headers = buildLockHeaders(lock.until)
    return new Response(JSON.stringify({ error: 'locked', until: lock.until }), { status: 403, headers: { 'content-type': 'application/json', ...headers } })
  }
  const id = params?.id
  const url = new URL(request.url)
  const token = getProvidedToken(request)

  let env
  try { ({ env } = getRequestContext()) } catch {}
  const expected = String(env?.ADMIN_TOKEN || process.env.ADMIN_TOKEN || '').trim()
  if (!expected || token !== expected) {
    const prev = getFailInfo(request)
    const curr = prev + 1
    if (curr >= 3) {
      const until = Date.now() + 60 * 60 * 1000
      const headers = buildLockHeaders(until)
      return new Response(JSON.stringify({ error: 'unauthorized', until }), { status: 401, headers: { 'content-type': 'application/json', ...headers } })
    }
    const headers = buildFailHeaders(curr)
    return new Response(JSON.stringify({ error: 'unauthorized', attemptsLeft: 3 - curr }), { status: 401, headers: { 'content-type': 'application/json', ...headers } })
  }

  const db = env?.DB
  const useMock = !db || typeof db.prepare !== 'function'

  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  if (useMock) {
    const ok = deleteMock(id)
    return ok ? new Response(JSON.stringify({ ok: true, mock: true }), { status: 200, headers: { 'content-type': 'application/json', ...buildClearFailHeaders() } }) : Response.json({ error: 'not found' }, { status: 404 })
  } else {
    await db.prepare(`DELETE FROM sites WHERE id = ?`).bind(id).run()
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json', ...buildClearFailHeaders() } })
  }
}
