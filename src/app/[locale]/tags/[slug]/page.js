import { blogs } from '@/.velite/generated'
import CategoryPageContent from "@/src/components/Category/CategoryPageContent";
import { slug } from "github-slugger";
import { getServerTranslation } from "@/src/i18n";
import { generateLanguageLinks } from '@/src/utils/pageUtils';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateStaticParams() {
  const allCategories = [];
  
  // 为每种语言生成参数（不再包含 "all"，因为 /tags 就是列表页）
  ['en', 'zh-cn'].forEach(locale => {
    const language = locale === 'zh-cn' ? 'zh-cn' : 'en';
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
  const blogLanguage = locale === 'zh-cn' ? 'zh-cn' : 'en';
  
  // 不再处理 "all" 情况，因为 /tags 就是列表页
  // 获取当前分类的标签名称
  const getCategoryLabel = (categorySlug) => {
    const currentLanguageBlogs = blogs.filter(blog => blog.language === blogLanguage);
    
    const matchingBlog = currentLanguageBlogs.find(blog => {
      if (blog.tagKeys && blog.tagKeys.length > 0) {
        return blog.tagKeys.includes(categorySlug);
      } else {
        return blog.tags.some(tag => slug(tag) === categorySlug);
      }
    });
    
    let label = '';
    if (matchingBlog) {
      if (matchingBlog.tagKeys && matchingBlog.tagKeys.includes(categorySlug)) {
        const tagKeyIndex = matchingBlog.tagKeys.indexOf(categorySlug);
        if (tagKeyIndex >= 0 && matchingBlog.tags[tagKeyIndex]) {
          label = matchingBlog.tags[tagKeyIndex];
        }
      } else {
        const originalTag = matchingBlog.tags.find(tag => slug(tag) === categorySlug);
        if (originalTag) {
          label = originalTag;
        }
      }
    }
    
    // 如果没有找到匹配的标签，使用 slug 生成
    if (!label) {
      label = categorySlug.replaceAll("-", " ");
    }
    
    // 确保首字母大写
    return label.replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const categoryTitle = getCategoryLabel(categorySlug);
  const tdk = getServerTranslation(language, "meta");
  return {
    title: `${categoryTitle} ${tdk.categories.posts}`,
    description: `${tdk.categories.learnAbout} ${categoryTitle} ${tdk.categories.throughCollection}`,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/tags/${categorySlug}`,
      languages: generateLanguageLinks(`/tags/${categorySlug}`),
    },
  };
}

export default async function LangCategoryPage({ params }) {
  const { locale, slug: categorySlug } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  
  return <CategoryPageContent categorySlug={categorySlug} locale={locale} language={language} />;
}

