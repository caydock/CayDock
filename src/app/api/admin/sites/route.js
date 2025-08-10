export const runtime = 'edge'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { listMock } from '@/src/app/api/admin/mockStore'

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

function likeWrap(v) { return `%${v || ''}%` }

export async function GET(request) {
  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') || '20', 10)))
  const q = (url.searchParams.get('q') || '').trim()
  const isShowParam = url.searchParams.get('isShow')
  const token = getProvidedToken(request)

  let env
  try { ({ env } = getRequestContext()) } catch {}
  const expected = String(env?.ADMIN_TOKEN || process.env.ADMIN_TOKEN || '').trim()
  if (!expected || token !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const db = env?.DB
  const useMock = !db || typeof db.prepare !== 'function'

  // Build filters
  const where = []
  const params = []
  if (isShowParam === '0' || isShowParam === '1') {
    where.push('isShow = ?')
    params.push(parseInt(isShowParam, 10))
  }
  if (q) {
    where.push(`(title LIKE ? OR title_zh LIKE ? OR title_en LIKE ? OR description LIKE ? OR desc_zh LIKE ? OR desc_en LIKE ? OR link LIKE ? OR id LIKE ? OR slug LIKE ? OR abbrlink LIKE ?)`)
    const like = likeWrap(q)
    params.push(like, like, like, like, like, like, like, like, like, like)
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  if (useMock) {
    const { items, total } = listMock({ q, isShow: (isShowParam==='0'||isShowParam==='1')?parseInt(isShowParam,10):undefined, page, pageSize })
    return Response.json({ items, total, page, pageSize, mock: true })
  } else {
    // Count total
    const countRow = await db.prepare(`SELECT COUNT(*) AS c FROM sites ${whereSql}`).bind(...params).first()
    const total = Number(countRow?.c || 0)

    // Fetch page of items
    const offset = (page - 1) * pageSize
    const data = await db.prepare(
      `SELECT * FROM sites ${whereSql} ORDER BY isShow ASC, COALESCE(date, '') DESC, id DESC LIMIT ? OFFSET ?`
    ).bind(...params, pageSize, offset).all()

    const items = Array.isArray(data?.results) ? data.results : []
    return Response.json({ items, total, page, pageSize })
  }
}
