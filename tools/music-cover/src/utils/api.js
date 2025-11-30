// iTunes Search API 支持 CORS，可以直接调用
// 如果 Cloudflare Function 失败，回退到直接调用
const ITUNES_API_BASE = 'https://itunes.apple.com'
const CF_FUNCTION_BASE = '/api/itunes'

async function tryCloudflareFunction(url) {
  try {
    const response = await fetch(`${CF_FUNCTION_BASE}/search?${url}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (response.ok) {
      return await response.json()
    }
    
    // 如果返回 403 或其他错误，返回 null 以触发回退
    if (response.status === 403 || response.status === 404) {
      return null
    }
    
    throw new Error(`搜索失败: ${response.statusText}`)
  } catch (error) {
    // 网络错误或其他错误，返回 null 以触发回退
    console.warn('Cloudflare Function failed, falling back to direct API call:', error)
    return null
  }
}

export async function searchItunes(params) {
  const queryString = new URLSearchParams(params).toString()
  
  // 先尝试使用 Cloudflare Function
  const cfResult = await tryCloudflareFunction(queryString)
  if (cfResult) {
    return cfResult
  }
  
  // 如果 Cloudflare Function 失败，直接调用 iTunes API（支持 CORS）
  try {
    const response = await fetch(`${ITUNES_API_BASE}/search?${queryString}`, {
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
    console.error('Direct API request failed:', error)
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

