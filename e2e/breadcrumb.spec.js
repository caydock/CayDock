import { test, expect } from '@playwright/test';

test.describe('Breadcrumb Navigation Tests', () => {
  test.describe('English Breadcrumbs', () => {
    test('should show correct breadcrumb on blog article page', async ({ page }) => {
      await page.goto('/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Check breadcrumb structure
      await expect(page.locator('nav').filter({ hasText: 'Home' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: 'Blog' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: 'Categories' })).toBeVisible();
      
      // Check that breadcrumb links work
      await page.click('nav a:has-text("Home")');
      await expect(page).toHaveURL('/');
      
      await page.goBack();
      await page.click('nav a:has-text("Blog")');
      await expect(page).toHaveURL('/blog');
    });

    test('should show correct breadcrumb on category page', async ({ page }) => {
      await page.goto('/categories/weird-websites');
      
      // Check breadcrumb structure
      await expect(page.locator('nav').filter({ hasText: 'Home' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: 'Blog' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: 'Categories' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: 'Weird Websites' })).toBeVisible();
      
      // Check that breadcrumb links work
      await page.click('nav a:has-text("Home")');
      await expect(page).toHaveURL('/');
      
      await page.goBack();
      await page.click('nav a:has-text("Blog")');
      await expect(page).toHaveURL('/blog');
    });

    test('should show correct breadcrumb on all categories page', async ({ page }) => {
      await page.goto('/categories/all');
      
      // Check breadcrumb structure
      await expect(page.locator('nav').filter({ hasText: 'Home' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: 'Blog' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: 'Categories' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: 'All Categories' })).toBeVisible();
    });
  });

  test.describe('Chinese Breadcrumbs', () => {
    test('should show correct breadcrumb on Chinese blog article page', async ({ page }) => {
      await page.goto('/zh-cn/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Check breadcrumb structure
      await expect(page.locator('nav').filter({ hasText: '首页' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: '博客' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: '分类' })).toBeVisible();
      
      // Check that breadcrumb links work
      await page.click('nav a:has-text("首页")');
      await expect(page).toHaveURL('/zh-cn/');
      
      await page.goBack();
      await page.click('nav a:has-text("博客")');
      await expect(page).toHaveURL('/zh-cn/blog');
    });

    test('should show correct breadcrumb on Chinese category page', async ({ page }) => {
      await page.goto('/zh-cn/categories/weird-websites');
      
      // Check breadcrumb structure
      await expect(page.locator('nav').filter({ hasText: '首页' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: '博客' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: '分类' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: '奇趣网站' })).toBeVisible();
      
      // Check that breadcrumb links work
      await page.click('nav a:has-text("首页")');
      await expect(page).toHaveURL('/zh-cn/');
      
      await page.goBack();
      await page.click('nav a:has-text("博客")');
      await expect(page).toHaveURL('/zh-cn/blog');
    });

    test('should show correct breadcrumb on Chinese all categories page', async ({ page }) => {
      await page.goto('/zh-cn/categories/all');
      
      // Check breadcrumb structure
      await expect(page.locator('nav').filter({ hasText: '首页' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: '博客' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: '分类' })).toBeVisible();
      await expect(page.locator('nav').filter({ hasText: '全部分类' })).toBeVisible();
    });
  });

  test.describe('Breadcrumb Link Validation', () => {
    test('should have correct href attributes for English breadcrumbs', async ({ page }) => {
      await page.goto('/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Check href attributes
      const homeLink = page.locator('nav a:has-text("Home")');
      await expect(homeLink).toHaveAttribute('href', '/');
      
      const blogLink = page.locator('nav a:has-text("Blog")');
      await expect(blogLink).toHaveAttribute('href', '/blog');
      
      const categoriesLink = page.locator('nav a:has-text("Categories")');
      await expect(categoriesLink).toHaveAttribute('href', '/categories/all');
    });

    test('should have correct href attributes for Chinese breadcrumbs', async ({ page }) => {
      await page.goto('/zh-cn/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Check href attributes
      const homeLink = page.locator('nav a:has-text("首页")');
      await expect(homeLink).toHaveAttribute('href', '/zh-cn/');
      
      const blogLink = page.locator('nav a:has-text("博客")');
      await expect(blogLink).toHaveAttribute('href', '/zh-cn/blog');
      
      const categoriesLink = page.locator('nav a:has-text("分类")');
      await expect(categoriesLink).toHaveAttribute('href', '/zh-cn/categories/all');
    });

    test('should not have href attribute for last breadcrumb item', async ({ page }) => {
      await page.goto('/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Last breadcrumb item should not be a link
      const lastBreadcrumb = page.locator('nav').filter({ hasText: '10 Weird Websites That Will Blow Your Mind' });
      await expect(lastBreadcrumb.locator('a')).not.toBeVisible();
    });
  });

  test.describe('Breadcrumb Separators', () => {
    test('should show correct separators in English breadcrumbs', async ({ page }) => {
      await page.goto('/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Check that separators are present
      const separators = page.locator('nav span:has-text("/")');
      await expect(separators).toHaveCount(3); // One for each breadcrumb item
    });

    test('should show correct separators in Chinese breadcrumbs', async ({ page }) => {
      await page.goto('/zh-cn/blog/featured-10-weird-websites-that-will-blow-your-mind');
      
      // Check that separators are present
      const separators = page.locator('nav span:has-text("/")');
      await expect(separators).toHaveCount(3); // One for each breadcrumb item
    });
  });
});
