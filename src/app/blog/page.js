import BlogPageContent from '@/src/components/Blog/BlogPageContent';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/blog', 'blog');

export default async function BlogPage() {
  const locale = 'en';
  const language = 'en';
  
  return <BlogPageContent locale={locale} language={language} />;
}
