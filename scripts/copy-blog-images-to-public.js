const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, '../content/blogs');
const publicStaticDir = path.join(__dirname, '../public/static/blogs');

// 获取所有博客目录
const blogDirs = fs.readdirSync(blogsDir).filter(item => {
  const itemPath = path.join(blogsDir, item);
  return fs.statSync(itemPath).isDirectory() && item !== 'images';
});

blogDirs.forEach(blogDir => {
  const blogPath = path.join(blogsDir, blogDir);
  const imagesDir = path.join(blogPath, 'images');
  const targetDir = path.join(publicStaticDir, blogDir);
  
  if (!fs.existsSync(imagesDir)) {
    return; // 没有 images 目录，跳过
  }
  
  // 创建目标 images 目录
  const targetImagesDir = path.join(targetDir, 'images');
  if (!fs.existsSync(targetImagesDir)) {
    fs.mkdirSync(targetImagesDir, { recursive: true });
  }
  
  // 复制 images 目录下的所有内容到目标 images 目录
  copyDirectory(imagesDir, targetImagesDir);
  
  console.log(`✓ Copied images for ${blogDir}`);
});

function copyDirectory(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const files = fs.readdirSync(sourceDir, { withFileTypes: true });
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file.name);
    const targetPath = path.join(targetDir, file.name);
    
    if (file.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

console.log('\nFinished copying blog images to public/static/blogs!');

