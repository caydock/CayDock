"use client";
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import PageTemplate from '../PageTemplate/PageTemplate';
import { useMemo } from 'react';

export default function SubscribeContent() {
  const t = useTranslations('ui');
  const locale = useLocale();
  
  // 计算字数
  const wordCount = useMemo(() => {
    const content = locale === 'zh-cn' 
      ? '获取最新内容更新欢迎关注我的微信公众号，获取更多技术分享和独立开发经验您可以使用 RSS 阅读器订阅我的博客'
      : 'Get the latest content updatesFollow my WeChat Official Account for more technical sharing and independent development experienceYou can subscribe to my blog using an RSS reader';
    return content.length;
  }, [locale]);

  return (
    <PageTemplate
      backgroundImage="/images/about-bg.jpg"
      title={locale === 'zh-cn' ? '订阅' : 'Subscribe'}
      breadcrumb="Pages /"
      metadata={{
        date: new Date().toLocaleDateString(locale === 'zh-cn' ? 'zh-CN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        wordCount,
        readingTime: locale === 'zh-cn' ? '1分钟' : '1 min'
      }}
      heroHeight="h-[30vh] sm:h-[35vh] md:h-[40vh]"
      locale={locale}
    >
      <section className="text-dark dark:text-light leading-relaxed">
        <p className="text-sm md:text-base mb-8 text-dark/80 dark:text-light/80">
          {locale === 'zh-cn' ? '获取最新内容更新' : 'Get the latest content updates'}
        </p>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            {locale === 'zh-cn' ? '微信公众号' : 'WeChat Official Account'}
          </h2>
          <p className="text-sm md:text-base mb-6">
            {locale === 'zh-cn' 
              ? '欢迎关注我的微信公众号，获取更多技术分享和独立开发经验：'
              : 'Follow my WeChat Official Account for more technical sharing and independent development experience:'
            }
          </p>
          <div className="mb-8 flex justify-start">
            <Image
              src="/images/wechat_banner.jpg"
              alt={locale === 'zh-cn' ? '微信公众号' : 'WeChat Official Account'}
              width={400}
              height={300}
              className="w-full max-w-md rounded-lg"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-bold mb-4">
            {locale === 'zh-cn' ? 'RSS 订阅' : 'RSS Feed'}
          </h2>
          <p className="text-sm md:text-base mb-4">
            {locale === 'zh-cn' 
              ? '您可以使用 RSS 阅读器订阅我的博客：'
              : 'You can subscribe to my blog using an RSS reader:'
            }
          </p>
          <a 
            href="/feed.xml" 
            className="text-accent dark:text-accentDark hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RSS Feed
          </a>
        </div>
      </section>
    </PageTemplate>
  );
}

