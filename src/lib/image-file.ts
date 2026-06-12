// 圖片檔案處理：支援一般圖片 + HEIC/HEIF（Apple 格式）轉檔
//
// 瀏覽器的 <img> 無法直接顯示 HEIC，需在前端先轉成 JPEG。
// heic2any 內含 libheif WASM，體積較大，因此用動態 import，
// 只有在使用者真的上傳 HEIC 時才載入。

const HEIC_MIME = ["image/heic", "image/heif"];

/** 是否為 HEIC/HEIF。注意：部分瀏覽器對 .heic 回報的 type 是空字串，需同時檢查副檔名 */
function isHeic(file: File): boolean {
  if (HEIC_MIME.includes(file.type.toLowerCase())) return true;
  return /\.(heic|heif)$/i.test(file.name);
}

/** 是否為可接受的圖片檔（一般圖片或 HEIC） */
export function isSupportedImage(file: File): boolean {
  return file.type.startsWith("image/") || isHeic(file);
}

/**
 * 把上傳的檔案轉成可供 <img> 顯示的 object URL。
 * HEIC/HEIF 會先轉成 JPEG；其餘格式直接建立 object URL。
 * 呼叫端負責在不需要時 URL.revokeObjectURL() 釋放。
 */
export async function fileToImageUrl(file: File): Promise<string> {
  if (isHeic(file)) {
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });
    // heic2any 多頁時回傳陣列，取第一張即可
    const blob = Array.isArray(result) ? result[0] : result;
    return URL.createObjectURL(blob);
  }
  return URL.createObjectURL(file);
}
