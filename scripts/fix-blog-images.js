const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const sourceImagesDir = '/Users/Bright/Work/CayDock/static/images';
const sourcePostsDir = '/Users/Bright/Work/CayDock/content/posts';
const targetBlogsDir = '/Users/Bright/Work/CayDock-Next/content/blogs';

// 获取所有源文章文件
const sourceFiles = fs.readdirSync(sourcePostsDir).filter(file => 
  file.endsWith('.md') && !file.startsWith('_index')
);

// 读取每篇文章，找到图片路径并复制
sourceFiles.forEach(file => {
  const filePath = path.join(sourcePostsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(content);
  
  if (!data.featureimage) return;
  
  // 获取 translationKey 或从文件名生成
  const translationKey = data.translationKey || file.replace(/\.(en|zh-cn)\.md$/, '').replace(/\.md$/, '');
  
  // 生成 slug（与迁移脚本一致）
  function generateSlug(title, translationKey) {
    if (!title) return translationKey;
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  const slug = generateSlug(data.title, translationKey);
  const targetBlogDir = path.join(targetBlogsDir, slug);
  
  if (!fs.existsSync(targetBlogDir)) {
    console.log(`Skipping ${slug} - blog folder not found`);
    return;
  }
  
  // 处理图片路径
  let imagePath = data.featureimage;
  
  // 移除开头的 /images/
  if (imagePath.startsWith('/images/')) {
    imagePath = imagePath.substring(8);
  }
  
  const sourceImagePath = path.join(sourceImagesDir, imagePath);
  const targetImagesDir = path.join(targetBlogDir, 'images');
  
  // 创建目标 images 目录
  if (!fs.existsSync(targetImagesDir)) {
    fs.mkdirSync(targetImagesDir, { recursive: true });
  }
  
  // 如果图片路径包含子目录，保持目录结构
  const imageDir = path.dirname(imagePath);
  const imageName = path.basename(imagePath);
  
  if (imageDir && imageDir !== '.') {
    const targetImageDir = path.join(targetImagesDir, imageDir);
    if (!fs.existsSync(targetImageDir)) {
      fs.mkdirSync(targetImageDir, { recursive: true });
    }
    const targetImagePath = path.join(targetImageDir, imageName);
    
    if (fs.existsSync(sourceImagePath)) {
      fs.copyFileSync(sourceImagePath, targetImagePath);
      console.log(`Copied: ${imagePath} -> ${targetImagePath}`);
    } else {
      console.log(`Warning: Source image not found: ${sourceImagePath}`);
    }
  } else {
    const targetImagePath = path.join(targetImagesDir, imageName);
    
    if (fs.existsSync(sourceImagePath)) {
      fs.copyFileSync(sourceImagePath, targetImagePath);
      console.log(`Copied: ${imagePath} -> ${targetImagePath}`);
    } else {
      console.log(`Warning: Source image not found: ${sourceImagePath}`);
    }
  }
});

// 处理一些特殊情况：检查博客文章中的图片引用
const blogDirs = fs.readdirSync(targetBlogsDir).filter(item => {
  const itemPath = path.join(targetBlogsDir, item);
  return fs.statSync(itemPath).isDirectory();
});

blogDirs.forEach(blogDir => {
  const blogPath = path.join(targetBlogsDir, blogDir);
  const mdxFiles = fs.readdirSync(blogPath).filter(f => f.endsWith('.mdx'));
  
  mdxFiles.forEach(mdxFile => {
    const mdxPath = path.join(blogPath, mdxFile);
    let content = fs.readFileSync(mdxPath, 'utf-8');
    const { data, content: body } = matter(content);
    
    // 修复图片路径
    if (data.image) {
      // 如果路径包含 /images/，转换为相对路径
      if (data.image.includes('/images/')) {
        const imagePath = data.image.replace(/.*\/images\//, '');
        data.image = `./images/${imagePath}`;
        
        // 更新文件
        const newContent = `---\n${Object.entries(data).map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key}: "${value.replace(/"/g, '\\"')}"`;
          } else if (Array.isArray(value)) {
            return `${key}: [${value.map(v => `"${v.replace(/"/g, '\\"')}"`).join(', ')}]`;
          } else {
            return `${key}: ${value}`;
          }
        }).join('\n')}\n---\n\n${body}`;
        
        fs.writeFileSync(mdxPath, newContent, 'utf-8');
        console.log(`Fixed image path in: ${mdxPath}`);
      }
    }
  });
});

console.log('\nImage migration completed!');

