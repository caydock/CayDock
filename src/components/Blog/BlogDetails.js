"use client";
import { useTranslations } from 'next-intl';
import { blogs } from '@/.velite/generated';
import { notFound } from 'next/navigation';
import Tag from '../Elements/Tag';
import { slug } from 'github-slugger';
import RenderMdx from './RenderMdx';
import BreadcrumbClient from './BreadcrumbClient';
import ShareButtons from '../Elements/ShareButtons';
import PageTemplate from '../PageTemplate/PageTemplate';
import siteMetadata from '@/src/utils/siteMetaData';
import GiscusComments from '../Elements/GiscusComments';
import TableOfContents from './TableOfContents';
import { useMemo, useEffect, useRef } from 'react';

export default function BlogDetails({ slug: blogSlug, locale }) {
  const t = useTranslations('ui');
  const language = locale === 'zh-cn' ? 'zh-cn' : 'en';
  const tocContainerRef = useRef(null);

  useEffect(() => {
    const tocElement = tocContainerRef.current;
    if (!tocElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = 400; // 标题区域高度
      const offset = 96; // header 高度

      // 当滚动超过标题区域 + offset 时显示目录
      if (scrollPosition > heroHeight + offset) {
        tocElement.style.opacity = '1';
        tocElement.style.pointerEvents = 'auto';
      } else {
        tocElement.style.opacity = '0';
        tocElement.style.pointerEvents = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 查找对应的博客文章（优先通过 key 查找，如果没有 key 则通过 slug 查找）
  const blog = blogs.find(blog => {
    const urlSlug = blog.key || blog.slug;
    return urlSlug === blogSlug && blog.language === language;
  });

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

  // 准备标签组件
  // 始终使用 slug(tag) 生成链接，确保一致性
  const tagElements = blog.tags.slice(0, 4).map((tag, index) => (
    <Tag
      key={index}
      name={tag}
      link={`/tags/${slug(tag)}`}
      locale={locale}
      className="!bg-light/20 dark:!bg-light/20 backdrop-blur-sm !border-dark/30 dark:!border-light/30 !text-dark dark:!text-light hover:!bg-dark/10 dark:hover:!bg-light/30 !border-2 px-4 py-1 text-xs md:text-sm"
    />
  ));

  // 面包屑导航项：Home / Blog / CurrentArticle
  const breadcrumbItems = [
    { label: t('blog.title'), href: '/posts' },
    { label: blog.title, href: blog.url }
  ];

  
  return (
    <PageTemplate
      backgroundImage={blog.image?.src ? {
        src: blog.image.src,
        ...(blog.image.blurDataURL && { blurDataURL: blog.image.blurDataURL })
      } : undefined}
      title={blog.title}
      breadcrumb={<BreadcrumbClient items={breadcrumbItems} locale={locale} />}
      metadata={{
        date: new Date(blog.publishedAt).toLocaleDateString(locale === 'zh-cn' ? 'zh-CN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        wordCount,
        readingTime: blog.readingTime?.text || (locale === 'zh-cn' ? '3分钟' : '3 min')
      }}
      tags={tagElements}
      author={true}
      locale={locale}
    >
      {/* 两列布局 */}
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* 左侧内容区域 */}
          <div className="flex-1 pr-8">
            <div className="w-full max-w-4xl">
              <RenderMdx blog={blog} />
            </div>

            {/* 分享按钮 */}
            <div className="mt-12 pt-8 border-t border-dark/10 dark:border-light/10 w-full max-w-4xl">
              <ShareButtons
                url={`${siteMetadata.siteUrl}${blog.url}`}
                title={blog.title}
                description={blog.description}
                hashtags="weirdwebsites,webdiscovery,blog"
              />
            </div>

            {/* 评论组件 */}
            <div className="mt-8 w-full max-w-4xl">
              <GiscusComments locale={locale} />
            </div>
          </div>

          {/* 右侧目录区域 */}
          <div className="hidden xl:block">
            <div ref={tocContainerRef} className="fixed right-[max(5px,calc(50%-540px-24px))] top-24 transition-opacity duration-300 opacity-0 pointer-events-none w-64">
              <TableOfContents content={blog.body || ''} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
