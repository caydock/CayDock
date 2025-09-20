import { headers, cookies } from "next/headers";
import ContactContent from "./ContactContent";
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
    title: tdk.contact.title,
    description: tdk.contact.description,
    keywords: tdk.contact.keywords,
  };
}

export default async function Contact() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";

  return <ContactContent initialLanguage={language} />;
}
