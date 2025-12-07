"use client";
import { useTranslations } from 'next-intl';
import { blogs } from '@/.velite/generated';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Tag from '../Elements/Tag';
import SmartLink from '../Elements/SmartLink';
import { slug } from 'github-slugger';
import RenderMdx from './RenderMdx';
import ShareButtons from '../Elements/ShareButtons';
import siteMetadata from '@/src/utils/siteMetaData';
import profileCharacter from "../../../public/cay.webp";
import { useMemo } from 'react';

export default function BlogDetails({ slug: blogSlug, locale }) {
  const t = useTranslations('ui');
  const language = locale === 'zh-cn' ? 'zh-cn' : 'en';
  
  // 查找对应的博客文章
  const blog = blogs.find(blog => 
    blog.slug === blogSlug && blog.language === language
  );

  if (!blog) {
    notFound();
  }

  // 计算字数（去除 HTML 标签和空白）
  const wordCount = useMemo(() => {
    if (typeof blog.body === 'string') {
      const text = blog.body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      return text.length;
    }
    return 0;
  }, [blog.body]);

  const breadcrumbItems = [
    {
      label: t('nav.blog'),
      href: "/blog"
    },
    {
      label: t('breadcrumb.categories'),
      href: "/categories/all"
    },
    {
      label: blog.title,
      href: blog.url
    }
  ];

  return (
    <>
      {/* 固定全局背景图片 - 渐变效果，只在上半部分显示 */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Image
          src={blog.image.src}
          placeholder="blur"
          blurDataURL={blog.image.blurDataURL}
          alt={blog.title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* 渐变遮罩：从顶部的不透明到底部的完全透明，在50%处完全消失 */}
        <div 
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 5%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.03) 48%, transparent 5%)'
          }}
        />
      </div>

      <article className="relative z-10 pt-16 min-h-screen">
        <div className="dark:hidden absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 2%, rgba(255, 255, 255, 0.7) 5%,  rgba(255, 255, 255, 0.9) 10%,  rgba(255, 255, 255, 0.98) 100%)'
        }} />
        <div className="hidden dark:block absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.2) 0%, rgba(26, 26, 26, 0.4) 5%, rgba(26, 26, 26, 0.7) 10%, rgba(26, 26, 26, 0.9) 100%)'
        }} />
        <div className="relative z-10">
        {/* Hero Section - 封面图区域 */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-end">
          {/* 内容叠加在左侧 */}
          <div className="w-full pb-8 md:pb-12 lg:pb-16 px-5 sm:px-10 md:px-10 z-10">
            <div className="max-w-7xl mx-auto">
              <div className="w-full max-w-4xl">
                {/* 标题 */}
                <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 leading-tight text-dark dark:text-light">
                  {blog.title}
                </h1>
                
                {/* 日期、字数、阅读时间 */}
                <div className="flex flex-wrap items-center gap-3 text-dark/90 dark:text-light/90 text-sm md:text-base mb-4">
                  <span>
                    {new Date(blog.publishedAt).toLocaleDateString(locale === 'zh-cn' ? 'zh-CN' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span>・</span>
                  <span>
                    {locale === 'zh-cn' ? `${wordCount}字` : `${wordCount} words`}
                  </span>
                  <span>・</span>
                  <span>
                    {blog.readingTime?.text || (locale === 'zh-cn' ? '3分钟' : '3 min')}
                  </span>
                </div>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {blog.tags.slice(0, 4).map((tag, index) => (
                    <Tag
                      key={index}
                      name={tag}
                      link={`/categories/${blog.tagKeys && blog.tagKeys.length > index ? blog.tagKeys[index] : slug(tag)}`}
                      locale={locale}
                      className="!bg-light/20 dark:!bg-light/20 backdrop-blur-sm !border-dark/30 dark:!border-light/30 !text-dark dark:!text-light hover:!bg-dark/10 dark:hover:!bg-light/30 !border-2 px-4 py-1 text-xs md:text-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 作者信息区域 */}
        <div className="relative px-5 sm:px-10 md:px-10 py-8 border-b border-dark/10 dark:border-light/10">
          <div className="relative z-10">
          <div className="flex items-start gap-4 max-w-7xl mx-auto">
            {/* 头像 */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={profileCharacter}
                alt={siteMetadata.author}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 作者信息 */}
            <div className="flex-1">
              <div className="text-xs md:text-sm text-dark/60 dark:text-light/60 mb-1">
                {locale === 'zh-cn' ? '作者' : 'Author'}
              </div>
              <div className="font-semibold text-base md:text-lg text-dark dark:text-light mb-2">
                {siteMetadata.author}
              </div>
              <p className="text-sm md:text-base text-dark/70 dark:text-light/70 mb-2">
                {locale === 'zh-cn' 
                  ? '专注独立产品开发,记录独立产品开发过程中的点点滴滴'
                  : 'Focused on independent product development, recording bits and pieces of the development process'
                }
              </p>
              <p className="text-xs md:text-sm text-dark/60 dark:text-light/60 mb-3">
                {locale === 'zh-cn' 
                  ? '欢迎关注微信公众号 CayDock'
                  : 'Welcome to follow WeChat Official Account CayDock'
                }
              </p>
              
              {/* 社交媒体图标 */}
              <div className="flex items-center gap-3">
                {siteMetadata.github && (
                  <a
                    href={siteMetadata.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-5 h-5 hover:scale-125 transition-all ease duration-200"
                    aria-label="GitHub"
                  >
                    <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {siteMetadata.twitter && (
                  <a
                    href={siteMetadata.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-5 h-5 hover:scale-125 transition-all ease duration-200"
                    aria-label="Twitter"
                  >
                    <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {siteMetadata.email && (
                  <a
                    href={`mailto:${siteMetadata.email}`}
                    className="w-5 h-5 hover:scale-125 transition-all ease duration-200"
                    aria-label="Email"
                  >
                    <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
                      <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* 文章内容区域 */}
        <div className="relative px-5 sm:px-10 md:px-10 pb-10 md:pb-16">
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-4xl">
                <RenderMdx blog={blog} />
                
                {/* 分享按钮 */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <ShareButtons 
                    url={`${siteMetadata.siteUrl}${blog.url}`}
                    title={blog.title}
                    description={blog.description}
                    hashtags="weirdwebsites,webdiscovery,blog"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </article>
    </>
  );
}
