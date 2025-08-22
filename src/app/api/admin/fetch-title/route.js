import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

// 抓取网站标题
async function fetchWebsiteTitle(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; W3Cay/1.0)',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // 尝试多种方式提取标题
    let title = null
    
    // 1. 从 <title> 标签提取
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (titleMatch) {
      title = titleMatch[1].trim()
    }
    
    // 2. 从 Open Graph title 提取
    if (!title) {
      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
      if (ogTitleMatch) {
        title = ogTitleMatch[1].trim()
      }
    }
    
    // 3. 从 Twitter Card title 提取
    if (!title) {
      const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i)
      if (twitterTitleMatch) {
        title = twitterTitleMatch[1].trim()
      }
    }
    
    // 4. 从 h1 标签提取
    if (!title) {
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
      if (h1Match) {
        title = h1Match[1].trim()
      }
    }
    
    // 清理标题
    if (title) {
      // 移除多余的空白字符
      title = title.replace(/\s+/g, ' ').trim()
      // 限制长度
      if (title.length > 100) {
        title = title.substring(0, 100) + '...'
      }
    }
    
    return { title }
    
  } catch (error) {
    return { title: null, error: error.message }
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return Response.json({ error: '缺少URL参数' }, { status: 400 })
    }
    
    // 验证URL格式
    try {
      new URL(url)
    } catch {
      return Response.json({ error: '无效的URL格式' }, { status: 400 })
    }
    
    // 抓取标题
    const result = await fetchWebsiteTitle(url)
    
    return Response.json(result)
    
  } catch (error) {
    return Response.json({ 
      error: '抓取标题失败', 
      message: error.message 
    }, { status: 500 })
  }
}
