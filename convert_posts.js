const fs = require('fs');
const path = require('path');

// 源目录和目标目录
const sourceDir = '/Users/Bright/Work/CayDock/source/_posts';
const targetDir = '/Users/Bright/Work/CayDock-Hugo/content/posts';

// 读取源目录中的所有文件
const files = fs.readdirSync(sourceDir);

files.forEach(file => {
  if (file.endsWith('.md')) {
    const sourcePath = path.join(sourceDir, file);
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // 解析 front matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (frontMatterMatch) {
      const frontMatterContent = frontMatterMatch[1];
      const bodyContent = frontMatterMatch[2];
      
      // 解析 YAML front matter
      const lines = frontMatterContent.split('\n');
      const frontMatter = {};
      
      lines.forEach(line => {
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          
          if (key.trim() === 'tags' && value.includes('[')) {
            // 处理标签数组
            const tagsMatch = value.match(/\[(.*?)\]/);
            if (tagsMatch) {
              const tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''));
              frontMatter[key.trim()] = tags;
            }
          } else if (key.trim() === 'date') {
            // 处理日期格式
            frontMatter[key.trim()] = value;
          } else {
            frontMatter[key.trim()] = value;
          }
        }
      });
      
      // 转换为 Hugo front matter
      let hugoFrontMatter = '---\n';
      hugoFrontMatter += `title: "${frontMatter.title || ''}"\n`;
      hugoFrontMatter += `date: ${frontMatter.date || new Date().toISOString()}\n`;
      
      if (frontMatter.tags && frontMatter.tags.length > 0) {
        hugoFrontMatter += `tags:\n`;
        frontMatter.tags.forEach(tag => {
          hugoFrontMatter += `  - ${tag}\n`;
        });
      }
      
      if (frontMatter.categories) {
        hugoFrontMatter += `categories:\n`;
        if (Array.isArray(frontMatter.categories)) {
          frontMatter.categories.forEach(cat => {
            hugoFrontMatter += `  - ${cat}\n`;
          });
        } else {
          hugoFrontMatter += `  - ${frontMatter.categories}\n`;
        }
      }
      
      hugoFrontMatter += `draft: false\n`;
      hugoFrontMatter += `---\n\n`;
      
      // 组合最终内容
      const hugoContent = hugoFrontMatter + bodyContent;
      
      // 写入目标文件
      const targetPath = path.join(targetDir, file);
      fs.writeFileSync(targetPath, hugoContent, 'utf8');
      
      console.log(`转换完成: ${file}`);
    }
  }
});

console.log('所有文章转换完成！');
