const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const targetBlogsDir = '/Users/Bright/Work/CayDock-Next/content/blogs';

// 获取所有博客目录
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
    
    if (!data.image) return;
    
    let imagePath = data.image;
    const imagesDir = path.join(blogPath, 'images');
    
    // 如果图片路径包含子目录，检查文件是否存在
    if (imagePath.includes('/') && !imagePath.startsWith('./images/cover.')) {
      const fullImagePath = path.join(blogPath, imagePath.replace('./', ''));
      
      // 如果文件不存在，尝试在子目录中查找
      if (!fs.existsSync(fullImagePath)) {
        const imageName = path.basename(imagePath);
        const coverPath = path.join(imagesDir, 'cover.webp');
        const coverJpg = path.join(imagesDir, 'cover.jpg');
        const coverPng = path.join(imagesDir, 'cover.png');
        
        // 如果根目录有封面，使用它
        if (fs.existsSync(coverPath)) {
          data.image = './images/cover.webp';
        } else if (fs.existsSync(coverJpg)) {
          data.image = './images/cover.jpg';
        } else if (fs.existsSync(coverPng)) {
          data.image = './images/cover.png';
        } else {
          // 尝试在子目录中查找
          const subDirs = fs.readdirSync(imagesDir).filter(item => {
            const itemPath = path.join(imagesDir, item);
            return fs.statSync(itemPath).isDirectory();
          });
          
          for (const subDir of subDirs) {
            const subDirPath = path.join(imagesDir, subDir);
            const files = fs.readdirSync(subDirPath);
            const foundFile = files.find(f => 
              f === imageName || 
              f === 'cover.webp' || 
              f === 'cover.jpg' || 
              f === 'cover.png'
            );
            
            if (foundFile) {
              // 复制到根目录
              const sourceFile = path.join(subDirPath, foundFile);
              const targetFile = path.join(imagesDir, 'cover.webp');
              fs.copyFileSync(sourceFile, targetFile);
              data.image = './images/cover.webp';
              console.log(`Fixed and copied image for: ${blogDir}`);
              break;
            }
          }
        }
      } else {
        // 文件存在，但路径可能太深，简化路径
        const imageName = path.basename(imagePath);
        const coverPath = path.join(imagesDir, 'cover.webp');
        
        // 如果根目录没有封面，从子目录复制一个
        if (!fs.existsSync(coverPath)) {
          const fullImagePath = path.join(blogPath, imagePath.replace('./', ''));
          if (fs.existsSync(fullImagePath)) {
            fs.copyFileSync(fullImagePath, coverPath);
            data.image = './images/cover.webp';
            console.log(`Copied image to root for: ${blogDir}`);
          }
        } else {
          // 根目录有封面，使用它
          data.image = './images/cover.webp';
        }
      }
    }
    
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
  });
});

console.log('\nAll image paths have been fixed!');

