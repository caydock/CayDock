import { test, expect } from '@playwright/test';

test.describe('Language Switch Tests', () => {
  test.describe('Footer Language Switcher', () => {
    test('should switch from English to Chinese on homepage', async ({ page }) => {
      await page.goto('/');
      
      // Verify we're on English homepage
      await expect(page.locator('h1')).toContainText('World\'s Weird Websites Cay');
      
      // Click language switcher
      await page.click('text=中文');
      
      // Verify we're now on Chinese homepage
      await expect(page).toHaveURL('/zh-cn/');
      await expect(page.locator('h1')).toContainText('全球奇趣网站精选');
    });

    test('should switch from Chinese to English on homepage', async ({ page }) => {
      await page.goto('/zh-cn/');
      
      // Verify we're on Chinese homepage
      await expect(page.locator('h1')).toContainText('全球奇趣网站精选');
      
      // Click language switcher
      await page.click('text=EN');
      
      // Verify we're now on English homepage
      await expect(page).toHaveURL('/');
      await expect(page.locator('h1')).toContainText('World\'s Weird Websites Cay');
    });

    test('should switch from English to Chinese on blog page', async ({ page }) => {
      await page.goto('/blog');
      
      // Verify we're on English blog page
      await expect(page.locator('h1')).toContainText('All Posts');
      
      // Click language switcher
      await page.click('text=中文');
      
      // Verify we're now on Chinese blog page
      await expect(page).toHaveURL('/zh-cn/blog');
      await expect(page.locator('h1')).toContainText('所有文章');
    });

    test('should switch from Chinese to English on blog page', async ({ page }) => {
      await page.goto('/zh-cn/blog');
      
      // Verify we're on Chinese blog page
      await expect(page.locator('h1')).toContainText('所有文章');
      
      // Click language switcher
      await page.click('text=EN');
      
      // Verify we're now on English blog page
      await expect(page).toHaveURL('/blog');
      await expect(page.locator('h1')).toContainText('All Posts');
    });

    test('should switch from English to Chinese on category page', async ({ page }) => {
      await page.goto('/categories/weird-websites');
      
      // Verify we're on English category page
      await expect(page.locator('h1')).toContainText('Weird Websites');
      
      // Click language switcher
      await page.click('text=中文');
      
      // Verify we're now on Chinese category page
      await expect(page).toHaveURL('/zh-cn/categories/weird-websites');
      await expect(page.locator('h1')).toContainText('奇趣网站');
    });

    test('should switch from Chinese to English on category page', async ({ page }) => {
      await page.goto('/zh-cn/categories/weird-websites');
      
      // Verify we're on Chinese category page
      await expect(page.locator('h1')).toContainText('奇趣网站');
      
      // Click language switcher
      await page.click('text=EN');
      
      // Verify we're now on English category page
      await expect(page).toHaveURL('/categories/weird-websites');
      await expect(page.locator('h1')).toContainText('Weird Websites');
    });

    test('should switch from English to Chinese on blog article page', async ({ page }) => {
      await page.goto('/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Verify we're on English blog article page
      await expect(page.locator('h1')).toContainText('10 Weird Websites That Will Blow Your Mind');
      
      // Click language switcher
      await page.click('text=中文');
      
      // Verify we're now on Chinese blog article page
      await expect(page).toHaveURL('/zh-cn/blog/featured-10-weird-websites-that-will-blow-your-mind');
      await expect(page.locator('h1')).toContainText('10个让你大开眼界的奇趣网站');
    });

    test('should switch from Chinese to English on blog article page', async ({ page }) => {
      await page.goto('/zh-cn/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Verify we're on Chinese blog article page
      await expect(page.locator('h1')).toContainText('10个让你大开眼界的奇趣网站');
      
      // Click language switcher
      await page.click('text=EN');
      
      // Verify we're now on English blog article page
      await expect(page).toHaveURL('/blog/featured-10-weird-websites-that-will-blow-your-mind');
      await expect(page.locator('h1')).toContainText('10 Weird Websites That Will Blow Your Mind');
    });
  });

  test.describe('Language Switcher Display', () => {
    test('should show "中文" button when on English page', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('text=中文')).toBeVisible();
      await expect(page.locator('text=EN')).not.toBeVisible();
    });

    test('should show "EN" button when on Chinese page', async ({ page }) => {
      await page.goto('/zh-cn/');
      await expect(page.locator('text=EN')).toBeVisible();
      await expect(page.locator('text=中文')).not.toBeVisible();
    });
  });

  test.describe('Language Switcher Functionality', () => {
    test('should maintain current page context when switching languages', async ({ page }) => {
      // Test on about page
      await page.goto('/about');
      await page.click('text=中文');
      await expect(page).toHaveURL('/zh-cn/about');
      
      // Test on contact page
      await page.goto('/contact');
      await page.click('text=中文');
      await expect(page).toHaveURL('/zh-cn/contact');
      
      // Test on submit page
      await page.goto('/submit');
      await page.click('text=中文');
      await expect(page).toHaveURL('/zh-cn/submit');
    });

    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      await expect(page.locator('text=中文')).toBeVisible();
      
      await page.click('text=中文');
      await expect(page).toHaveURL('/zh-cn/');
      await expect(page.locator('h1')).toContainText('全球奇趣网站精选');
    });
  });
});
