import siteMetadata from '@/src/utils/siteMetaData'
import { blogs } from '@/.velite/generated'
import { slug } from 'github-slugger'

export const runtime = 'edge'

export default async function sitemap() {
  const base = siteMetadata.siteUrl?.replace(/\/$/, '') || 'https://w3cay.com'

  // 英文页面（带 /en/ 前缀）
  const enStaticPaths = [
    '/en',
    '/en/submit',
    '/en/about',
    '/en/contact',
    '/en/privacy-policy',
    '/en/terms-of-service',
    '/en/disclaimer',
    '/en/blog',
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

  // 生成英文标签页面路径
  const enCategoryPaths = allCategories.map((category) => ({
    url: `${base}/en/categories/${category}`,
    changefreq: 'weekly',
    priority: 0.6,
  }))

  // 生成中文标签页面路径
  const zhCategoryPaths = allCategories.map((category) => ({
    url: `${base}/zh-cn/categories/${category}`,
    changefreq: 'weekly',
    priority: 0.6,
  }))

  const categoryPaths = [...enCategoryPaths, ...zhCategoryPaths]

  // 生成英文博客文章路径
  const enBlogPaths = blogs
    .filter((blog) => blog.isPublished)
    .map((blog) => ({
      url: `${base}/en${blog.url}`,
      changefreq: 'monthly',
      priority: 0.8,
    }))

  // 生成中文博客文章路径
  const zhBlogPaths = blogs
    .filter((blog) => blog.isPublished)
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

