"use client";
import { useTranslations } from 'next-intl';
import RecentPosts from './RecentPosts';

export default function BlogHome() {
  const t = useTranslations('ui');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('blog.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('blog.description')}</p>
        </div>
        
        <RecentPosts />
      </div>
    </div>
  );
}
