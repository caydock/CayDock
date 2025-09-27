const fs = require('fs');
const path = require('path');

// 创建一个简单的 ICO 文件生成器
// 由于没有 ImageMagick，我们创建一个基本的 ICO 文件

function createBasicIco() {
  const publicDir = path.join(__dirname, '../public');
  const faviconPath = path.join(publicDir, 'favicon.ico');
  
  // 创建一个基本的 ICO 文件头
  // ICO 文件格式：文件头 + 图标目录 + 图标数据
  const icoHeader = Buffer.from([
    0x00, 0x00, // Reserved (must be 0)
    0x01, 0x00, // Type (1 = ICO)
    0x01, 0x00, // Number of images
  ]);
  
  // 图标目录条目 (16x16)
  const iconDirEntry = Buffer.from([
    16, 0,      // Width (16)
    16, 0,      // Height (16)
    0,          // Color palette (0 = no palette)
    0,          // Reserved
    1, 0,       // Color planes
    32, 0,      // Bits per pixel
    0, 0, 0, 0, // Image data size (will be calculated)
    22, 0, 0, 0 // Image data offset
  ]);
  
  // 创建一个简单的 16x16 图标数据 (PNG 格式)
  // 这里我们使用一个简单的蓝色方块作为示例
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x10, // 16x16
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0xF3, 0xFF, // 8-bit RGBA
    0x61, 0x00, 0x00, 0x00, 0x19, 0x74, 0x45, 0x58, // tEXt chunk
    0x74, 0x53, 0x6F, 0x66, 0x74, 0x77, 0x61, 0x72,
    0x65, 0x00, 0x41, 0x64, 0x6F, 0x62, 0x65, 0x20,
    0x49, 0x6D, 0x61, 0x67, 0x65, 0x52, 0x65, 0x61,
    0x64, 0x79, 0x71, 0xC9, 0x65, 0x3C, 0x00, 0x00,
    0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C,
    0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01,
    0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82  // IEND chunk
  ]);
  
  // 更新图标目录中的图像数据大小
  iconDirEntry.writeUInt32LE(pngData.length, 8);
  
  // 组合 ICO 文件
  const icoFile = Buffer.concat([icoHeader, iconDirEntry, pngData]);
  
  // 写入文件
  fs.writeFileSync(faviconPath, icoFile);
  
  console.log('✅ Created basic favicon.ico');
  console.log('📝 Note: This is a basic ICO file. For best results, use a proper ICO generator.');
}

// 更好的解决方案：使用现有的 PNG 文件作为 favicon
function usePngAsFavicon() {
  const publicDir = path.join(__dirname, '../public');
  const sourcePng = path.join(publicDir, 'logo.png');
  const faviconPath = path.join(publicDir, 'favicon.ico');
  
  if (fs.existsSync(sourcePng)) {
    // 直接复制 PNG 文件作为 favicon.ico
    // 现代浏览器可以处理 PNG 格式的 favicon
    fs.copyFileSync(sourcePng, faviconPath);
    console.log('✅ Copied logo.png as favicon.ico');
    console.log('📝 Modern browsers can handle PNG format favicons');
  } else {
    console.log('❌ logo.png not found');
  }
}

// 运行
console.log('🔧 Creating favicon.ico...');
usePngAsFavicon();
