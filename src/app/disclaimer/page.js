import { headers, cookies } from "next/headers";
import DisclaimerContent from "./DisclaimerContent";
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
    title: tdk.disclaimer.title,
    description: tdk.disclaimer.description,
    keywords: tdk.disclaimer.keywords,
  };
}

export default async function DisclaimerPage() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";

  return <DisclaimerContent initialLanguage={language} />;
}
