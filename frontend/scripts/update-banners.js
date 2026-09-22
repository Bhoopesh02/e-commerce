const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploads = 'C:/Users/bhoop/.gemini/antigravity-ide/brain/4153271b-4ebe-4673-8906-d12e583a0a56/.user_uploaded/';
const dest = 'c:/Users/bhoop/OneDrive/Desktop/company/e-commerce1/frontend/public/images/sections/banners/';

const images = {
  apparel: path.join(uploads, 'media_1790074451710.png'),
  shoes: path.join(uploads, 'media_1790074451707.jpg'),
  leather: path.join(uploads, 'media_1790074451735.jpg'),
  jewelry: path.join(uploads, 'media_1790074451738.jpg')
};

const map = [
  { src: images.apparel, dest: 'banner-outerwear.webp', gravity: sharp.gravity.north },
  { src: images.apparel, dest: 'banner-tailoring.webp', gravity: sharp.gravity.north },
  { src: images.apparel, dest: 'banner-knitwear.webp', gravity: sharp.gravity.north },
  { src: images.apparel, dest: 'banner-eveningwear.webp', gravity: sharp.gravity.center },
  { src: images.shoes, dest: 'banner-footwear.webp', gravity: sharp.gravity.center },
  { src: images.leather, dest: 'banner-leather-goods.webp', gravity: sharp.gravity.center },
  { src: images.jewelry, dest: 'banner-fine-jewelry.webp', gravity: sharp.gravity.center }
];

async function run() {
  for (const item of map) {
    const meta = await sharp(item.src).metadata();
    await sharp(item.src)
      // Crop 45px from bottom right to remove the gemini logo watermark completely
      .extract({ left: 0, top: 0, width: meta.width - 45, height: meta.height - 45 })
      .resize(1920, 640, { fit: 'cover', position: item.gravity, kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 1.1 })
      .webp({ quality: 95 })
      .toFile(path.join(dest, item.dest));
    console.log('Processed', item.dest);
  }
}

run().catch(console.error);
