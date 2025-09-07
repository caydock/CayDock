---
title: "Web Rendering and Performance Optimization"
date: 2018-06-23 16:21:35
draft: false
lang: en
translationKey: "web-rendering-performance-optimization"
---

As a web development engineer, developing a web page is simple, but developing a high-performance web page with fast loading speed is not so simple. It involves many aspects, such as server response, client loading, rendering, developer code organization, etc. Many factors can make your page performance poor. Today, based on my recent learning, I will focus on summarizing client-side rendering-related optimization suggestions and related principles.

## Browser Rendering Process

The browser rendering process is very complex. If you want to explain it clearly, you could write a book, such as "WebKit Technology Insider." But to make a long story short, the browser rendering process can be summarized into the following steps:

1. **DOM Tree Generation**: Loaded from the network to the browser locally, processed by the HTML parser to generate the DOM Tree
2. **CSS Rule Generation**: CSS stylesheets are processed and calculated by the CSS parser to generate final CSS rules
3. **JavaScript Parsing and Execution**: Since browser rendering is single-threaded, JavaScript parsing and execution occurs during the browser's HTML parsing process, including lexical analysis, abstract syntax tree, bytecode, and native code generation
4. **Layout Generation**: DOM Tree and CSS rules are combined through layout style calculations to form the RenderTree
5. **Painting**: Based on the calculated RenderTree, paint each element's size, border, position, shadow, and other effects. The painting process is layered, such as images and some Transform effects being painted on different layers
6. **Compositing**: Merge the painted layers for final rendering, ultimately reflected in screen pixels

So in these steps, how can we optimize to achieve better performance improvements?

## Performance Optimization Recommendations

In the page rendering process, steps 1-3 may only execute once, but steps 4-6 execute at least once. So for better performance, we should minimize the triggering of subsequent rendering.

### 1. **DOM Tree Generation Stage**
- **Minimize DOM hierarchy** - Reduce nested elements
- **Avoid deep nesting** - Keep DOM structure flat
- **Use semantic HTML** - Proper HTML elements for better parsing
- **Minimize DOM manipulation** - Batch DOM changes

```html
<!-- Bad: Deep nesting -->
<div>
  <div>
    <div>
      <div>
        <span>Content</span>
      </div>
    </div>
  </div>
</div>

<!-- Good: Flat structure -->
<div class="container">
  <span class="content">Content</span>
</div>
```

### 2. **CSS Rule Generation Stage**
- **Simplify CSS rules** - Reduce complexity for faster parsing
- **Minimize selectors** - Use efficient CSS selectors
- **Avoid complex calculations** - Simplify CSS properties
- **Use CSS preprocessors** - Organize and optimize CSS

```css
/* Bad: Complex selector */
div > ul > li:nth-child(odd) > a:hover {
  color: red;
}

/* Good: Simple selector */
.nav-link:hover {
  color: red;
}
```

### 3. **JavaScript Parsing and Execution Stage**
- **Optimize code execution** - Improve algorithm efficiency
- **Use Web Workers** - Move heavy computations off the main thread
- **Avoid blocking operations** - Use asynchronous patterns
- **Minimize JavaScript bundle size** - Code splitting and tree shaking

```javascript
// Bad: Blocking operation
function heavyComputation() {
  for (let i = 0; i < 1000000; i++) {
    // Heavy computation
  }
}

// Good: Use Web Worker
const worker = new Worker('heavy-computation.js');
worker.postMessage({ data: 'process this' });
```

### 4. **Layout and Painting Optimization**
- **Minimize reflows** - Avoid layout thrashing
- **Use CSS transforms** - Hardware-accelerated animations
- **Optimize repaints** - Reduce visual changes
- **Use will-change** - Hint browser about upcoming changes

```css
/* Good: Hardware acceleration */
.animated-element {
  transform: translateX(100px);
  will-change: transform;
}

/* Bad: Causes reflow */
.animated-element {
  left: 100px;
}
```

## Advanced Optimization Techniques

### 1. **Critical Rendering Path Optimization**
```html
<!-- Inline critical CSS -->
<style>
  .above-fold { /* Critical styles */ }
</style>

<!-- Defer non-critical CSS -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### 2. **Resource Loading Optimization**
```html
<!-- Preload important resources -->
<link rel="preload" href="hero-image.jpg" as="image">
<link rel="preload" href="critical-font.woff2" as="font" type="font/woff2" crossorigin>

<!-- Lazy load non-critical resources -->
<img src="placeholder.jpg" data-src="actual-image.jpg" loading="lazy">
```

### 3. **JavaScript Optimization**
```javascript
// Code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Tree shaking
import { specificFunction } from 'large-library';

// Bundle optimization
import { debounce } from 'lodash/debounce';
```

### 4. **CSS Optimization**
```css
/* Use efficient selectors */
.button { /* Class selector - fast */ }
#header { /* ID selector - fast */ }
div > p { /* Child selector - moderate */ }
div p { /* Descendant selector - slower */ }

/* Avoid expensive properties */
.expensive {
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  border-radius: 10px;
  filter: blur(5px);
}
```

## Performance Monitoring

### 1. **Core Web Vitals**
- **Largest Contentful Paint (LCP)** - Loading performance
- **First Input Delay (FID)** - Interactivity
- **Cumulative Layout Shift (CLS)** - Visual stability

### 2. **Performance APIs**
```javascript
// Measure performance
performance.mark('start');
// ... code execution ...
performance.mark('end');
performance.measure('execution', 'start', 'end');

// Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 3. **Browser DevTools**
- **Performance tab** - Analyze rendering performance
- **Network tab** - Monitor resource loading
- **Lighthouse** - Comprehensive performance audit
- **Coverage tab** - Identify unused code

## Best Practices

### 1. **HTML Optimization**
```html
<!-- Use semantic HTML -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<!-- Minimize DOM nodes -->
<div class="container">
  <h1>Title</h1>
  <p>Content</p>
</div>
```

### 2. **CSS Optimization**
```css
/* Use efficient selectors */
.button { color: blue; }
.button:hover { color: red; }

/* Minimize reflows */
.animated {
  transform: translateX(100px);
  will-change: transform;
}

/* Use CSS containment */
.isolated {
  contain: layout style paint;
}
```

### 3. **JavaScript Optimization**
```javascript
// Use requestAnimationFrame for animations
function animate() {
  // Animation code
  requestAnimationFrame(animate);
}

// Debounce expensive operations
const debouncedResize = debounce(() => {
  // Resize handling
}, 250);

// Use Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
    }
  });
});
```

### 4. **Image Optimization**
```html
<!-- Use modern formats -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>

<!-- Responsive images -->
<img srcset="small.jpg 480w, large.jpg 800w" 
     sizes="(max-width: 600px) 480px, 800px"
     src="large.jpg" alt="Description">
```

## Tools and Techniques

### 1. **Build Tools**
- **Webpack** - Module bundling and optimization
- **Rollup** - Tree shaking and code splitting
- **Parcel** - Zero-configuration bundling
- **Vite** - Fast development and building

### 2. **Performance Tools**
- **Lighthouse** - Performance auditing
- **WebPageTest** - Detailed performance analysis
- **Chrome DevTools** - Browser-based debugging
- **Bundle Analyzer** - Bundle size analysis

### 3. **Optimization Libraries**
- **Lodash** - Utility functions with tree shaking
- **Moment.js** - Date manipulation (consider alternatives)
- **Axios** - HTTP client with request/response interceptors
- **React.memo** - Component memoization

## Conclusion

Web rendering and performance optimization is a complex topic that requires understanding of:

1. **Browser rendering process** - How browsers process and display content
2. **Critical rendering path** - The sequence of steps to render a page
3. **Performance bottlenecks** - Common issues that slow down rendering
4. **Optimization techniques** - Strategies to improve performance
5. **Monitoring and measurement** - Tools to track performance

### Key Takeaways:

1. **Minimize DOM complexity** - Keep HTML structure simple
2. **Optimize CSS selectors** - Use efficient selectors
3. **Use Web Workers** - Move heavy computations off the main thread
4. **Minimize reflows and repaints** - Use CSS transforms and will-change
5. **Monitor performance** - Use tools to measure and track improvements
6. **Optimize resources** - Compress, minify, and lazy load assets
7. **Use modern techniques** - Leverage new web APIs and features

### Performance Goals:

- **LCP < 2.5s** - Fast loading
- **FID < 100ms** - Responsive interactions
- **CLS < 0.1** - Stable layout
- **TTFB < 600ms** - Quick server response

By understanding the browser rendering process and applying these optimization techniques, developers can create web applications that load quickly, respond smoothly, and provide an excellent user experience. The key is to measure performance, identify bottlenecks, and apply targeted optimizations based on real data.