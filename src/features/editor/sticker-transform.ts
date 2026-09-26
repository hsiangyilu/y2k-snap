// 貼紙圖層的平移與縮放。
// 貼紙是「整面散佈好的圖層」而非單顆元件，因此這裡處理的是整個圖層的位移與縮放，
// 用來決定哪一段圖樣落在照片上、每顆貼紙顯示多大。

export type StickerTransform = {
  /** 水平位移，單位為「貼紙顯示區寬度的比例」，0 為置中 */
  x: number;
  /** 垂直位移，單位為「貼紙顯示區高度的比例」，0 為置中 */
  y: number;
  scale: number;
};

export const STICKER_TRANSFORM_DEFAULT: StickerTransform = { x: 0, y: 0, scale: 1 };

// 下限設為 1：圖層以 cover 鋪滿顯示區，縮小到 1 以下邊緣會露出空隙
export const STICKER_SCALE_MIN = 1;
export const STICKER_SCALE_MAX = 3;

// 1 倍時仍可移動的範圍。圖層以 cover 鋪滿，長寬比通常與顯示區不同，
// 至少有一軸有溢出的餘裕可移動；移到另一軸的極限時邊緣會露出空隙，
// 屬於使用者可見且可回復（往回拖或按 RESET）的結果，因此不封鎖手勢。
const BASE_PAN_LIMIT = 0.2;
// 放大後額外增加的可移動範圍：放大越多，露出邊緣的風險越低
const PAN_LIMIT_PER_SCALE = 0.5;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** 依目前縮放算出位移可達的範圍 */
export function panLimit(scale: number) {
  const s = clamp(scale, STICKER_SCALE_MIN, STICKER_SCALE_MAX);
  return BASE_PAN_LIMIT + ((s - 1) / 2) * PAN_LIMIT_PER_SCALE;
}

export function clampTransform(t: StickerTransform): StickerTransform {
  const scale = clamp(t.scale, STICKER_SCALE_MIN, STICKER_SCALE_MAX);
  const limit = panLimit(scale);
  return { scale, x: clamp(t.x, -limit, limit), y: clamp(t.y, -limit, limit) };
}

export function isTransformed(t: StickerTransform) {
  return t.x !== 0 || t.y !== 0 || t.scale !== 1;
}

/**
 * 預覽用的 CSS transform。
 * 位移以百分比表示，基準是元素自身尺寸，與匯出端的「顯示區比例」定義一致。
 */
export function toCssTransform(t: StickerTransform) {
  return `translate(${t.x * 100}%, ${t.y * 100}%) scale(${t.scale})`;
}

/**
 * 匯出用：在 canvas 上套用與預覽相同的變形。
 * CSS 的 `translate(T) scale(S)` 以元素中心為原點，換算為 p' = (p - c) * S + c + T，
 * 下列三個 transform 的疊加順序即對應此式。呼叫前需自行 save/restore。
 */
export function applyStickerTransform(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
  t: StickerTransform,
) {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  ctx.translate(cx + t.x * rect.width, cy + t.y * rect.height);
  ctx.scale(t.scale, t.scale);
  ctx.translate(-cx, -cy);
}
