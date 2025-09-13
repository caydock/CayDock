/**
 * 站点相关的工具函数
 * 用于避免在多个API路由中重复定义相同的函数
 */

/**
 * 将数据库行数据标准化为站点对象
 * @param {Object} row - 数据库行数据
 * @returns {Object|null} 标准化后的站点对象
 */
export function normalizeRowToSite(row) {
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
    title: { en: titleEn },
    icon: row.icon || null,
    slug: row.slug || null,
    abbrlink: row.abbrlink || null,
    permalink: row.permalink || null,
    date: row.date || null,
  }
}
