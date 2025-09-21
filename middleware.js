import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // 检查是否是 /zh-cn/ 开头的路径
  if (pathname.startsWith('/zh-cn')) {
    // 重写到 /zh-cn 路由
    const newPath = pathname.replace('/zh-cn', '') || '/'
    const rewritePath = `/zh-cn${newPath}`
    
    // 创建新的 URL
    const url = request.nextUrl.clone()
    url.pathname = rewritePath
    
    return NextResponse.rewrite(url)
  }
  
  // 检查是否是 /en/ 开头的路径（可选，保持一致性）
  if (pathname.startsWith('/en')) {
    const newPath = pathname.replace('/en', '') || '/'
    const rewritePath = `/en${newPath}`
    
    const url = request.nextUrl.clone()
    url.pathname = rewritePath
    
    return NextResponse.rewrite(url)
  }
  
  // 其他路径正常处理
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
