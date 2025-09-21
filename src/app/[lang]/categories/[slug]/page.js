// 导入统一的分类页面组件
import { blogs } from '@/.velite/generated'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import BreadcrumbServer from "@/src/components/Blog/BreadcrumbServer";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { slug } from "github-slugger";
import { getServerTranslation } from "@/src/i18n";
import { generateMultilingualPath } from "@/src/utils/languageUtils";

export default async function LangCategoryPage({ params }) {
  const { lang, slug: categorySlug } = await params;
  
  // 根据lang参数确定语言
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  // 获取对应语言的翻译
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
    
    const currentLanguageBlogs = blogs.filter(blog => blog.language === language);
    const matchingBlog = currentLanguageBlogs.find(blog => {
      if (blog.tagKeys && blog.tagKeys.length > 0) {
        return blog.tagKeys.includes(categorySlug);
      } else {
        return blog.tags.some(tag => slug(tag) === categorySlug);
      }
    });
    
    if (matchingBlog) {
      if (matchingBlog.tagKeys && matchingBlog.tagKeys.includes(categorySlug)) {
        const tagKeyIndex = matchingBlog.tagKeys.indexOf(categorySlug);
        if (tagKeyIndex >= 0 && matchingBlog.tags[tagKeyIndex]) {
          return matchingBlog.tags[tagKeyIndex];
        }
      } else {
        const originalTag = matchingBlog.tags.find(tag => slug(tag) === categorySlug);
        if (originalTag) {
          return originalTag;
        }
      }
    }
    
    return categorySlug.replaceAll("-", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const breadcrumbItems = [
    {
      label: tdk.breadcrumb.blog,
      href: generateMultilingualPath("/blog", language)
    },
    {
      label: tdk.breadcrumb.categories,
      href: generateMultilingualPath("/categories/all", language)
    },
    {
      label: getCategoryLabel(categorySlug),
      href: generateMultilingualPath(`/categories/${categorySlug}`, language)
    }
  ];

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <BreadcrumbServer items={breadcrumbItems} homeLabel={tdk.nav.home} />
      <div className="px-5 sm:px-10 md:px-10 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl capitalize">#{getCategoryLabel(categorySlug)}</h1>
        <span className="mt-10 inline-block">
          {tdk.blog.categorySubtitle}
        </span>
      </div>
      <Categories categories={allCategories} currentSlug={categorySlug} lang={lang} getCategoryLabel={getCategoryLabel} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 mb-10">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 relative">
            <BlogLayoutThree blog={blog} lang={lang} />
          </article>
        ))}
      </div>
      
      <ExploreButton href={generateMultilingualPath("/", language)}>
        {tdk.blog.exploreMore}
      </ExploreButton>
    </article>
  );
}
