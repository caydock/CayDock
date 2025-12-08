"use client";
import Image from 'next/image';
import { usePathname } from 'next/navigation';

/**
 * 全局背景组件
 * 应用于所有页面，包括文章页（如果文章页没有配置背景封面）
 */
const GlobalBackground = () => {
  return (
    <>
      {/* 固定全局背景图片 */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Image
          src="/images/about-bg.jpg"
          alt="Background"
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
      
      {/* 高斯模糊背景遮罩 */}
      <div className="dark:hidden fixed inset-0 z-[1]" style={{
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.5) 2%, rgba(255, 255, 255, 0.7) 5%,  rgba(255, 255, 255, 0.85) 10%,  rgba(255, 255, 255, 0.95) 100%)'
      }} />
      <div className="hidden dark:block fixed inset-0 z-[1]" style={{
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.3) 0%, rgba(26, 26, 26, 0.5) 5%, rgba(26, 26, 26, 0.7) 10%, rgba(26, 26, 26, 0.85) 100%)'
      }} />
    </>
  );
};

export default GlobalBackground;

