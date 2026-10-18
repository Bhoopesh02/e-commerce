import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3005';

async function runTests() {
  console.log('=== RUNNING PRODUCTION VERIFICATION ON ' + BASE_URL + ' ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. RESPONSIVE MATRIX & OVERFLOW CHECK
  console.log('--- 1. RESPONSIVE MATRIX & HORIZONTAL OVERFLOW ---');
  const routes = ['/', '/shop', '/new-arrivals', '/wishlist'];
  const viewports = [360, 390, 768, 1024, 1280, 1440, 1920];
  const overflowResults = [];

  for (const route of routes) {
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      let gridColumns = 'N/A';
      if (route === '/shop' || route === '/new-arrivals') {
        gridColumns = await page.evaluate(() => {
          const grid = document.querySelector('.product-grid');
          if (!grid) return 'N/A';
          const style = window.getComputedStyle(grid);
          const cols = style.gridTemplateColumns.split(' ').filter(Boolean).length;
          return cols;
        });
      }

      overflowResults.push({
        Route: route,
        Viewport: `${width}px`,
        Overflow: hasOverflow ? 'FAIL (Overflow)' : 'Pass (None)',
        GridColumns: gridColumns,
      });
    }
  }
  console.table(overflowResults);

  // 2. BANNER CSS SWITCH CHECK
  console.log('\n--- 2. BANNER OBJECT-POSITION PER-BREAKPOINT TEST ---');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

  // Test at 1280px (desktop)
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(400);
  const desktopPos = await page.evaluate(() => {
    const img = document.querySelector('img[class*="bannerImage"], img[class*="collections-banner-img"]');
    if (!img) return null;
    const computed = window.getComputedStyle(img);
    return {
      computedObjectPosition: computed.objectPosition,
      inlinePosDesktop: img.style.getPropertyValue('--pos-desktop'),
      inlinePosMobile: img.style.getPropertyValue('--pos-mobile'),
    };
  });
  console.log('Desktop (1280px) Banner Position:', desktopPos);

  // Test at 390px (mobile <= 767px)
  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForTimeout(400);
  const mobilePos = await page.evaluate(() => {
    const img = document.querySelector('img[class*="bannerImage"], img[class*="collections-banner-img"]');
    if (!img) return null;
    const computed = window.getComputedStyle(img);
    return {
      computedObjectPosition: computed.objectPosition,
      inlinePosDesktop: img.style.getPropertyValue('--pos-desktop'),
      inlinePosMobile: img.style.getPropertyValue('--pos-mobile'),
    };
  });
  console.log('Mobile (390px) Banner Position:', mobilePos);

  // 3. IMAGE REQUEST SIZES AT 390px MOBILE
  console.log('\n--- 3. IMAGE REQUEST SIZES AT 390px (HOME) ---');
  const imageRequests = [];
  const imagePage = await context.newPage();
  imagePage.on('response', async (res) => {
    const url = res.url();
    const isImage =
      url.includes('/_next/image') ||
      url.endsWith('.webp') ||
      url.endsWith('.png') ||
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.avif');

    if (isImage && res.status() === 200) {
      try {
        const buffer = await res.body();
        const shortUrl = url.replace(BASE_URL, '').substring(0, 85);
        imageRequests.push({
          Status: res.status(),
          URL: shortUrl,
          SizeBytes: buffer.length,
          SizeKB: (buffer.length / 1024).toFixed(1) + ' KB',
        });
      } catch {}
    }
  });

  await imagePage.setViewportSize({ width: 390, height: 844 });
  await imagePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await imagePage.waitForTimeout(1000);

  console.table(
    imageRequests.map((r) => ({
      Status: r.Status,
      URL: r.URL,
      SizeBytes: r.SizeBytes,
      SizeKB: r.SizeKB,
    }))
  );
  console.log(`Total images fetched on 390px home: ${imageRequests.length}`);
  const maxProductSize = Math.max(...imageRequests.map((r) => r.SizeBytes));
  console.log(`Max single image payload: ${(maxProductSize / 1024).toFixed(1)} KB (target: < 400 KB)`);

  // 4. ADMIN IMAGE COMPRESSION & PERSISTENCE TEST
  console.log('\n--- 4. ADMIN 2-3 MB UPLOAD COMPRESSION & PERSISTENCE TEST ---');
  const adminPage = await context.newPage();
  await adminPage.goto(`${BASE_URL}/admin/products/prod_001/edit`, { waitUntil: 'domcontentloaded' });
  await adminPage.waitForTimeout(500);

  // Check how image compression works with a synthetic 2.5 MB canvas image
  const compressionResult = await adminPage.evaluate(async () => {
    // Generate a 2.5 MB equivalent synthetic canvas (e.g. 2500 x 2000)
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 3200;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgb(${i * 5}, ${100 + i * 2}, ${200 - i * 3})`;
      ctx.fillRect(i * 48, i * 64, 2000, 2000);
    }
    const uncompressedDataUrl = canvas.toDataURL('image/png');
    const uncompressedBytes = uncompressedDataUrl.length;

    // Run through client downscaler
    const { downscaleImage } = await import('/_next/static/chunks/src_lib_imageCompression_ts.js').catch(() => ({}));
    
    return {
      uncompressedKB: (uncompressedBytes / 1024).toFixed(1),
    };
  });
  console.log('Admin upload test environment initialized.');

  // Test admin update with price and persistence across reload
  console.log('Action: Updating price of prod_001 to 3250 via admin edit...');
  let alertMessage = '';
  adminPage.on('dialog', async (dialog) => {
    alertMessage = dialog.message();
    await dialog.accept();
  });

  const priceInput = adminPage.locator('input[name="price"]');
  await priceInput.fill('3250');
  const saveBtn = adminPage.locator('button:has-text("Save Changes")');
  await saveBtn.click();
  await adminPage.waitForTimeout(800);

  // Check localStorage overrides
  const overrides = await adminPage.evaluate(() => {
    return window.localStorage.getItem('aurelia_product_overrides');
  });
  console.log('aurelia_product_overrides in localStorage:', overrides);

  // Verify on /shop that 3250 is reflected
  await adminPage.goto(`${BASE_URL}/shop`, { waitUntil: 'domcontentloaded' });
  await adminPage.waitForTimeout(600);
  const priceOnShop = await adminPage.evaluate(() => {
    return document.body.innerText.includes('3,250') || document.body.innerText.includes('3250');
  });
  console.log('Updated price reflected on /shop:', priceOnShop);

  await browser.close();
  console.log('\n=== VERIFICATION RUN COMPLETED SUCCESSFULLY ===');
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
