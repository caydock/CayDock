#!/bin/bash

echo "开始复制图片文件..."

# 复制图片目录
echo "复制图片目录..."
cp -r content/static/bruno-simon-com public/blogs/ 2>/dev/null || true
cp -r content/static/cross-road-eight-vercel-app public/blogs/ 2>/dev/null || true
cp -r content/static/sokyokuban-com public/blogs/ 2>/dev/null || true
cp -r content/static/blocks-ovh public/blogs/ 2>/dev/null || true
cp -r content/static/www-flappymusk-xyz public/blogs/ 2>/dev/null || true

# 复制单个图片文件
echo "复制单个图片文件..."
cp content/static/screenshot_www_heyzxz_me_1743754410495.webp public/blogs/ 2>/dev/null || true
cp content/static/screenshot_ra2web_com_1742095785686.webp public/blogs/ 2>/dev/null || true
cp content/static/screenshot_dinoswords_gg_1742716132275.webp public/blogs/ 2>/dev/null || true

# 复制地理文章图片
echo "复制地理文章图片..."
cp content/static/screenshot-20250315141253.webp public/blogs/ 2>/dev/null || true
cp content/static/screenshot-20250315142210.webp public/blogs/ 2>/dev/null || true
cp content/static/screenshot-20250315145446.webp public/blogs/ 2>/dev/null || true
cp content/static/screenshot-20250315150135.webp public/blogs/ 2>/dev/null || true
cp content/static/screenshot-20250315150908.webp public/blogs/ 2>/dev/null || true
cp content/static/screenshot-20250315151307.webp public/blogs/ 2>/dev/null || true
cp content/static/screenshot-20250315134157.webp public/blogs/ 2>/dev/null || true

# 处理 Velite 生成的带哈希值的文件
echo "处理 Velite 生成的带哈希值的文件..."
if [ -f "public/blogs/screenshot_zoom_earth_1742634544844-3e476208.webp" ]; then
    cp public/blogs/screenshot_zoom_earth_1742634544844-3e476208.webp public/blogs/screenshot_zoom_earth_1742634544844.webp 2>/dev/null || true
fi

# 验证关键图片文件是否存在
echo "验证图片文件..."
required_files=(
    "public/blogs/screenshot-20250315141253.webp"
    "public/blogs/screenshot-20250315142210.webp"
    "public/blogs/screenshot-20250315145446.webp"
    "public/blogs/screenshot-20250315150135.webp"
    "public/blogs/screenshot-20250315150908.webp"
    "public/blogs/screenshot-20250315151307.webp"
    "public/blogs/screenshot-20250315134157.webp"
    "public/blogs/screenshot_ra2web_com_1742095785686.webp"
    "public/blogs/screenshot_www_heyzxz_me_1743754410495.webp"
    "public/blogs/screenshot_dinoswords_gg_1742716132275.webp"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 缺失"
    fi
done

echo "图片复制完成！"
