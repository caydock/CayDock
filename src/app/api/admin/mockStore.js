import { sites as fallbackSites } from '@/src/data/sites'

function mapSiteToRow(s) {
  const titleEn = s?.title_en || s?.title?.en || ''
  
  return {
    id: s.id || s.slug || s.abbrlink || (s.url || s.link),
    abbrlink: s.abbrlink || null,
    slug: s.slug || null,
    title: titleEn || '',
    title_en: s.title_en || titleEn || null,

    sub_title: s.sub_title || null,
    icon: s.icon || null,
    link: s.url || s.link || '',
    permalink: s.permalink || null,
    date: s.date || null,
    isShow: typeof s.isShow === 'number' ? s.isShow : 1,
  }
}

let mockRows = null

function ensureInit() {
  if (!mockRows) {
    mockRows = Array.isArray(fallbackSites) ? fallbackSites.map(mapSiteToRow) : []
  }
}

export function listMock({ q, isShow, page, pageSize }) {
  ensureInit()
  let rows = [...mockRows]
  if (isShow === 0 || isShow === 1) rows = rows.filter(r => r.isShow === isShow)
  if (q) {
    const lc = q.toLowerCase()
    rows = rows.filter(r => (
      (r.title || '').toLowerCase().includes(lc) ||
      (r.title_en || '').toLowerCase().includes(lc) ||

      (r.link || '').toLowerCase().includes(lc) ||
      (r.id || '').toLowerCase().includes(lc) ||
      (r.slug || '').toLowerCase().includes(lc) ||
      (r.abbrlink || '').toLowerCase().includes(lc)
    ))
  }
  rows.sort((a,b)=> (a.isShow - b.isShow) || String(b.date||'').localeCompare(String(a.date||'')) || String(b.id||'').localeCompare(String(a.id||'')))
  const total = rows.length
  const start = (page - 1) * pageSize
  const items = rows.slice(start, start + pageSize)
  return { items, total }
}

export function updateMock(id, updates) {
  ensureInit()
  const idx = mockRows.findIndex(r => r.id === id)
  if (idx === -1) return false
  const next = { ...mockRows[idx], ...updates }
  // Normalize title fields to plain strings to avoid React rendering objects
  next.title_en = typeof next.title_en === 'object' ? (next.title_en?.en || '') : next.title_en

  next.title = next.title_en || next.title || ''
  mockRows[idx] = next
  return true
}

export function deleteMock(id) {
  ensureInit()
  const idx = mockRows.findIndex(r => r.id === id)
  if (idx === -1) return false
  mockRows.splice(idx, 1)
  return true
}
