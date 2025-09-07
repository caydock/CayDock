---
title: "Web Loading Speed Optimization Checklist"
date: 2018-09-01T15:57:23+08:00
draft: false
description: "Web page loading speed optimization tips and best practices to improve user experience"
tags: ["Web optimization", "performance optimization", "loading speed", "frontend"]
categories: ["Frontend Development"]
featured: true
featuredImage: "cover-web.svg"
language: en
---

Web page loading speed is an important standard for measuring the quality of a web page. The abandonment rate of web pages increases with the increase of web page loading time. It is said that nearly half of users hope that web page loading time does not exceed 2s, and generally abandon the web page if it exceeds 3s. Time is life, who is willing to wait for no reason +1s, so today I'll organize how to speed up web pages specifically.

### HTML
- **Compress HTML:** HTML code compression, remove comments, spaces and newlines from production files.

    *Why:*
    > Removing all unnecessary spaces, comments and line breaks will reduce the size of HTML, speed up the page loading time of the website, and significantly reduce the user's download time.

    *How:*
    > Most frameworks have plugins to compress the size of web pages. You can use a set of NPM modules that can automatically do the work.

    * 🛠 [HTML minifier | Minify Code](http://minifycode.com/html-minifier/)
    * 📖 [Experimenting with HTML minifier — Perfection Kills](http://perfectionkills.com/experimenting-with-html-minifier/#use_short_doctype)

- **Remove unnecessary comments:** Make sure to remove comments from your web pages.

    *Why:*
    > Comments are useless to users and should be removed from production files. One case where comments might need to be kept is: keeping the origin for a library.

    *How:*
    > In most cases, you can use HTML minify plugins to remove comments.

 * 🛠 [remove-html-comments - npm](https://www.npmjs.com/package/remove-html-comments)

- **Remove unnecessary attributes:** Attributes like `type="text/javascript"` or `type="text/css"` should be removed.

    ``` html
    <!-- Before HTML5 -->
    <script type="text/javascript">
        // Javascript code
    </script>

    <!-- Today -->
    <script>
        // Javascript code
    </script>
    ```

    *Why*
    > Type attributes are not required because HTML5 uses text/css and text/javascript as default values. Useless code should be removed from websites or applications because they increase the size of web pages.

    *How:*
    > ⁃ Make sure all link and script tags have no type attributes.

    * 📖 [The Script Tag | CSS-Tricks](https://css-tricks.com/the-script-tag/)
   
- **Reference CSS tags before JavaScript references:** Make sure CSS is loaded before using JavaScript code.

    *Why:*
    > Referencing CSS before JavaScript enables better parallel downloading, thus speeding up browser rendering.

    *How:*
    > Make sure link and style in head are always before script.

- **Minimize the number of iframes:** Only use iframes when there is no other technical feasibility. Try to avoid using iframes.

- **DNS prefetch:** A DNS query time is roughly between 60-120ms or longer, resolve possible network connection domain names in web pages in advance
    ``` html
     <link rel="dns-prefetch" href="http://example.com/">
    ```

### CSS

-  **Compression:** All CSS files need to be compressed, remove comments, spaces and empty lines from production files.

    *Why:*
    > After minifying CSS files, content loads faster and less data is sent to the client, so minifying CSS files in production is very important, which is beneficial to users, just like any enterprise wants to reduce bandwidth costs and resources.

    *How:*
    > Use tools to automatically compress files before building or deploying.

    * 🛠 [cssnano: A modular minifier based on the PostCSS ecosystem.](https://cssnano.co/)
    * 🛠 [@neutrinojs/style-minify - npm](https://www.npmjs.com/package/@neutrinojs/style-minify)

-  **Concatenation:** CSS file merging (not very effective for HTTP/2).

    ``` html

    <!-- Not recommended -->
    <link rel="stylesheet" href="foo.css"/>
    <link rel="stylesheet" href="bar.css"/>

    <!-- Recommended -->
    <link rel="stylesheet" href="foobar.css"/>
    ```

    *Why:*
    > If you're still using HTTP/1, then you need to merge your files. However, this is not necessary when using HTTP/2 (effectiveness to be tested).

    *How:*
    > Use online tools or other plugins to merge files before building or deploying.
    > Of course, make sure the project can run normally after merging files.

    * 📖 [HTTP: Optimizing Application Delivery - High Performance Browser Networking (O'Reilly)](https://hpbn.co/optimizing-application-delivery/#optimizing-for-http2)
    * 📖 [Performance Best Practices for the HTTP/2 Era](https://deliciousbrains.com/performance-best-practices-http2/)

-  **Non-blocking:** CSS files need to be introduced non-blocking to prevent DOM from taking more time to render.

    ``` html
    <link rel="preload" href="global.min.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="global.min.css"></noscript>
    ```

    *Why:*
    > CSS files can block page loading and delay page rendering. Using `preload` can actually load CSS files before the browser starts displaying page content.

    *How:*
    > Need to add `rel` attribute and assign `preload`, and add `as="style"` on `<link>` element.

    * 📖 [loadCSS by filament group](https://github.com/filamentgroup/loadCSS)
    * 📖 [Example of preloading CSS with loadCSS](https://gist.github.com/thedaviddias/c24763b82b9991e53928e66a0bafc9bf)
    * 📖 [Preloading content with rel="preload"](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)
    * 📖 [Preload: What Is It Good For? — Smashing Magazine](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)

-  **CSS class length:** The length of classes will have a (slight) impact on HTML and CSS files.

    *Why:*
    > Even performance impact is debatable, the naming strategy of the project will have a significant impact on the maintainability of stylesheets. If using BEM, you might write longer class names than necessary in some cases. It's important to choose names and namespaces wisely.

    *How:*
    > Some people might be more concerned about class name length, but dividing the website by components can help reduce the number and length of class names.

    * 🛠 [long vs short class · jsPerf](https://jsperf.com/long-vs-short-class)

-  **Unused CSS:** Remove unused CSS selectors.

    *Why:*
    > Removing unused CSS selectors can reduce file size and improve resource loading speed.

    *How:*
    > ⚠️ Check if the CSS framework you want to use already includes reset/normalize code, you might not need the content in reset/normalize files.

    * 🛠 [UnCSS Online](https://uncss-online.com/)
    * 🛠 [PurifyCSS](https://github.com/purifycss/purifycss)
    * 🛠 [PurgeCSS](https://github.com/FullHuman/purgecss)
    * 🛠 [Chrome DevTools Coverage](https://developers.google.com/web/updates/2017/04/devtools-release-notes#coverage)

###  JavaScript

-  **JS compression:** All JavaScript files should be compressed, remove comments, spaces and empty lines in production environment (still effective in HTTP/2).

    *Why:*
    > Removing all unnecessary spaces, comments and empty lines will reduce the size of JavaScript files and speed up the page loading time of the website, improving user experience.

    *How:*
    > It is recommended to use the following tools to automatically minify files before building or deploying.

    * 📖 [uglify-js - npm](https://www.npmjs.com/package/uglify-js)
    * 📖 [Short read: How is HTTP/2 different? Should we still minify and concatenate?](https://scaleyourcode.com/blog/article/28)

-  **Non-blocking JavaScript:** Use defer attribute or use async to load JavaScript files asynchronously.

    ``` html
    <!-- Defer Attribute -->
    <script defer src="foo.js">

    <!-- Async Attribute -->
    <script async src="foo.js">
    ```

    *Why:*
    > JavaScript blocks the normal parsing of HTML documents, so when the parser reaches a script tag (especially inside <head>), it stops parsing and executes the script. If your script is at the top of the page, it is strongly recommended to add `async` and `defer`, but if loaded before the </body> tag, there is not much impact. However, using these attributes to avoid performance issues is a good practice.

    *How:*
    > Add `async` (if the script doesn't depend on other scripts) or `defer` (if the script depends on or depends on async scripts) as attributes of script tags.
    > If there are small scripts, you can use inline scripts above async scripts.

    * 📖 [Remove Render-Blocking JavaScript](https://developers.google.com/speed/docs/insights/BlockingJS)

-  **Use tree shaking technology to reduce js size:** Analyze JavaScript code through build tools and remove unused js modules or methods in production environment

    * 📖 [Reduce JavaScript Payloads with Tree Shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/)

-  **Use code splitting for package loading js:** Reduce the time required for initial loading through package splitting
    
    *How:*
    > **Vendor splitting** Split modules according to library files, for example React or lodash packaged separately into one file
    > **Entry point splitting** Split modules according to entry points, for example split through multi-page application entries or single-page application routes
    > **Dynamic splitting** Split modules according to dynamic loading, use dynamic loading syntax ```import()``` to achieve on-demand module loading

    * 📖 [Reduce JavaScript Payloads with Tree Shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/code-splitting/) 

###  Image Resources

 * 📖 [Image Bytes in 2018](https://httparchive.org/reports/page-weight#bytesImg)

*  **Image optimization:** Optimize images while ensuring that compressed images meet product requirements.

    *Why:*
    > Optimized images load faster in browsers and consume less data.

    *How:*
    > Try to use CSS3 effects as much as possible (instead of replacing with small images)
    > Use font images as much as possible
    > Use SVG
    > Use compilation tools and specify compression level below 85.

    * 📖 [Image Optimization | Web Fundamentals | Google Developers](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization)
    * 🛠 [TinyJPG – Compress JPEG images intelligently](https://tinyjpg.com/)
    * 🛠 [Kraken.io - Online Image Optimizer](https://kraken.io/web-interface)
    * 🛠 [Compressor.io - optimize and compress JPEG photos and PNG images](https://compressor.io/compress)
    * 🛠 [Cloudinary - Image Analysis Tool](https://webspeedtest.cloudinary.com/)

*  **Image format:** Choose appropriate image formats.

    *Why:*
    > Make sure images don't slow down the website
        
    *How:*
    > Use [Lighthouse](https://developers.google.com/web/tools/lighthouse/) to identify which images can use next-generation image formats (such as JPEG 2000m JPEG XR or WebP).
    > Compare different formats, sometimes using PNG8 is better than PNG16, sometimes not.

    * 📖 [Serve Images in Next-Gen Formats  |  Tools for Web Developers  |  Google Developers](https://developers.google.com/web/tools/lighthouse/audits/webp)
    * 📖 [What Is the Right Image Format for Your Website? — SitePoint](https://www.sitepoint.com/what-is-the-right-image-format-for-your-website/)
     * 📖 [PNG8 - The Clear Winner — SitePoint](https://www.sitepoint.com/png8-the-clear-winner/)
     * 📖 [8-bit vs 16-bit - What Color Depth You Should Use And Why It Matters - DIY Photography](https://www.diyphotography.net/8-bit-vs-16-bit-color-depth-use-matters/)

-  **Use vector images VS raster/bitmap:** If possible, recommend using vector images instead of bitmap images.

    *Why:*
    > Vector images (SVG) tend to be smaller than images, with responsive and perfect scaling features. And these images can be animated and modified through CSS.

*  **Image dimensions:** If the final rendered image size is known, set width and height attributes on <img>.

    *Why:*
    > If height and width are set, the space required for the image will be reserved when loading the page. Without these attributes, the browser doesn't know the size of the image and can't reserve appropriate space for it, causing page layout changes during loading.

*  **Avoid using Base64 images:** You can convert tiny images to base64, but it's actually not the best practice.

    * 📖 [Base64 Encoding & Performance, Part 1 and 2 by Harry Roberts](https://csswizardry.com/2017/02/base64-encoding-and-performance/)
    * 📖 [A closer look at Base64 image performance – The Page Not Found Blog](http://www.andygup.net/a-closer-look-at-base64-image-performance/)
    * 📖 [When to base64 encode images (and when not to) | David Calhoun](https://www.davidbcalhoun.com/2011/when-to-base64-encode-images-and-when-not-to/)
   * 📖 [Base64 encoding images for faster pages | Performance and seo factors](https://varvy.com/pagespeed/base64-images.html)

*  **Lazy loading:** Image lazy loading (always provide noscript as fallback).

    *Why:*
    > It can improve the response time of the current page and avoid loading some images that users might not need or are unnecessary.

    *How:*
    > Use [Lighthouse](https://developers.google.com/web/tools/lighthouse/) to identify the number of off-screen images.
    > Use JavaScript plugins for lazy loading images.

    * 🛠 [verlok/lazyload: Github](https://github.com/verlok/lazyload)
    * 📖 [Lazy Loading Images and Video  |  Web Fundamentals  |  Google Developers](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/)
    * 📖 [5 Brilliant Ways to Lazy Load Images For Faster Page Loads - Dynamic Drive Blog](http://blog.dynamicdrive.com/5-brilliant-ways-to-lazy-load-images-for-faster-page-loads/)

*  **Responsive images:** Make sure to provide images close to the device display size.

    *Why:*
    > Small devices don't need images larger than the viewport. It's recommended to use multiple versions of one image at different sizes.

    *How:*
    > Set different sized images for different devices.
    > Use srcset and picture to provide multiple variants for each image.

     * 📖 [Responsive images - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

###  Service Deployment

-  **Page size < 1500 KB:** (Ideally < 500 KB) Minimize the size of pages and resources as much as possible.

    *Why:*
    > Ideally, you should try to keep page size <500 KB, but the median web page size is about 1500 KB (even on mobile devices). Depending on your target users, connection speed, and devices, it's very important to minimize page size to get the best user experience possible.

    *How:*
    > All rules in the frontend performance checklist will help you minimize resources and code as much as possible.

    * 📖 [Page Weight](https://httparchive.org/reports/page-weight#bytesTotal)
    * 🛠 [What Does My Site Cost?](https://whatdoesmysitecost.com/)

*  **Cookie size:** If you use cookies, make sure each cookie does not exceed 4096 bytes and no more than 20 cookies under one domain.

    *Why:*
    > Cookies exist in HTTP headers and are exchanged between web servers and browsers. Keeping cookie size as low as possible is very important to minimize the impact on user response time.

    *How:*
    > Eliminate unnecessary cookies
    
    * 📖 [Cookie specification: RFC 6265](https://tools.ietf.org/html/rfc6265)
    * 📖 [Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
    * 🛠 [Browser Cookie Limits](http://browsercookielimits.squawky.net/)
    * 📖 [Website Performance: Cookies Don't Taste So Good - Monitis Blog](http://www.monitis.com/blog/website-performance-cookies-dont-taste-so-good/)
    * 📖 [Google's Web Performance Best Practices #3: Minimize Request Overhead - GlobalDots Blog](https://www.globaldots.com/googles-web-performance-best-practices-3-minimize-request-overhead/)

-  **Minimize HTTP requests:** Always make sure every file requested is essential to the website or application, minimize http requests as much as possible.

-  **Use CDN to provide static files:** Using CDN can get your static files faster globally.

 * 📖 [10 Tips to Optimize CDN Performance - CDN Planet](https://www.cdnplanet.com/blog/10-tips-optimize-cdn-performance/)
 * 📖 [HTTP Caching  |  Web Fundamentals  |  Google Developers](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)

-  **Set HTTP cache headers correctly:** Reasonably set HTTP cache headers to reduce the number of http requests.

-  **Enable GZIP compression** 

 * 📖 [Check GZIP compression](https://checkgzipcompression.com/)

-  **Store resources in different domains:** Since browsers have limited parallel downloads for the same domain, use multiple domain hosts to store static resources, increase parallel downloads, and shorten resource loading time

-  **Reduce page redirects**  

 
 The above checklist is only an excerpt, source: https://github.com/w3cay/Front-End-Performance-Checklist
