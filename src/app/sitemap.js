import siteMetadata from '@/src/utils/siteMetaData'
import { blogs } from '@/.velite/generated'
import { slug } from 'github-slugger'

export const runtime = 'edge'

export default async function sitemap() {
  const base = siteMetadata.siteUrl?.replace(/\/$/, '') || 'https://w3cay.com'

  // 英文页面（根路径，无前缀）
  const staticPaths = [
    '/',
    '/about',
    '/privacy-policy',
    '/terms-of-service',
    '/disclaimer',
    '/posts',
  ].map((p) => ({ url: `${base}${p}`, changefreq: 'weekly', priority: 0.7 }))

  // 获取英文博客标签（使用 tagKeys）
  const enCategories = ['all']
  blogs.forEach(blog => {
    if (blog.isPublished && blog.language === 'en') {
      if (blog.tagKeys && blog.tagKeys.length > 0) {
        blog.tagKeys.forEach(tagKey => {
          if (!enCategories.includes(tagKey)) {
            enCategories.push(tagKey)
          }
        })
      } else {
        // 如果没有 tagKeys，使用 tags 的 slug
        blog.tags.forEach(tag => {
          const slugified = slug(tag)
          if (!enCategories.includes(slugified)) {
            enCategories.push(slugified)
          }
        })
      }
    }
  })

  // 生成英文标签页面路径
  const categoryPaths = enCategories.map((category) => ({
    url: `${base}/tags/${category}`,
    changefreq: 'weekly',
    priority: 0.6,
  }))

  // 生成英文博客文章路径
  const blogPaths = blogs
    .filter((blog) => blog.isPublished && blog.language === 'en')
    .map((blog) => ({
      url: `${base}${blog.url}`,
      changefreq: 'monthly',
      priority: 0.8,
    }))

  return [
    ...staticPaths,
    ...categoryPaths,
    ...blogPaths,
  ]
}

