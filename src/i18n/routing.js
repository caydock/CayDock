import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'zh-cn'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Only show locale prefix when needed (zh-cn will have prefix, en won't)
  localePrefix: 'as-needed',

  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the locale, the external
  // paths are rewritten to the shared internal ones.
  pathnames: {
    // If all locales use the same pathname, a
    // single external path can be provided.
    '/': '/',
    '/about': '/about',
    '/posts': '/posts',
    '/terms-of-service': '/terms-of-service',
    '/privacy-policy': '/privacy-policy',
    '/disclaimer': '/disclaimer',
    '/subscribe': '/subscribe',
    '/products': '/products',
    '/music-cover': '/music-cover',
    '/tags': '/tags',
    '/tags/[slug]': '/tags/[slug]',
    '/posts/[slug]': '/posts/[slug]'
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
