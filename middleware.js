import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // 根路径直接处理，不重定向
  if (pathname === '/') {
    return NextResponse.next()
  }
  
  // 自动检测需要重定向的路由（排除已处理的路由和特殊路径）
  const excludedPaths = ['/api', '/_next', '/favicon.ico', '/zh-cn', '/en', '/admin', '/post']
  const isExcludedPath = excludedPaths.some(excluded => pathname.startsWith(excluded))
  
  // 如果不是排除的路径，且不是根路径，且不包含中文前缀，则重写到英文版本
  if (!isExcludedPath && pathname !== '/' && !pathname.startsWith('/zh-cn')) {
    // 重写到英文版本，使用 /en 前缀来匹配 [lang] 路由
    const url = request.nextUrl.clone()
    url.pathname = `/en${pathname}`
    return NextResponse.rewrite(url)
  }
  
  // 检查是否是 /en/ 开头的路径
  if (pathname.startsWith('/en')) {
    // 重写到 /en 路由
    const newPath = pathname.replace('/en', '') || '/'
    const rewritePath = `/en${newPath}`
    
    // 创建新的 URL
    const url = request.nextUrl.clone()
    url.pathname = rewritePath
    
    return NextResponse.rewrite(url)
  }
  
  // 检查是否是 /zh-cn/ 开头的其他路径
  if (pathname.startsWith('/zh-cn')) {
    // 重写到 /zh-cn 路由
    const newPath = pathname.replace('/zh-cn', '') || '/'
    const rewritePath = `/zh-cn${newPath}`
    
    // 创建新的 URL
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
