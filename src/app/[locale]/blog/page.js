import { getTranslations } from 'next-intl/server';
import BlogHome from '@/src/components/Blog/BlogHome';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('blog.title'),
    description: t('blog.description'),
    openGraph: {
      title: t('blog.title'),
      description: t('blog.description'),
    },
  };
}

export default async function BlogPage({ params }) {
  return <BlogHome />;
}
