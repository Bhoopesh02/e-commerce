const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.resolve('c:/Users/bhoop/OneDrive/Desktop/company/e-commerce1/images/section');
const PUBLIC_DIR = path.resolve(__dirname, '../public/images/sections');
const BANNERS_OUT = path.join(PUBLIC_DIR, 'banners');
const PRODUCTS_OUT = path.join(PUBLIC_DIR, 'products');

// Ensure output directories exist
fs.mkdirSync(BANNERS_OUT, { recursive: true });
fs.mkdirSync(PRODUCTS_OUT, { recursive: true });

// Banner mapping
const BANNER_MAP = [
  { source: 'outerwear.webp', target: 'banner-outerwear.webp', focus: sharp.gravity.north },
  { source: 'tailoring.webp', target: 'banner-tailoring.webp', focus: sharp.gravity.north },
  { source: 'evening wear.webp', target: 'banner-eveningwear.webp', focus: sharp.gravity.center },
  { source: 'knitwear.webp', target: 'banner-knitwear.webp', focus: sharp.gravity.center },
  { source: 'leather goods.webp', target: 'banner-leather-goods.webp', focus: sharp.gravity.center },
  { source: 'footwear.webp', target: 'banner-footwear.webp', focus: sharp.gravity.center },
  { source: 'fine jewellery.webp', target: 'banner-fine-jewelry.webp', focus: sharp.gravity.center },
];

async function processBanners() {
  console.log('--- Processing Banners ---');
  const bannerSrcDir = path.join(SOURCE_DIR, 'banner');

  const bannerConfigs = [
    { target: 'banner-outerwear.webp', primary: 'outerwear-4k.webp', fallback: 'outerwear.webp' },
    { target: 'banner-tailoring.webp', primary: 'tailoring-4k.webp', fallback: 'tailoring.webp' },
    { target: 'banner-eveningwear.webp', primary: 'eveningwear-4k.webp', fallback: 'evening wear.webp' },
    { target: 'banner-knitwear.webp', primary: 'knitwear-4k.webp', fallback: 'knitwear.webp' },
    { target: 'banner-leather-goods.webp', primary: 'leather goods-4k.webp', fallback: 'leather goods.webp' },
    { target: 'banner-footwear.webp', primary: 'footwear-4k.webp', fallback: 'footwear.webp' },
    { target: 'banner-fine-jewelry.webp', primary: 'fine-jewelry-4k.webp', fallback: 'fine jewellery.webp' },
  ];

  for (const cfg of bannerConfigs) {
    const primaryPath = path.join(bannerSrcDir, cfg.primary);
    const fallbackPath = path.join(bannerSrcDir, cfg.fallback);
    const chosenPath = fs.existsSync(primaryPath) ? primaryPath : fallbackPath;

    if (!fs.existsSync(chosenPath)) {
      console.warn(`Banner source not found: ${chosenPath}`);
      continue;
    }

    await sharp(chosenPath)
      .resize(1920, 640, { fit: 'cover', position: 'center', kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 1.1 })
      .webp({ quality: 95 })
      .toFile(path.join(BANNERS_OUT, cfg.target));
    console.log(`  -> ${cfg.target} processed from ${path.basename(chosenPath)}`);
  }
}

// Category folders mapping
const SECTION_FOLDERS = [
  { folder: 'outerwear1', slug: 'outerwear' },
  { folder: 'tailoring2', slug: 'tailoring' },
  { folder: 'Eveningwear3', slug: 'eveningwear' },
  { folder: 'Knitwear4', slug: 'knitwear' },
  { folder: 'Leather Goods5', slug: 'leather-goods' },
  { folder: 'footwear6', slug: 'footwear' },
  { folder: 'finejewellery7', slug: 'fine-jewelry' },
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

async function processProducts() {
  console.log('--- Processing Product Images ---');

  for (const sec of SECTION_FOLDERS) {
    const secSrcDir = path.join(SOURCE_DIR, sec.folder);
    if (!fs.existsSync(secSrcDir)) {
      console.warn(`Section dir not found: ${secSrcDir}`);
      continue;
    }

    const secDestDir = path.join(PRODUCTS_OUT, sec.slug);
    fs.mkdirSync(secDestDir, { recursive: true });

    const productDirs = fs.readdirSync(secSrcDir);
    for (const prodDirName of productDirs) {
      const prodPath = path.join(secSrcDir, prodDirName);
      if (!fs.statSync(prodPath).isDirectory()) continue;

      const prodSlug = slugify(prodDirName);
      // Put product-4k.webp first if present
      const files = fs.readdirSync(prodPath).filter(f => !f.startsWith('temp_')).sort((a, b) => {
        if (a === 'product-4k.webp') return -1;
        if (b === 'product-4k.webp') return 1;
        return a.localeCompare(b);
      });

      console.log(`Processing product: [${sec.slug}] ${prodDirName} (${files.length} images)`);

      let index = 1;
      for (const f of files) {
        if (index > 2) break; // Keep primary and secondary views
        const filePath = path.join(prodPath, f);
        if (!fs.statSync(filePath).isFile()) continue;

        const outFileName = `${prodSlug}-${index}.webp`;
        const destPath = path.join(secDestDir, outFileName);

        try {
          const img = sharp(filePath);
          const meta = await img.metadata();

          // Standardize to luxury 3:4 portrait ratio (900x1200 or 1200x1600)
          // If image is square or landscape, contain or cover with elegant background
          await img
            .resize(900, 1200, {
              fit: 'cover',
              position: 'center',
              kernel: sharp.kernel.lanczos3,
            })
            .sharpen({ sigma: 1.1, m1: 1.2, m2: 0.5 })
            .webp({ quality: 90, effort: 5 })
            .toFile(destPath);

          console.log(`  -> Saved ${outFileName} (from ${f} ${meta.width}x${meta.height})`);
          index++;
        } catch (err) {
          console.error(`  Error processing ${f}:`, err.message);
        }
      }
    }
  }
}

async function run() {
  await processBanners();
  await processProducts();
  console.log('All image optimization complete!');
}

run();
