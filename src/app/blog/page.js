import { blogs } from '@/.velite/generated'
import HomeCoverSection from "@/src/components/Home/HomeCoverSection";
import FeaturedPosts from "@/src/components/Home/FeaturedPosts";
import RecentPosts from "@/src/components/Home/RecentPosts";
import Categories from "@/src/components/Blog/Categories";
import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const lang = isZh ? "zh" : "en";
  const tdk = getServerTranslation(lang, "meta");

  return {
    title: tdk.blog.title,
    description: tdk.blog.description,
  };
}

export default async function Blog() {
  const allBlogs = blogs;
  const filteredBlogs = allBlogs.filter((blog) => {
    return blog.isPublished;
  });

  // 获取翻译
  const cookieStore = await cookies();
  const headerStore = await headers();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const lang = isZh ? "zh" : "en";
  const tdk = getServerTranslation(lang, "ui");

  return (
    <main className="flex flex-col items-center justify-center mb-10">
      <HomeCoverSection blogs={filteredBlogs} />
      <FeaturedPosts blogs={filteredBlogs} />
      <RecentPosts blogs={filteredBlogs} />
    </main>
  );
}
