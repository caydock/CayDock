import { sortBlogs } from '@/src/utils'
import Image from 'next/image';
import SmartLink from '../Elements/SmartLink';
import React from 'react'
import Tag from '../Elements/Tag';
import { slug } from 'github-slugger';

const HomeCoverSection = ({blogs, lang}) => {

    const sortedBlogs = sortBlogs(blogs);
    const blog = sortedBlogs[0];

    // 如果没有数据，不渲染组件
    if (!blog) {
        return null;
    }
    
    const blogUrl = blog.url;

  return (
    <div className='w-full max-w-7xl mx-auto px-5 sm:px-10 md:px-10 inline-block mt-10'>
        <article className='flex flex-col items-start justify-end relative h-[60vh] sm:h-[85vh]'>
            <div className='absolute top-0 left-0 bottom-0 right-0 h-full
            bg-gradient-to-b from-transparent from-0% to-dark/90 rounded-3xl z-0
            ' />
        <Image src={blog.image.src}
        placeholder='blur'
        blurDataURL={blog.image.blurDataURL}
        alt={blog.title}
        fill
        className='w-full h-full object-center object-cover rounded-3xl -z-10'
        sizes='100vw'
        priority
        />

        <div className='w-full lg:w-3/4 p-6 sm:p-8 md:p-12  lg:p-16 flex flex-col items-start justify-center z-0 text-light'>
            <Tag link={`/categories/${blog.tagKeys && blog.tagKeys.length > 0 ? blog.tagKeys[0] : slug(blog.tags[0])}`} name={blog.tags[0]} locale={lang} />
            <SmartLink href={blogUrl} locale={lang} className='mt-6'>
            <h1 className='font-bold capitalize text-lg sm:text-xl md:text-3xl lg:text-4xl'>
                <span className='bg-gradient-to-r from-accent to-accent dark:from-accentDark/50 
                dark:to-accentDark/50 bg-[length:0px_6px]
                hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 '>
                {blog.title}
                </span>
            </h1>
            </SmartLink>
            <p className='hidden  sm:inline-block mt-4 md:text-lg lg:text-xl font-in'>
                {blog.description}
            </p>
        </div>
    </article>
    </div>
  )
}

export default HomeCoverSection
