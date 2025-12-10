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

const RenderMdx = ({blog}) => {
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
            <div dangerouslySetInnerHTML={{ __html: beforeAd }} />
            <div className="w-full my-8">
              <InArticleAd />
            </div>
            <div dangerouslySetInnerHTML={{ __html: afterAd }} />
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
    <div className='col-span-12 lg:col-span-8 font-in prose-base max-w-max
    prose-blockquote:bg-accent/20 
    prose-blockquote:p-2
    prose-blockquote:px-6
    prose-blockquote:border-accent
    prose-blockquote:not-italic
    prose-blockquote:rounded-r-lg

    prose-figure:relative
    prose-figcaption:mt-1
    prose-figcaption:mb-2

    prose-li:marker:text-accent

    dark:prose-invert
    dark:prose-blockquote:border-accentDark
    dark:prose-blockquote:bg-accentDark/20
    dark:prose-li:marker:text-accentDark

    first-letter:text-3xl
    sm:first-letter:text-5xl'> 
        {insertAdInMiddle(blog.body)}
    </div>
  )
}

export default RenderMdx
