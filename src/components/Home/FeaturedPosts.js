"use client";
import { sortBlogs } from "@/src/utils";
import React from "react";
import BlogLayoutOne from "../Blog/BlogLayoutOne";
import BlogLayoutTwo from "../Blog/BlogLayoutTwo";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

const FeaturedPosts = ({ blogs, lang }) => {
  const { t } = useLanguage();
  const sortedBlogs = sortBlogs(blogs);
  
  // 检查是否有足够的特色文章数据
  const hasFeaturedPosts = sortedBlogs[1] || sortedBlogs[2] || sortedBlogs[3];
  
  // 如果没有数据，不渲染组件
  if (!hasFeaturedPosts) {
    return null;
  }
  
  return <section className="w-full mt-16 sm:mt-24  md:mt-10 px-5 sm:px-10 md:px-10 flex flex-col items-center justify-center">
    <h2 className="w-full inline-block font-bold capitalize text-2xl md:text-4xl text-dark dark:text-light">{t('blog.featuredPosts')}</h2>

    <div className="grid grid-cols-2 grid-rows-2 gap-6 mt-10 sm:mt-10">
      {sortedBlogs[1] && (
        <article className="col-span-2 lg:col-span-1 sxl:col-span-1 row-span-2 relative h-full">
          <BlogLayoutOne blog={sortedBlogs[1]} lang={lang} />
        </article>
      )}
      {sortedBlogs[2] && (
        <article className="col-span-2 sm:col-span-1 lg:col-span-1 row-span-1 relative h-full">
          <BlogLayoutTwo blog={sortedBlogs[2]} lang={lang} />
        </article>
      )}
      {sortedBlogs[3] && (
        <article className="col-span-2 sm:col-span-1 lg:col-span-1 row-span-1 relative h-full">
          <BlogLayoutTwo blog={sortedBlogs[3]} lang={lang} />
        </article>
      )}
    </div>
  </section>;
};

export default FeaturedPosts;
