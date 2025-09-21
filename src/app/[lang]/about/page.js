import AboutCoverSection from "@/src/components/About/AboutCoverSection";
import AboutBodyClient from "../../(about)/about/AboutBodyClient";
import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";

export const runtime = 'edge';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.about.title,
    description: tdk.about.description,
    keywords: tdk.about.keywords,
  };
}

export default function LangAbout({ params }) {
  return (
    <>
      <AboutCoverSection />
      <AboutBodyClient />
    </>
  );
}
