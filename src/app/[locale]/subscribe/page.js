import { getTranslations } from 'next-intl/server';
import { createLocalePageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/subscribe', 'subscribe');

export default async function SubscribePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ui' });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-16">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dark dark:text-light">
          {locale === 'zh-cn' ? '订阅' : 'Subscribe'}
        </h1>
        <p className="text-lg mb-8 text-dark/80 dark:text-light/80">
          {locale === 'zh-cn' ? '获取最新内容更新' : 'Get the latest content updates'}
        </p>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">
            {locale === 'zh-cn' ? '微信公众号' : 'WeChat Official Account'}
          </h2>
          <p className="mb-6">
            {locale === 'zh-cn' 
              ? '欢迎关注我的微信公众号，获取更多技术分享和独立开发经验：'
              : 'Follow my WeChat Official Account for more technical sharing and independent development experience:'
            }
          </p>
          <div className="mb-8">
            <img 
              src="/images/wechat_banner.jpg" 
              alt={locale === 'zh-cn' ? '微信公众号' : 'WeChat Official Account'}
              className="w-full max-w-md mx-auto rounded-lg"
            />
          </div>

          <h2 className="text-2xl font-bold mb-4">
            {locale === 'zh-cn' ? 'RSS 订阅' : 'RSS Feed'}
          </h2>
          <p className="mb-4">
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
            {locale === 'zh-cn' ? 'RSS Feed' : 'RSS Feed'}
          </a>
        </div>
      </div>
    </main>
  );
}

