import { headers, cookies } from "next/headers";
import SubmitForm from '@/src/app/[locale]/submit/SubmitForm';
import { getTranslations } from 'next-intl/server';
import siteMetadata from '@/src/utils/siteMetaData';

export const runtime = 'edge';

export async function generateMetadata() {
  const locale = 'en'; // 根目录默认为英文
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('submit.title'),
    description: t('submit.description'),
    keywords: t('submit.keywords'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/submit`,
      languages: {
        'en': `${siteMetadata.siteUrl}/submit`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/submit`,
        'x-default': `${siteMetadata.siteUrl}/submit`,
      },
    },
  };
}

export default async function SubmitPage({ searchParams }) {
  const locale = 'en'; // 根目录默认为英文
  const language = 'en';

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
