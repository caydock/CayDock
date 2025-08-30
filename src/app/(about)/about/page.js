import AboutCoverSection from "@/src/components/About/AboutCoverSection";
import AboutBodyClient from "./AboutBodyClient";
import { headers, cookies } from "next/headers";
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

export default function About() {
  return (
    <>
      <AboutCoverSection />
      <AboutBodyClient />
    </>
  );
}
