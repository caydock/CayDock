"use client";
import { useTranslations } from 'next-intl';

export default function BlogDetails({ slug, locale }) {
  const t = useTranslations('ui');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog Post: {slug}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This is a placeholder for the blog post content.
        </p>
      </div>
    </div>
  );
}
