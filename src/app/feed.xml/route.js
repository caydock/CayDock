import { blogs } from '@/.velite/generated';
import siteMetadata from '@/src/utils/siteMetaData';

export const runtime = 'edge';

export async function GET() {
  const base = siteMetadata.siteUrl?.replace(/\/$/, '') || 'https://w3cay.com';
  
  // 获取所有已发布的博客文章，按发布日期排序
  const publishedBlogs = blogs
    .filter(blog => blog.isPublished)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 20); // 只返回最新的 20 篇文章

  const rssItems = publishedBlogs.map(blog => {
    const url = blog.language === 'zh-cn' 
      ? `${base}/zh-cn${blog.url}` 
      : `${base}${blog.url}`;
    
    const pubDate = new Date(blog.publishedAt).toUTCString();
    const description = blog.description || '';
    
    // 清理描述中的 HTML 标签和特殊字符
    const cleanDescription = description
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
      .substring(0, 500); // 限制长度

    return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${cleanDescription}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${blog.author}</author>
      ${blog.image?.src ? `<enclosure url="${blog.image.src.startsWith('http') ? blog.image.src : base + blog.image.src}" type="image/jpeg" />` : ''}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteMetadata.title}]]></title>
    <link>${base}</link>
    <description><![CDATA[${siteMetadata.description}]]></description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>Next.js</generator>
    <webMaster>${siteMetadata.email || 'cay.dev@hotmail.com'}</webMaster>
    <managingEditor>${siteMetadata.email || 'cay.dev@hotmail.com'}</managingEditor>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

