import HomePageContent from "@/src/components/Home/HomePageContent";
import { generateHomePageMetadata } from "@/src/components/Home/HomePageMetadata";

export const runtime = 'edge';

export async function generateMetadata({ searchParams }) {
  const locale = 'en'; // 根目录默认为英文
  const params_search = await searchParams;
  
  return generateHomePageMetadata({ locale, searchParams: params_search });
}

export default async function RootPage({ searchParams }) {
  const locale = 'en'; // 根目录默认为英文
  const language = 'en';
  const params_search = await searchParams;

  return <HomePageContent locale={locale} language={language} searchParams={params_search} />;
}
