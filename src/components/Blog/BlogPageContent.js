import { blogs } from '@/.velite/generated'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Pagination from "@/src/components/Blog/Pagination";
import { sortBlogs } from '@/src/utils';
import { getTranslations } from 'next-intl/server';

const POSTS_PER_PAGE = 12;

export default async function BlogPageContent({ locale, language, searchParams }) {
  // 根据语言过滤博客
  // language 可能是 'zh'，但博客文章的 language 是 'zh-cn'，需要转换
  const blogLanguage = language === 'zh' ? 'zh-cn' : language;
  const filteredBlogs = blogs.filter((blog) => {
    return blog.isPublished && blog.language === blogLanguage;
  });

  // 按日期从新到旧排序
  const sortedBlogs = sortBlogs(filteredBlogs);

  // 分页逻辑
  const currentPage = parseInt(searchParams?.page || '1', 10);
  const totalPages = Math.ceil(sortedBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedBlogs = sortedBlogs.slice(startIndex, endIndex);

  const t = await getTranslations({locale: locale, namespace: 'ui'});

  return (
    <main className="flex flex-col items-center justify-center min-h-screen pt-20 md:pt-24 pb-10">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-10">
        {/* 标题 */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-dark dark:text-light mb-2">
            {t('blog.title')}
          </h1>
          <p className="text-base md:text-lg text-dark/70 dark:text-light/70">
            {locale === 'zh-cn' ? `共 ${sortedBlogs.length} 篇文章` : `${sortedBlogs.length} articles`}
          </p>
        </div>

        {/* 博客列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {paginatedBlogs.map((blog, index) => (
            <article key={blog.slug} className="col-span-1">
              <BlogLayoutThree blog={blog} lang={locale} />
            </article>
          ))}
        </div>

        {/* 分页 */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          locale={locale}
          basePath={locale === 'zh-cn' ? '/zh-cn/posts' : '/posts'}
        />
      </div>
    </main>
  );
}
