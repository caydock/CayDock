"use client"
import React from 'react'
import MDXContent from './MdxContent'
import InArticleAd from '../Elements/InArticleAd'

const mdxComponents = {
  // Add any custom components here
}

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
        
        // 分割内容
        const beforeAd = paragraphs.slice(0, middleIndex).join('</p>') + '</p>';
        const afterAd = paragraphs.slice(middleIndex).join('</p>');
        
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
    <div className='col-span-12 lg:col-span-8 font-in prose sm:prose-base md:prose-lg max-w-max
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
