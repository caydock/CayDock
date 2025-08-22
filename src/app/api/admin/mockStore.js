import { sites as fallbackSites } from '@/src/data/sites'

function mapSiteToRow(s) {
  const titleEn = s?.title_en || s?.title?.en || ''
  const titleZh = s?.title_zh || s?.title?.zh || ''
  const descEn = s?.pitch?.en || s?.desc_en || s?.description || s?.sub_title || ''
  const descZh = s?.pitch?.zh || s?.desc_zh || s?.description || s?.sub_title || ''
  return {
    id: s.id || s.slug || s.abbrlink || (s.url || s.link),
    abbrlink: s.abbrlink || null,
    slug: s.slug || null,
    title: titleEn || titleZh || '',
    title_en: s.title_en || titleEn || null,
    title_zh: s.title_zh || titleZh || null,
    description: s.description || descEn || descZh || '',
    desc_en: s.desc_en || descEn || null,
    desc_zh: s.desc_zh || descZh || null,
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
      (r.title_zh || '').toLowerCase().includes(lc) ||
      (r.description || '').toLowerCase().includes(lc) ||
      (r.desc_en || '').toLowerCase().includes(lc) ||
      (r.desc_zh || '').toLowerCase().includes(lc) ||
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
  next.title_en = typeof next.title_en === 'object' ? (next.title_en?.en || next.title_en?.zh || '') : next.title_en
  next.title_zh = typeof next.title_zh === 'object' ? (next.title_zh?.zh || next.title_zh?.en || '') : next.title_zh
  next.description = typeof next.description === 'object' ? '' : next.description
  next.desc_en = typeof next.desc_en === 'object' ? '' : next.desc_en
  next.desc_zh = typeof next.desc_zh === 'object' ? '' : next.desc_zh
  next.title = next.title_en || next.title_zh || next.title || ''
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
