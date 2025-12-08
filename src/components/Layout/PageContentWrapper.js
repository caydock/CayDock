/**
 * 页面内容包装器组件
 * 统一处理所有页面内容的 z-index，确保内容显示在背景之上
 * 使用此组件包装页面内容，避免每个页面都要单独设置 z-index
 */
export default function PageContentWrapper({ children, className = '' }) {
  return (
    <div className={`relative z-10 ${className}`}>
      {children}
    </div>
  );
}

