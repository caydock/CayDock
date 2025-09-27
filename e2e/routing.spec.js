import { test, expect } from '@playwright/test';

test.describe('Routing Tests', () => {
  test.describe('URL Structure', () => {
    test('should not add /en prefix for English URLs', async ({ page }) => {
      const englishUrls = [
        '/',
        '/blog',
        '/about',
        '/contact',
        '/submit',
        '/categories',
        '/categories/all',
        '/blog/featured-10-weird-websites-that-will-blow-your-mind',
        '/categories/weird-websites',
      ];

      for (const url of englishUrls) {
        const response = await page.goto(url);
        expect(response.url()).toBe(`http://localhost:3000${url}`);
        expect(response.url()).not.toContain('/en/');
      }
    });

    test('should maintain /zh-cn prefix for Chinese URLs', async ({ page }) => {
      const chineseUrls = [
        '/zh-cn/',
        '/zh-cn/blog',
        '/zh-cn/about',
        '/zh-cn/contact',
        '/zh-cn/submit',
        '/zh-cn/categories',
        '/zh-cn/categories/all',
        '/zh-cn/blog/featured-10-weird-websites-that-will-blow-your-mind',
        '/zh-cn/categories/weird-websites',
      ];

      for (const url of chineseUrls) {
        const response = await page.goto(url);
        expect(response.url()).toBe(`http://localhost:3000${url}`);
        expect(response.url()).toContain('/zh-cn/');
      }
    });
  });

  test.describe('Navigation Links', () => {
    test('should navigate correctly from English homepage', async ({ page }) => {
      await page.goto('/');
      
      // Test navigation to blog
      await page.click('a[href="/blog"]');
      await expect(page).toHaveURL('/blog');
      
      // Test navigation to categories
      await page.goto('/');
      await page.click('a[href="/categories"]');
      await expect(page).toHaveURL('/categories');
      
      // Test navigation to about
      await page.goto('/');
      await page.click('a[href="/about"]');
      await expect(page).toHaveURL('/about');
    });

    test('should navigate correctly from Chinese homepage', async ({ page }) => {
      await page.goto('/zh-cn/');
      
      // Test navigation to blog
      await page.click('a[href="/zh-cn/blog"]');
      await expect(page).toHaveURL('/zh-cn/blog');
      
      // Test navigation to categories
      await page.goto('/zh-cn/');
      await page.click('a[href="/zh-cn/categories"]');
      await expect(page).toHaveURL('/zh-cn/categories');
      
      // Test navigation to about
      await page.goto('/zh-cn/');
      await page.click('a[href="/zh-cn/about"]');
      await expect(page).toHaveURL('/zh-cn/about');
    });
  });

  test.describe('Dynamic Routes', () => {
    test('should handle blog article routes correctly', async ({ page }) => {
      const blogSlugs = [
        'featured-10-weird-websites-that-will-blow-your-mind',
        '10-most-popular-weird-websites-on-reddit',
        '8-magical-websites-with-superlatives',
      ];

      for (const slug of blogSlugs) {
        // Test English route
        await page.goto(`/blog/${slug}`);
        await expect(page).toHaveURL(`/blog/${slug}`);
        await expect(page.locator('h1')).toBeVisible();
        
        // Test Chinese route
        await page.goto(`/zh-cn/blog/${slug}`);
        await expect(page).toHaveURL(`/zh-cn/blog/${slug}`);
        await expect(page.locator('h1')).toBeVisible();
      }
    });

    test('should handle category routes correctly', async ({ page }) => {
      const categorySlugs = [
        'all',
        'weird-websites',
        'gaming',
        'interactive',
        'geography',
      ];

      for (const slug of categorySlugs) {
        // Test English route
        await page.goto(`/categories/${slug}`);
        await expect(page).toHaveURL(`/categories/${slug}`);
        await expect(page.locator('h1')).toBeVisible();
        
        // Test Chinese route
        await page.goto(`/zh-cn/categories/${slug}`);
        await expect(page).toHaveURL(`/zh-cn/categories/${slug}`);
        await expect(page.locator('h1')).toBeVisible();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle 404 for non-existent English routes', async ({ page }) => {
      const response = await page.goto('/non-existent-page');
      expect(response.status()).toBe(404);
    });

    test('should handle 404 for non-existent Chinese routes', async ({ page }) => {
      const response = await page.goto('/zh-cn/non-existent-page');
      expect(response.status()).toBe(404);
    });

    test('should handle 404 for non-existent blog articles', async ({ page }) => {
      const response = await page.goto('/blog/non-existent-article');
      expect(response.status()).toBe(404);
    });

    test('should handle 404 for non-existent categories', async ({ page }) => {
      const response = await page.goto('/categories/non-existent-category');
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Redirects', () => {
    test('should not redirect English URLs to /en', async ({ page }) => {
      const response = await page.goto('/');
      expect(response.status()).toBe(200);
      expect(response.url()).toBe('http://localhost:3000/');
      
      const response2 = await page.goto('/blog');
      expect(response2.status()).toBe(200);
      expect(response2.url()).toBe('http://localhost:3000/blog');
    });

    test('should handle trailing slashes correctly', async ({ page }) => {
      // Test with trailing slash
      await page.goto('/zh-cn/');
      await expect(page).toHaveURL('/zh-cn/');
      
      // Test without trailing slash
      await page.goto('/zh-cn');
      await expect(page).toHaveURL('/zh-cn/');
    });
  });

  test.describe('SEO and Meta Tags', () => {
    test('should have correct title tags for English pages', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/W3Cay/);
      
      await page.goto('/blog');
      await expect(page).toHaveTitle(/All Posts/);
      
      await page.goto('/categories');
      await expect(page).toHaveTitle(/Categories/);
    });

    test('should have correct title tags for Chinese pages', async ({ page }) => {
      await page.goto('/zh-cn/');
      await expect(page).toHaveTitle(/W3Cay/);
      
      await page.goto('/zh-cn/blog');
      await expect(page).toHaveTitle(/所有文章/);
      
      await page.goto('/zh-cn/categories');
      await expect(page).toHaveTitle(/分类/);
    });

    test('should have correct meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content');
      
      // Check for meta viewport
      const metaViewport = page.locator('meta[name="viewport"]');
      await expect(metaViewport).toHaveAttribute('content');
    });
  });
});
