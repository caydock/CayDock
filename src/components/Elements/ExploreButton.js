import { Link } from '@/src/i18n/routing';
import React from "react";

const ExploreButton = ({ href = "/", children, className = "", locale }) => {
  return (
    <div className={`w-full flex justify-center mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 mb-10 ${className}`}>
      <Link
        href={href}
        locale={locale}
        className="group relative inline-flex items-center gap-3 py-4 px-10 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      >
        {/* 背景动画效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* 图标 */}
        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        
        {/* 文字 */}
        <span className="relative z-10">{children}</span>
        
        {/* 脉冲效果 */}
        <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
    </div>
  );
};

export default ExploreButton;
