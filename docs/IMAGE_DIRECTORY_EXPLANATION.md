# 图片目录说明

## 目录结构

### 1. `content/blogs/{slug}/images/` - **源文件目录**（推荐使用）
- **用途**：存放 markdown 文件和对应的图片源文件
- **特点**：
  - 这是**唯一**应该编辑和存放博客图片的地方
  - 图片与 markdown 文件在同一个目录下，便于管理
  - 会被 Git 版本控制
- **示例**：
  ```
  content/blogs/my-blog-post/
    ├── index.zh-cn.mdx
    └── images/
        └── cover.jpg
  ```

### 2. `public/static/blogs/{slug}/images/` - **运行时目录**（自动生成）
- **用途**：Next.js 运行时访问的图片目录
- **特点**：
  - 通过 `scripts/copy-blog-images-to-public.js` 脚本自动从 `content/blogs` 复制
  - Next.js 只能访问 `public` 目录下的文件
  - **不要手动编辑**，会被脚本覆盖
- **生成方式**：
  ```bash
  node scripts/copy-blog-images-to-public.js
  ```

### 3. `public/images/` - **全局图片目录**
- **用途**：存放全局使用的图片（如 `about-bg.jpg`）
- **特点**：
  - 存放网站全局使用的图片
  - 不随博客文章变化
  - 可以直接访问，路径如 `/images/about-bg.jpg`

## 工作流程

1. **编辑时**：在 `content/blogs/{slug}/images/` 中存放图片
2. **构建时**：运行脚本将图片复制到 `public/static/blogs/{slug}/images/`
3. **运行时**：Next.js 从 `public/static/blogs/{slug}/images/` 访问图片

## 在 Markdown 中引用图片

### 封面图片（frontmatter）
```yaml
---
image: "./images/cover.jpg"
---
```

### 文章内容中的图片
```markdown
![描述](./images/my-image.jpg)
```

## 路径转换

velite 会自动将 markdown 中的相对路径转换为运行时路径：
- `./images/cover.jpg` → `/static/blogs/{slug}/images/cover.jpg`
- `/images/about-bg.jpg` → `/images/about-bg.jpg`（全局图片，不变）

## 最佳实践

✅ **推荐做法**：
- 所有博客图片存放在 `content/blogs/{slug}/images/`
- 使用相对路径 `./images/xxx.jpg` 在 markdown 中引用
- 构建前运行 `node scripts/copy-blog-images-to-public.js`

❌ **不推荐**：
- 不要直接在 `public/static/blogs` 中编辑图片（会被覆盖）
- 不要将博客图片放在 `public/images/`（这是全局图片目录）

