"use client";
import Image from 'next/image';
import { memo } from 'react';
import SmartLink from '../Elements/SmartLink';

const ProductCard = memo(function ProductCard({ 
  name, 
  description, 
  category, 
  link,
  icon,
}) {
  const isExternal = link.startsWith('http') || link.startsWith('//');
  const displayLink = isExternal ? link.replace(/^https?:\/\//, '') : link;
  
  const cardContent = (
    <div className="flex flex-col h-full">
      {/* 图标和产品名称 */}
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <div className="flex-shrink-0">
            {typeof icon === 'string' ? (
              icon.startsWith('http') || icon.startsWith('//') ? (
                <img 
                  src={icon} 
                  alt={name}
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Image
                  src={icon}
                  alt={name}
                  width={16}
                  height={16}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )
            ) : (
              <div className="w-4 h-4 text-dark dark:text-light flex items-center justify-center">
                {icon}
              </div>
            )}
          </div>
        )}
        
        {/* 产品名称 */}
        <h3 className="text-lg font-bold text-dark dark:text-light">
          {name}
        </h3>
      </div>
      
      {/* 分类标签 */}
      {category && (
        <span className="text-xs text-dark/60 dark:text-light/60 mb-2">
          {category}
        </span>
      )}
      
      {/* 产品描述 */}
      <p className="text-sm text-dark/70 dark:text-light/70 mb-4 flex-1 leading-relaxed">
        {description}
      </p>
      
      {/* 链接 */}
      <div className="mt-auto">
        <span className="text-base text-accent dark:text-accentDark hover:underline">
          {displayLink}
        </span>
      </div>
    </div>
  );
  
  const cardClassName = "group relative bg-light dark:bg-dark border border-dark/10 dark:border-light/10 rounded-lg p-5 hover:shadow-lg transition-all duration-200 cursor-pointer block h-full";
  
  return isExternal ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
    >
      {cardContent}
    </a>
  ) : (
    <SmartLink
      href={link}
      locale={locale}
      className={cardClassName}
    >
      {cardContent}
    </SmartLink>
  );
});

export default ProductCard;

