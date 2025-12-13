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
      </div>
      
      {/* 高斯模糊背景遮罩 - 覆盖整个页面，footer 沿用内容区域背景 */}
      <div className="dark:hidden fixed inset-0 z-[1]" style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.35) 10%, rgba(255, 255, 255, 0.55) 25%, rgba(255, 255, 255, 0.75) 45%, rgba(255, 255, 255, 0.85) 80%, rgba(255, 255, 255, 0.9) 100%)'
      }} />
      <div className="hidden dark:block fixed inset-0 z-[1]" style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(26, 26, 26, 0.2) 20%, rgba(26, 26, 26, 0.4) 30%, rgba(26, 26, 26, 0.6) 50%, rgba(26, 26, 26, 0.75) 80%, rgba(26, 26, 26, 0.8) 100%)'
      }} />
    </>
  );
};

export default GlobalBackground;

