import RenderMdx from "@/src/components/Blog/RenderMdx";
import Tag from "@/src/components/Elements/Tag";
import BreadcrumbServer from "@/src/components/Blog/BreadcrumbServer";
import ExploreButton from "@/src/components/Elements/ExploreButton";
import ShareButtons from "@/src/components/Elements/ShareButtons";
import siteMetadata from "@/src/utils/siteMetaData";
import { blogs } from '@/.velite/generated'
import { slug as slugify } from "github-slugger";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";

export async function generateStaticParams() {
  // 只为英文博客文章生成静态参数
  return blogs.filter(blog => blog.language === 'en').map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const {slug} = await params
  const blog = blogs.find((blog) => blog.slug === slug && blog.language === 'en');
  if (!blog) {
    return;
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

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: siteMetadata.siteUrl + blog.url,
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

function TableOfContentsItem({ item, level = "two" }){
  return (
    <li className="py-1">
      <a
        href={item.url}
        data-level={level}
        className="data-[level=two]:pl-0 data-[level=two]:pt-2
                  data-[level=two]:border-t border-solid border-dark/40
                  data-[level=three]:pl-4
                  sm:data-[level=three]:pl-6
                  flex items-center justify-start"
      >
        {level === "three" && (
          <span className="flex w-1 h-1 rounded-full bg-dark mr-2">&nbsp;</span>
        )}
        <span className="hover:underline">{item.title}</span>
      </a>
      {item.items.length > 0 && (
        <ul className="mt-1">
          {item.items.map((subItem) => (
            <TableOfContentsItem 
              key={subItem.url} 
              item={subItem} 
              level="three"
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default async function BlogPage({ params }) {
  const {slug} = await params
  
  // 只查找英文博客文章（无语言前缀的URL默认是英文）
  const blog = blogs.find((blog) => {
    return blog.slug === slug && blog.language === 'en'
  });

  if(!blog){
    notFound()
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
  }

  // 获取英文翻译
  const tdk = getServerTranslation('en', "ui");

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
      label: blog.title,
      href: blog.url
    }
  ];

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
       <article>
      <div className="mb-8 text-center relative w-full h-[70vh] bg-dark">
        {/* 悬浮面包屑导航 */}
        <div className="absolute top-8 left-0 right-0 z-20">
          <nav className="flex items-center space-x-2 text-sm text-light mb-6 px-5 sm:px-10 md:px-10">
            <Link 
              href="/" 
              className="hover:text-accent transition-colors"
            >
              {tdk.nav.home}
            </Link>
            
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-light/60">/</span>
                {index === breadcrumbItems.length - 1 ? (
                  <span className="text-light font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href} 
                    className="hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Tag
            name={blog.tags[0]}
            link={`/categories/${slugify(blog.tags[0])}`}
            className="px-6 text-sm py-2"
          />
          <h1
            className="inline-block mt-6 font-semibold capitalize text-light text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6"
          >
            {blog.title}
          </h1>
          <div className="mt-4 text-light/80 text-sm md:text-base">
            {new Date(blog.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-dark/60 dark:bg-dark/40" />
        <Image
          src={blog.image.src}
          placeholder="blur"
          blurDataURL={blog.image.blurDataURL}
          alt={blog.title}
          width={blog.image.width}
          height={blog.image.height}
          className="aspect-square w-full h-full object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      <div className="mb-10 grid grid-cols-12 gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 sm:px-10 md:px-10">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3">
          <RenderMdx blog={blog} />
          
          {/* 分享按钮 */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <ShareButtons 
              url={`${siteMetadata.siteUrl}${blog.url}`}
              title={blog.title}
              description={blog.description}
              hashtags="weirdwebsites,webdiscovery,blog"
            />
          </div>
        </div>
      </div>
      
      <ExploreButton>
        {tdk.blog.exploreMore}
      </ExploreButton>
    </article>
    </>
  );
}