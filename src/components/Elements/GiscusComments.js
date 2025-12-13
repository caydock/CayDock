"use client";
import { useEffect, useRef } from 'react';
import { useThemeSwitch } from '../Hooks/useThemeSwitch';
import siteMetadata from '@/src/utils/siteMetaData';

/**
 * Giscus 评论组件
 * 基于 GitHub Discussions 的评论系统
 */
export default function GiscusComments({ locale }) {
  const [mode] = useThemeSwitch();
  const commentsRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!siteMetadata.giscus?.enable) return;
    if (scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', siteMetadata.giscus.repo);
    script.setAttribute('data-repo-id', siteMetadata.giscus.repoId);
    script.setAttribute('data-category', siteMetadata.giscus.category);
    script.setAttribute('data-category-id', siteMetadata.giscus.categoryId);
    script.setAttribute('data-mapping', siteMetadata.giscus.mapping || 'pathname');
    script.setAttribute('data-strict', siteMetadata.giscus.strict || '0');
    script.setAttribute('data-reactions-enabled', siteMetadata.giscus.reactionsEnabled || '1');
    script.setAttribute('data-emit-metadata', siteMetadata.giscus.emitMetadata || '0');
    script.setAttribute('data-input-position', siteMetadata.giscus.inputPosition || 'bottom');
    script.setAttribute('data-theme', siteMetadata.giscus.theme || 'preferred_color_scheme');
    script.setAttribute('data-lang', locale === 'zh-cn' ? 'zh-CN' : 'en');
    script.setAttribute('data-loading', siteMetadata.giscus.loading || 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    if (commentsRef.current) {
      commentsRef.current.appendChild(script);
      scriptLoadedRef.current = true;
    }

    return () => {
      // 清理脚本
      const currentRef = commentsRef.current;
      if (currentRef && script.parentNode) {
        currentRef.removeChild(script);
        scriptLoadedRef.current = false;
      }
    };
  }, [locale]);

  // 当主题变化时，更新 Giscus 主题
  useEffect(() => {
    if (!siteMetadata.giscus?.enable || !scriptLoadedRef.current) return;

    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame && giscusFrame.contentWindow) {
      const currentTheme = mode === 'dark' ? 'dark' : 'light';
      giscusFrame.contentWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme: currentTheme,
            },
          },
        },
        'https://giscus.app'
      );
    }
  }, [mode]);

  if (!siteMetadata.giscus?.enable) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div
        ref={commentsRef}
        className="giscus"
        style={{
          width: '100%',
          minHeight: '150px',
        }}
      />
      <style jsx>{`
        .giscus,
        .giscus-frame {
          width: 100%;
          min-height: 150px;
        }

        .giscus-frame {
          border: none;
          color-scheme: light dark;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .giscus-frame--loading {
          opacity: 0;
        }

        /* 修复夜间模式下 Giscus 底部信息的显示问题 */
        @media (prefers-color-scheme: dark) {
          .giscus-frame {
            color-scheme: dark;
          }
        }

        /* 确保 Giscus 在暗色主题下正确显示 */
        [data-theme='dark'] .giscus-frame,
        .dark .giscus-frame {
          color-scheme: dark;
        }

        /* 修复 Giscus 底部链接的对比度 */
        .giscus-frame a {
          color: inherit !important;
        }

        /* 确保 Giscus 内容在暗色模式下可见 */
        .giscus-frame {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

