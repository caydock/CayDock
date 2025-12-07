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

// 映射 translationKey 到 slug
const translationKeyToSlug = {};

sourceFiles.forEach(file => {
  const filePath = path.join(sourcePostsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(content);
  
  const translationKey = data.translationKey || file.replace(/\.(en|zh-cn)\.md$/, '').replace(/\.md$/, '');
  
  function generateSlug(title, translationKey) {
    if (!title) return translationKey;
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  const slug = generateSlug(data.title, translationKey);
  translationKeyToSlug[translationKey] = slug;
});

// 处理每篇文章的图片
sourceFiles.forEach(file => {
  const filePath = path.join(sourcePostsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(content);
  
  const translationKey = data.translationKey || file.replace(/\.(en|zh-cn)\.md$/, '').replace(/\.md$/, '');
  const slug = translationKeyToSlug[translationKey];
  
  if (!slug) return;
  
  const targetBlogDir = path.join(targetBlogsDir, slug);
  if (!fs.existsSync(targetBlogDir)) return;
  
  const targetImagesDir = path.join(targetBlogDir, 'images');
  if (!fs.existsSync(targetImagesDir)) {
    fs.mkdirSync(targetImagesDir, { recursive: true });
  }
  
  // 处理 featureimage
  if (data.featureimage) {
    let imagePath = data.featureimage;
    if (imagePath.startsWith('/images/')) {
      imagePath = imagePath.substring(8);
    }
    
    const sourceImagePath = path.join(sourceImagesDir, imagePath);
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
      }
    } else {
      const targetImagePath = path.join(targetImagesDir, imageName);
      if (fs.existsSync(sourceImagePath)) {
        fs.copyFileSync(sourceImagePath, targetImagePath);
        console.log(`Copied: ${imagePath} -> ${targetImagePath}`);
      }
    }
  }
  
  // 处理 featuredImage (SVG)
  if (data.featuredImage) {
    const svgName = data.featuredImage;
    const sourceSvgPath = path.join(sourceImagesDir, svgName);
    const targetSvgPath = path.join(targetImagesDir, 'cover.webp'); // 转换为 webp 路径
    
    // 如果 SVG 存在，复制它（或者创建一个占位符）
    if (fs.existsSync(sourceSvgPath)) {
      // 对于 SVG，我们可以复制原文件或创建一个占位符
      // 这里我们创建一个简单的占位符文件
      if (!fs.existsSync(targetSvgPath)) {
        // 尝试从现有博客中复制一个默认封面
        const defaultCover = path.join(targetBlogsDir, 'geek-style-websites', 'images', 'cover.webp');
        if (fs.existsSync(defaultCover)) {
          fs.copyFileSync(defaultCover, targetSvgPath);
          console.log(`Created placeholder cover for: ${slug}`);
        }
      }
    }
  }
});

// 为所有缺失 cover.webp 的博客创建默认封面
const blogDirs = fs.readdirSync(targetBlogsDir).filter(item => {
  const itemPath = path.join(targetBlogsDir, item);
  return fs.statSync(itemPath).isDirectory();
});

// 找一个现有的封面作为默认封面
const defaultCoverSource = path.join(targetBlogsDir, 'geek-style-websites', 'images', 'cover.webp');
let defaultCoverExists = fs.existsSync(defaultCoverSource);

blogDirs.forEach(blogDir => {
  const blogPath = path.join(targetBlogsDir, blogDir);
  const imagesDir = path.join(blogPath, 'images');
  const coverPath = path.join(imagesDir, 'cover.webp');
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  if (!fs.existsSync(coverPath)) {
    // 尝试从源目录复制对应的图片
    const translationKey = blogDir;
    const sourceFiles = fs.readdirSync(sourcePostsDir).filter(file => 
      file.endsWith('.md') && !file.startsWith('_index')
    );
    
    let foundImage = false;
    for (const file of sourceFiles) {
      const filePath = path.join(sourcePostsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(content);
      
      const tk = data.translationKey || file.replace(/\.(en|zh-cn)\.md$/, '').replace(/\.md$/, '');
      function generateSlug(title, tk) {
        if (!title) return tk;
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }
      const s = generateSlug(data.title, tk);
      
      if (s === blogDir && data.featureimage) {
        let imagePath = data.featureimage;
        if (imagePath.startsWith('/images/')) {
          imagePath = imagePath.substring(8);
        }
        const sourceImagePath = path.join(sourceImagesDir, imagePath);
        if (fs.existsSync(sourceImagePath)) {
          const imageDir = path.dirname(imagePath);
          const imageName = path.basename(imagePath);
          
          if (imageDir && imageDir !== '.') {
            const targetImageDir = path.join(imagesDir, imageDir);
            if (!fs.existsSync(targetImageDir)) {
              fs.mkdirSync(targetImageDir, { recursive: true });
            }
            fs.copyFileSync(sourceImagePath, path.join(targetImageDir, imageName));
          } else {
            fs.copyFileSync(sourceImagePath, coverPath);
          }
          foundImage = true;
          console.log(`Found and copied image for: ${blogDir}`);
          break;
        }
      }
    }
    
    // 如果没找到，使用默认封面
    if (!foundImage && defaultCoverExists) {
      fs.copyFileSync(defaultCoverSource, coverPath);
      console.log(`Created default cover for: ${blogDir}`);
    }
  }
});

console.log('\nAll missing images have been processed!');

