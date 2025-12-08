const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blogsDir = path.join(__dirname, '../content/blogs');
const targetMd5 = '3005c8979dd26fa9e69456f315946373';

// 获取所有使用相同图片的博客目录
const duplicateBlogs = execSync(
  `find public/static/blogs -name "cover.webp" -exec sh -c 'md5 "$1" | grep -q "${targetMd5}" && echo "$1"' _ {} \\; | sed 's|public/static/blogs/||' | sed 's|/images/cover.webp||'`,
  { cwd: path.join(__dirname, '..'), encoding: 'utf-8' }
).trim().split('\n').filter(Boolean);

console.log(`找到 ${duplicateBlogs.length} 个使用相同封面图片的博客:`);
duplicateBlogs.forEach(blog => console.log(`  - ${blog}`));

// 更新每个博客的 markdown 文件
duplicateBlogs.forEach(blogSlug => {
  // 查找该博客的所有 markdown 文件
  const blogDir = path.join(blogsDir, blogSlug);
  if (!fs.existsSync(blogDir)) {
    console.log(`⚠️  目录不存在: ${blogDir}`);
    return;
  }
  
  const mdxFiles = fs.readdirSync(blogDir).filter(file => 
    file.endsWith('.mdx') && (file === 'index.mdx' || file.includes('.mdx'))
  );
  
  mdxFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查是否有 image 字段
    const imageMatch = content.match(/^image:\s*(.+)$/m);
    if (imageMatch) {
      // 删除 image 字段（使用默认的 about-bg）
      content = content.replace(/^image:\s*.+$/m, '');
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ 已删除 ${blogSlug}/${file} 的 image 字段`);
    } else {
      console.log(`  ${blogSlug}/${file} 没有 image 字段，跳过`);
    }
  });
});

console.log('\n完成！所有重复的封面图片已替换为默认的 about-bg。');

