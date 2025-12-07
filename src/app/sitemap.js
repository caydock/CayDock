import siteMetadata from '@/src/utils/siteMetaData'
import { blogs } from '@/.velite/generated'
import { slug } from 'github-slugger'

export const runtime = 'edge'

export default async function sitemap() {
  const base = siteMetadata.siteUrl?.replace(/\/$/, '') || 'https://w3cay.com'

  // 英文页面（根路径，无前缀）
  const enStaticPaths = [
    '/',
    '/submit',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/disclaimer',
    '/blog',
  ].map((p) => ({ url: `${base}${p}`, changefreq: 'weekly', priority: 0.7 }))

  // 中文页面（带 /zh-cn/ 前缀）
  const zhStaticPaths = [
    '/zh-cn',
    '/zh-cn/submit',
    '/zh-cn/about',
    '/zh-cn/contact',
    '/zh-cn/privacy-policy',
    '/zh-cn/terms-of-service',
    '/zh-cn/disclaimer',
    '/zh-cn/blog',
  ].map((p) => ({ url: `${base}${p}`, changefreq: 'weekly', priority: 0.7 }))

  const staticPaths = [...enStaticPaths, ...zhStaticPaths]

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

  // 获取中文博客标签（使用 tagKeys）
  const zhCategories = ['all']
  blogs.forEach(blog => {
    if (blog.isPublished && blog.language === 'zh-cn') {
      if (blog.tagKeys && blog.tagKeys.length > 0) {
        blog.tagKeys.forEach(tagKey => {
          if (!zhCategories.includes(tagKey)) {
            zhCategories.push(tagKey)
          }
        })
      } else {
        // 如果没有 tagKeys，使用 tags 的 slug
        blog.tags.forEach(tag => {
          const slugified = slug(tag)
          if (!zhCategories.includes(slugified)) {
            zhCategories.push(slugified)
          }
        })
      }
    }
  })

  // 生成英文标签页面路径
  const enCategoryPaths = enCategories.map((category) => ({
    url: `${base}/categories/${category}`,
    changefreq: 'weekly',
    priority: 0.6,
  }))

  // 生成中文标签页面路径
  const zhCategoryPaths = zhCategories.map((category) => ({
    url: `${base}/zh-cn/categories/${category}`,
    changefreq: 'weekly',
    priority: 0.6,
  }))

  const categoryPaths = [...enCategoryPaths, ...zhCategoryPaths]

  // 生成英文博客文章路径
  const enBlogPaths = blogs
    .filter((blog) => blog.isPublished && blog.language === 'en')
    .map((blog) => ({
      url: `${base}${blog.url}`,
      changefreq: 'monthly',
      priority: 0.8,
    }))

  // 生成中文博客文章路径
  const zhBlogPaths = blogs
    .filter((blog) => blog.isPublished && blog.language === 'zh-cn')
    .map((blog) => ({
      url: `${base}/zh-cn${blog.url}`,
      changefreq: 'monthly',
      priority: 0.8,
    }))

  const blogPaths = [...enBlogPaths, ...zhBlogPaths]

  return [
    ...staticPaths,
    ...categoryPaths,
    ...blogPaths,
  ]
}

