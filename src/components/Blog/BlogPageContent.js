import { blogs } from '@/.velite/generated'
import HomeCoverSection from "@/src/components/Home/HomeCoverSection";
import FeaturedPosts from "@/src/components/Home/FeaturedPosts";
import RecentPosts from "@/src/components/Home/RecentPosts";
import { getTranslations } from 'next-intl/server';

export default async function BlogPageContent({ locale, language }) {
  // 根据语言过滤博客
  // language 可能是 'zh'，但博客文章的 language 是 'zh-cn'，需要转换
  const blogLanguage = language === 'zh' ? 'zh-cn' : language;
  const filteredBlogs = blogs.filter((blog) => {
    return blog.isPublished && blog.language === blogLanguage;
  });

  const t = await getTranslations({locale: locale, namespace: 'ui'});

  return (
    <main className="flex flex-col items-center justify-center mb-10">
      <div className="w-full max-w-7xl mx-auto">
        <HomeCoverSection blogs={filteredBlogs} lang={locale} />
        <FeaturedPosts blogs={filteredBlogs} lang={locale} />
        <RecentPosts blogs={filteredBlogs} lang={locale} />
      </div>
    </main>
  );
}
