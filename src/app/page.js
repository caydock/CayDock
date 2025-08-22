import HomePage from "@/src/components/Home/HomePage";
import { headers, cookies } from "next/headers";

export const runtime = 'edge';

export default async function Home() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const language = isZh ? "zh" : "en";

  return <HomePage initialLanguage={language} />;
}
