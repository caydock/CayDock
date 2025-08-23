import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET(request, { params }) {
  try {
    const { abbr } = await params
    
    if (!abbr) {
      return Response.json({ error: '缺少abbr参数' }, { status: 400 })
    }

    // 本地开发环境直接使用静态数据
    try {
      const { env } = getRequestContext()
      const db = env.DB

      if (db && typeof db.prepare === 'function') {
      // 查询数据库
      const result = await db.prepare(`
        SELECT id, abbrlink, slug, title, title_en, sub_title, icon, link, permalink, date, isShow
        FROM sites 
        WHERE abbrlink = ? AND isShow = 1
        LIMIT 1
      `).bind(abbr).first()

      if (result) {
        const site = {
          id: result.id,
          abbrlink: result.abbrlink,
          slug: result.slug,
          title: {
            en: result.title_en || result.title,
            zh: result.title_zh || result.title
          },
          sub_title: result.sub_title,
          icon: result.icon,
          url: result.link || result.permalink,
          date: result.date,
          isShow: result.isShow
        }
        
        return Response.json(site)
      } else {
        return Response.json({ error: '网站不存在或未上线' }, { status: 404 })
      }
    }
    } catch (error) {
      // 如果获取Cloudflare环境失败，使用静态数据
      const { sites } = await import('@/src/data/sites')
      
      const site = sites.find(s => s.abbrlink === abbr || s.id === abbr)
      if (site) {
        return Response.json({
          id: site.id,
          abbrlink: site.abbrlink,
          title: {
            en: site.title?.en || site.title,
            zh: site.title?.zh || site.title
          },
          url: site.url,
          isShow: 1
        })
      } else {
        return Response.json({ error: '网站不存在' }, { status: 404 })
      }
    }
    
  } catch (error) {
    console.error('查询网站失败:', error)
    return Response.json({ 
      error: '查询失败', 
      message: error.message 
    }, { status: 500 })
  }
}
