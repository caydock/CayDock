import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 自定义插件：复制 favicon.svg
const copyFaviconPlugin = () => {
  return {
    name: 'copy-favicon',
    writeBundle() {
      const faviconSrc = path.resolve(__dirname, 'public/favicon.svg')
      const faviconDest = path.resolve(__dirname, '../../static/tools/music-cover/favicon.svg')
      if (existsSync(faviconSrc)) {
        // 确保目标目录存在
        const destDir = path.dirname(faviconDest)
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true })
        }
        copyFileSync(faviconSrc, faviconDest)
        console.log(`✓ Copied favicon.svg to ${faviconDest}`)
      } else {
        console.warn(`⚠ favicon.svg not found at ${faviconSrc}`)
      }
    }
  }
}

// 自定义插件：静态预渲染
const prerenderPlugin = () => {
  return {
    name: 'prerender',
    writeBundle() {
      const htmlPath = path.resolve(__dirname, '../../static/tools/music-cover/index.html')
      if (existsSync(htmlPath)) {
        let html = readFileSync(htmlPath, 'utf-8')
        
        // 在 <div id="app"> 中添加静态内容
        const staticContent = `
      <!-- 静态渲染内容 - 用于 SEO 和无 JS 环境 -->
      <div style="min-height: 100vh; display: flex; flex-direction: column;">
        <header style="max-width: 72rem; margin: 0 auto; width: 100%; padding: 1.5rem 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <a href="/" style="text-decoration: none; color: inherit;">
              <span style="font-size: 1.125rem; font-weight: bold;">CayDock</span>
            </a>
            <nav style="display: flex; gap: 1.25rem;">
              <a href="/zh-cn/posts/" style="text-decoration: none; color: #6b7280;">博客</a>
              <a href="/zh-cn/about/" style="text-decoration: none; color: #6b7280;">关于</a>
              <a href="/zh-cn/subscribe/" style="text-decoration: none; color: #6b7280;">订阅</a>
              <a href="/zh-cn/tags/" style="text-decoration: none; color: #6b7280;">标签</a>
            </nav>
          </div>
        </header>
        <main style="flex: 1; max-width: 72rem; margin: 0 auto; width: 100%; padding: 2rem 1rem;">
          <div style="margin-bottom: 2.5rem;">
            <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.75rem; background: linear-gradient(to right, #111827, #374151); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">音乐封面查询</h1>
            <p style="font-size: 1.125rem; color: #6b7280; line-height: 1.75;">免费音乐封面查询刮削工具，支持搜索专辑、歌曲、音乐录影带封面，可下载高清封面图片（600x600至2000x2000），支持多个国家/地区的 iTunes Store</p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(8px); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 1rem; padding: 2rem; margin-bottom: 2rem;">
            <p style="color: #6b7280; text-align: center; margin: 0;">此工具需要启用 JavaScript 才能正常使用。</p>
          </div>
        </main>
        <footer style="max-width: 72rem; margin: 0 auto; width: 100%; padding: 2rem 1rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
          <p style="text-align: center; color: #6b7280; font-size: 0.875rem; margin: 0;">© 2024 CayDock. All rights reserved.</p>
        </footer>
      </div>`
        
        // 替换 <div id="app"></div> 为包含静态内容的版本
        html = html.replace(
          /<div id="app">\s*<\/div>/,
          `<div id="app">${staticContent}</div>`
        )
        
        writeFileSync(htmlPath, html, 'utf-8')
      }
    }
  }
}

export default defineConfig({
  root: __dirname,
  plugins: [vue(), copyFaviconPlugin(), prerenderPlugin()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api/itunes': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/itunes/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 添加 CORS 头
            proxyReq.setHeader('Accept', 'application/json')
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // 添加 CORS 响应头
            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type'
          })
        }
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../../static/tools/music-cover'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // 确保生成独立的 index.html
    copyPublicDir: false
  },
  base: '/tools/music-cover/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  // 确保可以解析共享目录
  optimizeDeps: {
    include: []
  }
})
