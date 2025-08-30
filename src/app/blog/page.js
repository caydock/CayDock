import { blogs } from '@/.velite/generated'
import HomeCoverSection from "@/src/components/Home/HomeCoverSection";
import FeaturedPosts from "@/src/components/Home/FeaturedPosts";
import RecentPosts from "@/src/components/Home/RecentPosts";
import Categories from "@/src/components/Blog/Categories";
import { headers, cookies } from "next/headers";
import enTdk from "@/src/i18n/tdk/en.json";
import zhTdk from "@/src/i18n/tdk/zh.json";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const lang = isZh ? "zh" : "en";
  const tdk = lang === "zh" ? zhTdk : enTdk;

  return {
    title: tdk.blogs.title,
    description: tdk.blogs.description,
  };
}

export default function Blogs() {
  const allBlogs = blogs;
  const filteredBlogs = allBlogs.filter((blog) => {
    return blog.isPublished;
  });

  return (
    <main className="flex flex-col items-center justify-center mb-10">
      <HomeCoverSection blogs={filteredBlogs} />
      <FeaturedPosts blogs={filteredBlogs} />
      <RecentPosts blogs={filteredBlogs} />
    </main>
  );
}
