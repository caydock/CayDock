import blogs from '@/.velite/generated/blogs.json'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import BreadcrumbServer from "@/src/components/Blog/BreadcrumbServer";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { slug } from "github-slugger";
import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";

export async function generateStaticParams() {
  const categories = [];
  const allCategories = ["all"];
  const blogsCategories = blogs.map((blog) => blog.tags);
  blogsCategories.forEach((category) => {
    category.forEach((item) => {
      if (!allCategories.includes(item)) {
        allCategories.push(item);
      }
    });
  });
  
  // 为每种语言生成参数
  const langCategories = [];
  allCategories.forEach((category) => {
    if (category === "all") {
      langCategories.push({ lang: 'en', slug: "all" });
      langCategories.push({ lang: 'zh-cn', slug: "all" });
    } else {
      langCategories.push({ lang: 'en', slug: slug(category) });
      langCategories.push({ lang: 'zh-cn', slug: slug(category) });
    }
  });
  
  return langCategories;
}

export async function generateMetadata({ params }) {
  const { lang, slug: categorySlug } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  if (categorySlug === "all") {
    const tdk = getServerTranslation(language, "meta");
    return {
      title: tdk.categories.all,
      description: tdk.categories.allDescription,
    };
  } else {
    const categoryTitle = categorySlug.replaceAll("-", " ").replace(/\b\w/g, l => l.toUpperCase());
    const tdk = getServerTranslation(language, "meta");
    return {
      title: `${categoryTitle} ${tdk.categories.posts}`,
      description: `${tdk.categories.learnAbout} ${categoryTitle} ${tdk.categories.throughCollection}`,
    };
  }
}

export default async function LangCategoryPage({ params }) {
  const { lang, slug: categorySlug } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  // Separating logic to create list of categories from all blog posts
  const allCategories = ["all"]; // Initialize with 'all' category
  blogs.forEach(blog => {
    blog.tags.forEach(tag => {
      const slugified = slug(tag);
      if (!allCategories.includes(slugified)) {
        allCategories.push(slugified);
      }
    });
  });

  // Sort allCategories to ensure they are in alphabetical order
  allCategories.sort();

  // Step 2: Filter blog posts based on the current category (params.slug)
  const filteredBlogs = blogs.filter(blog => {
    if (categorySlug === "all") {
      return blog.isPublished; // Include all published blog posts if 'all' category is selected
    }
    return blog.isPublished && blog.tags.some(tag => slug(tag) === categorySlug);
  });

  // 获取翻译
  const tdk = getServerTranslation(language, "ui");

  const breadcrumbItems = [
    {
      label: tdk.breadcrumb.blog,
      href: `/${lang}/blog`
    },
    {
      label: tdk.breadcrumb.categories,
      href: `/${lang}/categories/all`
    },
    {
      label: categorySlug === "all" ? tdk.breadcrumb.allCategories : categorySlug.replaceAll("-", " ").replace(/\b\w/g, l => l.toUpperCase()),
      href: `/${lang}/categories/${categorySlug}`
    }
  ];

  return (
    <article className="mt-8">
      <div className="px-5 md:px-10">
        <BreadcrumbServer items={breadcrumbItems} />
      </div>
      <div className="px-5 md:px-10">
        <Categories categories={allCategories} currentSlug={categorySlug} lang={lang} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 px-5 md:px-10">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 row-span-1 relative">
            <BlogLayoutThree blog={blog} lang={lang} />
          </article>
        ))}
      </div>
      <ExploreButton>
        {tdk.blog.exploreMore}
      </ExploreButton>
    </article>
  );
}
