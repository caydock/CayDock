import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  plugins: [vue()],
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
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name][extname]'
        }
      }
    },
    // 确保生成独立的 index.html
    copyPublicDir: false
  },
  base: '/tools/music-cover/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
