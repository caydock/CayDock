"use client";
import { useTranslations } from 'next-intl';
import { blogs } from '@/.velite/generated';
import { notFound } from 'next/navigation';
import Tag from '../Elements/Tag';
import { slug } from 'github-slugger';
import RenderMdx from './RenderMdx';
import ShareButtons from '../Elements/ShareButtons';
import PageTemplate from '../PageTemplate/PageTemplate';
import siteMetadata from '@/src/utils/siteMetaData';
import GiscusComments from '../Elements/GiscusComments';
import { useMemo } from 'react';

export default function BlogDetails({ slug: blogSlug, locale }) {
  const t = useTranslations('ui');
  const language = locale === 'zh-cn' ? 'zh-cn' : 'en';
  
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

  const breadcrumbItems = [
    {
      label: t('nav.blog'),
      href: "/posts"
    },
    {
      label: t('breadcrumb.categories'),
      href: "/tags"
    },
    {
      label: blog.title,
      href: blog.url
    }
  ];

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

  return (
    <PageTemplate
      backgroundImage={blog.image?.src ? {
        src: blog.image.src,
        ...(blog.image.blurDataURL && { blurDataURL: blog.image.blurDataURL })
      } : '/images/about-bg.jpg'}
      title={blog.title}
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
      locale={locale}
    >
      <RenderMdx blog={blog} />
      
      {/* 分享按钮 */}
      <div className="mt-12 pt-8 border-t border-dark/10 dark:border-light/10">
        <ShareButtons 
          url={`${siteMetadata.siteUrl}${blog.url}`}
          title={blog.title}
          description={blog.description}
          hashtags="weirdwebsites,webdiscovery,blog"
        />
      </div>

      {/* 评论组件 */}
      <GiscusComments locale={locale} />
    </PageTemplate>
  );
}
