// 该路由已弃用，保留为空壳以避免客户端旧缓存调用报错
export const runtime = 'edge'
export async function GET() {
  return Response.json({ canEmbed: true, deprecated: true })
}
