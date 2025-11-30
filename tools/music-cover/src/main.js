import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 独立渲染，挂载到 #app
const app = createApp(App)
app.mount('#app')
