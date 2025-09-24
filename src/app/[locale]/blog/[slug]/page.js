import { getTranslations } from 'next-intl/server';
import BlogDetails from '@/src/components/Blog/BlogDetails';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  // 这里可以根据 slug 获取具体的博客文章信息
  // 暂时使用默认的博客标题
  return {
    title: `${slug} - ${t('blog.title')}`,
    description: t('blog.description'),
    openGraph: {
      title: `${slug} - ${t('blog.title')}`,
      description: t('blog.description'),
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { locale, slug } = await params;
  
  return <BlogDetails slug={slug} locale={locale} />;
}
