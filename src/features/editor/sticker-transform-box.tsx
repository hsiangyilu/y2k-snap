"use client";

import { useCallback, useRef } from "react";
import { boxRect, clampTransform, type StickerTransform } from "./sticker-transform";

type Props = {
  transform: StickerTransform;
  onChange: (updater: (t: StickerTransform) => StickerTransform) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

// 四個角：用來算縮放時的對角參考點
const CORNERS = [
  { id: "nw", label: "top left",     style: "left-0  top-0    -translate-x-1/2 -translate-y-1/2", cursor: "cursor-nwse-resize" },
  { id: "ne", label: "top right",    style: "right-0 top-0     translate-x-1/2 -translate-y-1/2", cursor: "cursor-nesw-resize" },
  { id: "sw", label: "bottom left",  style: "left-0  bottom-0 -translate-x-1/2  translate-y-1/2", cursor: "cursor-nesw-resize" },
  { id: "se", label: "bottom right", style: "right-0 bottom-0  translate-x-1/2  translate-y-1/2", cursor: "cursor-nwse-resize" },
] as const;

/**
 * 貼紙圖層的變形框：虛線外框 + 四角控制點。
 * 框內拖曳為移動，拖角為以中心為基準的等比縮放。
 * 覆蓋在顯示區之上且不被裁切，因此放大時控制點仍可抓取。
 */
export function StickerTransformBox({ transform, onChange, onKeyDown }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  // 移動：記錄上一個指標位置；縮放：記錄起始的中心距離與縮放值
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const resizeRef = useRef<{ distance: number; scale: number } | null>(null);

  const rect = boxRect(transform);

  /** 取得顯示區在畫面上的尺寸，位移換算成比例時需要 */
  const overlayBox = () => overlayRef.current?.getBoundingClientRect();

  const startMove = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    dragRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const startResize = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    const box = overlayBox();
    if (!box) return;
    // 框的中心（畫面座標）
    const cx = box.left + box.width * (rect.left + rect.width / 2) / 100;
    const cy = box.top + box.height * (rect.top + rect.height / 2) / 100;
    resizeRef.current = {
      distance: Math.hypot(e.clientX - cx, e.clientY - cy) || 1,
      scale: transform.scale,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [rect.left, rect.top, rect.width, rect.height, transform.scale]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const box = overlayBox();
    if (!box) return;

    if (resizeRef.current) {
      // 以「指標到框中心的距離」變化比例做等比縮放，任一角操作結果一致
      const cx = box.left + box.width * (rect.left + rect.width / 2) / 100;
      const cy = box.top + box.height * (rect.top + rect.height / 2) / 100;
      const distance = Math.hypot(e.clientX - cx, e.clientY - cy);
      const ratio = distance / resizeRef.current.distance;
      const nextScale = resizeRef.current.scale * ratio;
      onChange((t) => clampTransform({ ...t, scale: nextScale }));
      return;
    }

    const prev = dragRef.current;
    if (!prev || box.width === 0 || box.height === 0) return;
    const dx = (e.clientX - prev.x) / box.width;
    const dy = (e.clientY - prev.y) / box.height;
    dragRef.current = { x: e.clientX, y: e.clientY };
    onChange((t) => clampTransform({ ...t, x: t.x + dx, y: t.y + dy }));
  }, [onChange, rect.left, rect.top, rect.width, rect.height]);

  const endPointer = useCallback(() => {
    dragRef.current = null;
    resizeRef.current = null;
  }, []);

  return (
    <div ref={overlayRef} className="absolute inset-0 pointer-events-none touch-none">
      <div
        className="absolute border-2 border-dashed border-brand pointer-events-auto cursor-move focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{ left: `${rect.left}%`, top: `${rect.top}%`, width: `${rect.width}%`, height: `${rect.height}%` }}
        onPointerDown={startMove}
        onPointerMove={onMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="application"
        aria-label="Sticker layer. Drag to move, drag a corner to resize, arrow keys to nudge, plus and minus to scale."
      >
        {CORNERS.map((corner) => (
          <button
            key={corner.id}
            type="button"
            // 外層是 44px 的透明觸控範圍，內層小圓點才是視覺；手機才抓得到
            className={`absolute grid h-11 w-11 place-items-center ${corner.style} ${corner.cursor} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-full`}
            style={{ touchAction: "none" }}
            aria-label={`Resize sticker from ${corner.label} corner`}
            onPointerDown={startResize}
            onPointerMove={onMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
          >
            <span className="block h-3.5 w-3.5 rounded-full border-2 border-brand bg-bg-surface shadow-sm" />
          </button>
        ))}
      </div>
    </div>
  );
}
