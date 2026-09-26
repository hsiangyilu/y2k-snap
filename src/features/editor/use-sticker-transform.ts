"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  STICKER_TRANSFORM_DEFAULT,
  STICKER_SCALE_MAX,
  STICKER_SCALE_MIN,
  clampTransform,
  type StickerTransform,
} from "./sticker-transform";

// 位移超過這個像素數才算拖曳，否則視為點擊（預覽區的點擊是「更換照片」）
const DRAG_THRESHOLD_PX = 6;
const KEY_PAN_STEP = 0.02;
const KEY_ZOOM_STEP = 0.1;
const WHEEL_ZOOM_SENSITIVITY = 0.0015;

type Pointer = { x: number; y: number };

/**
 * 貼紙圖層的手勢操作：單指/滑鼠拖曳平移、雙指捏合或滾輪縮放、方向鍵與 +/- 鍵盤操作。
 * enabled 為 false 時完全不攔截事件，預覽區維持原本「點擊更換照片」的行為。
 */
export function useStickerTransform(enabled: boolean) {
  const [transform, setTransform] = useState<StickerTransform>(STICKER_TRANSFORM_DEFAULT);
  const elementRef = useRef<HTMLButtonElement | null>(null);
  const pointersRef = useRef(new Map<number, Pointer>());
  // 捏合起點：初始雙指距離與當下縮放值
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);
  // 本次互動是否已達拖曳門檻，用來讓 click 知道該不該觸發更換照片
  const draggedRef = useRef(false);
  const movedPxRef = useRef(0);

  const reset = useCallback(() => setTransform(STICKER_TRANSFORM_DEFAULT), []);

  /** 讀取本次互動是否為拖曳，並清除旗標（click 處理器呼叫） */
  const consumeDragged = useCallback(() => {
    const was = draggedRef.current;
    draggedRef.current = false;
    return was;
  }, []);

  const nudge = useCallback((dx: number, dy: number, dScale: number) => {
    setTransform((t) =>
      clampTransform({ x: t.x + dx, y: t.y + dy, scale: t.scale + dScale })
    );
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!enabled) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 1) {
      movedPxRef.current = 0;
      draggedRef.current = false;
    }
    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchRef.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), scale: transform.scale };
      // 進入捏合就不再視為點擊
      draggedRef.current = true;
    }
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [enabled, transform.scale]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!enabled) return;
    const pointers = pointersRef.current;
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, next);

    const box = elementRef.current?.getBoundingClientRect();
    if (!box || box.width === 0 || box.height === 0) return;

    if (pointers.size >= 2 && pinchRef.current) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchRef.current.distance > 0) {
        const ratio = distance / pinchRef.current.distance;
        setTransform((t) => clampTransform({ ...t, scale: pinchRef.current!.scale * ratio }));
      }
      return;
    }

    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    movedPxRef.current += Math.hypot(dx, dy);
    if (movedPxRef.current > DRAG_THRESHOLD_PX) draggedRef.current = true;
    if (!draggedRef.current) return;

    setTransform((t) => clampTransform({ ...t, x: t.x + dx / box.width, y: t.y + dy / box.height }));
  }, [enabled]);

  const endPointer = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
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
    // 鍵盤操作也算互動，避免放開按鍵後誤觸更換照片
    draggedRef.current = true;
    nudge(...step);
  }, [enabled, nudge]);

  // 滾輪縮放需要 preventDefault 阻止頁面捲動，React 的 onWheel 是被動監聽，故用原生事件
  useEffect(() => {
    const el = elementRef.current;
    if (!el || !enabled) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setTransform((t) =>
        clampTransform({ ...t, scale: t.scale - e.deltaY * WHEEL_ZOOM_SENSITIVITY })
      );
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [enabled]);

  return {
    transform,
    reset,
    consumeDragged,
    isEnabled: enabled,
    scaleRange: { min: STICKER_SCALE_MIN, max: STICKER_SCALE_MAX },
    bind: {
      ref: elementRef,
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
      onKeyDown,
    },
  };
}
