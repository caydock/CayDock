export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const searchParams = url.searchParams

  // 构建 iTunes Search API 请求
  const itunesParams = new URLSearchParams()
  itunesParams.set('term', searchParams.get('term') || '')
  itunesParams.set('media', searchParams.get('media') || 'music')
  itunesParams.set('entity', searchParams.get('entity') || 'album')
  itunesParams.set('country', searchParams.get('country') || 'us')
  itunesParams.set('limit', searchParams.get('limit') || '50')

  const itunesUrl = `https://itunes.apple.com/search?${itunesParams.toString()}`

  try {
    // 使用最简化的请求，让 Cloudflare 使用默认的 User-Agent
    // iTunes API 可能对自定义 User-Agent 敏感
    const response = await fetch(itunesUrl, {
      method: 'GET',
      // 不设置自定义 headers，使用 Cloudflare 的默认行为
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('iTunes API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: itunesUrl
      })
      throw new Error(`iTunes API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // 返回 JSON 响应，添加 CORS 头
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || '搜索失败' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

