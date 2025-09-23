import { NextResponse } from 'next/server'

// 支持的语言列表
const locales = ['en', 'zh-cn']

// 获取首选语言
function getLocale(request) {
  // 通过环境变量控制是否启用语言检测
  const enableLanguageDetection = process.env.ENABLE_LANGUAGE_DETECTION === 'true'
  
  if (!enableLanguageDetection) {
    // 禁用语言检测，始终返回默认语言
    return 'en'
  }
  
  // 启用语言检测时，从 Accept-Language 头部获取语言偏好
  const acceptLanguage = request.headers.get('accept-language') || ''
  
  // 简单的语言检测逻辑
  if (acceptLanguage.includes('zh') || acceptLanguage.includes('cn')) {
    return 'zh-cn'
  }
  
  // 默认返回英文
  return 'en'
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // 检查路径是否已经包含支持的语言
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // 如果路径已经包含语言，直接继续
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // 如果路径不包含语言，重写到带语言的路径（不改变URL）
  const locale = getLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  
  return NextResponse.rewrite(url)
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
