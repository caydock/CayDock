import { headers, cookies } from "next/headers";
import TermsContent from "./TermsContent";
import { getServerTranslation } from "@/src/i18n";

export const runtime = 'edge';

export async function generateMetadata() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";
  
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.title,
    description: tdk.description,
    keywords: tdk.keywords,
  };
}

export default async function TermsPage() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";

  return <TermsContent initialLanguage={language} />;
}
