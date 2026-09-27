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

// 有了可見的變形框之後，縮小是合理操作（貼紙群變小、可放到角落），
// 因此下限放寬到 0.3；不再是「必須鋪滿」的圖層
export const STICKER_SCALE_MIN = 0.3;
export const STICKER_SCALE_MAX = 2.5;

// 位移上限：以顯示區尺寸為單位。放大後給更多餘裕，避免框被卡在中央附近
const BASE_PAN_LIMIT = 0.5;
const PAN_LIMIT_PER_SCALE = 0.5;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** 依目前縮放算出位移可達的範圍 */
export function panLimit(scale: number) {
  const s = clamp(scale, STICKER_SCALE_MIN, STICKER_SCALE_MAX);
  return BASE_PAN_LIMIT + Math.max(0, s - 1) * PAN_LIMIT_PER_SCALE;
}

/**
 * 變形框在顯示區內的位置，單位為百分比。
 * 貼紙圖層以 inset-0 填滿顯示區再套 transform，因此框即是「顯示區 × scale」
 * 以中心為原點縮放後再位移的結果。
 */
export function boxRect(t: StickerTransform) {
  const size = t.scale * 100;
  return {
    left: (100 - size) / 2 + t.x * 100,
    top: (100 - size) / 2 + t.y * 100,
    width: size,
    height: size,
  };
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
