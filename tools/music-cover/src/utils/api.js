// 开发环境直接调用 iTunes API，生产环境使用 Cloudflare Functions
const isDev = import.meta.env.DEV
const API_BASE = isDev ? 'https://itunes.apple.com' : (import.meta.env.BASE_URL + 'api/itunes').replace(/\/+/g, '/')

export async function searchItunes(params) {
  const queryString = new URLSearchParams(params).toString()
  const url = `${API_BASE}/search?${queryString}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`搜索失败: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw new Error(error.message || '搜索失败，请稍后重试')
  }
}

export function getCoverUrl(item, size = '600') {
  if (!item) return ''
  
  // 优先使用 artworkUrl100，然后尝试其他尺寸
  let url = item.artworkUrl100 || item.artworkUrl60 || item.artworkUrl30 || ''
  
  if (url && size !== '100') {
    // 替换 URL 中的尺寸参数
    url = url.replace(/\/\d+x\d+bb\.jpg/, `/${size}x${size}bb.jpg`)
    // 如果没有找到标准格式，尝试其他格式
    if (url === (item.artworkUrl100 || item.artworkUrl60 || item.artworkUrl30)) {
      url = url.replace(/100x100/, `${size}x${size}`)
        .replace(/60x60/, `${size}x${size}`)
        .replace(/30x30/, `${size}x${size}`)
    }
  }
  
  return url || ''
}

