const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const sourceDir = '/Users/Bright/Work/CayDock/content/posts';
const targetDir = '/Users/Bright/Work/CayDock-Next/content/blogs';

// 获取所有源文件
const sourceFiles = fs.readdirSync(sourceDir).filter(file => 
  file.endsWith('.md') && !file.startsWith('_index')
);

// 按 translationKey 分组
const postsByKey = {};

sourceFiles.forEach(file => {
  const filePath = path.join(sourceDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  const translationKey = data.translationKey || file.replace(/\.(en|zh-cn)\.md$/, '').replace(/\.md$/, '');
  const lang = file.includes('.en.md') ? 'en' : file.includes('.zh-cn.md') ? 'zh-cn' : 'zh-cn';
  
  if (!postsByKey[translationKey]) {
    postsByKey[translationKey] = {};
  }
  
  postsByKey[translationKey][lang] = { data, body, file };
});

// 转换日期格式
function convertDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  // 处理 "2019-01-06 20:51:35" 格式
  if (typeof dateStr === 'string' && dateStr.includes(' ')) {
    return dateStr.split(' ')[0];
  }
  
  // 处理 Date 对象
  if (dateStr instanceof Date) {
    return dateStr.toISOString().split('T')[0];
  }
  
  return dateStr;
}

// 生成 slug
function generateSlug(title, translationKey) {
  if (!title) return translationKey;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 转换标签
function convertTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags.split(',').map(t => t.trim());
}

// 转换每篇文章
Object.keys(postsByKey).forEach(translationKey => {
  const posts = postsByKey[translationKey];
  
  // 优先使用英文版本的数据作为基础
  const basePost = posts.en || posts['zh-cn'];
  if (!basePost) return;
  
  const baseData = basePost.data;
  const slug = generateSlug(baseData.title, translationKey);
  const targetFolder = path.join(targetDir, slug);
  
  // 创建目标文件夹
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }
  
  // 处理每个语言版本
  ['en', 'zh-cn'].forEach(lang => {
    const post = posts[lang];
    if (!post) return;
    
    const { data, body } = post;
    const langExt = lang === 'en' ? 'en.mdx' : 'zh-cn.mdx';
    const targetFile = path.join(targetFolder, `index.${langExt}`);
    
    // 转换 frontmatter
    const newData = {
      title: data.title || '',
      description: data.description || data.subtitle || (body.substring(0, 150).replace(/\n/g, ' ').trim() + '...'),
      publishedAt: convertDate(data.date),
      updatedAt: convertDate(data.updatedAt || data.date),
      image: data.featureimage ? data.featureimage.replace(/^\/images\//, './images/') : './images/cover.webp',
      isPublished: data.draft === false,
      author: data.author || 'Cayden',
      tags: convertTags(data.tags),
      slug: slug,
      key: translationKey,
      tagKeys: convertTags(data.tags),
      language: lang === 'en' ? 'en' : 'zh-cn'
    };
    
    // 生成 MDX 内容
    const mdxContent = `---\n${Object.entries(newData).map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}: "${value.replace(/"/g, '\\"')}"`;
      } else if (Array.isArray(value)) {
        return `${key}: [${value.map(v => `"${v.replace(/"/g, '\\"')}"`).join(', ')}]`;
      } else {
        return `${key}: ${value}`;
      }
    }).join('\n')}\n---\n\n${body}`;
    
    fs.writeFileSync(targetFile, mdxContent, 'utf-8');
    console.log(`Migrated: ${slug} (${lang})`);
  });
});

console.log(`\nMigration completed! Migrated ${Object.keys(postsByKey).length} blog posts.`);

