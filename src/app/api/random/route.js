import { sites } from '@/src/data/sites'

export async function GET() {
  try {
    // 随机选择一个网站
    const randomIndex = Math.floor(Math.random() * sites.length)
    const randomSite = sites[randomIndex]
    
    return Response.json(randomSite)
  } catch (error) {
    return Response.json({ error: 'Failed to get random site' }, { status: 500 })
  }
} 