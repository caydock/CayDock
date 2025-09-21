import { blogs } from '@/.velite/generated'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import BreadcrumbServer from "@/src/components/Blog/BreadcrumbServer";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { slug } from "github-slugger";
import { getServerTranslation } from "@/src/i18n";
import { detectLanguageFromPath, generateMultilingualPath } from "@/src/utils/languageUtils";
import { headers } from "next/headers";

export async function generateStaticParams() {
  const allCategories = ["all"];
  
  // 生成所有语言的分类参数
  blogs.forEach((blog) => {
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

  // 为每个分类生成英文和中文两种参数
  const categories = [];
  allCategories.forEach((category) => {
    // 英文版本（无语言前缀）
    categories.push({ slug: category });
    // 中文版本（有语言前缀）
    categories.push({ slug: category, lang: 'zh-cn' });
  });

  return categories;
}

export async function generateMetadata({ params, searchParams }) {
  const { slug: categorySlug } = await params;
  const { lang } = await searchParams;
  
  // 从URL路径中检测语言
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const { language } = detectLanguageFromPath(pathname);
  const tdk = getServerTranslation(language, "meta");
  
  if (categorySlug === "all") {
    return {
      title: tdk.categories.all,
      description: tdk.categories.allDescription,
    };
  } else {
    // 获取当前分类的中文标签名称
    const getCategoryLabel = (categorySlug) => {
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
    
    const categoryTitle = getCategoryLabel(categorySlug);
    return {
      title: `${categoryTitle} ${tdk.categories.posts}`,
      description: `${tdk.categories.learnAbout} ${categoryTitle} ${tdk.categories.throughCollection}`,
    };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug: categorySlug } = await params;
  const { lang } = await searchParams;
  
  // 从URL路径中检测语言
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const { language } = detectLanguageFromPath(pathname);
  
  // 获取对应语言的翻译
  const tdk = getServerTranslation(language, "ui");
  
  // Separating logic to create list of categories from current language blog posts using tagKeys
  const allCategories = ["all"]; // Initialize with 'all' category
  blogs.filter(blog => blog.language === language).forEach(blog => {
    if (blog.tagKeys && blog.tagKeys.length > 0) {
      blog.tagKeys.forEach(tagKey => {
        if (!allCategories.includes(tagKey)) {
          allCategories.push(tagKey);
        }
      });
    } else {
      // Fallback to original tags if tagKeys not available
      blog.tags.forEach(tag => {
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
    if (categorySlug === "all") {
      return blog.isPublished && blog.language === language; // Include all published blog posts if 'all' category is selected
    }
    
    // Use tagKeys for filtering if available, otherwise fallback to tags
    if (blog.tagKeys && blog.tagKeys.length > 0) {
      return blog.isPublished && blog.language === language && blog.tagKeys.includes(categorySlug);
    } else {
      return blog.isPublished && blog.language === language && blog.tags.some(tag => slug(tag) === categorySlug);
    }
  });

  // 获取当前分类的原始标签名称（只查找当前语言的博客）
  const getCategoryLabel = (categorySlug) => {
    if (categorySlug === "all") {
      return tdk.breadcrumb.allCategories;
    }
    
    // 只查找当前语言的博客文章来获取原始标签名称
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
      <Categories categories={allCategories} currentSlug={categorySlug} lang={language === 'zh' ? 'zh-cn' : undefined} getCategoryLabel={getCategoryLabel} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 mb-10">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 relative">
            <BlogLayoutThree blog={blog} lang={language === 'zh' ? 'zh-cn' : undefined} />
          </article>
        ))}
      </div>
      
      <ExploreButton href={generateMultilingualPath("/", language)}>
        {tdk.blog.exploreMore}
      </ExploreButton>
    </article>
  );
}