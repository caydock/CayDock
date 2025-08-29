#!/bin/bash

echo "开始按照文章维度重新组织图片..."

# 创建新的静态目录结构
mkdir -p content/static/gaming-websites
mkdir -p content/static/geography-websites
mkdir -p content/static/magical-websites

echo "复制游戏网站文章相关图片..."
# 游戏网站文章的图片
cp content/static/bruno-simon-com/cover.webp content/static/gaming-websites/01-bruno-simon.webp 2>/dev/null || true
cp content/static/cross-road-eight-vercel-app/cover.webp content/static/gaming-websites/02-cross-road-chicken.webp 2>/dev/null || true
cp content/static/screenshot_www_heyzxz_me_1743754410495.webp content/static/gaming-websites/03-pcol-snooker.webp 2>/dev/null || true
cp content/static/screenshot_ra2web_com_1742095785686.webp content/static/gaming-websites/04-red-alert.webp 2>/dev/null || true
cp content/static/www-flappymusk-xyz/cover.webp content/static/gaming-websites/05-flappy-musk.webp 2>/dev/null || true
cp content/static/sokyokuban-com/cover.webp content/static/gaming-websites/06-hyperbolic-sokoban.webp 2>/dev/null || true
cp content/static/screenshot_dinoswords_gg_1742716132275.webp content/static/gaming-websites/07-armed-dinosaur.webp 2>/dev/null || true
cp content/static/blocks-ovh/cover.webp content/static/gaming-websites/08-blocks.webp 2>/dev/null || true

echo "复制地理网站文章相关图片..."
# 地理网站文章的图片
cp content/static/screenshot_zoom_earth_1742634544844.webp content/static/geography-websites/01-zoom-earth.webp 2>/dev/null || true
cp content/static/screenshot-20250315141253.webp content/static/geography-websites/02-gta-geography.webp 2>/dev/null || true
cp content/static/screenshot-20250315142210.webp content/static/geography-websites/03-geographic-names.webp 2>/dev/null || true
cp content/static/screenshot-20250315145446.webp content/static/geography-websites/04-satellite-map.webp 2>/dev/null || true
cp content/static/screenshot-20250315150135.webp content/static/geography-websites/05-ufo-stalker.webp 2>/dev/null || true
cp content/static/screenshot-20250315150908.webp content/static/geography-websites/06-gpsjam.webp 2>/dev/null || true
cp content/static/screenshot-20250315151307.webp content/static/geography-websites/07-earthquake-info.webp 2>/dev/null || true
cp content/static/screenshot-20250315134157.webp content/static/geography-websites/08-chinese-provinces.webp 2>/dev/null || true

echo "复制神奇网站文章相关图片..."
# 神奇网站文章的图片
cp content/static/longshot20250216202758.jpg content/static/magical-websites/01-longshot.webp 2>/dev/null || true

echo "更新 MDX 文件中的图片路径..."

# 更新游戏网站文章的图片路径
sed -i '' 's|/static/bruno-simon-com/cover.webp|/static/gaming-websites/01-bruno-simon.webp|g' content/blogs/8-fun-gaming-websites-collection/index.mdx
sed -i '' 's|/static/cross-road-eight-vercel-app/cover.webp|/static/gaming-websites/02-cross-road-chicken.webp|g' content/blogs/8-fun-gaming-websites-collection/index.mdx
sed -i '' 's|/static/screenshot_www_heyzxz_me_1743754410495.webp|/static/gaming-websites/03-pcol-snooker.webp|g' content/blogs/8-fun-gaming-websites-collection/index.mdx
sed -i '' 's|/static/screenshot_ra2web_com_1742095785686.webp|/static/gaming-websites/04-red-alert.webp|g' content/blogs/8-fun-gaming-websites-collection/index.mdx
sed -i '' 's|/static/www-flappymusk-xyz/cover.webp|/static/gaming-websites/05-flappy-musk.webp|g' content/blogs/8-fun-gaming-websites-collection/index.mdx
sed -i '' 's|/static/sokyokuban-com/cover.webp|/static/gaming-websites/06-hyperbolic-sokoban.webp|g' content/blogs/8-fun-gaming-websites-collection/index.mdx
sed -i '' 's|/static/screenshot_dinoswords_gg_1742716132275.webp|/static/gaming-websites/07-armed-dinosaur.webp|g' content/blogs/8-fun-gaming-websites-collection/index.mdx
sed -i '' 's|/static/blocks-ovh/cover.webp|/static/gaming-websites/08-blocks.webp|g' content/blogs/8-fun-gaming-websites-collection/index.mdx

# 更新地理网站文章的图片路径
sed -i '' 's|/static/screenshot_zoom_earth_1742634544844.webp|/static/geography-websites/01-zoom-earth.webp|g' content/blogs/geography-enthusiasts-interesting-websites/index.mdx
sed -i '' 's|/static/screenshot-20250315141253.webp|/static/geography-websites/02-gta-geography.webp|g' content/blogs/geography-enthusiasts-interesting-websites/index.mdx
sed -i '' 's|/static/screenshot-20250315142210.webp|/static/geography-websites/03-geographic-names.webp|g' content/blogs/geography-enthusiasts-interesting-websites/index.mdx
sed -i '' 's|/static/screenshot-20250315145446.webp|/static/geography-websites/04-satellite-map.webp|g' content/blogs/geography-enthusiasts-interesting-websites/index.mdx
sed -i '' 's|/static/screenshot-20250315150135.webp|/static/geography-websites/05-ufo-stalker.webp|g' content/blogs/geography-enthusiasts-interesting-websites/index.mdx
sed -i '' 's|/static/screenshot-20250315150908.webp|/static/geography-websites/06-gpsjam.webp|g' content/blogs/geography-enthusiasts-interesting-websites/index.mdx
sed -i '' 's|/static/screenshot-20250315151307.webp|/static/geography-websites/07-earthquake-info.webp|g' content/blogs/geography-enthusiasts-interesting-websites/index.mdx
sed -i '' 's|/static/screenshot-20250315134157.webp|/static/geography-websites/08-chinese-provinces.webp|g' content/blogs/geography-enthusiasts-interesting-websites/index.mdx

# 更新神奇网站文章的图片路径
sed -i '' 's|/static/longshot20250216202758.jpg|/static/magical-websites/01-longshot.webp|g' content/blogs/8-magical-websites-with-superlatives/index.mdx

echo "图片重新组织完成！"
echo ""
echo "新的目录结构："
echo "content/static/"
echo "├── gaming-websites/     # 游戏网站文章图片"
echo "├── geography-websites/  # 地理网站文章图片"
echo "└── magical-websites/    # 神奇网站文章图片"
