import * as runtime from 'react/jsx-runtime'
import Image from 'next/image'

// 自定义 Image 组件，处理字符串类型的 width 和 height
const CustomImage = (props) => {
  const { width, height, ...rest } = props;
  return (
    <Image
      {...rest}
      width={typeof width === 'string' ? parseInt(width) : width}
      height={typeof height === 'string' ? parseInt(height) : height}
    />
  );
};

// 自定义 Link 组件，外部链接在新标签页打开
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
        className="text-accent dark:text-accentDark hover:underline"
        {...rest}
      >
        {children}
      </a>
    );
  }
  
  // 内部链接保持原样
  return <a href={href} {...rest}>{children}</a>;
};

const sharedComponents = {
  Image: CustomImage,
  a: CustomLink
}

const useMDXComponent = (code) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

 const MDXContent = ({ code, components, ...props }) => {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} {...props} />
}

export default MDXContent
