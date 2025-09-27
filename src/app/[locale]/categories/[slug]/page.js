import { blogs } from '@/.velite/generated'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import BreadcrumbServer from "@/src/components/Blog/BreadcrumbServer";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import { slug } from "github-slugger";
import { getServerTranslation } from "@/src/i18n";
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateStaticParams() {
  const allCategories = ["all"];
  
  // 为每种语言生成参数
  ['en', 'zh-cn'].forEach(locale => {
    const language = locale === 'zh-cn' ? 'zh' : 'en';
    const languageBlogs = blogs.filter(blog => blog.language === language);
    
    languageBlogs.forEach((blog) => {
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
  });
  
  const params = [];
  ['en', 'zh-cn'].forEach(locale => {
    allCategories.forEach((category) => {
      params.push({
        locale,
        slug: category
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }) {
  const { locale, slug: categorySlug } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  
  if (categorySlug === "all") {
    const tdk = getServerTranslation(language, "meta");
    return {
      title: tdk.categories.all,
      description: tdk.categories.allDescription,
      alternates: {
        canonical: `${siteMetadata.siteUrl}/${locale}/categories/all`,
        languages: {
          'en': `${siteMetadata.siteUrl}/en/categories/all`,
          'zh-cn': `${siteMetadata.siteUrl}/zh-cn/categories/all`,
          'x-default': `${siteMetadata.siteUrl}/en/categories/all`,
        },
      },
    };
  } else {
    // 获取当前分类的标签名称
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
    const tdk = getServerTranslation(language, "meta");
    return {
      title: `${categoryTitle} ${tdk.categories.posts}`,
      description: `${tdk.categories.learnAbout} ${categoryTitle} ${tdk.categories.throughCollection}`,
      alternates: {
        canonical: `${siteMetadata.siteUrl}/${locale}/categories/${categorySlug}`,
        languages: {
          'en': `${siteMetadata.siteUrl}/en/categories/${categorySlug}`,
          'zh-cn': `${siteMetadata.siteUrl}/zh-cn/categories/${categorySlug}`,
          'x-default': `${siteMetadata.siteUrl}/en/categories/${categorySlug}`,
        },
      },
    };
  }
}

export default async function LangCategoryPage({ params }) {
  const { locale, slug: categorySlug } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  
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

  // 获取翻译
  const tdk = getServerTranslation(language, "ui");

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
      <BreadcrumbServer items={breadcrumbItems} homeLabel={tdk.nav.home} />
      <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl capitalize">#{getCategoryLabel(categorySlug)}</h1>
        <span className="mt-10 inline-block">
          {tdk.blog.categorySubtitle}
        </span>
      </div>
      <Categories 
        categories={allCategories} 
        currentSlug={categorySlug} 
        lang={locale} 
        getCategoryLabel={getCategoryLabel}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 mb-10">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 relative">
            <BlogLayoutThree blog={blog} lang={locale} />
          </article>
        ))}
      </div>
      
      <ExploreButton href="/">
        {tdk.blog.exploreMore}
      </ExploreButton>
    </article>
  );
}
