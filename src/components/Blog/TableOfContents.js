"use client";
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const TableOfContents = ({ content, locale }) => {
  const t = useTranslations('ui');
  const [activeId, setActiveId] = useState('');
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // 等待页面完全加载后查找标题
    const findHeadings = () => {
      // 尝试多种选择器
      const selectors = [
        '.prose h2, .prose h3, .prose h4',
        '[class*="prose"] h2, [class*="prose"] h3, [class*="prose"] h4',
        'h2, h3, h4'
      ];

      let headingElements = null;
      for (const selector of selectors) {
        headingElements = document.querySelectorAll(selector);
        if (headingElements.length > 0) {
          break;
        }
      }

      if (!headingElements || headingElements.length === 0) {
        // 如果找不到标题，尝试从内容中解析
        if (content) {
          const headingRegex = /^#{2,4}\s+(.+)$/gm;
          const matches = [];
          let match;

          while ((match = headingRegex.exec(content)) !== null) {
            const text = match[1].trim();
            const level = match[0].startsWith('##') ? 2 :
                         match[0].startsWith('###') ? 3 : 4;
            const id = slugify(text);

            matches.push({
              text,
              id,
              level,
              element: `h${level}`
            });
          }

          setHeadings(matches);
        }
        return;
      }

      const matches = [];
      const usedIds = new Set();

      headingElements.forEach((element, index) => {
        const level = parseInt(element.tagName.charAt(1));
        const text = element.textContent?.trim() || '';
        let id = slugify(text);

        // 确保ID唯一性
        let originalId = id;
        let counter = 1;
        while (usedIds.has(id)) {
          id = `${originalId}-${counter}`;
          counter++;
        }
        usedIds.add(id);

        // 确保元素有 ID
        if (!element.id) {
          element.id = id;
        }

        matches.push({
          text,
          id: element.id,
          level,
          element: `h${level}`,
          index // 添加索引用于唯一key
        });
      });

      setHeadings(matches);
    };

    // 延迟执行，确保内容已渲染
    const timer = setTimeout(findHeadings, 500);

    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    // 监听滚动，更新活跃标题
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);

      if (headingElements.length === 0) return;

      // 找到当前在视窗中的标题
      const current = headingElements.find(element => {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (current) {
        setActiveId(current.id);
      } else {
        // 如果没有找到当前标题，使用第一个在视窗中或即将进入视窗的标题
        const firstVisible = headingElements.find(element => {
          const rect = element.getBoundingClientRect();
          return rect.top > 0;
        });
        if (firstVisible) {
          setActiveId(firstVisible.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const slugify = (text) => {
    // 与 MdxContent 中的 slugify 函数保持一致
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符合并为一个
      .trim();
  };

  const scrollToHeading = (id) => {
    // 查找所有可能的标题元素
    const headingElements = document.querySelectorAll('h2, h3, h4');

    // 查找匹配的标题
    let targetElement = document.getElementById(id);

    // 如果通过 ID 找不到，尝试通过文本匹配
    if (!targetElement) {
      const targetHeading = headings.find(h => h.id === id);
      if (targetHeading) {
        headingElements.forEach((element) => {
          const text = element.textContent?.trim() || '';
          if (text === targetHeading.text) {
            element.id = id;
            targetElement = element;
          }
        });
      }
    }

    if (targetElement) {
      // 计算目标位置，考虑导航栏偏移
      const offset = 100; // 导航栏高度 + 额外间距
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // 更新活跃状态
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-transparent p-4 overflow-y-auto h-full">
      {/* 目录标题 */}
      <h3 className="text-sm text-gray-500 dark:text-light font-medium mb-4 pb-2">
        {locale === 'zh-cn' ? '文章目录' : 'Table of Contents'}
      </h3>

      {/* 目录列表 */}
      <div className="space-y-1">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;

          return (
            <a
              key={`${heading.id}-${heading.index}`}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHeading(heading.id);
              }}
              className={`
                block py-2 px-3 text-sm rounded-md transition-all duration-200
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-medium'
                  : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-light hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
                ${heading.level === 3 ? 'ml-4' : ''}
                ${heading.level === 4 ? 'ml-8' : ''}
              `}
            >
              {heading.text}
            </a>
          );
        })}
      </div>

      {/* 返回顶部按钮 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="mt-4 w-full py-2 text-xs text-gray-500 dark:text-zinc-300 hover:text-gray-700 dark:hover:text-light transition-colors duration-200 pt-3"
      >
        {locale === 'zh-cn' ? '返回顶部 ↑' : 'Back to top ↑'}
      </button>
    </div>
  );
};

export default TableOfContents;