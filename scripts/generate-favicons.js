const fs = require('fs');
const path = require('path');

// 这是一个简单的 favicon 生成脚本
// 由于没有 ImageMagick，我们创建一个基本的 favicon.ico 文件

const sourceImage = path.join(__dirname, '../public/logo.png');
const publicDir = path.join(__dirname, '../public');

// 创建基本的 favicon.ico 文件（使用现有的 logo.png）
function createFavicon() {
  try {
    // 复制 logo.png 作为各种尺寸的 favicon
    const sizes = [
      { name: 'favicon-16x16.png', size: 16 },
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'favicon-96x96.png', size: 96 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'android-chrome-192x192.png', size: 192 },
      { name: 'android-chrome-512x512.png', size: 512 },
    ];

    // 由于没有图像处理库，我们直接复制源文件
    // 在实际项目中，您应该使用 ImageMagick 或 Sharp 来调整尺寸
    sizes.forEach(({ name }) => {
      const sourcePath = sourceImage;
      const targetPath = path.join(publicDir, name);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Created ${name}`);
      }
    });

    // 创建 favicon.ico（复制 32x32 版本）
    const faviconPath = path.join(publicDir, 'favicon.ico');
    if (fs.existsSync(sourceImage)) {
      fs.copyFileSync(sourceImage, faviconPath);
      console.log('Created favicon.ico');
    }

    console.log('✅ Favicon generation completed!');
    console.log('📝 Note: For best results, use ImageMagick or online tools to create properly sized icons');
    
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
  }
}

createFavicon();
