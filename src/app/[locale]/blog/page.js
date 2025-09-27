import BlogPageContent from '@/src/components/Blog/BlogPageContent';
import { createLocalePageMetadata, getPageLocale } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/blog', 'blog');

export default async function BlogPage({ params }) {
  const { locale, language } = await getPageLocale(params);
  
  return <BlogPageContent locale={locale} language={language} />;
}
