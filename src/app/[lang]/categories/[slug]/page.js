import { blogs } from '@/.velite/generated'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import BreadcrumbServer from "@/src/components/Blog/BreadcrumbServer";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { slug } from "github-slugger";
import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";

export async function generateStaticParams() {
  const allCategories = ["all"];
  
  // 只为中文博客文章生成分类（英文使用无前缀URL）
  const zhBlogs = blogs.filter(blog => blog.language === 'zh');
  zhBlogs.forEach((blog) => {
    // 只使用tagKeys作为分类，移除中文标签分类
    if (blog.tagKeys && blog.tagKeys.length > 0) {
      blog.tagKeys.forEach(tagKey => {
        if (!allCategories.includes(tagKey)) {
          allCategories.push(tagKey);
        }
      });
    } else {
      // 如果没有tagKeys，使用slugified的英文标签作为fallback
      blog.tags.forEach((tag) => {
        const slugified = slug(tag);
        if (!allCategories.includes(slugified)) {
          allCategories.push(slugified);
        }
      });
    }
  });
  
  // 只为中文生成参数
  const langCategories = [];
  allCategories.forEach((category) => {
    if (category === "all") {
      langCategories.push({ lang: 'zh-cn', slug: "all" });
    } else {
      langCategories.push({ lang: 'zh-cn', slug: category });
    }
  });
  
  return langCategories;
}

export async function generateMetadata({ params }) {
  const { lang, slug: categorySlug } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  // Decode URL-encoded category slug
  const decodedCategorySlug = decodeURIComponent(categorySlug);
  
  if (decodedCategorySlug === "all") {
    const tdk = getServerTranslation(language, "meta");
    return {
      title: tdk.categories.all,
      description: tdk.categories.allDescription,
    };
  } else {
    // 获取当前分类的中文标签名称
    const getCategoryLabel = (categorySlug) => {
      // 只查找当前语言的博客文章来获取原始标签名称
      const currentLanguageBlogs = blogs.filter(blog => blog.language === language);
      
      // 查找tagKeys匹配的博客，获取对应的中文标签
      const matchingBlog = currentLanguageBlogs.find(blog => {
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
      
      // 如果没有找到匹配的博客，使用默认的格式化方法
      return categorySlug.replaceAll("-", " ").replace(/\b\w/g, l => l.toUpperCase());
    };
    
    const categoryTitle = getCategoryLabel(decodedCategorySlug);
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
  
  // Decode URL-encoded category slug
  const decodedCategorySlug = decodeURIComponent(categorySlug);
  
  // Separating logic to create list of categories from blog posts of current language using tagKeys
  const allCategories = ["all"]; // Initialize with 'all' category
  blogs.filter(blog => blog.language === language).forEach(blog => {
    // 只使用tagKeys作为分类，移除中文标签分类
    if (blog.tagKeys && blog.tagKeys.length > 0) {
      blog.tagKeys.forEach(tagKey => {
        if (!allCategories.includes(tagKey)) {
          allCategories.push(tagKey);
        }
      });
    } else {
      // 如果没有tagKeys，使用slugified的英文标签作为fallback
      blog.tags.forEach((tag) => {
        const slugified = slug(tag);
        if (!allCategories.includes(slugified)) {
          allCategories.push(slugified);
        }
      });
    }
  });

  // Sort allCategories to ensure they are in alphabetical order
  allCategories.sort();

  // Step 2: Filter blog posts based on the current category (params.slug) and language using tagKeys
  const filteredBlogs = blogs.filter(blog => {
    if (decodedCategorySlug === "all") {
      return blog.isPublished && blog.language === language; // Include all published blog posts if 'all' category is selected
    }
    
    // Use tagKeys for filtering if available, otherwise fallback to tags
    if (blog.tagKeys && blog.tagKeys.length > 0) {
      return blog.isPublished && blog.language === language && blog.tagKeys.includes(decodedCategorySlug);
    } else {
      return blog.isPublished && blog.language === language && blog.tags.some(tag => slug(tag) === decodedCategorySlug);
    }
  });

  // 获取翻译
  const tdk = getServerTranslation(language, "ui");

  // 获取当前分类的原始标签名称（只查找当前语言的博客）
  const getCategoryLabel = (categorySlug) => {
    if (categorySlug === "all") {
      return tdk.breadcrumb.allCategories;
    }
    
    // 只查找当前语言的博客文章来获取原始标签名称
    const currentLanguageBlogs = blogs.filter(blog => blog.language === language);
    
    // 查找tagKeys匹配的博客，获取对应的中文标签
    const matchingBlog = currentLanguageBlogs.find(blog => {
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
      href: `/${lang}/blog`
    },
    {
      label: tdk.breadcrumb.categories,
      href: `/${lang}/categories/all`
    },
    {
      label: getCategoryLabel(categorySlug),
      href: `/${lang}/categories/${categorySlug}`
    }
  ];

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <BreadcrumbServer items={breadcrumbItems} homeLabel={tdk.nav.home} />
      <div className="px-5 sm:px-10 md:px-10 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl capitalize">#{getCategoryLabel(decodedCategorySlug)}</h1>
        <span className="mt-10 inline-block">
          {tdk.blog.categorySubtitle}
        </span>
      </div>
      <Categories 
        categories={allCategories} 
        currentSlug={decodedCategorySlug} 
        lang={lang} 
        getCategoryLabel={getCategoryLabel}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 px-5 sm:px-10 md:px-10">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 row-span-1 relative">
            <BlogLayoutThree blog={blog} lang={lang} />
          </article>
        ))}
      </div>
      <ExploreButton href={`/${lang}`}>
        {tdk.blog.exploreMore}
      </ExploreButton>
    </article>
  );
}
