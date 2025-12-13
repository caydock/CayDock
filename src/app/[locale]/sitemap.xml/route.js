import siteMetadata from '@/src/utils/siteMetaData'
import { blogs } from '@/.velite/generated'
import { slug } from 'github-slugger'

export const runtime = 'edge'

export async function GET(request, { params }) {
  // 从 params 获取 locale
  const resolvedParams = params instanceof Promise ? await params : (params || {})
  const locale = resolvedParams?.locale || 'en'
  
  const base = siteMetadata.siteUrl?.replace(/\/$/, '') || 'https://caydock.com'
  const language = locale === 'zh-cn' ? 'zh-cn' : 'en'
  const localePrefix = locale === 'zh-cn' ? '/zh-cn' : ''

  // 静态页面路径
  const staticPaths = [
    `${localePrefix}/`,
    `${localePrefix}/about`,
    `${localePrefix}/privacy-policy`,
    `${localePrefix}/terms-of-service`,
    `${localePrefix}/disclaimer`,
    `${localePrefix}/posts`,
  ].map((p) => ({ url: `${base}${p}`, changefreq: 'weekly', priority: 0.7 }))

  // 获取当前语言的博客标签
  const categories = ['all']
  blogs.forEach(blog => {
    if (blog.isPublished && blog.language === language) {
      if (blog.tagKeys && blog.tagKeys.length > 0) {
        blog.tagKeys.forEach(tagKey => {
          if (!categories.includes(tagKey)) {
            categories.push(tagKey)
          }
        })
      } else {
        blog.tags.forEach(tag => {
          const slugified = slug(tag)
          if (!categories.includes(slugified)) {
            categories.push(slugified)
          }
        })
      }
    }
  })

  // 生成标签页面路径
  const categoryPaths = categories.map((category) => ({
    url: `${base}${localePrefix}/tags/${category}`,
    changefreq: 'weekly',
    priority: 0.6,
  }))

  // 生成博客文章路径
  const blogPaths = blogs
    .filter((blog) => blog.isPublished && blog.language === language)
    .map((blog) => {
      // 对 URL 进行编码，确保中文字符被正确编码
      const encodedUrl = encodeURI(`${base}${localePrefix}${blog.url}`)
      return {
        url: encodedUrl,
        changefreq: 'monthly',
        priority: 0.8,
      }
    })

  const sitemap = [
    ...staticPaths,
    ...categoryPaths,
    ...blogPaths,
  ]

  // 生成 XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((item) => `  <url>
    <loc>${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

