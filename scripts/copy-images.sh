#!/bin/bash

echo "开始复制图片文件..."

# 复制按文章维度组织的图片目录
echo "复制按文章维度组织的图片..."
cp -r content/static/gaming-websites public/blogs/ 2>/dev/null || true
cp -r content/static/geography-websites public/blogs/ 2>/dev/null || true
cp -r content/static/magical-websites public/blogs/ 2>/dev/null || true

# 处理 Velite 生成的带哈希值的文件
echo "处理 Velite 生成的带哈希值的文件..."
if [ -f "public/blogs/geography-websites/01-zoom-earth-3e476208.webp" ]; then
    cp public/blogs/geography-websites/01-zoom-earth-3e476208.webp public/blogs/geography-websites/01-zoom-earth.webp 2>/dev/null || true
fi

# 验证关键图片文件是否存在
echo "验证图片文件..."
required_files=(
    "public/blogs/gaming-websites/01-bruno-simon.webp"
    "public/blogs/gaming-websites/02-cross-road-chicken.webp"
    "public/blogs/gaming-websites/03-pcol-snooker.webp"
    "public/blogs/gaming-websites/04-red-alert.webp"
    "public/blogs/gaming-websites/05-flappy-musk.webp"
    "public/blogs/gaming-websites/06-hyperbolic-sokoban.webp"
    "public/blogs/gaming-websites/07-armed-dinosaur.webp"
    "public/blogs/gaming-websites/08-blocks.webp"
    "public/blogs/geography-websites/01-zoom-earth.webp"
    "public/blogs/geography-websites/02-gta-geography.webp"
    "public/blogs/geography-websites/03-geographic-names.webp"
    "public/blogs/geography-websites/04-satellite-map.webp"
    "public/blogs/geography-websites/05-ufo-stalker.webp"
    "public/blogs/geography-websites/06-gpsjam.webp"
    "public/blogs/geography-websites/07-earthquake-info.webp"
    "public/blogs/geography-websites/08-chinese-provinces.webp"
    "public/blogs/magical-websites/01-longshot.webp"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 缺失"
    fi
done

echo "图片复制完成！"
