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
        rel="noopener noreferrer"
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
      const HtmlRenderer = () => (
        <div 
          className="prose prose-lg max-w-none prose-a:underline prose-a:text-blue-600 hover:prose-a:no-underline hover:prose-a:text-blue-800"
          dangerouslySetInnerHTML={{ 
            __html: code.replace(
              /<a\s+([^>]*?)href="([^"]*?)"([^>]*?)>/g,
              (match, before, href, after) => {
                const isExternal = href.startsWith('http://') || href.startsWith('https://');
                return isExternal 
                  ? `<a ${before}href="${href}"${after} target="_blank" rel="noopener noreferrer">`
                  : `<a ${before}href="${href}"${after} target="_blank">`;
              }
            )
          }}
        />
      );
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
