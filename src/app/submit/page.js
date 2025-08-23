import { headers, cookies } from "next/headers";
import SubmitForm from './SubmitForm';
import { getTdk } from "@/src/utils/tdk";

export const runtime = 'edge';

export async function generateMetadata() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";
  
  const tdk = getTdk('submit', language);
  
  return {
    title: tdk.title,
    description: tdk.description,
    keywords: tdk.keywords,
  };
}

export default async function SubmitPage({ searchParams }) {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";

  // 等待 searchParams
  const params = await searchParams;

  // 如果有site参数，在服务端获取网站信息
  let initialSite = null;
  if (params?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://w3cay.com' 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(params.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        initialSite = await res.json();
      }
    } catch (error) {
      console.error('服务端获取网站信息失败:', error);
    }
  }

  return <SubmitForm initialLanguage={language} searchParams={params} initialSite={initialSite} />;
} 