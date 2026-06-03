export type Filter = {
  id: string;
  label: string;
  css: string;
};

export const Y2K_FILTERS: Filter[] = [
  { id: "original", label: "ORIGINAL", css: "none" },
  { id: "washed",   label: "WASHED",   css: "brightness(1.35) contrast(0.75) saturate(0.55)" },
  { id: "vivid",    label: "VIVID",    css: "saturate(2.5) contrast(1.15) brightness(1.05)" },
  { id: "chrome",   label: "CHROME",   css: "grayscale(0.35) contrast(1.5) brightness(1.2)" },
  { id: "retro",    label: "RETRO",    css: "sepia(0.55) saturate(1.4) contrast(1.1)" },
  { id: "neon",     label: "NEON",     css: "hue-rotate(220deg) saturate(2.2) brightness(1.1) contrast(1.1)" },
  { id: "glam",     label: "GLAM",     css: "hue-rotate(320deg) saturate(2) brightness(1.1)" },
  { id: "dark",     label: "DARK",     css: "brightness(0.65) contrast(1.5) saturate(1.4)" },
];
