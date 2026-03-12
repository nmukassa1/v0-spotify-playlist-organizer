/**
 * Client-side: convert an image File to base64 JPEG under Spotify's 256 KB limit.
 * Used for playlist cover upload.
 */

const MAX_BYTES = 256 * 1024;
const MAX_DIM = 1024;
const INITIAL_QUALITY = 0.85;

function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.replace(/^data:image\/\w+;base64,/, "");
}

export function getBase64ByteLength(base64: string): number {
  return Math.ceil((base64.length * 3) / 4);
}

/**
 * Returns base64-encoded JPEG (no data URI prefix), or null on error.
 * Resizes and compresses to stay under 256 KB.
 */
export function fileToCoverBase64(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX_DIM || h > MAX_DIM) {
        if (w > h) {
          h = Math.round((h * MAX_DIM) / w);
          w = MAX_DIM;
        } else {
          w = Math.round((w * MAX_DIM) / h);
          h = MAX_DIM;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);

      let quality = INITIAL_QUALITY;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      let base64 = dataUrlToBase64(dataUrl);

      while (getBase64ByteLength(base64) > MAX_BYTES && quality > 0.1) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        base64 = dataUrlToBase64(dataUrl);
      }

      if (getBase64ByteLength(base64) > MAX_BYTES) {
        resolve(null);
        return;
      }
      resolve(base64);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
