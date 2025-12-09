const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const blogsDir = path.join(__dirname, '../content/blogs');

// 获取所有博客目录
const blogDirs = fs.readdirSync(blogsDir).filter(item => {
  const itemPath = path.join(blogsDir, item);
  return fs.statSync(itemPath).isDirectory() && item !== 'images';
});

// 从 markdown 内容中提取第一张图片
function extractFirstImage(content) {
  // 匹配 markdown 图片格式: ![](url) 或 ![alt](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
  const match = content.match(markdownImageRegex);
  
  if (match && match[2]) {
    return match[2].trim();
  }
  
  return null;
}

// 判断是否是外部 URL
function isExternalUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

// 判断是否是本地路径
function isLocalPath(url) {
  return url.startsWith('/') || url.startsWith('./') || !url.includes('://');
}

// 下载图片
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      // 根据 Content-Type 确定文件扩展名
      const contentType = response.headers['content-type'] || '';
      let ext = '.jpg';
      if (contentType.includes('png')) ext = '.png';
      else if (contentType.includes('webp')) ext = '.webp';
      else if (contentType.includes('gif')) ext = '.gif';
      else if (contentType.includes('jpeg')) ext = '.jpg';
      
      // 如果 URL 中有扩展名，使用 URL 的扩展名
      const urlExt = path.extname(new URL(url).pathname);
      if (urlExt) {
        ext = urlExt;
      }
      
      const finalPath = destPath + ext;
      const fileStream = fs.createWriteStream(finalPath);
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(finalPath);
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(finalPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// 处理单个博客目录
async function processBlogDir(blogDir) {
  const blogPath = path.join(blogsDir, blogDir);
  const mdxFiles = fs.readdirSync(blogPath).filter(file => 
    file.endsWith('.mdx') && (file === 'index.mdx' || file.includes('.mdx'))
  );
  
  for (const file of mdxFiles) {
    const filePath = path.join(blogPath, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查是否已经有 image 字段
    const hasImageField = /^image:\s*.+$/m.test(content);
    
    if (hasImageField) {
      console.log(`⏭️  ${blogDir}/${file} 已有封面，跳过`);
      continue;
    }
    
    // 提取第一张图片
    const imageUrl = extractFirstImage(content);
    
    if (!imageUrl) {
      console.log(`⚠️  ${blogDir}/${file} 没有找到图片`);
      continue;
    }
    
    console.log(`📸 ${blogDir}/${file} 找到图片: ${imageUrl}`);
    
    let coverPath;
    
    // 确保 images 目录存在
    const imagesDir = path.join(blogPath, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    if (isExternalUrl(imageUrl)) {
      // 下载外部图片
      try {
        console.log(`⬇️  下载图片: ${imageUrl}`);
        const destPath = path.join(imagesDir, 'cover');
        coverPath = await downloadImage(imageUrl, destPath);
        const relativePath = `./images/${path.basename(coverPath)}`;
        
        // 更新 markdown 文件
        const frontmatterEnd = content.indexOf('---', 3);
        if (frontmatterEnd > 0) {
          const frontmatter = content.substring(0, frontmatterEnd);
          const body = content.substring(frontmatterEnd + 3);
          
          // 在 frontmatter 中添加 image 字段（在 updatedAt 之后）
          const updatedAtMatch = frontmatter.match(/^updatedAt:\s*.+$/m);
          if (updatedAtMatch) {
            const insertPos = frontmatter.indexOf(updatedAtMatch[0]) + updatedAtMatch[0].length;
            const newFrontmatter = frontmatter.substring(0, insertPos) + 
              `\nimage: "${relativePath}"` + 
              frontmatter.substring(insertPos);
            content = newFrontmatter + '---' + body;
          } else {
            // 如果没有 updatedAt，在 publishedAt 之后添加
            const publishedAtMatch = frontmatter.match(/^publishedAt:\s*.+$/m);
            if (publishedAtMatch) {
              const insertPos = frontmatter.indexOf(publishedAtMatch[0]) + publishedAtMatch[0].length;
              const newFrontmatter = frontmatter.substring(0, insertPos) + 
                `\nimage: "${relativePath}"` + 
                frontmatter.substring(insertPos);
              content = newFrontmatter + '---' + body;
            }
          }
          
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`✅ ${blogDir}/${file} 已添加封面: ${relativePath}`);
        }
      } catch (error) {
        console.error(`❌ ${blogDir}/${file} 下载失败: ${error.message}`);
      }
    } else if (isLocalPath(imageUrl)) {
      // 处理本地图片
      let relativePath;
      
      if (imageUrl.startsWith('/images/')) {
        // 绝对路径，转换为相对路径
        relativePath = `.${imageUrl}`;
      } else if (imageUrl.startsWith('./')) {
        // 已经是相对路径
        relativePath = imageUrl;
      } else if (imageUrl.startsWith('/')) {
        // 以 / 开头的路径
        relativePath = `.${imageUrl}`;
      } else {
        // 相对路径，假设在 images 目录下
        relativePath = `./images/${imageUrl}`;
      }
      
      // 更新 markdown 文件
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd > 0) {
        const frontmatter = content.substring(0, frontmatterEnd);
        const body = content.substring(frontmatterEnd + 3);
        
        // 在 frontmatter 中添加 image 字段
        const updatedAtMatch = frontmatter.match(/^updatedAt:\s*.+$/m);
        if (updatedAtMatch) {
          const insertPos = frontmatter.indexOf(updatedAtMatch[0]) + updatedAtMatch[0].length;
          const newFrontmatter = frontmatter.substring(0, insertPos) + 
            `\nimage: "${relativePath}"` + 
            frontmatter.substring(insertPos);
          content = newFrontmatter + '---' + body;
        } else {
          const publishedAtMatch = frontmatter.match(/^publishedAt:\s*.+$/m);
          if (publishedAtMatch) {
            const insertPos = frontmatter.indexOf(publishedAtMatch[0]) + publishedAtMatch[0].length;
            const newFrontmatter = frontmatter.substring(0, insertPos) + 
              `\nimage: "${relativePath}"` + 
              frontmatter.substring(insertPos);
            content = newFrontmatter + '---' + body;
          }
        }
        
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ ${blogDir}/${file} 已添加封面: ${relativePath}`);
      }
    }
  }
}

// 主函数
async function main() {
  console.log('开始处理博客封面...\n');
  
  for (const blogDir of blogDirs) {
    await processBlogDir(blogDir);
  }
  
  console.log('\n处理完成！');
}

main().catch(console.error);

