export type Filter = {
  id: string;
  label: string;
  css: string;
};

// 螢幕區域：相對於相框圖片原始尺寸的百分比座標，用於裁切照片
export type FrameScreenRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Frame = {
  id: string;
  label: string;
  src: string | null; // null 代表「無邊框」
  screen: FrameScreenRect;
  // 邊框圖片原始尺寸，用於維持預覽的長寬比例
  size: { width: number; height: number };
};

// 貼紙特效：每張 src 是「整面散佈好的貼紙圖層」（去背 PNG），
// 以 cover 方式鋪滿照片區域；套用貼紙時照片轉為黑白底片色調
export type Sticker = {
  id: string;
  label: string;
  src: string | null; // null 代表「無貼紙」
};

// 貼紙模式下照片的黑白底片色調：低對比的灰平褪色復古感，讓彩色貼紙更突出
export const STICKER_BW_CSS =
  "grayscale(1) sepia(0.2) contrast(0.82) brightness(0.97)";

export const Y2K_STICKERS: Sticker[] = [
  { id: "none",      label: "NONE",    src: null },
  { id: "sticker-1", label: "STARS",   src: "/stickers/sticker-1.png" },
  { id: "sticker-2", label: "GEMS",    src: "/stickers/sticker-2.png" },
  { id: "sticker-3", label: "FLOWER",  src: "/stickers/sticker-3.png" },
  { id: "sticker-4", label: "HEARTS",  src: "/stickers/sticker-4.png" },
  { id: "sticker-6", label: "CRYSTAL", src: "/stickers/sticker-6.png" },
  { id: "sticker-7", label: "MOON",    src: "/stickers/sticker-7.png" },
  { id: "sticker-8", label: "BLUEBERRY", src: "/stickers/sticker-8.png" },
];

// 濾鏡強度整體降低 20%：每個數值往無效果基準拉近 20%
// （brightness/contrast/saturate 基準 1，grayscale/sepia/hue-rotate 基準 0）
export const Y2K_FILTERS: Filter[] = [
  { id: "original", label: "ORIGINAL", css: "none" },
  { id: "washed",   label: "WASHED",   css: "brightness(1.28) contrast(0.8) saturate(0.64)" },
  { id: "vivid",    label: "VIVID",    css: "saturate(2.2) contrast(1.12) brightness(1.04)" },
  { id: "chrome",   label: "CHROME",   css: "grayscale(0.28) contrast(1.4) brightness(1.16)" },
  { id: "retro",    label: "RETRO",    css: "sepia(0.44) saturate(1.32) contrast(1.08)" },
  // NEON / GLAM 改為人像友善：移除大角度 hue-rotate（會把膚色轉成外星色），
  // 改用微幅色調 + 飽和/亮度，保留 Y2K 電子感但臉不變色
  { id: "neon",     label: "NEON",     css: "saturate(1.55) contrast(1.12) brightness(1.06) hue-rotate(-10deg)" },
  { id: "glam",     label: "GLAM",     css: "brightness(1.12) saturate(1.18) contrast(0.96) sepia(0.18)" },
  // HONEY / ANGEL：人像友善的新增款，無大角度 hue-rotate，膚色自然
  { id: "honey",    label: "HONEY",    css: "sepia(0.28) saturate(1.2) brightness(1.08) contrast(1.02)" },
  { id: "angel",    label: "ANGEL",    css: "brightness(1.15) contrast(0.9) saturate(1.1)" },
  { id: "dark",     label: "DARK",     css: "brightness(0.72) contrast(1.4) saturate(1.32)" },
];

// 相機邊框樣式：screen 為照片要嵌入的區域（百分比座標，依各邊框圖片的鏤空範圍量測）
// 之後新增邊框圖片時，將檔案放到 public/frames/ 並依圖片量測 screen 座標
export const Y2K_FRAMES: Frame[] = [
  { id: "none", label: "NONE", src: null, screen: { x: 0, y: 0, width: 100, height: 100 }, size: { width: 1, height: 1 } },
  { id: "frame-1", label: "NIKON",  src: "/frames/1.png", screen: { x: 15.67, y: 26.39, width: 46.67, height: 49.07 }, size: { width: 2400, height: 1728 } },
  { id: "frame-2", label: "STAR",   src: "/frames/2.png", screen: { x: 14.00, y: 38.43, width: 39.00, height: 40.74 }, size: { width: 2400, height: 1728 } },
  { id: "frame-3", label: "RIBBON", src: "/frames/3.png", screen: { x: 18.54, y: 28.95, width: 42.25, height: 57.60 }, size: { width: 2400, height: 2342 } },
  { id: "frame-4", label: "TICKET", src: "/frames/4.png", screen: { x: 7.42,  y: 31.65, width: 46.92, height: 49.56 }, size: { width: 2400, height: 1703 } },
  { id: "frame-5", label: "LUCKY",  src: "/frames/5.png", screen: { x: 10.67, y: 29.51, width: 44.33, height: 49.60 }, size: { width: 2400, height: 1613 } },
  { id: "frame-6", label: "CHERRY", src: "/frames/6.png", screen: { x: 20.21, y: 37.03, width: 46.12, height: 44.01 }, size: { width: 2400, height: 1904 } },
  { id: "frame-7", label: "SANRIO", src: "/frames/7.png", screen: { x: 21.00, y: 30.40, width: 38.54, height: 48.26 }, size: { width: 2400, height: 1434 } },
];
