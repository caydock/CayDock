const fs = require('fs');
const path = require('path');

const blogsDir = '/Users/Bright/Work/CayDock-Next/content/blogs';

// 保留的原有文章（关于 weird websites 的）
const keepBlogs = [
  '10-most-popular-weird-websites-on-reddit',
  '10-weird-websites-with-fascinating-interactive-features',
  '5-radio-tv-websites-collection',
  '7-interesting-ai-application-websites',
  '8-fun-gaming-websites-collection',
  '8-magical-websites-with-superlatives',
  'featured-10-weird-websites-that-will-blow-your-mind',
  'geek-style-websites',
  'geography-enthusiasts-interesting-websites',
  'interactive-music-websites'
];

// 获取所有博客目录
const allBlogs = fs.readdirSync(blogsDir).filter(item => {
  const itemPath = path.join(blogsDir, item);
  return fs.statSync(itemPath).isDirectory() && item !== 'images';
});

// 删除迁移过来的文章
let deletedCount = 0;
allBlogs.forEach(blogDir => {
  if (!keepBlogs.includes(blogDir)) {
    const blogPath = path.join(blogsDir, blogDir);
    console.log(`Deleting: ${blogDir}`);
    fs.rmSync(blogPath, { recursive: true, force: true });
    deletedCount++;
  }
});

console.log(`\nDeleted ${deletedCount} migrated blog posts.`);
console.log(`Kept ${keepBlogs.length} original blog posts.`);

