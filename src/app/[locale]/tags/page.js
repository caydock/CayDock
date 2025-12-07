import CategoryPageContent from "@/src/components/Category/CategoryPageContent";
import { getServerTranslation } from "@/src/i18n";
import { generateLanguageLinks } from '@/src/utils/pageUtils';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.categories.all,
    description: tdk.categories.allDescription,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale === 'en' ? '' : locale + '/'}tags`,
      languages: generateLanguageLinks('/tags'),
    },
  };
}

export default async function TagsPage({ params }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  
  // 传递 "all" 作为 categorySlug，显示所有标签
  return <CategoryPageContent categorySlug="all" locale={locale} language={language} />;
}

