import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const backupDir = path.join(rootDir, '.image-backups');

const SCAN_DIRS = [
  path.join(rootDir, 'public'),
  path.join(rootDir, 'src', 'assets')
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file === 'node_modules' || file === '.next' || file === '.image-backups') continue;
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

async function optimize() {
  console.log('=== STARTING IMAGE OPTIMIZATION (SHARP) ===');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const allFiles = [];
  SCAN_DIRS.forEach(d => getAllFiles(d, allFiles));

  const imageExts = ['.webp', '.jpg', '.jpeg', '.png'];
  const imageFiles = allFiles.filter(f => imageExts.includes(path.extname(f).toLowerCase()));

  const report = [];

  for (const filePath of imageFiles) {
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const originalStat = fs.statSync(filePath);
    const originalSizeKB = originalStat.size / 1024;

    try {
      const inputBuffer = fs.readFileSync(filePath);
      const meta = await sharp(inputBuffer).metadata();
      const isBanner = relPath.includes('banner') || relPath.includes('hero');
      const isThumb = relPath.includes('thumb');
      const isProduct = relPath.includes('product') || relPath.includes('categories');

      let targetMaxWidth;
      if (isThumb) {
        targetMaxWidth = 200;
      } else if (isBanner) {
        targetMaxWidth = 1920;
      } else if (isProduct) {
        targetMaxWidth = 800;
      } else {
        targetMaxWidth = 1200;
      }

      // Only optimize if file size is > 150KB for products / > 350KB for banners, or width exceeds target
      const needsResize = meta.width && meta.width > targetMaxWidth;
      const needsCompression = (isBanner && originalSizeKB > 350) || (!isBanner && originalSizeKB > 150);

      if (!needsResize && !needsCompression && meta.format === 'webp') {
        continue;
      }

      // Backup original
      const backupPath = path.join(backupDir, relPath);
      const backupSubDir = path.dirname(backupPath);
      if (!fs.existsSync(backupSubDir)) {
        fs.mkdirSync(backupSubDir, { recursive: true });
      }
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
      }

      // Process with Sharp
      let pipeline = sharp(inputBuffer);
      if (needsResize) {
        pipeline = pipeline.resize({
          width: targetMaxWidth,
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      const buffer = await pipeline
        .webp({ quality: 78, effort: 5 })
        .toBuffer();

      // Only overwrite if optimized is smaller
      if (buffer.length < originalStat.size || meta.format !== 'webp') {
        fs.writeFileSync(filePath, buffer);
        const newSizeKB = buffer.length / 1024;
        const savedPercent = (((originalSizeKB - newSizeKB) / originalSizeKB) * 100).toFixed(1);

        report.push({
          File: relPath.length > 55 ? '...' + relPath.slice(-52) : relPath,
          OrigKB: originalSizeKB.toFixed(1),
          NewKB: newSizeKB.toFixed(1),
          Saved: `${savedPercent}%`,
          OrigDim: `${meta.width}x${meta.height}`,
          NewDim: needsResize ? `max-${targetMaxWidth}w` : 'same',
        });
      }
    } catch (err) {
      console.error(`Error processing ${relPath}:`, err.message);
    }
  }

  console.log(`\nOptimized ${report.length} images:`);
  console.table(report);

  const totalOrig = report.reduce((sum, r) => sum + parseFloat(r.OrigKB), 0);
  const totalNew = report.reduce((sum, r) => sum + parseFloat(r.NewKB), 0);
  const totalSavedMB = ((totalOrig - totalNew) / 1024).toFixed(2);
  console.log(`Total saved: ${totalSavedMB} MB (${((totalOrig - totalNew) / totalOrig * 100).toFixed(1)}% reduction)\n`);
}

optimize().catch(console.error);
