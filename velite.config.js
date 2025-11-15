import { defineConfig, s } from 'velite'
import GithubSlugger from "github-slugger"
import readingTime from "reading-time"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeExternalLinks from "rehype-external-links"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

const codeOptions = {
  theme: 'github-dark',
  grid: false,
}

// Define the blog schema
const blog = s
  .object({
    title: s.string(),
    publishedAt: s.isodate(),
    updatedAt: s.isodate(),
    description: s.string(), 
    image: s.image(),
    isPublished: s.boolean().default(true),
    author: s.string(),
    tags: s.array(s.string()),
    tagKeys: s.array(s.string()).optional(), // 标签的key映射
    body: s.markdown(),
    toc: s.toc(),
    slug: s.string(),
    key: s.string().optional(), // 博客文章的key映射
    language: s.string().default('en'),
  })
  .transform((data) => {
    return {
      ...data,
      url: `/blog/${data.slug}`,
      readingTime: readingTime(data.body),
    //   toc: headings,
      image: {
        ...data.image,
        // 保持velite的默认图片路径处理
        src: data.image.src,
      },
    }
  })

export default defineConfig({
  root: 'content',
  collections: {
    blogs: {
      name: 'Blog',
      pattern: 'blogs/**/*.{mdx,en.mdx,zh-cn.mdx}',
      schema: blog,
    },
  },
  output: {
    data: '.velite/generated',
    assets: 'public/static',
    clean: false, // 改为 false 避免清理图片文件
  },
  // Add MDX plugins
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [rehypeExternalLinks, { 
        target: '_blank',
        rel: ['nofollow', 'noopener', 'noreferrer']
      }],
      [rehypePrettyCode, codeOptions],
    ],
    // 生成 HTML 而不是 JavaScript 代码
    compile: false,
    outputFormat: 'html'
  }
})
