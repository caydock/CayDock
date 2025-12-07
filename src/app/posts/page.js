import BlogPageContent from '@/src/components/Blog/BlogPageContent';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/posts', 'blog');

export default async function BlogPage({ searchParams }) {
  const locale = 'en';
  const language = 'en';
  
  return <BlogPageContent locale={locale} language={language} searchParams={searchParams} />;
}
