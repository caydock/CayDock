import HomePage from "@/src/components/Home/HomePage";
import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";

export const runtime = 'edge';

export async function generateMetadata({ searchParams }) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";
  
  // 等待 searchParams
  const params = await searchParams;
  
  // 如果有 site 参数，获取网站信息并生成动态标题
  if (params?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://w3cay.com' 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(params.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        const site = await res.json();
        const siteTitle = language === 'zh' ? site.title?.zh : site.title?.en;
        if (siteTitle) {
          const description = language === 'zh' 
            ? `在 W3Cay 发现有趣网站：${siteTitle}。探索数字世界中的奇妙网站，发现更多有趣内容。`
            : `Discover interesting website ${siteTitle} on W3Cay. Explore weird and wonderful websites in the digital world.`;
          
          return {
            title: `${siteTitle} - W3Cay`,
            description: description,
            openGraph: {
              title: `${siteTitle} - W3Cay`,
              description: description,
            },
          };
        }
      }
    } catch (error) {
      console.error('生成动态标题失败:', error);
    }
  }
  
  // 默认标题
  const tdk = getServerTranslation(language, "meta");
  return {
    title: tdk.home.title,
    description: tdk.home.description,
  };
}

export default async function Home({ searchParams }) {
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

  return <HomePage initialLanguage={language} searchParams={params} initialSite={initialSite} />;
}
