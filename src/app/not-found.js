"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const runtime = 'edge';

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // 立即重定向到默认语言首页，让middleware处理语言检测
    router.replace('/');
  }, [router]);

  // 显示简单的加载状态
  return (
    <main className="my-32 w-full dark:bg-dark flex justify-center font-mr">
      <div className="relative flex flex-col items-center justify-center">
        <h1 className={`inline-block text-dark dark:text-light text-6xl font-bold w-full capitalize xl:text-8xl text-center`}>404</h1>
        <h2 className={`inline-block text-dark dark:text-light text-3xl md:text-5xl font-bold w-full text-center mt-4 tracking-wide leading-snug`}>页面不存在</h2>
        <p className="text-center mt-4">正在重定向到首页...</p>
      </div>
    </main>
  );
}
