import Image from "next/image";
import { Link } from '@/src/i18n/routing';
import React from "react";

const BlogLayoutTwo = ({ blog, lang }) => {
  if (!blog) return null;
  
  const blogUrl = blog.url;
  
  return (
    <div className="group grid grid-cols-12 gap-4 items-stretch text-dark dark:text-light h-full">
      <Link
        href={blogUrl || '#'}
        className="col-span-12 lg:col-span-4 h-32 xl:h-40 2xl:h-48 rounded-xl overflow-hidden"
      >
        <Image
          src={blog.image.src}
          placeholder="blur"
          blurDataURL={blog.image.blurDataURL}
          alt={blog.title}
          width={blog.image.width}
          height={blog.image.height}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all ease duration-300"
          sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <div className="col-span-12 lg:col-span-8 w-full flex flex-col justify-center h-full">
        <span className="inline-block w-full capitalize text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
          {blog.tags[0]}
        </span>
        <Link href={blogUrl} className="inline-block my-1">
          <h2 className="font-semibold capitalize text-base sm:text-lg">
            <span
              className="bg-gradient-to-r from-accent/50 dark:from-accentDark/50 to-accent/50 dark:to-accentDark/50 bg-[length:0px_6px]
                group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 "
            >
              {blog.title}
            </span>
          </h2>
        </Link>

        <span className="inline-block w-full capitalize text-gray dark:text-light/50 font-semibold text-xs sm:text-base">
          {new Date(blog.publishedAt).toLocaleDateString(lang === 'zh-cn' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>
    </div>
  );
};

export default BlogLayoutTwo;
