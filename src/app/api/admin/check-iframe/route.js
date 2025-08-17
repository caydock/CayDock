import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

// 检测网站是否允许iframe嵌入
async function checkIframeAllowed(url) {
  try {
    // 检查X-Frame-Options头部
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; W3Cay/1.0)',
      },
    })
    
    const xFrameOptions = response.headers.get('X-Frame-Options')
    const csp = response.headers.get('Content-Security-Policy')
    
    // 检查X-Frame-Options
    if (xFrameOptions) {
      const value = xFrameOptions.toLowerCase()
      if (value === 'deny' || value === 'sameorigin') {
        return { allowed: false, reason: `X-Frame-Options: ${xFrameOptions}` }
      }
    }
    
    // 检查Content-Security-Policy的frame-ancestors
    if (csp) {
      const frameAncestorsMatch = csp.match(/frame-ancestors\s+([^;]+)/i)
      if (frameAncestorsMatch) {
        const frameAncestors = frameAncestorsMatch[1].toLowerCase()
        if (frameAncestors.includes('none') || frameAncestors.includes('self')) {
          return { allowed: false, reason: `CSP frame-ancestors: ${frameAncestorsMatch[1]}` }
        }
      }
    }
    
    return { allowed: true, reason: '允许嵌入' }
    
  } catch (error) {
    return { allowed: null, reason: `检查失败: ${error.message}` }
  }
}

// 下线网站
async function unpublishSite(db, siteId) {
  try {
    await db.prepare(
      `UPDATE sites SET isShow = 0 WHERE id = ?`
    ).bind(siteId).run()
    
    return { success: true, message: '网站已下线' }
  } catch (error) {
    return { success: false, message: `下线失败: ${error.message}` }
  }
}

export async function POST(request) {
  try {
    let db;
    
    // 尝试获取Cloudflare环境
    try {
      const { env } = getRequestContext()
      db = env?.DB
    } catch (error) {
      // 本地开发环境，返回模拟数据
      console.log('本地开发环境，返回模拟检测结果')
      
      const { siteId } = await request.json()
      
      if (!siteId) {
        return Response.json({ error: '缺少网站ID' }, { status: 400 })
      }
      
      // 模拟检测结果
      const mockResults = {
        'popcat': { allowed: false, reason: 'X-Frame-Options: SAMEORIGIN' },
        'rleonardi-com': { allowed: false, reason: 'X-Frame-Options: SAMEORIGIN' },
        'example-com': { allowed: true, reason: '允许嵌入' }
      }
      
      const checkResult = mockResults[siteId] || { allowed: true, reason: '允许嵌入' }
      
      return Response.json({
        siteId,
        siteTitle: `测试网站 ${siteId}`,
        siteUrl: `https://example.com/${siteId}`,
        checkResult,
        unpublishResult: checkResult.allowed === false ? 
          { success: true, message: '网站已下线（模拟）' } : null
      })
    }
    
    if (!db) {
      return Response.json({ error: '数据库连接失败' }, { status: 500 })
    }
    
    const { siteId } = await request.json()
    
    if (!siteId) {
      return Response.json({ error: '缺少网站ID' }, { status: 400 })
    }
    
    // 获取网站信息
    const site = await db.prepare(
      `SELECT id, link, title FROM sites WHERE id = ?`
    ).bind(siteId).first()
    
    if (!site) {
      return Response.json({ error: '网站不存在' }, { status: 404 })
    }
    
    // 检测iframe限制
    const checkResult = await checkIframeAllowed(site.link)
    
    let result = {
      siteId,
      siteTitle: site.title,
      siteUrl: site.link,
      checkResult
    }
    
    // 如果不允许iframe，自动下线
    if (checkResult.allowed === false) {
      const unpublishResult = await unpublishSite(db, siteId)
      result.unpublishResult = unpublishResult
    }
    
    return Response.json(result)
    
  } catch (error) {
    return Response.json({ 
      error: '检测失败', 
      message: error.message 
    }, { status: 500 })
  }
} 