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
    const response = await fetch(itunesUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://music.apple.com/',
      },
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

