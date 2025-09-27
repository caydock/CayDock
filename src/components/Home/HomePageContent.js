import { getTranslations } from 'next-intl/server';
import HomePage from "@/src/components/Home/HomePage";
import siteMetadata from '@/src/utils/siteMetaData';

export default async function HomePageContent({ locale, language, searchParams }) {
  // 如果有site参数，在服务端获取网站信息
  let initialSite = null;
  if (searchParams?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? siteMetadata.siteUrl 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(searchParams.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        initialSite = await res.json();
      }
    } catch (error) {
      console.error('服务端获取网站信息失败:', error);
    }
  }

  return <HomePage initialLanguage={language} searchParams={searchParams} initialSite={initialSite} />;
}
