import { blogs } from '@/.velite/generated'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Pagination from "@/src/components/Blog/Pagination";
import { sortBlogs } from '@/src/utils';
import { getTranslations } from 'next-intl/server';
import BreadcrumbServer from './BreadcrumbServer';
import PageTemplate from '../PageTemplate/PageTemplate';

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
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);
  const totalPages = Math.ceil(sortedBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedBlogs = sortedBlogs.slice(startIndex, endIndex);

  const t = await getTranslations({locale: locale, namespace: 'ui'});

  const breadcrumbItems = [
    {
      label: t('blog.title'),
      href: "/posts"
    }
  ];

  return (
    <PageTemplate
      title={t('blog.title')}
      subtitle={t('blog.subtitle')}
      breadcrumb={<BreadcrumbServer items={breadcrumbItems} locale={locale} />}
      locale={locale}
      backgroundImage="/images/about-bg.jpg"
      heroHeight="h-[400px]"
    >
      <section className="text-dark dark:text-light">
        {/* 博客列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-10">
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
          basePath="/posts"
        />
      </section>
    </PageTemplate>
  );
}
