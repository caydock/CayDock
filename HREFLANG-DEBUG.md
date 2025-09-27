# Hreflang 配置调试指南

## 🔍 **问题分析**

您看到的 HTML 输出：
```html
<link rel="canonical" href="https://w3cay.com"/>
<link rel="alternate" hrefLang="en" href="https://w3cay.com"/>
<link rel="alternate" hrefLang="zh-cn" href="https://w3cay.com"/>
```

## 🚨 **问题所在**

1. **属性名错误**：`hrefLang` → 应该是 `hreflang`
2. **URL 错误**：都指向 `https://w3cay.com` → 应该指向具体的语言版本
3. **缺少 x-default**：需要添加默认语言版本

## ✅ **正确的配置应该是**

```html
<link rel="canonical" href="https://w3cay.com/en/"/>
<link rel="alternate" hreflang="en" href="https://w3cay.com/en/"/>
<link rel="alternate" hreflang="zh-cn" href="https://w3cay.com/zh-cn/"/>
<link rel="alternate" hreflang="x-default" href="https://w3cay.com/en/"/>
```

## 🔧 **已修复的配置**

### **1. 根布局 (src/app/layout.js)**
- ✅ 移除了 hreflang 配置（避免冲突）

### **2. 多语言布局 (src/app/[locale]/layout.js)**
- ✅ 添加了正确的 hreflang 生成逻辑
- ✅ 包含 x-default 配置
- ✅ 使用正确的语言代码

## 🧪 **测试方法**

### **1. 开发环境测试**
```bash
# 启动开发服务器
npm run dev

# 访问页面并查看源代码
# 英文页面：http://localhost:3000/en/
# 中文页面：http://localhost:3000/zh-cn/
```

### **2. 生产环境测试**
```bash
# 检查英文页面
curl -s "https://w3cay.com/en/" | grep -E "(canonical|hreflang)"

# 检查中文页面
curl -s "https://w3cay.com/zh-cn/" | grep -E "(canonical|hreflang)"
```

### **3. 浏览器开发者工具**
1. 打开页面
2. 右键 → 查看页面源代码
3. 搜索 "hreflang" 或 "canonical"

## 📊 **预期输出**

### **英文页面 (/en/)**
```html
<link rel="canonical" href="https://w3cay.com/en/"/>
<link rel="alternate" hreflang="en" href="https://w3cay.com/en/"/>
<link rel="alternate" hreflang="zh-cn" href="https://w3cay.com/zh-cn/"/>
<link rel="alternate" hreflang="x-default" href="https://w3cay.com/en/"/>
```

### **中文页面 (/zh-cn/)**
```html
<link rel="canonical" href="https://w3cay.com/zh-cn/"/>
<link rel="alternate" hreflang="en" href="https://w3cay.com/en/"/>
<link rel="alternate" hreflang="zh-cn" href="https://w3cay.com/zh-cn/"/>
<link rel="alternate" hreflang="x-default" href="https://w3cay.com/en/"/>
```

## 🚀 **如果问题仍然存在**

### **1. 清除缓存**
```bash
# 清除 Next.js 缓存
rm -rf .next

# 重新启动开发服务器
npm run dev
```

### **2. 检查浏览器缓存**
- 硬刷新页面 (Ctrl+F5 或 Cmd+Shift+R)
- 清除浏览器缓存
- 使用无痕模式测试

### **3. 检查部署状态**
- 确保代码已部署到生产环境
- 检查 CDN 缓存是否已清除

## 🔍 **调试步骤**

1. **确认页面**：您是在哪个页面看到错误的 HTML？
2. **确认环境**：开发环境还是生产环境？
3. **确认缓存**：是否清除了所有缓存？
4. **确认部署**：代码是否已正确部署？

## 📞 **如果问题持续**

请提供以下信息：
1. 具体的页面 URL
2. 完整的 HTML 输出
3. 开发环境还是生产环境
4. 浏览器类型和版本
