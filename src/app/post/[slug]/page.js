import { redirect } from 'next/navigation'

export default function PostPage({ params }) {
  const { slug } = params
  
  // 移除.html后缀（如果存在）
  const cleanSlug = slug.replace(/\.html$/, '')
  
  // 重定向到新的URL格式
  redirect(`/site?id=${cleanSlug}`)
} 