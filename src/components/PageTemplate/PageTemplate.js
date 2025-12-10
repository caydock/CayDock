"use client";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import siteMetadata from '@/src/utils/siteMetaData';
import profileCharacter from "../../../public/cay.webp";

/**
 * 通用页面模板组件
 * 用于博客详情页、关于页等需要相同布局的页面
 */
export default function PageTemplate({
  backgroundImage, // 背景图片路径或对象 {src, blurDataURL}
  title, // 页面标题
  breadcrumb, // 面包屑导航（可选）
  metadata, // 元数据 {date, wordCount, readingTime}
  tags, // 标签数组（可选）
  author, // 是否显示作者信息，默认 true
  children, // 主要内容
  locale = 'en', // 语言
  heroHeight = 'h-[50vh] sm:h-[55vh] md:h-[60vh]', // Hero 区域高度
}) {
  const pathname = usePathname();
  
  // 判断是否是文章页（只在文章页显示背景）
  // 文章页路径格式：/posts/[slug] 或 /zh-cn/posts/[slug]
  const isBlogPostPage = pathname?.match(/\/posts\/[^/]+$/) || pathname?.match(/\/zh-cn\/posts\/[^/]+$/);
  
  // 判断是否配置了背景图片
  const hasBackgroundImage = backgroundImage && (
    (typeof backgroundImage === 'string' && backgroundImage !== '/images/about-bg.jpg') ||
    (typeof backgroundImage === 'object' && backgroundImage?.src && backgroundImage.src !== '/images/about-bg.jpg')
  );
  
  const bgImageSrc = typeof backgroundImage === 'string' 
    ? backgroundImage 
    : backgroundImage?.src || '/images/about-bg.jpg';
  
  const bgImageBlur = typeof backgroundImage === 'object' 
    ? backgroundImage?.blurDataURL 
    : undefined;
  
  // 只有当 blurDataURL 是有效字符串时才添加 placeholder
  const imageProps = bgImageBlur && typeof bgImageBlur === 'string' && bgImageBlur.trim()
    ? { placeholder: "blur", blurDataURL: bgImageBlur }
    : {};

  return (
    <>
      {/* 固定全局背景图片 - 只在文章页且有配置背景图片时显示，z-index 高于全局背景 */}
      {isBlogPostPage && hasBackgroundImage && (
        <div className="fixed top-0 left-0 w-full h-screen z-[2]">
        <Image
          src={bgImageSrc}
          alt={title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          unoptimized={bgImageSrc.startsWith('/static/')}
          {...imageProps}
        />
        {/* 渐变遮罩 */}
        <div 
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 5%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.03) 48%, transparent 5%)'
          }}
        />
        </div>
      )}

      <article className="relative z-10 pt-16">
        {/* 渐变背景遮罩 - 只在文章页且有配置背景图片时显示 */}
        {isBlogPostPage && hasBackgroundImage && (
          <>
            <div className="dark:hidden absolute inset-0" style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 2%, rgba(255, 255, 255, 0.7) 5%,  rgba(255, 255, 255, 0.9) 10%,  rgba(255, 255, 255, 0.98) 100%)'
            }} />
            <div className="hidden dark:block absolute inset-0" style={{
              background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.2) 0%, rgba(26, 26, 26, 0.4) 5%, rgba(26, 26, 26, 0.7) 10%, rgba(26, 26, 26, 0.9) 100%)'
            }} />
          </>
        )}
        
        <div className="relative z-10">
          {/* Hero Section - 标题区域 */}
          <div className={`relative w-full ${heroHeight} flex items-end`}>
            <div className="w-full pb-4 md:pb-4 lg:pb-4 z-10">
              <div className="max-w-7xl mx-auto px-5 sm:px-10">
                <div className="w-full max-w-4xl">
                  {/* 面包屑导航 */}
                  {breadcrumb && (
                    <div className="text-sm md:text-base text-dark/60 dark:text-light/60 mb-2">
                      {breadcrumb}
                    </div>
                  )}
                  
                  {/* 标题 */}
                  <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-4xl mb-4 leading-tight text-dark dark:text-light">
                    {title}
                  </h1>
                  
                  {/* 日期、字数、阅读时间 */}
                  {metadata && (
                    <div className="flex flex-wrap items-center gap-3 text-dark/90 dark:text-light/90 text-sm md:text-base mb-4">
                      {metadata.date && (
                        <>
                          <span>{metadata.date}</span>
                          <span>・</span>
                        </>
                      )}
                      {metadata.wordCount !== undefined && (
                        <>
                          <span>
                            {locale === 'zh-cn' ? `${metadata.wordCount}字` : `${metadata.wordCount} words`}
                          </span>
                          <span>・</span>
                        </>
                      )}
                      {metadata.readingTime && (
                        <span>{metadata.readingTime}</span>
                      )}
                    </div>
                  )}
                  
                  {/* 标签 */}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 作者信息区域 */}
          {author !== false && (
            <div className="relative">
              <AuthorSection locale={locale} />
            </div>
          )}

          {/* 主要内容区域 */}
          <div className="relative pb-10 md:pb-16">
            <div className="relative z-10">
              <div className="max-w-7xl mx-auto px-5 sm:px-10">
                <div className="max-w-4xl">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

/**
 * 作者信息组件
 */
function AuthorSection({ locale }) {
  return (
    <div className="relative pt-6 pb-8">
      <div className="relative z-10">
        <div className="flex items-center gap-4 md:gap-6 max-w-7xl mx-auto px-5 sm:px-10">
          {/* 头像 */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 border-2 border-dark/10 dark:border-light/10">
            <Image
              src={profileCharacter}
              alt={siteMetadata.author}
              width={112}
              height={112}
              className="w-full h-full object-cover object-center"
              priority
            />
          </div>
          
          {/* 作者信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-dark/60 dark:text-light/60">
                {locale === 'zh-cn' ? '作者' : 'Author'}
              </span>
              <span className="font-bold text-lg md:text-xl text-dark dark:text-light">
                {siteMetadata.author}
              </span>
            </div>
            <p className="text-xs md:text-sm text-dark/70 dark:text-light/70 mb-2 leading-relaxed">
              {locale === 'zh-cn' 
                ? '专注独立产品开发,记录独立产品开发过程中的点点滴滴'
                : 'Focused on independent product development, recording bits and pieces of the development process'
              }
            </p>
            <p className="text-xs text-dark/60 dark:text-light/60 mb-4">
              {locale === 'zh-cn' 
                ? '欢迎关注微信公众号 CayDock'
                : 'Welcome to follow WeChat Official Account CayDock'
              }
            </p>
            
            {/* 社交媒体图标 */}
            <div className="flex items-center gap-4">
              {siteMetadata.email && (
                <a
                  href={`mailto:${siteMetadata.email}`}
                  className="w-4 h-4 text-dark/70 dark:text-light/70 hover:text-dark dark:hover:text-light hover:scale-110 transition-all ease duration-200"
                  aria-label="Email"
                >
                  <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                    <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                  </svg>
                </a>
              )}
              {siteMetadata.github && (
                <a
                  href={siteMetadata.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-4 h-4 text-dark/70 dark:text-light/70 hover:text-dark dark:hover:text-light hover:scale-110 transition-all ease duration-200"
                  aria-label="GitHub"
                >
                  <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {siteMetadata.twitter && (
                <a
                  href={siteMetadata.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-4 h-4 text-dark/70 dark:text-light/70 hover:text-dark dark:hover:text-light hover:scale-110 transition-all ease duration-200"
                  aria-label="Twitter"
                >
                  <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

