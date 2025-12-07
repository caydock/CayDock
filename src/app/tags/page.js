import CategoryPageContent from "@/src/components/Category/CategoryPageContent";
import { getServerTranslation } from "@/src/i18n";
import { generateLanguageLinks } from '@/src/utils/pageUtils';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata() {
  const locale = 'en'; // 根目录默认为英文
  const language = 'en';
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.categories.all,
    description: tdk.categories.allDescription,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/tags`,
      languages: generateLanguageLinks('/tags'),
    },
  };
}

export default async function TagsPage() {
  const locale = 'en';
  const language = 'en';
  
  // 传递 "all" 作为 categorySlug，显示所有标签
  return <CategoryPageContent categorySlug="all" locale={locale} language={language} />;
}

