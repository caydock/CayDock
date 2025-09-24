"use client";
import { useTranslations } from 'next-intl';

export default function RecentPosts() {
  const t = useTranslations('ui');

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{t('blog.recentPosts')}</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Recent posts will be displayed here.
      </p>
    </div>
  );
}
