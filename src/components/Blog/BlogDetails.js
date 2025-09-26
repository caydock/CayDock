"use client";
import { useTranslations } from 'next-intl';
import { blogs } from '@/.velite/generated';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Tag from '../Elements/Tag';
import { Link } from '@/src/i18n/routing';
import { slug } from 'github-slugger';
import RenderMdx from './RenderMdx';
import ShareButtons from '../Elements/ShareButtons';
import ExploreButton from '../Elements/ExploreButton';
import siteMetadata from '@/src/utils/siteMetaData';
import { generateMultilingualPath } from '@/src/utils/languageUtils';

export default function BlogDetails({ slug: blogSlug, locale }) {
  const t = useTranslations('ui');
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  
  // 查找对应的博客文章
  const blog = blogs.find(blog => 
    blog.slug === blogSlug && blog.language === language
  );

  if (!blog) {
    notFound();
  }

  const breadcrumbItems = [
    {
      label: t('nav.blog'),
      href: generateMultilingualPath("/blog", language)
    },
    {
      label: t('breadcrumb.categories'),
      href: generateMultilingualPath("/categories/all", language)
    },
    {
      label: blog.title,
      href: generateMultilingualPath(blog.url, language)
    }
  ];

  return (
    <>
      <article>
        <div className="mb-8 text-center relative w-full h-[70vh] bg-dark">
          {/* 悬浮面包屑导航 */}
          <div className="absolute top-8 left-0 right-0 z-20">
            <nav className="flex items-center space-x-2 text-sm text-light mb-6 px-5 sm:px-10 md:px-10">
              <Link 
                href={generateMultilingualPath("/", language)} 
                className="hover:opacity-50 hover:scale-105 transition-all duration-300"
              >
                {t('nav.home')}
              </Link>
              
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-light/60">/</span>
                  {index === breadcrumbItems.length - 1 ? (
                    <span className="text-light font-medium">
                      {item.label}
                    </span>
                  ) : (
                    <Link 
                      href={item.href} 
                      className="hover:opacity-50 hover:scale-105 transition-all duration-300"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Tag
              name={blog.tags[0]}
              link={generateMultilingualPath(`/categories/${blog.tagKeys && blog.tagKeys.length > 0 ? blog.tagKeys[0] : slug(blog.tags[0])}`, language)}
              className="px-6 text-sm py-2"
            />
            <h1
              className="inline-block mt-6 font-semibold capitalize text-light text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6"
            >
              {blog.title}
            </h1>
            <div className="mt-4 text-light/80 text-sm md:text-base">
              {new Date(blog.publishedAt).toLocaleDateString(locale === 'zh-cn' ? 'zh-CN' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-dark/60 dark:bg-dark/40" />
          <Image
            src={blog.image.src}
            placeholder="blur"
            blurDataURL={blog.image.blurDataURL}
            alt={blog.title}
            width={blog.image.width}
            height={blog.image.height}
            className="aspect-square w-full h-full object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        <div className="mb-10 grid grid-cols-12 gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 sm:px-10 md:px-10">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <RenderMdx blog={blog} />
            
            {/* 分享按钮 */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <ShareButtons 
                url={`${siteMetadata.siteUrl}${generateMultilingualPath(blog.url, language)}`}
                title={blog.title}
                description={blog.description}
                hashtags="weirdwebsites,webdiscovery,blog"
              />
            </div>
          </div>
        </div>
        
        <ExploreButton href={generateMultilingualPath("/", language)}>
          {t('blog.exploreMore')}
        </ExploreButton>
      </article>
    </>
  );
}
