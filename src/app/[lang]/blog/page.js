import { blogs } from '@/.velite/generated'
import HomeCoverSection from "@/src/components/Home/HomeCoverSection";
import FeaturedPosts from "@/src/components/Home/FeaturedPosts";
import RecentPosts from "@/src/components/Home/RecentPosts";
import Categories from "@/src/components/Blog/Categories";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  const tdk = getServerTranslation(language, "meta");

  return {
    title: tdk.blog.title,
    description: tdk.blog.description,
  };
}

export default async function LangBlog({ params }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  const allBlogs = blogs;
  const filteredBlogs = allBlogs.filter((blog) => {
    return blog.isPublished && blog.language === language;
  });

  // 获取翻译
  const tdk = getServerTranslation(language, "ui");

  return (
    <main className="flex flex-col items-center justify-center mb-10">
      <HomeCoverSection blogs={filteredBlogs} lang={lang} />
      <FeaturedPosts blogs={filteredBlogs} lang={lang} />
      <RecentPosts blogs={filteredBlogs} lang={lang} />
      
      <ExploreButton href={`/${lang}`}>
        {tdk.blog.exploreMore}
      </ExploreButton>
    </main>
  );
}
