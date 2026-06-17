// 像素層級 CSS filter 實作，相容 iOS Safari < 18（不支援 ctx.filter）

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

type FilterStep = { fn: string; val: number };

function parseFilterSteps(css: string): FilterStep[] {
  const steps: FilterStep[] = [];
  const re = /([\w-]+)\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    steps.push({ fn: m[1], val: parseFloat(m[2]) });
  }
  return steps;
}

// canvas 指定矩形區域套用 CSS filter 字串（依宣告順序逐步套用）
export function applyPixelFilters(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  filterCss: string
) {
  if (filterCss === "none" || w <= 0 || h <= 0) return;

  const steps = parseFilterSteps(filterCss);
  if (steps.length === 0) return;

  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iw = Math.ceil(w);
  const ih = Math.ceil(h);

  const imageData = ctx.getImageData(ix, iy, iw, ih);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2];

    for (const { fn, val } of steps) {
      switch (fn) {
        case "brightness":
          r *= val; g *= val; b *= val;
          break;
        case "contrast":
          r = (r - 127.5) * val + 127.5;
          g = (g - 127.5) * val + 127.5;
          b = (b - 127.5) * val + 127.5;
          break;
        case "saturate": {
          const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          r = L + (r - L) * val;
          g = L + (g - L) * val;
          b = L + (b - L) * val;
          break;
        }
        case "grayscale": {
          const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          r += (L - r) * val;
          g += (L - g) * val;
          b += (L - b) * val;
          break;
        }
        case "sepia": {
          const sr = 0.393 * r + 0.769 * g + 0.189 * b;
          const sg = 0.349 * r + 0.686 * g + 0.168 * b;
          const sb = 0.272 * r + 0.534 * g + 0.131 * b;
          r += (sr - r) * val;
          g += (sg - g) * val;
          b += (sb - b) * val;
          break;
        }
        case "hue-rotate": {
          if (val !== 0) {
            const [h, s, l] = rgbToHsl(clamp(r), clamp(g), clamp(b));
            let newH = (h + val / 360) % 1;
            if (newH < 0) newH += 1;
            [r, g, b] = hslToRgb(newH, s, l);
          }
          break;
        }
      }
    }

    d[i] = clamp(r);
    d[i + 1] = clamp(g);
    d[i + 2] = clamp(b);
  }

  ctx.putImageData(imageData, ix, iy);
}
