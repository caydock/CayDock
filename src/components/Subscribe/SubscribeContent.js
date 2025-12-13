"use client";
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import PageTemplate from '../PageTemplate/PageTemplate';
import BreadcrumbClient from '../Blog/BreadcrumbClient';

export default function SubscribeContent() {
  const t = useTranslations('ui');
  const locale = useLocale();

  const breadcrumbItems = [
    {
      label: t('subscribe.title'),
      href: "/subscribe"
    }
  ];

  return (
    <PageTemplate
      title={t('subscribe.title')}
      subtitle={t('subscribe.subtitle')}
      breadcrumb={<BreadcrumbClient items={breadcrumbItems} homeLabel={locale === 'zh-cn' ? '首页' : 'Home'} locale={locale} />}
      locale={locale}
    >
      <section className="text-dark dark:text-light leading-relaxed">
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

