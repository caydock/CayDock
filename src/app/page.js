import HomePage from "@/src/components/Home/HomePage";
import SitePage from "@/src/components/Site/SitePage";
import { headers, cookies } from "next/headers";

export const runtime = 'edge';

export default async function Home({ searchParams }) {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";

  // 检查是否有site参数
  const siteParam = (await searchParams)?.site;
  
  if (siteParam) {
    return <SitePage siteId={siteParam} language={language} />;
  }

  return <HomePage initialLanguage={language} />;
}
