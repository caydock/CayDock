import { headers, cookies } from "next/headers";
import SubmitForm from '@/src/components/Submit/SubmitForm';
import { getServerTranslation } from "@/src/i18n";

export const runtime = 'edge';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.submit.title,
    description: tdk.submit.description,
    keywords: tdk.submit.keywords,
  };
}

export default async function LangSubmitPage({ params, searchParams }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';

  // 等待 searchParams
  const params_search = await searchParams;

  // 如果有site参数，在服务端获取网站信息
  let initialSite = null;
  if (params_search?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://w3cay.com' 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(params_search.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        initialSite = await res.json();
      }
    } catch (error) {
      console.error('服务端获取网站信息失败:', error);
    }
  }

  return <SubmitForm initialLanguage={language} searchParams={params_search} initialSite={initialSite} />;
}
