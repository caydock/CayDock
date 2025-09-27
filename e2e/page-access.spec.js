import { test, expect } from '@playwright/test';

test.describe('Page Access Tests', () => {
  test.describe('English Pages (no prefix)', () => {
    test('should load homepage', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/W3Cay/);
      await expect(page.locator('h1')).toContainText('World\'s Weird Websites Cay');
    });

    test('should load blog page', async ({ page }) => {
      await page.goto('/blog');
      await expect(page).toHaveTitle(/All Posts/);
      await expect(page.locator('h1')).toContainText('All Posts');
    });

    test('should load categories page', async ({ page }) => {
      await page.goto('/categories');
      await expect(page).toHaveTitle(/Categories/);
      await expect(page.locator('h1')).toContainText('Categories');
    });

    test('should load about page', async ({ page }) => {
      await page.goto('/about');
      await expect(page).toHaveTitle(/About/);
    });

    test('should load contact page', async ({ page }) => {
      await page.goto('/contact');
      await expect(page).toHaveTitle(/Contact/);
    });

    test('should load submit page', async ({ page }) => {
      await page.goto('/submit');
      await expect(page).toHaveTitle(/Recommend a Website/);
    });
  });

  test.describe('Chinese Pages (with /zh-cn prefix)', () => {
    test('should load Chinese homepage', async ({ page }) => {
      await page.goto('/zh-cn/');
      await expect(page).toHaveTitle(/W3Cay/);
      await expect(page.locator('h1')).toContainText('全球奇趣网站精选');
    });

    test('should load Chinese blog page', async ({ page }) => {
      await page.goto('/zh-cn/blog');
      await expect(page).toHaveTitle(/所有文章/);
      await expect(page.locator('h1')).toContainText('所有文章');
    });

    test('should load Chinese categories page', async ({ page }) => {
      await page.goto('/zh-cn/categories');
      await expect(page).toHaveTitle(/分类/);
      await expect(page.locator('h1')).toContainText('分类');
    });

    test('should load Chinese about page', async ({ page }) => {
      await page.goto('/zh-cn/about');
      await expect(page).toHaveTitle(/关于/);
    });

    test('should load Chinese contact page', async ({ page }) => {
      await page.goto('/zh-cn/contact');
      await expect(page).toHaveTitle(/联系/);
    });

    test('should load Chinese submit page', async ({ page }) => {
      await page.goto('/zh-cn/submit');
      await expect(page).toHaveTitle(/推荐一个网站/);
    });
  });

  test.describe('Dynamic Routes', () => {
    test('should load blog article page', async ({ page }) => {
      await page.goto('/blog/featured-10-weird-websites-that-will-blow-your-mind');
      await expect(page).toHaveTitle(/10 Weird Websites That Will Blow Your Mind/);
    });

    test('should load Chinese blog article page', async ({ page }) => {
      await page.goto('/zh-cn/blog/featured-10-weird-websites-that-will-blow-your-mind');
      await expect(page).toHaveTitle(/10个让你大开眼界的奇趣网站/);
    });

    test('should load category page', async ({ page }) => {
      await page.goto('/categories/weird-websites');
      await expect(page).toHaveTitle(/Weird Websites/);
    });

    test('should load Chinese category page', async ({ page }) => {
      await page.goto('/zh-cn/categories/weird-websites');
      await expect(page).toHaveTitle(/奇趣网站/);
    });

    test('should load all categories page', async ({ page }) => {
      await page.goto('/categories/all');
      await expect(page).toHaveTitle(/All Categories/);
    });

    test('should load Chinese all categories page', async ({ page }) => {
      await page.goto('/zh-cn/categories/all');
      await expect(page).toHaveTitle(/全部分类/);
    });
  });

  test.describe('URL Structure Validation', () => {
    test('should not redirect English URLs to /en', async ({ page }) => {
      const response = await page.goto('/');
      expect(response.url()).toBe('http://localhost:3000/');
      
      const response2 = await page.goto('/blog');
      expect(response2.url()).toBe('http://localhost:3000/blog');
    });

    test('should maintain Chinese URLs with /zh-cn prefix', async ({ page }) => {
      const response = await page.goto('/zh-cn/');
      expect(response.url()).toBe('http://localhost:3000/zh-cn/');
      
      const response2 = await page.goto('/zh-cn/blog');
      expect(response2.url()).toBe('http://localhost:3000/zh-cn/blog');
    });
  });
});
