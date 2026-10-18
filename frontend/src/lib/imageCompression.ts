/**
 * Client-side image downscaling and compression utility for Admin uploads.
 * Ensures uploaded images do not exhaust the browser's 5MB localStorage quota.
 */
export async function downscaleImage(
  source: File | Blob | string,
  maxDimension = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    let srcUrl = '';
    let shouldRevoke = false;

    if (typeof source === 'string') {
      srcUrl = source;
    } else if (typeof Blob !== 'undefined' && source instanceof Blob) {
      srcUrl = URL.createObjectURL(source);
      shouldRevoke = true;
    } else {
      return reject(new Error('Invalid image source type'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (shouldRevoke) {
        URL.revokeObjectURL(srcUrl);
      }

      let { width, height } = img;
      if (width <= 0 || height <= 0) {
        return resolve(typeof source === 'string' ? source : '');
      }

      // Downscale if width or height exceeds maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(typeof source === 'string' ? source : '');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as webp with quality ~0.8
      try {
        const dataUrl = canvas.toDataURL('image/webp', quality);
        // Verify webp support; fallback to jpeg if necessary
        if (dataUrl.startsWith('data:image/webp')) {
          resolve(dataUrl);
        } else {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      if (shouldRevoke) {
        URL.revokeObjectURL(srcUrl);
      }
      reject(err);
    };

    img.src = srcUrl;
  });
}
