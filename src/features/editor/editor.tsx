"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { UploadZone } from "./upload-zone";
import { FilterPanel } from "./filter-panel";
import { FramePanel } from "./frame-panel";
import { StickerPanel } from "./sticker-panel";
import { Y2K_FILTERS, Y2K_FRAMES, Y2K_STICKERS, STICKER_BW_CSS } from "./types";
import type { StickerTone } from "./types";
import { fileToImageUrl, isSupportedImage } from "@/lib/image-file";
import { applyPixelFilters } from "@/lib/canvas-filter";

type Tab = "frame" | "filter" | "sticker";

// 計算 object-fit: cover 的來源裁切區域，讓照片等比例填滿目標區域
function getCoverCrop(srcW: number, srcH: number, destW: number, destH: number) {
  const srcRatio = srcW / srcH;
  const destRatio = destW / destH;

  if (srcRatio > destRatio) {
    const sh = srcH;
    const sw = srcH * destRatio;
    return { sx: (srcW - sw) / 2, sy: 0, sw, sh };
  }

  const sw = srcW;
  const sh = srcW / destRatio;
  return { sx: 0, sy: (srcH - sh) / 2, sw, sh };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// 以 cover 方式把來源圖鋪滿目標區域（照片與貼紙圖層共用）
function drawCover(
  ctx: CanvasRenderingContext2D,
  source: HTMLImageElement,
  rect: { x: number; y: number; width: number; height: number },
) {
  const crop = getCoverCrop(
    source.naturalWidth,
    source.naturalHeight,
    rect.width,
    rect.height,
  );
  ctx.drawImage(
    source,
    crop.sx, crop.sy, crop.sw, crop.sh,
    rect.x, rect.y, rect.width, rect.height,
  );
}

const EXPORT_FILENAME = "y2k-snap.png";

// 只有觸控裝置（手機/平板）才走 Web Share 存相簿；
// 桌機即使支援 navigator.share 也一律直接下載，避免跳出分享面板而不是存檔
function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

// 觸發瀏覽器下載檔案
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  // 必須掛進 DOM 才能在 Firefox 觸發下載
  document.body.appendChild(a);
  a.click();
  a.remove();
  // 延後釋放：立即 revoke 會讓尚未開始的下載靜默失敗
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// 匯出一律保留透明背景：相框的鏤空區域輸出為去背 PNG
async function exportCanvas(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) return;

  const file = new File([blob], EXPORT_FILENAME, { type: "image/png" });

  // 手機優先用 Web Share API，讓使用者可直接存到相簿
  if (isTouchDevice() && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "y2k-snap" });
      return;
    } catch (err) {
      // AbortError 表示使用者主動取消，不需再退回下載
      if ((err as Error).name === "AbortError") return;
      // 其餘失敗（例如權限被擋）改走一般下載，避免使用者拿不到檔案
    }
  }

  downloadBlob(blob, EXPORT_FILENAME);
}

export function Editor() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("filter");
  const [activeFilter, setActiveFilter] = useState("original");
  const [activeFrame, setActiveFrame] = useState("none");
  const [activeSticker, setActiveSticker] = useState("none");
  // 貼紙模式的照片色調：預設黑白，讓彩色貼紙更突出
  const [stickerTone, setStickerTone] = useState<StickerTone>("bw");
  // 下載合成需載入邊框/貼紙原圖（最大 1.5MB），期間鎖定按鈕避免連點
  const [isDownloading, setIsDownloading] = useState(false);
  // 照片原始尺寸：無邊框預覽時用來定出貼紙圖層的覆蓋範圍
  const [photoSize, setPhotoSize] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // 更換照片用的 file input（與上傳區分開）
  const changeInputRef = useRef<HTMLInputElement>(null);

  const activeFilterCss =
    Y2K_FILTERS.find((f) => f.id === activeFilter)?.css ?? "none";
  const frame = Y2K_FRAMES.find((f) => f.id === activeFrame) ?? Y2K_FRAMES[0];
  const sticker =
    Y2K_STICKERS.find((s) => s.id === activeSticker) ?? Y2K_STICKERS[0];
  // 貼紙模式選 B&W 時照片轉黑白底片色調，蓋過原本選的濾鏡；
  // 選 COLOR 則保留使用者在濾鏡分頁選的效果
  const effectiveFilterCss =
    sticker.src && stickerTone === "bw" ? STICKER_BW_CSS : activeFilterCss;

  const handleDownload = useCallback(async () => {
    const img = imgRef.current;
    if (!photoUrl || !img || img.naturalWidth === 0 || isDownloading) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    setIsDownloading(true);
    try {
      const stickerImg = sticker.src ? await loadImage(sticker.src) : null;

      if (frame.src) {
        const frameImg = await loadImage(frame.src);
        canvas.width = frameImg.naturalWidth;
        canvas.height = frameImg.naturalHeight;

        const rect = {
          x: (frame.screen.x / 100) * canvas.width,
          y: (frame.screen.y / 100) * canvas.height,
          width: (frame.screen.width / 100) * canvas.width,
          height: (frame.screen.height / 100) * canvas.height,
        };

        // 照片與貼紙圖層都裁切進相框螢幕區域，相框圖片疊在最上層
        ctx.save();
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.clip();
        drawCover(ctx, img, rect);
        ctx.restore();
        // 濾鏡以像素操作套用，相容 iOS Safari < 18（ctx.filter 在舊版無效）
        applyPixelFilters(ctx, rect.x, rect.y, rect.width, rect.height, effectiveFilterCss);
        ctx.save();
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.clip();
        if (stickerImg) drawCover(ctx, stickerImg, rect);
        ctx.restore();

        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        await exportCanvas(canvas);
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      applyPixelFilters(ctx, 0, 0, canvas.width, canvas.height, effectiveFilterCss);
      if (stickerImg) {
        drawCover(ctx, stickerImg, {
          x: 0, y: 0, width: canvas.width, height: canvas.height,
        });
      }
      await exportCanvas(canvas);
    } catch (err) {
      // AbortError 是使用者主動取消分享，其餘才是真正的錯誤
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("[y2k-snap] 匯出失敗", err);
      }
    } finally {
      setIsDownloading(false);
    }
  }, [photoUrl, effectiveFilterCss, frame, sticker, isDownloading]);

  // 點照片區塊觸發更換（支援 HEIC，轉檔為非同步）
  const handleChangePhoto = useCallback(async (file: File) => {
    if (!isSupportedImage(file)) return;
    try {
      const url = await fileToImageUrl(file);
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setPhotoUrl(url);
      setActiveFilter("original");
      setActiveFrame("none");
      setActiveSticker("none");
      setStickerTone("bw");
      setPhotoSize(null);
    } catch {
      // 轉檔失敗則保留原本照片，不中斷使用者
    }
  }, [photoUrl]);

  const changePhotoInput = (
    <input
      ref={changeInputRef}
      type="file"
      accept="image/*,.heic,.heif"
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleChangePhoto(file);
        e.target.value = "";
      }}
    />
  );

  const framedPhotoImg = (
    <img
      ref={imgRef}
      src={photoUrl ?? undefined}
      alt="Uploaded photo preview"
      className="w-full h-full object-cover block"
      style={{ filter: effectiveFilterCss }}
      onLoad={(e) =>
        setPhotoSize({
          w: e.currentTarget.naturalWidth,
          h: e.currentTarget.naturalHeight,
        })
      }
    />
  );

  // 貼紙圖層：整面散佈貼紙以 cover 鋪滿照片區域（預覽與下載共用同一張圖）
  const stickerOverlay = sticker.src ? (
    <img
      src={sticker.src}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
    />
  ) : null;

  return (
    <div className="flex flex-col h-dvh">
      {/* 頂部導覽列 */}
      <header className="flex items-center justify-between px-5 py-3 bg-bg-surface border-b border-border shrink-0">
        <Link
          href="/"
          className="inline-flex min-w-11 min-h-11 items-center justify-center -ml-2 font-display text-heading-sm text-content-primary leading-none hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-full"
          aria-label="Back to home"
        >
          ←
        </Link>

        {photoUrl && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-6 font-body font-semibold text-base text-content-on-brand transition-colors hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 disabled:cursor-wait"
            aria-label="Download edited photo"
            aria-busy={isDownloading}
          >
            {isDownloading ? "Downloading…" : "Download"}
          </button>
        )}
      </header>

      {/* 主體：工具面板 + 照片預覽 */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* 工具面板：桌機左側，手機排到下方（order-last）；永遠顯示，無照片時為空狀態 */}
        <aside
          className="order-last lg:order-first w-full lg:w-56 xl:w-64 max-h-[42vh] lg:max-h-none bg-bg-surface border-t border-border lg:border-t-0 lg:border-r overflow-y-auto shrink-0"
          aria-label="Edit tools"
        >
          <div className="p-4 flex flex-col gap-4">
            {/* Tab 切換：邊框 / 濾鏡 */}
            <div
              role="tablist"
              aria-label="Edit tool tabs"
              className="flex gap-6 border-b border-border"
            >
              {([
                { id: "filter", label: "Filter" },
                { id: "frame", label: "Frame" },
                { id: "sticker", label: "Sticker" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 font-display tracking-[0.1em] transition-colors border-b-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    activeTab === tab.id
                      ? "text-sm text-content-primary border-b-brand"
                      : "text-xs text-content-secondary border-b-transparent hover:text-content-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="animate-tab-in" key={activeTab}>
            {activeTab === "frame" && (
              <FramePanel
                frames={Y2K_FRAMES}
                activeId={activeFrame}
                onSelect={setActiveFrame}
              />
            )}
            {activeTab === "filter" && (
              <FilterPanel
                filters={Y2K_FILTERS}
                activeId={activeFilter}
                photoUrl={photoUrl}
                onSelect={setActiveFilter}
              />
            )}
            {activeTab === "sticker" && (
              <StickerPanel
                stickers={Y2K_STICKERS}
                activeId={activeSticker}
                tone={stickerTone}
                onSelect={setActiveSticker}
                onToneChange={setStickerTone}
              />
            )}
            </div>
          </div>
        </aside>

        {/* 照片預覽區：桌機右側，手機排到上方（order-first）；設為 container 讓預覽用 cqw/cqh 填滿 */}
        <div className="order-first lg:order-last flex flex-1 items-center justify-center p-6 bg-bg-base overflow-hidden [container-type:size]">
          {photoUrl ? (
            <>
              {changePhotoInput}
              {frame.src ? (
                /* 有邊框：照片裁切置入相框螢幕區域，相框圖片疊在最上層 */
                <button
                  type="button"
                  onClick={() => changeInputRef.current?.click()}
                  className="relative max-w-full max-h-full shadow-xl rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  style={{
                    aspectRatio: `${frame.size.width} / ${frame.size.height}`,
                    // 填滿可用區域並保持比例：寬度同時受限於容器寬(100cqw)與
                    // 由容器高換算的寬(100cqh × 比例)，再以原始尺寸為上限避免放大模糊
                    width: `min(${frame.size.width}px, 100cqw, calc(100cqh * ${frame.size.width} / ${frame.size.height}))`,
                  }}
                  title="Tap to change photo"
                  aria-label="Tap to change photo — frame preview active"
                >
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      left: `${frame.screen.x}%`,
                      top: `${frame.screen.y}%`,
                      width: `${frame.screen.width}%`,
                      height: `${frame.screen.height}%`,
                    }}
                  >
                    {framedPhotoImg}
                    {stickerOverlay}
                  </div>
                  <img
                    src={frame.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  />
                </button>
              ) : (
                /* 無邊框：照片填滿可用區域並保持比例，貼紙圖層直接疊在照片上 */
                <button
                  type="button"
                  onClick={() => changeInputRef.current?.click()}
                  className="relative shadow-xl rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  style={
                    photoSize
                      ? {
                          aspectRatio: `${photoSize.w} / ${photoSize.h}`,
                          width: `min(${photoSize.w}px, 100cqw, calc(100cqh * ${photoSize.w} / ${photoSize.h}))`,
                        }
                      : undefined
                  }
                  title="Tap to change photo"
                  aria-label="Tap to change photo"
                >
                  {framedPhotoImg}
                  {stickerOverlay}
                </button>
              )}
            </>
          ) : (
            <div className="w-full max-w-sm">
              <UploadZone onUpload={setPhotoUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
