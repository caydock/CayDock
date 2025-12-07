"use client";
import { memo, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from './ProductCard';

const ProductsPageContent = memo(function ProductsPageContent({ locale: propLocale }) {
  const t = useTranslations('ui');
  const hookLocale = useLocale();
  const locale = propLocale || hookLocale;
  
  const products = useMemo(() => [
    {
      name: t('products.musicCover.name'),
      description: t('products.musicCover.description'),
      category: t('products.musicCover.category'),
      link: t('products.musicCover.link'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
    {
      name: t('products.w3cay.name'),
      description: t('products.w3cay.description'),
      category: t('products.w3cay.category'),
      link: t('products.w3cay.link'),
      icon: t('products.w3cay.icon'),
    },
    {
      name: t('products.qrcay.name'),
      description: t('products.qrcay.description'),
      category: t('products.qrcay.category'),
      link: t('products.qrcay.link'),
      icon: t('products.qrcay.icon'),
    },
    {
      name: t('products.timecay.name'),
      description: t('products.timecay.description'),
      category: t('products.timecay.category'),
      link: t('products.timecay.link'),
      icon: t('products.timecay.icon'),
    },
  ], [t]);

  return (
    <>
      {/* 固定全局背景图片 */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Image
          src="/images/about-bg.jpg"
          alt="Products background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* 渐变遮罩 */}
        <div 
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 5%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.03) 48%, transparent 5%)'
          }}
        />
      </div>
      
      {/* 渐变背景遮罩 - 覆盖整个页面 */}
      <div className="dark:hidden fixed top-0 left-0 right-0 bottom-0 z-[1]" style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 2%, rgba(255, 255, 255, 0.7) 5%,  rgba(255, 255, 255, 0.9) 10%,  rgba(255, 255, 255, 0.98) 100%)',
        minHeight: '100vh'
      }} />
      <div className="hidden dark:block fixed top-0 left-0 right-0 bottom-0 z-[1]" style={{
        background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.2) 0%, rgba(26, 26, 26, 0.4) 5%, rgba(26, 26, 26, 0.7) 10%, rgba(26, 26, 26, 0.9) 100%)',
        minHeight: '100vh'
      }} />
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 md:pt-24 py-12">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-dark dark:text-light">
            {t('products.title')}
          </h1>
          <p className="text-xl text-dark/70 dark:text-light/70 mb-2">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <ProductCard
              key={`${product.link}-${index}`}
              name={product.name}
              description={product.description}
              category={product.category}
              link={product.link}
              icon={product.icon}
            />
          ))}
        </div>

        {/* Empty State (if no products) */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark/5 dark:bg-light/5 mb-6">
              <svg className="w-10 h-10 text-dark/40 dark:text-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-lg text-dark/60 dark:text-light/60 font-medium">{t('products.empty')}</p>
          </div>
        )}
      </div>
      </main>
    </>
  );
});

export default ProductsPageContent;

