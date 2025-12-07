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
  
  if (!fs.existsSync(imagesDir)) {
    return;
  }
  
  // 查找实际的封面文件
  let actualCoverFile = null;
  const coverFiles = ['cover.webp', 'cover.jpg', 'cover.png', 'cover.jpeg'];
  for (const coverFile of coverFiles) {
    const coverPath = path.join(imagesDir, coverFile);
    if (fs.existsSync(coverPath)) {
      actualCoverFile = coverFile;
      break;
    }
  }
  
  if (!actualCoverFile) {
    return;
  }
  
  const ext = path.extname(actualCoverFile);
  
  // 更新所有 MDX 文件
  const mdxFiles = fs.readdirSync(blogPath).filter(f => f.endsWith('.mdx'));
  mdxFiles.forEach(mdxFile => {
    const mdxPath = path.join(blogPath, mdxFile);
    const content = fs.readFileSync(mdxPath, 'utf-8');
    const { data, content: body } = matter(content);
    
    // 检查 image 字段是否匹配实际文件
    const expectedImage = `./images/cover${ext}`;
    if (data.image !== expectedImage) {
      data.image = expectedImage;
      
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
      
      fs.writeFileSync(mdxPath, newMdxContent, 'utf-8');
      console.log(`✓ Fixed image path in ${mdxFile} to ${expectedImage}`);
    }
  });
});

console.log('\nFinished fixing cover image paths!');

