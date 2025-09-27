import { blogs } from '@/.velite/generated'
import HomeCoverSection from "@/src/components/Home/HomeCoverSection";
import FeaturedPosts from "@/src/components/Home/FeaturedPosts";
import RecentPosts from "@/src/components/Home/RecentPosts";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { getTranslations } from 'next-intl/server';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('blog.title'),
    description: t('blog.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/blog`,
      languages: {
        'en': `${siteMetadata.siteUrl}/en/blog`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/blog`,
        'x-default': `${siteMetadata.siteUrl}/en/blog`,
      },
    },
    openGraph: {
      title: t('blog.title'),
      description: t('blog.description'),
    },
  };
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  
  // 根据语言过滤博客
  const filteredBlogs = blogs.filter((blog) => {
    return blog.isPublished && blog.language === language;
  });

  const t = await getTranslations({locale: locale, namespace: 'ui'});

  return (
    <main className="flex flex-col items-center justify-center mb-10">
      <HomeCoverSection blogs={filteredBlogs} lang={locale} />
      <FeaturedPosts blogs={filteredBlogs} lang={locale} />
      <RecentPosts blogs={filteredBlogs} lang={locale} />
      
      <ExploreButton href="/">
        {t('blog.exploreMore')}
      </ExploreButton>
    </main>
  );
}
