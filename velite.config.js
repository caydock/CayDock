import { defineConfig, s } from 'velite'
import GithubSlugger from "github-slugger"
import readingTime from "reading-time"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
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
    body: s.mdx(),
    toc: s.toc(),
    slug: s.string(),
  })
  .transform(data => {
    return {
      ...data,
      url: `/blogs/${data.slug}`,
      readingTime: readingTime(data.body),
    //   toc: headings,
      image: {
        ...data.image,
        src: data.image.src.replace("/static", "/blogs"),
      },
    }
  })

export default defineConfig({
  root: 'content',
  collections: {
    blogs: {
      name: 'Blog',
      pattern: 'blogs/**/*.mdx',
      schema: blog,
    },
  },
  output: {
    data: '.velite/generated',
    assets: 'public/blogs',
    clean: false, // 改为 false 避免清理图片文件
  },
  // Add MDX plugins
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [rehypePrettyCode, codeOptions],
      // Custom plugin to transform image paths in MDX content
      () => (tree) => {
        const visit = (node) => {
          if (node.type === 'element' && node.tagName === 'img') {
            if (node.properties && node.properties.src) {
              const src = node.properties.src;
              if (src.startsWith('/static/')) {
                node.properties.src = src.replace('/static/', '/blogs/');
              }
            }
          }
          if (node.children) {
            node.children.forEach(visit);
          }
        };
        visit(tree);
      }
    ]
  }
})
