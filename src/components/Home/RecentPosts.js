"use client";
import { sortBlogs } from "@/src/utils";
import React from "react";
import BlogLayoutThree from "../Blog/BlogLayoutThree";
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

const RecentPosts = ({ blogs, lang }) => {
  const t = useTranslations('ui');
  const sortedBlogs = sortBlogs(blogs);
  const recentBlogs = sortedBlogs.slice(4, 10);
  
  // 如果没有数据，不渲染组件
  if (!recentBlogs || recentBlogs.length === 0) {
    return null;
  }
  
  return (
    <section className="w-full mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-10 flex flex-col items-center justify-center">
      <div className="w-full flex justify-between">
        <h2 className="w-fit inline-block font-bold capitalize text-2xl md:text-4xl text-dark dark:text-light">
          {t('blog.recentPosts')}
        </h2>
        <Link
          href="/categories/all"
          locale={lang}
          className="inline-block font-medium text-accent dark:text-accentDark underline underline-offset-2 text-base md:text-lg"
        >
          {t('blog.viewAll')}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-16 mt-16 w-full">
        {recentBlogs.map((blog, index) => {
          return (
            <article key={index} className="col-span-1 row-span-1 relative">
              <BlogLayoutThree blog={blog} lang={lang} />
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default RecentPosts;
