import { headers, cookies } from "next/headers";
import TermsContent from '@/src/components/Legal/TermsContent';
import { getServerTranslation } from "@/src/i18n";

export const runtime = 'edge';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.terms.title,
    description: tdk.terms.description,
    keywords: tdk.terms.keywords,
  };
}

export default async function LangTermsPage({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';

  return <TermsContent initialLanguage={language} />;
}
