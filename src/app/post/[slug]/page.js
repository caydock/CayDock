import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function PostPage({ params }) {
  const { slug } = params
  
  // 直接重定向到 /?site=xxx
  redirect(`/?site=${slug}`)
} 