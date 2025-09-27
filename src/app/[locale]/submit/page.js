import SubmitForm from '@/src/components/Submit/SubmitForm';
import { createLocalePageMetadata, getPageLocale } from '@/src/utils/pageUtils';
import siteMetadata from '@/src/utils/siteMetaData';

export const runtime = 'edge';

export const generateMetadata = createLocalePageMetadata('/submit', 'submit');

export default async function SubmitPage({ params, searchParams }) {
  const { language } = await getPageLocale(params);

  // 等待 searchParams
  const params_data = await searchParams;

  // 如果有site参数，在服务端获取网站信息
  let initialSite = null;
  if (params_data?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? siteMetadata.siteUrl 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(params_data.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        initialSite = await res.json();
      }
    } catch (error) {
      console.error('服务端获取网站信息失败:', error);
    }
  }

  return <SubmitForm initialLanguage={language} searchParams={params_data} initialSite={initialSite} />;
}
