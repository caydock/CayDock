"use client"
import React from 'react'
import MDXContent from './MdxContent'

const mdxComponents = {
  // Add any custom components here
}

const RenderMdx = ({blog, locale = 'en'}) => {
  return (
    <div className={`w-full text-base leading-relaxed text-dark dark:text-light px-0 ${locale === 'zh-cn' ? 'font-sc' : 'font-in'} [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-2 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>li]:mb-2 [&>blockquote]:bg-accent/20 [&>blockquote]:p-2 [&>blockquote]:px-6 [&>blockquote]:border-accent [&>blockquote]:not-italic [&>blockquote]:rounded-r-lg dark:[&>blockquote]:bg-accentDark/20 dark:[&>blockquote]:border-accentDark [&>figure]:relative [&>figure]:mb-6 [&>img]:w-full [&>img]:rounded-lg [&>figcaption]:mt-1 [&>figcaption]:mb-2 [&>figcaption]:text-sm [&>code]:bg-accent/10 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:font-mono [&>pre]:bg-accent/10 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:font-mono [&>pre]:text-sm [&>a]:text-accent [&>a]:hover:text-accentDark dark:[&>a]:text-accentDark [&>a]:font-medium [&>a]:hover:underline [&>strong]:font-bold [&>em]:italic [&_hr]:border-t [&_hr]:border-accent/30 [&_hr]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_th]:border [&_th]:border-accent/30 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-accent/10 [&_td]:border [&_td]:border-accent/30 [&_td]:px-4 [&_td]:py-2 dark:[&_th]:bg-accentDark/10 dark:[&_th]:border-accentDark/30 first-letter:text-3xl sm:first-letter:text-5xl`}>
      <MDXContent code={blog.body} components={mdxComponents} />
    </div>
  )
}

export default RenderMdx
