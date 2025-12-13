import { getTranslations } from 'next-intl/server';
import { blogs } from '@/.velite/generated';
import { notFound } from 'next/navigation';
import BlogDetails from '@/src/components/Blog/BlogDetails';
import { generateLanguageLinks } from '@/src/utils/pageUtils';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateStaticParams() {
  const params = [];

  // 只为英文生成参数
  const language = 'en';
  const languageBlogs = blogs.filter(blog => blog.language === language);

  languageBlogs.forEach(blog => {
    // 优先使用 key，如果没有 key 则使用 slug（保持与旧项目一致）
    const urlSlug = blog.key || blog.slug;
    params.push({
      slug: urlSlug,
    });
    // 同时为原始 slug 生成参数（如果与 key 不同），以兼容旧的链接
    if (blog.key && blog.slug && blog.key !== blog.slug) {
      params.push({
        slug: blog.slug,
      });
    }
  });

  return params;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = 'en'; // 根目录默认为英文
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  const language = 'en';

  // 查找对应的博客文章（优先通过 key 查找，如果没有 key 则通过 slug 查找）
  const blog = blogs.find(blog => {
    // 匹配 key 或 slug，两者中任意一个都能访问到文章
    return (blog.key === slug || blog.slug === slug) && blog.language === language;
  });

  if (!blog) {
    return {
      title: `${slug} - ${t('blog.title')}`,
      description: t('blog.description'),
    };
  }

  const publishedAt = new Date(blog.publishedAt).toISOString();
  const modifiedAt = new Date(blog.updatedAt || blog.publishedAt).toISOString();

  let imageList = [siteMetadata.socialBanner];
  if (blog.image) {
    imageList =
      typeof blog.image.src === "string"
        ? [siteMetadata.siteUrl + blog.image.src]
        : blog.image;
  }
  const ogImages = imageList.map((img) => {
    return { url: img.includes("http") ? img : siteMetadata.siteUrl + img };
  });

  const authors = blog?.author ? [blog.author] : siteMetadata.author;

  const currentUrl = `${siteMetadata.siteUrl}${blog.url}`;
  
  // 简化的 hreflang 配置，与其他页面保持一致
  const alternateLanguages = generateLanguageLinks(blog.url);

  return {
    title: blog.title,
    description: blog.description,
    alternates: {
      canonical: currentUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: currentUrl,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: ogImages,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const locale = 'en'; // 根目录默认为英文
  const language = 'en';

  // 查找对应的博客文章（支持通过 key 或 slug 查找，兼容历史链接）
  const blog = blogs.find(blog => {
    return (blog.key === slug || blog.slug === slug) && blog.language === language;
  });

  if (!blog) {
    notFound();
  }

  let imageList = [siteMetadata.socialBanner];
  if (blog.image) {
    imageList =
      typeof blog.image.src === "string"
        ? [siteMetadata.siteUrl + blog.image.src]
        : blog.image;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": blog.title,
    "description": blog.description,
    "image": imageList,
    "datePublished": new Date(blog.publishedAt).toISOString(),
    "dateModified": new Date(blog.updatedAt || blog.publishedAt).toISOString(),
    "author": [{
        "@type": "Person",
        "name": blog?.author ? [blog.author] : siteMetadata.author,
        "url": siteMetadata.twitter,
      }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetails slug={slug} locale={locale} />
    </>
  );
}
