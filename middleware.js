import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  
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