// iTunes Search API 工具函数
const ITUNES_API_BASE = 'https://itunes.apple.com'

/**
 * 搜索参数接口
 */
export const searchItunes = async (params) => {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value)
      }
      return acc
    }, {})
  ).toString()
  
  const url = `${ITUNES_API_BASE}/search?${queryString}`
  
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
    throw new Error(error instanceof Error ? error.message : '搜索失败，请稍后重试')
  }
}

/**
 * 获取封面图片 URL
 * @param {Object} item - iTunes 结果项
 * @param {string} size - 图片尺寸，默认 '600'
 * @returns {string} 封面图片 URL
 */
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

