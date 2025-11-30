// 检测环境并设置 API 基础路径
function getApiBase() {
  // 开发环境（Vite 开发服务器）
  if (import.meta.env.DEV) {
    // 检查是否在 Vite 开发服务器中（端口 5173）
    if (typeof window !== 'undefined' && window.location.port === '5173') {
      return '/api/itunes' // 使用 Vite 代理
    }
    // 其他开发环境（如 Hugo 服务器），直接使用 iTunes API
    return 'https://itunes.apple.com'
  }
  
  // 生产环境使用 Cloudflare Functions
  return '/api/itunes'
}

const API_BASE = getApiBase()

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

