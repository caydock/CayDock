import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 初始化统计和广告 SDK
import { initAllAnalytics } from '@shared/analytics.js'
import { initAdSense } from '@shared/ads.js'

// 独立渲染，挂载到 #app
const app = createApp(App)
app.mount('#app')

// 初始化统计和广告（在 DOM 加载完成后）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAllAnalytics()
    initAdSense()
  })
} else {
  initAllAnalytics()
  initAdSense()
}
