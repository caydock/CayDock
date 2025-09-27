import { headers, cookies } from "next/headers";
import HomePageContent from "@/src/components/Home/HomePageContent";
import { generateHomePageMetadata } from "@/src/components/Home/HomePageMetadata";
import { generateLanguageLinks } from '@/src/utils/pageUtils';
import siteMetadata from '@/src/utils/siteMetaData';

export const runtime = 'edge';

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const params_search = await searchParams;
  
  const metadata = await generateHomePageMetadata({ locale, searchParams: params_search });
  
  // 为 locale 页面添加正确的 canonical URL
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: `${siteMetadata.siteUrl}/${locale}/`,
    },
  };
}

export default async function LocaleHome({ params, searchParams }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  const params_search = await searchParams;

  return <HomePageContent locale={locale} language={language} searchParams={params_search} />;
}
