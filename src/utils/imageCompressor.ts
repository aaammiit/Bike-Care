/**
 * Utility to process and compress user-uploaded image files into optimized Base64 data URLs.
 * Prevents localStorage quota exceeded errors and speeds up web rendering in production.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    // If tiny file already (< 100KB), read directly as DataURL
    if (file.size < 100 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          resolve("");
        }
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(typeof reader.result === "string" ? reader.result : "");
            return;
          }

          // Fill canvas white background before drawing (prevents black background on PNG transparency -> JPEG)
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(typeof reader.result === "string" ? reader.result : "");
        }
      };
      img.onerror = () => resolve(typeof reader.result === "string" ? reader.result : "");
      if (typeof e.target?.result === "string") {
        img.src = e.target.result;
      } else {
        resolve("");
      }
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}
