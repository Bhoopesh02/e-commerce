const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const rootDir = path.join(__dirname, '..');
const srcFiles = walk(path.join(rootDir, 'src'));

console.log('--- 1. AUDIT SRC CODEBASE FOR NON-WEBP IMAGE REFERENCES ---');
const nonWebpRegex = /([a-zA-Z0-9_\-\/.]+\.(png|jpg|jpeg|avif))/gi;
let nonWebpCount = 0;

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(nonWebpRegex);
  if (matches) {
    console.log(`Found non-webp in ${path.relative(rootDir, file)}:`, matches);
    nonWebpCount += matches.length;
  }
}

if (nonWebpCount === 0) {
  console.log('PASSED: Zero non-webp image references found in src/');
} else {
  console.log(`FAILED: Found ${nonWebpCount} non-webp references in src/`);
}

console.log('\n--- 2. AUDIT PUBLIC DIRECTORY FOR IMAGE FORMATS ---');
const publicFiles = walk(path.join(rootDir, 'public'));
const extCounts = {};
for (const file of publicFiles) {
  const ext = path.extname(file).toLowerCase();
  extCounts[ext] = (extCounts[ext] || 0) + 1;
}
console.log('Public folder file extensions:', extCounts);

const nonWebpPublic = publicFiles.filter(f => /\.(png|jpg|jpeg|avif)$/i.test(f));
if (nonWebpPublic.length === 0) {
  console.log('PASSED: 100% of images in public/ are .webp format');
} else {
  console.log(`FAILED: Found ${nonWebpPublic.length} non-webp images in public/`);
}

console.log('\n--- 3. VERIFY ALL REFERENCED IMAGES EXIST ON DISK ---');
const imgPathRegex = /[\'\"](\/images\/[^\'\"]+\.webp)[\'\"]/g;
const referencedImages = new Set();

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = imgPathRegex.exec(content)) !== null) {
    referencedImages.add(match[1]);
  }
}

console.log(`Found ${referencedImages.size} unique image paths referenced in src/`);
const missingImages = [];
for (const imgPath of referencedImages) {
  const diskPath = path.join(rootDir, 'public', imgPath);
  if (!fs.existsSync(diskPath)) {
    missingImages.push(imgPath);
  }
}

if (missingImages.length === 0) {
  console.log(`PASSED: All ${referencedImages.size} referenced images exist on disk!`);
} else {
  console.log(`FAILED: Missing ${missingImages.length} images:`, missingImages);
}

console.log('\n--- AUDIT COMPLETE ---');
