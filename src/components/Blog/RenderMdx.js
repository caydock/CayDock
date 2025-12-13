"use client"
import React from 'react'
import MDXContent from './MdxContent'
import InArticleAd from '../Elements/InArticleAd'

const mdxComponents = {
  // Add any custom components here
}

// 处理 HTML 中的链接，添加 target="_blank" 和 rel 属性
const processLinksInHtml = (html) => {
  if (typeof html !== 'string') return html;
  
  return html.replace(
    /<a\s+([^>]*?)href=["']([^"']*?)["']([^>]*?)>/gi,
    (match, before, href, after) => {
      // 检查是否已经有 target 属性
      const hasTarget = /target\s*=/i.test(before + after);
      const hasRel = /rel\s*=/i.test(before + after);
      
      // 判断是否为外部链接
      const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
      
      if (hasTarget) {
        // 如果已经有 target，只更新 rel（如果是外部链接）
        if (isExternal && !hasRel) {
          return `<a ${before}href="${href}"${after} rel="nofollow noopener noreferrer">`;
        }
        return match; // 已经有 target，不需要修改
      }
      
      // 没有 target，添加 target 和 rel
      if (isExternal) {
        return `<a ${before}href="${href}"${after} target="_blank" rel="nofollow noopener noreferrer">`;
      } else {
        return `<a ${before}href="${href}"${after} target="_blank">`;
      }
    }
  );
};

const RenderMdx = ({blog, locale = 'en'}) => {
  console.log('Blog body type:', typeof blog.body);
  console.log('Blog body preview:', typeof blog.body === 'string' ? blog.body.substring(0, 200) : blog.body);

  // 在文章内容中间插入广告的函数
  const insertAdInMiddle = (content) => {
    if (typeof content === 'string') {
      // 按段落分割内容
      const paragraphs = content.split('</p>');
      
      if (paragraphs.length > 4) {
        // 找到中间位置
        const middleIndex = Math.floor(paragraphs.length / 2);
        
        // 分割内容并处理链接
        const beforeAd = processLinksInHtml(paragraphs.slice(0, middleIndex).join('</p>') + '</p>');
        const afterAd = processLinksInHtml(paragraphs.slice(middleIndex).join('</p>'));
        
        return (
          <>
            <div className={`w-full text-base leading-relaxed text-dark dark:text-light px-0 ${locale === 'zh-cn' ? 'font-sc' : 'font-in'} [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-2 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>li]:mb-2 [&>blockquote]:bg-accent/20 [&>blockquote]:p-2 [&>blockquote]:px-6 [&>blockquote]:border-accent [&>blockquote]:not-italic [&>blockquote]:rounded-r-lg dark:[&>blockquote]:bg-accentDark/20 dark:[&>blockquote]:border-accentDark [&>figure]:relative [&>figure]:mb-6 [&>img]:w-full [&>img]:rounded-lg [&>figcaption]:mt-1 [&>figcaption]:mb-2 [&>figcaption]:text-sm [&>figcaption]:text-center [&>code]:bg-accent/10 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:font-mono [&>pre]:bg-accent/10 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:font-mono [&>pre]:text-sm [&>a]:text-accent [&>a]:hover:text-accentDark dark:[&>a]:text-accentDark [&>a]:font-medium [&>a]:hover:underline [&>strong]:font-bold [&>em]:italic [&_hr]:border-t [&_hr]:border-accent/30 [&_hr]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_th]:border [&_th]:border-accent/30 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-accent/10 [&_td]:border [&_td]:border-accent/30 [&_td]:px-4 [&_td]:py-2 dark:[&_th]:bg-accentDark/10 dark:[&_th]:border-accentDark/30`} dangerouslySetInnerHTML={{ __html: beforeAd }} />
            <div className="w-full my-8">
              <InArticleAd />
            </div>
            <div className={`w-full text-base leading-relaxed text-dark dark:text-light px-0 ${locale === 'zh-cn' ? 'font-sc' : 'font-in'} [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-2 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>li]:mb-2 [&>blockquote]:bg-accent/20 [&>blockquote]:p-2 [&>blockquote]:px-6 [&>blockquote]:border-accent [&>blockquote]:not-italic [&>blockquote]:rounded-r-lg dark:[&>blockquote]:bg-accentDark/20 dark:[&>blockquote]:border-accentDark [&>figure]:relative [&>figure]:mb-6 [&>img]:w-full [&>img]:rounded-lg [&>figcaption]:mt-1 [&>figcaption]:mb-2 [&>figcaption]:text-sm [&>figcaption]:text-center [&>code]:bg-accent/10 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:font-mono [&>pre]:bg-accent/10 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:font-mono [&>pre]:text-sm [&>a]:text-accent [&>a]:hover:text-accentDark dark:[&>a]:text-accentDark [&>a]:font-medium [&>a]:hover:underline [&>strong]:font-bold [&>em]:italic [&_hr]:border-t [&_hr]:border-accent/30 [&_hr]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_th]:border [&_th]:border-accent/30 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-accent/10 [&_td]:border [&_td]:border-accent/30 [&_td]:px-4 [&_td]:py-2 dark:[&_th]:bg-accentDark/10 dark:[&_th]:border-accentDark/30`} dangerouslySetInnerHTML={{ __html: afterAd }} />
          </>
        );
      }
    }
    
    // 如果无法分割或内容较短，在内容后添加广告
    return (
      <>
        <MDXContent code={content} components={mdxComponents}/>
        <div className="w-full my-8">
          <InArticleAd />
        </div>
      </>
    );
  };

  return (
    <div className={`w-full text-base leading-relaxed text-dark dark:text-light px-0 ${locale === 'zh-cn' ? 'font-sc' : 'font-in'} [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-2 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>li]:mb-2 [&>blockquote]:bg-accent/20 [&>blockquote]:p-2 [&>blockquote]:px-6 [&>blockquote]:border-accent [&>blockquote]:not-italic [&>blockquote]:rounded-r-lg dark:[&>blockquote]:bg-accentDark/20 dark:[&>blockquote]:border-accentDark [&>figure]:relative [&>figure]:mb-6 [&>img]:w-full [&>img]:rounded-lg [&>figcaption]:mt-1 [&>figcaption]:mb-2 [&>figcaption]:text-sm [&>figcaption]:text-center [&>code]:bg-accent/10 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:font-mono [&>pre]:bg-accent/10 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:font-mono [&>pre]:text-sm [&>a]:text-accent [&>a]:hover:text-accentDark dark:[&>a]:text-accentDark [&>a]:font-medium [&>a]:hover:underline [&>strong]:font-bold [&>em]:italic [&_hr]:border-t [&_hr]:border-accent/30 [&_hr]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_th]:border [&_th]:border-accent/30 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-accent/10 [&_td]:border [&_td]:border-accent/30 [&_td]:px-4 [&_td]:py-2 dark:[&_th]:bg-accentDark/10 dark:[&_th]:border-accentDark/30 first-letter:text-3xl sm:first-letter:text-5xl`}>
        {insertAdInMiddle(blog.body)}
    </div>
  )
}

export default RenderMdx
