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
    image: s.string().optional(), // 改为可选字符串，支持外部 URL
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
    // 优先使用 key，如果没有 key 则使用 slug（保持与旧项目一致）
    const urlSlug = data.key || data.slug;
    
    // 处理图片：如果是外部 URL，直接使用；如果是本地路径，尝试解析
    let imageData = null;
    if (data.image) {
      // 检查是否是外部 URL
      if (data.image.startsWith('http://') || data.image.startsWith('https://')) {
        // 外部 URL，直接使用，不包含 blurDataURL
        imageData = {
          src: data.image,
          width: 1200,
          height: 630,
        };
      } else {
        // 本地路径，转换为以 / 开头的绝对路径
        // 将 ./images/xxx 转换为 /static/blogs/{slug}/images/xxx
        // 注意：使用 slug 而不是 key，因为目录名通常是基于 slug 的
        let imageSrc = data.image;
        const blogDirName = data.slug; // 使用 slug 作为博客目录名
        
        if (imageSrc.startsWith('./')) {
          // 移除 ./ 前缀，添加博客目录路径
          // 处理 ./blog/images/xxx 这种情况，转换为 ./images/xxx
          if (imageSrc.startsWith('./blog/images/')) {
            imageSrc = imageSrc.replace('./blog/images/', './images/');
          }
          imageSrc = `/static/blogs/${blogDirName}${imageSrc.substring(1)}`;
        } else if (imageSrc.startsWith('/images/')) {
          // 如果已经是 /images/ 开头，添加博客目录路径
          imageSrc = `/static/blogs/${blogDirName}${imageSrc}`;
        } else if (imageSrc.startsWith('/blog/images/')) {
          // 处理 /blog/images/xxx 这种情况
          imageSrc = `/static/blogs/${blogDirName}${imageSrc.replace('/blog/images/', '/images/')}`;
        } else if (!imageSrc.startsWith('/')) {
          // 如果没有 ./ 也没有 /，添加 /static/blogs/{slug}/
          imageSrc = `/static/blogs/${blogDirName}/${imageSrc}`;
        }
        
        imageData = {
          src: imageSrc,
          width: 1200,
          height: 630,
        };
      }
    }
    
    return {
      ...data,
      url: `/posts/${urlSlug}`,
      readingTime: readingTime(data.body),
      image: imageData,
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
