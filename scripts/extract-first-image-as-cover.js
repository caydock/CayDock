const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogsDir = '/Users/Bright/Work/CayDock-Next/content/blogs';

// 获取所有博客目录
const blogDirs = fs.readdirSync(blogsDir).filter(item => {
  const itemPath = path.join(blogsDir, item);
  return fs.statSync(itemPath).isDirectory() && item !== 'images';
});

blogDirs.forEach(blogDir => {
  const blogPath = path.join(blogsDir, blogDir);
  const imagesDir = path.join(blogPath, 'images');
  const coverPath = path.join(imagesDir, 'cover.webp');
  const coverJpg = path.join(imagesDir, 'cover.jpg');
  const coverPng = path.join(imagesDir, 'cover.png');
  
  // 如果已经有封面图，跳过
  if (fs.existsSync(coverPath) || fs.existsSync(coverJpg) || fs.existsSync(coverPng)) {
    return;
  }
  
  // 读取所有 MDX 文件
  const mdxFiles = fs.readdirSync(blogPath).filter(f => f.endsWith('.mdx'));
  
  let foundImage = null;
  let finalExt = '.webp';
  
  // 遍历所有 MDX 文件，找到第一张图片
  for (const mdxFile of mdxFiles) {
    const mdxPath = path.join(blogPath, mdxFile);
    const content = fs.readFileSync(mdxPath, 'utf-8');
    const { content: body } = matter(content);
    
    // 匹配 Markdown 图片语法: ![alt](path) 或 ![alt](./path)
    // 支持带查询参数的图片链接
    const markdownImageRegex = /!\[.*?\]\(([^)]+)\)/g;
    // 匹配 HTML img 标签: <img src="path" />
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    
    let firstImage = null;
    
    // 先尝试 Markdown 格式
    let match = markdownImageRegex.exec(body);
    if (match && match[1]) {
      firstImage = match[1];
    }
    
    // 如果没有找到，尝试 HTML 格式
    if (!firstImage) {
      match = htmlImageRegex.exec(body);
      if (match && match[1]) {
        firstImage = match[1];
      }
    }
    
    if (firstImage) {
      // 移除查询参数和锚点
      let imagePath = firstImage.split('?')[0].split('#')[0];
      
      // 跳过外部链接（http/https）
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        continue;
      }
      
      // 处理相对路径
      // 移除开头的 ./
      if (imagePath.startsWith('./')) {
        imagePath = imagePath.substring(2);
      }
      
      // 如果路径以 /images/ 开头，移除开头的 /，变成 images/...
      if (imagePath.startsWith('/images/')) {
        imagePath = imagePath.substring(8); // 移除 '/images/'
      }
      
      // 如果路径以 / 开头但不是 /images/，可能是相对于博客目录的
      if (imagePath.startsWith('/') && !imagePath.startsWith('/images/')) {
        imagePath = imagePath.substring(1);
      }
      
      // 构建可能的路径
      const possiblePaths = [];
      
      // 如果 imagePath 包含目录结构（如 scroll-issue/xxx.png）
      if (imagePath.includes('/')) {
        possiblePaths.push(path.join(blogPath, 'images', imagePath)); // images/scroll-issue/xxx.png
        possiblePaths.push(path.join(blogPath, imagePath)); // scroll-issue/xxx.png
      }
      
      // 添加其他可能的路径
      possiblePaths.push(
        path.join(blogPath, imagePath), // 相对博客目录
        path.join(blogPath, 'images', path.basename(imagePath)), // 在 images 目录下（仅文件名）
        path.join(imagesDir, path.basename(imagePath)) // 在 images 目录下（仅文件名）
      );
      
      // 查找存在的文件
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          foundImage = possiblePath;
          // 获取文件扩展名
          const ext = path.extname(foundImage).toLowerCase();
          // 如果没有扩展名，尝试从原始路径获取
          finalExt = ext || path.extname(imagePath).toLowerCase() || '.webp';
          break;
        }
      }
      
      if (foundImage) {
        break; // 找到一个就够了
      }
    }
  }
  
  // 如果找到了图片，复制并更新所有 MDX 文件
  if (foundImage) {
    // 确保 images 目录存在
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    const targetCoverPath = path.join(imagesDir, `cover${finalExt}`);
    
    // 复制图片作为封面
    fs.copyFileSync(foundImage, targetCoverPath);
    console.log(`✓ Extracted cover for ${blogDir} from ${path.basename(foundImage)}`);
    
    // 更新该博客目录下所有 MDX 文件的 image 字段
    mdxFiles.forEach(mdxFile => {
      const mdxFilePath = path.join(blogPath, mdxFile);
      const mdxContent = fs.readFileSync(mdxFilePath, 'utf-8');
      const { data, content: body } = matter(mdxContent);
      
      // 更新 image 字段
      data.image = `./images/cover${finalExt}`;
      
      // 重新生成 MDX 内容
      const newMdxContent = `---\n${Object.entries(data).map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}: "${value.replace(/"/g, '\\"')}"`;
        } else if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v.replace(/"/g, '\\"')}"`).join(', ')}]`;
        } else {
          return `${key}: ${value}`;
        }
      }).join('\n')}\n---\n\n${body}`;
      
      fs.writeFileSync(mdxFilePath, newMdxContent, 'utf-8');
    });
  }
});

console.log('\nFinished extracting first images as covers!');

