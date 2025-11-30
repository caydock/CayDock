# 音乐封面查询工具

这是一个基于 Vue 3 + Vite 构建的音乐封面查询应用，使用 iTunes Search API 来搜索和下载音乐专辑封面。

## 功能特性

- 🔍 支持搜索专辑、歌曲、音乐录影带和艺人
- 🌍 支持多个国家/地区的 iTunes Store
- 🖼️ 支持多种封面分辨率选择（600x600 到 2000x2000）
- 💾 一键下载高清封面
- 📱 响应式设计，支持移动端和桌面端

## 技术栈

- Vue 3 (Composition API)
- Vite
- Tailwind CSS (shadcn/ui 风格)
- Cloudflare Functions (用于 API 代理)

## 开发

```bash
# 安装依赖
cd tools/music-cover
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 构建和部署

在项目根目录运行：

```bash
# 构建 Vue 应用和 Hugo 站点
npm run build

# 或者分别构建
npm run build:music-cover
hugo --minify
```

构建后的文件会输出到 `static/tools/music-cover/` 目录，Hugo 会自动将其包含在最终构建中。

## API

应用通过 Cloudflare Functions 调用 iTunes Search API，函数位于 `functions/api/itunes/search.js`。

## 访问路径

- 中文: `/tools/music-cover/` 或 `/zh-cn/tools/music-cover/`
- 英文: `/en/tools/music-cover/`

