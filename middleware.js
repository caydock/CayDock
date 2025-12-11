import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 重定向 /tools/music-cover 到 /zh-cn/music-cover/
  // 必须在 next-intl middleware 之前处理，避免路径被重写
  if (pathname === '/tools/music-cover' || pathname.startsWith('/tools/music-cover/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/zh-cn/music-cover/';
    url.search = ''; // 清除查询参数
    return NextResponse.redirect(url, 301);
  }
  
  // 处理 next-intl 路由
  const response = intlMiddleware(request);
  
  // 如果 next-intl 返回了重定向响应，直接返回
  if (response && (response.status === 307 || response.status === 308 || response.status === 301 || response.status === 302)) {
    return response;
  }
  
  if (response) {
    // 设置原始路径到header中，供根布局使用
    response.headers.set('x-pathname', request.nextUrl.pathname);
  }
  
  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /static (static assets)
  // - /favicon.ico, /sitemap.xml, /robots.txt (static files)
  // - Files with extensions (images, etc.)
  matcher: ['/((?!api|_next|_vercel|static|.*\\..*).*)']
};