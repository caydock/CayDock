# 工具模块共享基础组件

这个目录包含了所有工具模块可以复用的基础组件和配置。

## 目录结构

```
tools/shared/
├── config.js              # 共享配置文件（统计、广告等配置）
├── analytics.js           # 统计 SDK 初始化脚本
├── ads.js                 # 广告 SDK 初始化脚本
├── components/
│   ├── Header.vue        # 网站头部组件
│   └── Footer.vue        # 网站底部组件
└── README.md             # 本文件
```

## 使用方法

### 1. 在工具模块中引入配置

```javascript
import { siteConfig } from '../shared/config.js'
```

### 2. 初始化统计 SDK

在 `main.js` 中：

```javascript
import { initAllAnalytics } from '../shared/analytics.js'

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnalytics)
} else {
  initAllAnalytics()
}
```

### 3. 初始化广告 SDK

在 `main.js` 中：

```javascript
import { initAdSense } from '../shared/ads.js'

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdSense)
} else {
  initAdSense()
}
```

### 4. 使用 Header 和 Footer 组件

在 `App.vue` 中：

```vue
<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <!-- 你的内容 -->
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '../shared/components/Header.vue'
import Footer from '../shared/components/Footer.vue'
</script>
```

### 5. 配置 Vite 别名（可选）

在 `vite.config.js` 中：

```javascript
resolve: {
  alias: {
    '@shared': path.resolve(__dirname, '../shared')
  }
}
```

然后可以这样引入：

```javascript
import { siteConfig } from '@shared/config.js'
```

## 配置说明

### 统计工具

- **Google Analytics**: 通过 `googleAnalytics.id` 配置
- **Umami Analytics**: 通过 `umamiAnalytics` 配置
- **Microsoft Clarity**: 通过 `clarityAnalytics.projectId` 配置

### 广告

- **Google AdSense**: 通过 `advertisement.adsense` 配置

### 菜单

- **Footer Menu**: 在 `config.js` 中的 `footerMenu` 数组配置
- **Header Menu**: 在 `Header.vue` 组件中根据语言自动配置

## 添加新工具模块

1. 复制现有工具模块的结构
2. 在 `main.js` 中引入统计和广告初始化
3. 在 `App.vue` 中使用 Header 和 Footer 组件
4. 所有配置会自动从 `shared/config.js` 读取

## 更新配置

当需要更新统计或广告配置时，只需修改 `tools/shared/config.js` 文件，所有工具模块会自动使用新配置。

