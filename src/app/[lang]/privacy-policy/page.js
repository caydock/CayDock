import { headers, cookies } from "next/headers";
import PrivacyContent from '@/src/components/Legal/PrivacyContent';
import { getServerTranslation } from "@/src/i18n";

export const runtime = 'edge';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.privacy.title,
    description: tdk.privacy.description,
    keywords: tdk.privacy.keywords,
  };
}

export default async function LangPrivacyPolicyPage({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';

  return <PrivacyContent initialLanguage={language} />;
}
