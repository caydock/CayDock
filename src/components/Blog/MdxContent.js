import { useMemo } from 'react'
import Image from 'next/image'

// 自定义 Image 组件，处理字符串类型的 width 和 height
const CustomImage = (props) => {
  const { width, height, ...rest } = props;
  return (
    <Image
      {...rest}
      alt={rest.alt || ''}
      width={typeof width === 'string' ? parseInt(width) : width}
      height={typeof height === 'string' ? parseInt(height) : height}
    />
  );
};

// 自定义 Link 组件，所有链接都在新标签页打开
const CustomLink = (props) => {
  const { href, children, ...rest } = props;
  
  // 检查是否为外部链接
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
  
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="text-accent dark:text-accentDark"
        style={{ textDecoration: 'underline' }}
        onMouseEnter={(e) => e.target.style.textDecoration = 'none'}
        onMouseLeave={(e) => e.target.style.textDecoration = 'underline'}
        {...rest}
      >
        {children}
      </a>
    );
  }
  
  // 内部链接也在新标签页打开
  return (
    <a 
      href={href} 
      target="_blank"
      className="text-accent dark:text-accentDark"
      style={{ textDecoration: 'underline' }}
      onMouseEnter={(e) => e.target.style.textDecoration = 'none'}
      onMouseLeave={(e) => e.target.style.textDecoration = 'underline'}
      {...rest}
    >
      {children}
    </a>
  );
};

const sharedComponents = {
  Image: CustomImage,
  a: CustomLink
}

const MDXContent = ({ code, components, ...props }) => {
  // 使用 useMemo 来缓存组件，避免重复创建
  const Component = useMemo(() => {
    // 如果 code 是一个函数，直接使用
    if (typeof code === 'function') {
      return code;
    }
    
    // 如果 code 是字符串，直接渲染为 HTML
    if (typeof code === 'string') {
      const HtmlRenderer = () => {
        // 改进的链接处理：支持单引号、双引号、各种属性顺序
        const processedHtml = code.replace(
          /<a\s+([^>]*?)href=["']([^"']*?)["']([^>]*?)>/gi,
          (match, before, href, after) => {
            // 检查是否已经有 target 属性
            const hasTarget = /target\s*=/i.test(before + after);
            const hasRel = /rel\s*=/i.test(before + after);
            
            // 判断是否为外部链接
            const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
            
            if (hasTarget) {
              // 如果已经有 target，只更新 rel（如果是外部链接）
              if (isExternal && !hasRel) {
                return `<a ${before}href="${href}"${after} rel="nofollow noopener noreferrer">`;
              }
              return match; // 已经有 target，不需要修改
            }
            
            // 没有 target，添加 target 和 rel
            if (isExternal) {
              return `<a ${before}href="${href}"${after} target="_blank" rel="nofollow noopener noreferrer">`;
            } else {
              return `<a ${before}href="${href}"${after} target="_blank">`;
            }
          }
        );
        
        return (
          <div 
            className="prose prose-base max-w-none prose-a:underline prose-a:text-blue-600 hover:prose-a:no-underline hover:prose-a:text-blue-800"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        );
      };
      HtmlRenderer.displayName = 'HtmlRenderer';
      return HtmlRenderer;
    }
    
    // 默认返回空组件
    const EmptyComponent = () => null;
    EmptyComponent.displayName = 'EmptyComponent';
    return EmptyComponent;
  }, [code]);

  return <Component components={{ ...sharedComponents, ...components }} {...props} />
}

export default MDXContent
