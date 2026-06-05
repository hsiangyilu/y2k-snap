export type Filter = {
  id: string;
  label: string;
  css: string;
};

// 濾鏡強度整體降低 20%：每個數值往無效果基準拉近 20%
// （brightness/contrast/saturate 基準 1，grayscale/sepia/hue-rotate 基準 0）
export const Y2K_FILTERS: Filter[] = [
  { id: "original", label: "ORIGINAL", css: "none" },
  { id: "washed",   label: "WASHED",   css: "brightness(1.28) contrast(0.8) saturate(0.64)" },
  { id: "vivid",    label: "VIVID",    css: "saturate(2.2) contrast(1.12) brightness(1.04)" },
  { id: "chrome",   label: "CHROME",   css: "grayscale(0.28) contrast(1.4) brightness(1.16)" },
  { id: "retro",    label: "RETRO",    css: "sepia(0.44) saturate(1.32) contrast(1.08)" },
  { id: "neon",     label: "NEON",     css: "hue-rotate(176deg) saturate(1.96) brightness(1.08) contrast(1.08)" },
  { id: "glam",     label: "GLAM",     css: "hue-rotate(256deg) saturate(1.8) brightness(1.08)" },
  { id: "dark",     label: "DARK",     css: "brightness(0.72) contrast(1.4) saturate(1.32)" },
];
