import blogs from '@/.velite/generated/blogs.json'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import BreadcrumbServer from "@/src/components/Blog/BreadcrumbServer";
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
  allCategories.forEach((category) => {
    if (category === "all") {
      categories.push({ slug: "all" });
    } else {
      categories.push({ slug: slug(category) });
    }
  });
  return categories;
}

export async function generateMetadata({ params }) {
  const { slug: categorySlug } = await params;
  if (categorySlug === "all") {
    return {
      title: `All Blog Posts`,
      description: `Learn web development through our collection of free, practical blog posts.`,
    };
  } else {
    return {
      title: `${categorySlug.replaceAll("-", " ")} Blog Posts`,
      description: `Learn about ${categorySlug.replaceAll(
        "-",
        " "
      )} through our collection of free, practical blog posts.`,
    };
  }
}

export default async function CategoryPage({ params }) {
  const { slug: categorySlug } = await params;
  
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
  const cookieStore = await cookies();
  const headerStore = await headers();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const lang = isZh ? "zh" : "en";
  const tdk = getServerTranslation(lang, "ui");

      const breadcrumbItems = [
      {
        label: tdk.breadcrumb.blog,
        href: "/blog"
      },
      {
        label: tdk.breadcrumb.categories,
        href: "/categories/all"
      },
      {
        label: categorySlug === "all" ? tdk.breadcrumb.allCategories : categorySlug.replaceAll("-", " "),
        href: `/categories/${categorySlug}`
      }
    ];

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <BreadcrumbServer items={breadcrumbItems} homeLabel={tdk.nav.home} />
      <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl">#{categorySlug}</h1>
        <span className="mt-2 inline-block">
          Discover more categories and expand your knowledge!
        </span>
      </div>
      <Categories categories={allCategories} currentSlug={categorySlug} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 mb-10">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 relative">
            <BlogLayoutThree blog={blog} />
          </article>
        ))}
      </div>
    </article>
  );
}
