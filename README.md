# CayDock Hugo 博客

这是使用 Hugo + Blowfish 主题构建的个人博客。

## 项目结构

```
CayDock-Hugo/
├── config/           # 配置文件
│   └── _default/     # 默认配置
├── content/          # 内容文件
│   ├── posts/        # 博客文章
│   └── pages/        # 页面
├── static/           # 静态资源
├── themes/           # 主题
│   └── blowfish/     # Blowfish 主题
└── i18n/             # 国际化文件
```

## 功能特性

- ✅ 使用 Blowfish 主题
- ✅ 支持中文
- ✅ 响应式设计
- ✅ 暗色/亮色主题切换
- ✅ 搜索功能
- ✅ 标签和分类
- ✅ 文章目录
- ✅ 代码高亮
- ✅ 数学公式支持

## 已迁移的内容

- 40+ 篇博客文章
- 图片资源
- 关于页面

## 使用方法

1. 安装 Hugo（如果还没有安装）
2. 运行 `hugo server` 启动开发服务器
3. 访问 `http://localhost:1313` 查看网站

## 部署

可以使用任何静态网站托管服务，如：
- Netlify
- Vercel
- GitHub Pages
- 自建服务器

## 配置说明

主要配置文件位于 `config/_default/` 目录：
- `hugo.toml` - 基本配置
- `params.toml` - 主题参数
- `languages.zh.toml` - 中文语言配置
- `menus.zh.toml` - 中文菜单配置

