import siteMetadata from '@/src/utils/siteMetaData'
import { blogs } from '@/.velite/generated'
import { slug } from 'github-slugger'

export const runtime = 'edge'

export default async function sitemap() {
  const base = siteMetadata.siteUrl?.replace(/\/$/, '') || 'https://w3cay.com'

  const staticPaths = [
    '',
    '/submit',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/disclaimer',
    '/blog',
  ].map((p) => ({ url: `${base}${p}`, changefreq: 'weekly', priority: 0.7 }))

  // 获取所有博客标签
  const allCategories = ['all']
  blogs.forEach(blog => {
    if (blog.isPublished) {
      blog.tags.forEach(tag => {
        const slugified = slug(tag)
        if (!allCategories.includes(slugified)) {
          allCategories.push(slugified)
        }
      })
    }
  })

  // 生成标签页面路径
  const categoryPaths = allCategories.map((category) => ({
    url: `${base}/categories/${category}`,
    changefreq: 'weekly',
    priority: 0.6,
  }))

  // 生成博客文章路径
  const blogPaths = blogs
    .filter((blog) => blog.isPublished)
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

