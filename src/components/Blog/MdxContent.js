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

const sharedComponents = {
  Image: CustomImage
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
