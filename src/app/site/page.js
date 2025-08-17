import SitePage from "@/src/components/Site/SitePage";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = 'edge';

export default async function SitePageRoute({ searchParams }) {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";

  // 获取id参数
  const siteId = (await searchParams)?.id;

  if (!siteId) {
    // 如果没有id参数，重定向到首页
    return redirect('/');
  }

  return <SitePage siteId={siteId} language={language} />;
} 