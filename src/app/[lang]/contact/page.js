import { headers, cookies } from "next/headers";
import ContactContent from "@/src/components/Contact/ContactContent";
import { getServerTranslation } from "@/src/i18n";

export const runtime = 'edge';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.contact.title,
    description: tdk.contact.description,
    keywords: tdk.contact.keywords,
  };
}

export default async function LangContact({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';

  return <ContactContent initialLanguage={language} />;
}
