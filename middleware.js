import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  // 先设置原始路径到header中
  const response = intlMiddleware(request);
  
  if (response) {
    // 设置原始路径到header中，供根布局使用
    response.headers.set('x-pathname', request.nextUrl.pathname);
  }
  
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh-cn|en)/:path*']
};