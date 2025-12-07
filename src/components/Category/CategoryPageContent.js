import { blogs } from '@/.velite/generated'
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import { slug } from "github-slugger";
import { getServerTranslation } from "@/src/i18n";

export default function CategoryPageContent({ categorySlug, locale, language }) {
  // 获取翻译
  const tdk = getServerTranslation(language, "ui");
  
  // language 可能是 'zh'，但博客文章的 language 是 'zh-cn'，需要转换
  const blogLanguage = language === 'zh' ? 'zh-cn' : language;
  
  // 解码 URL 编码的 categorySlug（如果存在）
  let decodedCategorySlug = categorySlug;
  try {
    const decoded = decodeURIComponent(categorySlug);
    if (decoded !== categorySlug) {
      decodedCategorySlug = decoded;
    }
  } catch (e) {
    // 如果解码失败，使用原始值
    decodedCategorySlug = categorySlug;
  }
  
  // 创建分类列表
  // 只使用当前语言的博客，确保标签名称也是当前语言的
  const allCategories = ["all"];
  // 检测中文字符的正则表达式（用于过滤中文标签）
  const chineseCharRegex = /[\u4e00-\u9fa5]/;
  
  blogs.filter(blog => blog.language === blogLanguage && blog.isPublished).forEach(blog => {
    // 始终从 tags 生成 slug，确保只使用当前语言的标签
    blog.tags.forEach((tag) => {
      // 如果是英文站，跳过包含中文字符的标签
      if (blogLanguage === 'en' && chineseCharRegex.test(tag)) {
        return;
      }
      // 如果是中文站，跳过包含非中文字符的标签（可选，根据需求）
      // if (blogLanguage === 'zh-cn' && !chineseCharRegex.test(tag)) {
      //   return;
      // }
      
      const slugified = slug(tag);
      if (!allCategories.includes(slugified)) {
        allCategories.push(slugified);
      }
    });
  });

  // 排序分类，确保 "all" 始终排在第一位
  allCategories.sort((a, b) => {
    if (a === "all") return -1;
    if (b === "all") return 1;
    return a.localeCompare(b);
  });

  // 过滤博客文章
  const filteredBlogs = blogs.filter(blog => {
    if (categorySlug === "all") {
      return blog.isPublished && blog.language === blogLanguage;
    }

    // 始终使用 tags 进行匹配，确保只匹配当前语言的标签
    // 同时匹配原始 slug 和解码后的 slug
    return blog.isPublished && blog.language === blogLanguage && blog.tags.some(tag => {
      const tagSlug = slug(tag);
      return tagSlug === categorySlug || tagSlug === decodedCategorySlug || tag === decodedCategorySlug;
    });
  });

  // 获取当前分类的原始标签名称
  // 创建一个映射表，将 slug 映射到当前语言的标签名称
  // 只使用当前语言的博客，确保标签名称也是当前语言的
  const slugToTagMap = new Map();
  const currentLanguageBlogs = blogs.filter(blog => {
    // 严格过滤：只使用当前语言且已发布的博客
    return blog.language === blogLanguage && blog.isPublished;
  });
  
  currentLanguageBlogs.forEach(blog => {
    // 确保 blog.tags 存在且是数组
    if (blog.tags && Array.isArray(blog.tags)) {
      blog.tags.forEach(tag => {
        // 确保 tag 是字符串
        if (typeof tag === 'string' && tag.trim()) {
          // 如果是英文站，跳过包含中文字符的标签
          if (blogLanguage === 'en' && chineseCharRegex.test(tag)) {
            return;
          }
          
          const tagSlug = slug(tag);
          // 如果这个 slug 还没有映射，设置映射
          if (!slugToTagMap.has(tagSlug)) {
            slugToTagMap.set(tagSlug, tag);
          }
        }
      });
    }
  });

  const getCategoryLabel = (categorySlug) => {
    if (categorySlug === "all") {
      return tdk.breadcrumb.allCategories;
    }
    
    // 尝试解码 URL 编码的 slug
    let decodedSlug = categorySlug;
    try {
      const decoded = decodeURIComponent(categorySlug);
      if (decoded !== categorySlug) {
        decodedSlug = decoded;
      }
    } catch (e) {
      // 如果解码失败，使用原始值
    }
    
    // 检测中文字符
    const chineseCharRegex = /[\u4e00-\u9fa5]/;
    
    // 如果解码后的值包含中文字符，可能是原始标签名称
    // 先尝试在映射表中查找（使用 slug 后的值）
    if (decodedSlug !== categorySlug && chineseCharRegex.test(decodedSlug)) {
      // 对解码后的值进行 slug 处理，然后查找
      const decodedSlugProcessed = slug(decodedSlug);
      if (slugToTagMap.has(decodedSlugProcessed)) {
        return slugToTagMap.get(decodedSlugProcessed);
      }
      // 如果解码后的值本身就是标签名称，直接返回
      if (slugToTagMap.has(decodedSlug)) {
        return slugToTagMap.get(decodedSlug);
      }
    }
    
    // 先从映射表中查找（使用原始 slug）
    if (slugToTagMap.has(categorySlug)) {
      return slugToTagMap.get(categorySlug);
    }
    
    // 如果没找到，尝试使用解码后的 slug
    if (decodedSlug !== categorySlug && slugToTagMap.has(decodedSlug)) {
      return slugToTagMap.get(decodedSlug);
    }
    
    // 尝试在博客中查找匹配的标签（遍历所有可能的匹配方式）
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
    
    // 如果解码后的值看起来像原始标签名称（包含中文字符），直接返回
    if (decodedSlug !== categorySlug && chineseCharRegex.test(decodedSlug)) {
      return decodedSlug;
    }
    
    // 使用默认的格式化方法
    return decodedSlug.replaceAll("-", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <article className="mt-12 pt-24 flex flex-col text-dark dark:text-light max-w-7xl mx-auto">
      <div className="px-5 sm:px-10 md:px-10 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl capitalize">#{getCategoryLabel(decodedCategorySlug)}</h1>
        <span className="mt-10 inline-block">
          {tdk.blog.categorySubtitle}
        </span>
      </div>
      <div className="px-5 sm:px-10 md:px-10">
        <Categories categories={allCategories} currentSlug={categorySlug} lang={locale} getCategoryLabel={getCategoryLabel} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-10 mb-10">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 relative">
            <BlogLayoutThree blog={blog} lang={locale} />
          </article>
        ))}
      </div>
    </article>
  );
}
