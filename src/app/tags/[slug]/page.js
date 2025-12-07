import { blogs } from '@/.velite/generated'
import CategoryPageContent from "@/src/components/Category/CategoryPageContent";
import { slug } from "github-slugger";
import { getServerTranslation } from "@/src/i18n";
import { generateLanguageLinks } from '@/src/utils/pageUtils';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateStaticParams() {
  // 只为英文博客文章生成分类参数（不再包含 "all"，因为 /tags 就是列表页）
  const categories = [];
  const allCategories = [];
  const enBlogs = blogs.filter(blog => blog.language === 'en');
  enBlogs.forEach((blog) => {
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
  
  allCategories.forEach((category) => {
    categories.push({ slug: category });
  });
  return categories;
}

export async function generateMetadata({ params }) {
  const { slug: categorySlug } = await params;
  const locale = 'en'; // 根目录默认为英文
  const language = 'en';
  
  // 不再处理 "all" 情况，因为 /tags 就是列表页
  // 获取当前分类的标签名称
  const getCategoryLabel = (categorySlug) => {
    // 解码 URL 编码的 slug
    let decodedSlug = categorySlug;
    try {
      const decoded = decodeURIComponent(categorySlug);
      if (decoded !== categorySlug) {
        decodedSlug = decoded;
      }
    } catch (e) {
      // 如果解码失败，使用原始值
    }
    
    const currentLanguageBlogs = blogs.filter(blog => blog.language === language && blog.isPublished);
    
    // 检测中文字符
    const chineseCharRegex = /[\u4e00-\u9fa5]/;
    
    // 尝试多种匹配方式
    for (const blog of currentLanguageBlogs) {
      for (const tag of blog.tags) {
        const tagSlug = slug(tag);
        // 匹配多种可能的情况
        if (tagSlug === categorySlug || 
            tagSlug === decodedSlug || 
            tag === decodedSlug ||
            tag === categorySlug ||
            (decodedSlug !== categorySlug && tagSlug === slug(decodedSlug))) {
          return tag; // 返回原始标签名称
        }
      }
    }
    
    // 如果解码后的值包含中文字符，直接返回
    if (decodedSlug !== categorySlug && chineseCharRegex.test(decodedSlug)) {
      return decodedSlug;
    }
    
    // 如果没有找到匹配的标签，使用 slug 生成
    let label = decodedSlug.replaceAll("-", " ");
    
    // 确保首字母大写（仅对英文）
    if (!chineseCharRegex.test(label)) {
      label = label.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return label;
  };
  
  const categoryTitle = getCategoryLabel(categorySlug);
  const tdk = getServerTranslation(language, "meta");
  return {
    title: `${categoryTitle} ${tdk.categories.posts}`,
    description: `${tdk.categories.learnAbout} ${categoryTitle} ${tdk.categories.throughCollection}`,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/tags/${categorySlug}`,
      languages: generateLanguageLinks(`/tags/${categorySlug}`),
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug: categorySlug } = await params;
  const locale = 'en';
  const language = 'en';
  
  return <CategoryPageContent categorySlug={categorySlug} locale={locale} language={language} />;
}
