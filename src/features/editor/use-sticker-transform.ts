"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  STICKER_TRANSFORM_DEFAULT,
  clampTransform,
  type StickerTransform,
} from "./sticker-transform";

const KEY_PAN_STEP = 0.02;
const KEY_ZOOM_STEP = 0.1;
const WHEEL_ZOOM_SENSITIVITY = 0.0015;

/**
 * 貼紙圖層的變形狀態。
 *
 * 拖曳與角點縮放由 StickerTransformBox 直接操作（框看得見、手指知道抓哪裡），
 * 這裡只保留狀態本身，以及桌機補充用的滾輪縮放與鍵盤微調。
 * enabled 由調整模式控制，關閉時不掛任何監聽。
 */
export function useStickerTransform(enabled: boolean) {
  const [transform, setTransform] = useState<StickerTransform>(STICKER_TRANSFORM_DEFAULT);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const reset = useCallback(() => setTransform(STICKER_TRANSFORM_DEFAULT), []);

  const update = useCallback((updater: (t: StickerTransform) => StickerTransform) => {
    setTransform((t) => clampTransform(updater(t)));
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!enabled) return;
    const map: Record<string, [number, number, number]> = {
      ArrowLeft:  [-KEY_PAN_STEP, 0, 0],
      ArrowRight: [KEY_PAN_STEP, 0, 0],
      ArrowUp:    [0, -KEY_PAN_STEP, 0],
      ArrowDown:  [0, KEY_PAN_STEP, 0],
      "+":        [0, 0, KEY_ZOOM_STEP],
      "=":        [0, 0, KEY_ZOOM_STEP],
      "-":        [0, 0, -KEY_ZOOM_STEP],
    };
    const step = map[e.key];
    if (!step) return;
    e.preventDefault();
    const [dx, dy, dScale] = step;
    update((t) => ({ x: t.x + dx, y: t.y + dy, scale: t.scale + dScale }));
  }, [enabled, update]);

  // 滾輪縮放需要 preventDefault 阻止頁面捲動，React 的 onWheel 是被動監聽，故用原生事件
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      update((t) => ({ ...t, scale: t.scale - e.deltaY * WHEEL_ZOOM_SENSITIVITY }));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [enabled, update]);

  return { transform, update, reset, containerRef, onKeyDown };
}
