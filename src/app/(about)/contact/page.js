import { headers, cookies } from "next/headers";
import ContactContent from "./ContactContent";
import { getTdk } from "@/src/utils/tdk";

export const runtime = 'edge';

export async function generateMetadata() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";
  
  const tdk = getTdk('contact', language);
  
  return {
    title: tdk.title,
    description: tdk.description,
    keywords: tdk.keywords,
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
