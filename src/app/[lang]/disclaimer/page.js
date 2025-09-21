import { headers, cookies } from "next/headers";
import DisclaimerContent from "../../disclaimer/DisclaimerContent";
import { getServerTranslation } from "@/src/i18n";

export const runtime = 'edge';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.disclaimer.title,
    description: tdk.disclaimer.description,
    keywords: tdk.disclaimer.keywords,
  };
}

export default async function LangDisclaimerPage({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';

  return <DisclaimerContent initialLanguage={language} />;
}
