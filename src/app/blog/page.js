import { blogs } from '@/.velite/generated'
import HomeCoverSection from "@/src/components/Home/HomeCoverSection";
import FeaturedPosts from "@/src/components/Home/FeaturedPosts";
import RecentPosts from "@/src/components/Home/RecentPosts";
import Categories from "@/src/components/Blog/Categories";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { getServerTranslation } from "@/src/i18n";

export async function generateMetadata() {
  const tdk = getServerTranslation("en", "meta");

  return {
    title: tdk.blog.title,
    description: tdk.blog.description,
  };
}

export default async function Blog() {
  // 只显示英文的已发布博客（无语言前缀的URL默认是英文）
  const filteredBlogs = blogs.filter((blog) => {
    return blog.isPublished && blog.language === 'en';
  });

  // 获取英文翻译
  const tdk = getServerTranslation("en", "ui");

  return (
    <main className="flex flex-col items-center justify-center mb-10">
      <HomeCoverSection blogs={filteredBlogs} />
      <FeaturedPosts blogs={filteredBlogs} />
      <RecentPosts blogs={filteredBlogs} />
      
      <ExploreButton>
        {tdk.blog.exploreMore}
      </ExploreButton>
    </main>
  );
}