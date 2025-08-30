import { blogs } from '@/.velite/generated'
import HomeCoverSection from "@/src/components/Home/HomeCoverSection";
import FeaturedPosts from "@/src/components/Home/FeaturedPosts";
import RecentPosts from "@/src/components/Home/RecentPosts";
import Categories from "@/src/components/Blog/Categories";
import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";
import Link from "next/link";

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
      
      {/* 探索更多按钮 */}
      <div className="w-full flex justify-center mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32">
        <Link
          href="/"
          className="inline-block py-3 px-8 bg-dark text-light dark:bg-light dark:text-dark rounded-full font-semibold hover:scale-105 transition-all duration-200 text-lg"
        >
          {tdk.blog.exploreMore}
        </Link>
      </div>
    </main>
  );
}
