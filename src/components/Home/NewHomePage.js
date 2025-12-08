"use client";
import React from 'react';
import { blogs } from '@/.velite/generated';
import { sortBlogs } from '@/src/utils';
import HomeHeroSection from './HomeHeroSection';
import BlogLayoutThree from '../Blog/BlogLayoutThree';
import SmartLink from '../Elements/SmartLink';
import { useTranslations, useLocale } from 'next-intl';

const NewHomePage = () => {
  const locale = useLocale();
  const language = locale === 'zh-cn' ? 'zh-cn' : 'en';
  const t = useTranslations('ui');
  
  // 根据语言过滤博客
  const filteredBlogs = blogs.filter((blog) => {
    return blog.isPublished && blog.language === language;
  });

  const sortedBlogs = sortBlogs(filteredBlogs);
  const recentBlogs = sortedBlogs.slice(0, 6); // 显示最新6篇文章

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 md:pt-32">
      {/* Hero Section */}
      <HomeHeroSection />
      
      {/* Latest Posts Section */}
      {recentBlogs.length > 0 && (
        <section className="w-full max-w-7xl mx-auto mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-10 flex flex-col items-start justify-center mb-20">
          <div className="w-full flex justify-between items-end mb-8">
            <div>
              <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-dark dark:text-light mb-2">
                {t('blog.recentPosts')}
              </h2>
              <p className="text-sm md:text-base text-dark/70 dark:text-light/70">
                {locale === 'zh-cn' ? '最近发布的博客文章' : 'Recently published blog posts'}
              </p>
            </div>
            <SmartLink
              href="/posts"
              locale={locale}
              className="inline-block font-medium text-accent dark:text-accentDark underline underline-offset-2 text-sm md:text-base"
            >
              {t('blog.viewAll')}
            </SmartLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {recentBlogs.map((blog, index) => {
              return (
                <article key={index} className="col-span-1">
                  <BlogLayoutThree blog={blog} lang={locale} />
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};

export default NewHomePage;

