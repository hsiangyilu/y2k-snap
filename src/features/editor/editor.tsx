"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { UploadZone } from "./upload-zone";
import { FilterPanel } from "./filter-panel";
import { FramePanel } from "./frame-panel";
import { StickerPanel } from "./sticker-panel";
import { Y2K_FILTERS, Y2K_FRAMES, Y2K_STICKERS, STICKER_BW_CSS } from "./types";
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

async function exportCanvas(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) return;

  const file = new File([blob], "y2k-snap.png", { type: "image/png" });

  // 手機優先用 Web Share API，讓使用者可直接存到相簿
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "y2k-snap" });
    } catch (err) {
      // AbortError 表示使用者主動取消，不算錯誤
      if ((err as Error).name !== "AbortError") throw err;
    }
    return;
  }

  // 桌面瀏覽器 fallback：觸發檔案下載
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "y2k-snap.png";
  a.click();
  URL.revokeObjectURL(url);
}

export function Editor() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("filter");
  const [activeFilter, setActiveFilter] = useState("original");
  const [activeFrame, setActiveFrame] = useState("none");
  const [activeSticker, setActiveSticker] = useState("none");
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
  // 貼紙模式：照片轉黑白底片色調，蓋過原本選的濾鏡
  const effectiveFilterCss = sticker.src ? STICKER_BW_CSS : activeFilterCss;

  const handleDownload = useCallback(async () => {
    const img = imgRef.current;
    if (!photoUrl || !img || img.naturalWidth === 0 || isDownloading) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
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
    } catch {
      // 圖層載入失敗則不下載，避免輸出不完整的圖
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
                onSelect={setActiveSticker}
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
