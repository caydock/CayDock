import { blogs } from '@/.velite/generated'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import BreadcrumbServer from "@/src/components/Blog/BreadcrumbServer";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { slug } from "github-slugger";
import { getServerTranslation } from "@/src/i18n";

export default function CategoryPageContent({ categorySlug, locale, language }) {
  // 获取翻译
  const tdk = getServerTranslation(language, "ui");
  
  // 创建分类列表
  const allCategories = ["all"];
  blogs.filter(blog => blog.language === language).forEach(blog => {
    if (blog.tagKeys && blog.tagKeys.length > 0) {
      blog.tagKeys.forEach(tagKey => {
        if (!allCategories.includes(tagKey)) {
          allCategories.push(tagKey);
        }
      });
    } else {
      blog.tags.forEach((tag) => {
        const slugified = slug(tag);
        if (!allCategories.includes(slugified)) {
          allCategories.push(slugified);
        }
      });
    }
  });

  // 排序分类
  allCategories.sort();

  // 过滤博客文章
  const filteredBlogs = blogs.filter(blog => {
    if (categorySlug === "all") {
      return blog.isPublished && blog.language === language;
    }

    if (blog.tagKeys && blog.tagKeys.length > 0) {
      return blog.isPublished && blog.language === language && blog.tagKeys.includes(categorySlug);
    } else {
      return blog.isPublished && blog.language === language && blog.tags.some(tag => slug(tag) === categorySlug);
    }
  });

  // 获取当前分类的原始标签名称
  const getCategoryLabel = (categorySlug) => {
    if (categorySlug === "all") {
      return tdk.breadcrumb.allCategories;
    }
    
    // 查找当前语言的博客文章来获取原始标签名称
    const currentLanguageBlogs = blogs.filter(blog => blog.language === language);
    const matchingBlog = currentLanguageBlogs.find(blog => {
      // 优先使用tagKeys进行匹配
      if (blog.tagKeys && blog.tagKeys.length > 0) {
        return blog.tagKeys.includes(categorySlug);
      } else {
        return blog.tags.some(tag => slug(tag) === categorySlug);
      }
    });
    
    if (matchingBlog) {
      // 如果使用tagKeys匹配，找到对应的原始标签
      if (matchingBlog.tagKeys && matchingBlog.tagKeys.includes(categorySlug)) {
        const tagKeyIndex = matchingBlog.tagKeys.indexOf(categorySlug);
        if (tagKeyIndex >= 0 && matchingBlog.tags[tagKeyIndex]) {
          return matchingBlog.tags[tagKeyIndex];
        }
      } else {
        // 使用原始tags匹配
        const originalTag = matchingBlog.tags.find(tag => slug(tag) === categorySlug);
        if (originalTag) {
          return originalTag;
        }
      }
    }
    
    // 如果没有找到匹配的博客，尝试解码URL编码的标签
    try {
      const decoded = decodeURIComponent(categorySlug);
      if (decoded !== categorySlug) {
        return decoded;
      }
    } catch (e) {
      // 如果解码失败，继续使用默认方法
    }
    
    // 使用默认的格式化方法
    return categorySlug.replaceAll("-", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

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
      label: getCategoryLabel(categorySlug),
      href: `/categories/${categorySlug}`
    }
  ];

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <BreadcrumbServer items={breadcrumbItems} homeLabel={tdk.nav.home} locale={locale} />
      <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl capitalize">#{getCategoryLabel(categorySlug)}</h1>
        <span className="mt-10 inline-block">
          {tdk.blog.categorySubtitle}
        </span>
      </div>
      <Categories categories={allCategories} currentSlug={categorySlug} lang={locale} getCategoryLabel={getCategoryLabel} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 mb-10">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 relative">
            <BlogLayoutThree blog={blog} />
          </article>
        ))}
      </div>
      
      <ExploreButton locale={locale}>
        {tdk.blog.exploreMore}
      </ExploreButton>
    </article>
  );
}
