/**
 * Client-side high-performance image compressor.
 * Resizes large camera photos (e.g. 20MB - 50MB) down to optimized web dimensions (e.g. max 2400px, ~500KB-1.5MB)
 * so uploads happen in milliseconds, never exceed Cloudinary/server limits, and maintain stunning visual clarity.
 */

export async function compressImage(
  file: File,
  maxDimension = 2400,
  quality = 0.85
): Promise<File> {
  // If not an image or SVG/GIF, return as-is
  if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file;
  }

  // If already small (< 1.5MB), no need to compress
  if (file.size <= 1.5 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
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
          return resolve(file);
        }

        // Smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG or WebP blob
        const outputType = file.type === 'image/png' ? 'image/jpeg' : file.type;
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, '.jpg');
            const compressedFile = new File([blob], cleanFileName, {
              type: outputType,
              lastModified: Date.now(),
            });

            console.log(
              `[Image Compressed] Original: ${(file.size / (1024 * 1024)).toFixed(2)} MB -> Compressed: ${(
                compressedFile.size /
                (1024 * 1024)
              ).toFixed(2)} MB`
            );

            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}
