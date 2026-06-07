"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { UploadZone } from "./upload-zone";
import { FilterPanel } from "./filter-panel";
import { FramePanel } from "./frame-panel";
import { Y2K_FILTERS, Y2K_FRAMES } from "./types";
import { fileToImageUrl, isSupportedImage } from "@/lib/image-file";

type Tab = "frame" | "filter";

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

function exportCanvas(canvas: HTMLCanvasElement) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "y2k-snap.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

export function Editor() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("frame");
  const [activeFilter, setActiveFilter] = useState("original");
  const [activeFrame, setActiveFrame] = useState("none");
  const imgRef = useRef<HTMLImageElement>(null);
  // 更換照片用的 file input（與上傳區分開）
  const changeInputRef = useRef<HTMLInputElement>(null);

  const activeFilterCss =
    Y2K_FILTERS.find((f) => f.id === activeFilter)?.css ?? "none";
  const frame = Y2K_FRAMES.find((f) => f.id === activeFrame) ?? Y2K_FRAMES[0];

  const handleDownload = useCallback(() => {
    const img = imgRef.current;
    if (!photoUrl || !img || img.naturalWidth === 0) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (frame.src) {
      const frameImg = new Image();
      frameImg.onload = () => {
        canvas.width = frameImg.naturalWidth;
        canvas.height = frameImg.naturalHeight;

        const rect = {
          x: (frame.screen.x / 100) * canvas.width,
          y: (frame.screen.y / 100) * canvas.height,
          width: (frame.screen.width / 100) * canvas.width,
          height: (frame.screen.height / 100) * canvas.height,
        };
        const crop = getCoverCrop(img.naturalWidth, img.naturalHeight, rect.width, rect.height);

        ctx.save();
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.clip();
        if (activeFilterCss !== "none") ctx.filter = activeFilterCss;
        ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, rect.x, rect.y, rect.width, rect.height);
        ctx.restore();

        ctx.filter = "none";
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        exportCanvas(canvas);
      };
      frameImg.src = frame.src;
      return;
    }

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    if (activeFilterCss !== "none") ctx.filter = activeFilterCss;
    ctx.drawImage(img, 0, 0);
    exportCanvas(canvas);
  }, [photoUrl, activeFilterCss, frame]);

  // 點照片區塊觸發更換（支援 HEIC，轉檔為非同步）
  const handleChangePhoto = useCallback(async (file: File) => {
    if (!isSupportedImage(file)) return;
    try {
      const url = await fileToImageUrl(file);
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setPhotoUrl(url);
      setActiveFilter("original");
      setActiveFrame("none");
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
      alt="已上傳的照片預覽"
      className="w-full h-full object-cover block"
      style={{ filter: activeFilterCss }}
    />
  );

  return (
    <div className="flex flex-col h-dvh">
      {/* 頂部導覽列 */}
      <header className="flex items-center justify-between px-5 py-3 bg-bg-surface border-b border-border shrink-0">
        <Link
          href="/"
          className="font-display text-heading-sm text-content-primary leading-none hover:text-accent transition-colors"
          aria-label="返回首頁"
        >
          ←
        </Link>

        {photoUrl && (
          <button
            onClick={handleDownload}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-6 font-body font-semibold text-base text-content-on-brand transition-colors hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="下載套用邊框與濾鏡後的照片"
          >
            下載
          </button>
        )}
      </header>

      {/* 主體：工具面板 + 照片預覽 */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* 工具面板：桌機左側，手機排到下方（order-last）；永遠顯示，無照片時為空狀態 */}
        <aside
          className="order-last lg:order-first w-full lg:w-56 xl:w-64 bg-bg-surface border-t border-border lg:border-t-0 lg:border-r overflow-y-auto shrink-0"
          aria-label="編輯工具"
        >
          <div className="p-4 flex flex-col gap-4">
            {/* Tab 切換：邊框 / 濾鏡 */}
            <div
              role="tablist"
              aria-label="編輯工具分頁"
              className="grid grid-cols-2 gap-1 rounded-full bg-bg-base p-1"
            >
              {([
                { id: "frame", label: "邊框" },
                { id: "filter", label: "濾鏡" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-9 rounded-full font-display text-sm tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    activeTab === tab.id
                      ? "bg-brand text-content-on-brand"
                      : "text-content-secondary hover:text-content-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "frame" ? (
              <FramePanel
                frames={Y2K_FRAMES}
                activeId={activeFrame}
                onSelect={setActiveFrame}
              />
            ) : (
              <FilterPanel
                filters={Y2K_FILTERS}
                activeId={activeFilter}
                photoUrl={photoUrl}
                onSelect={setActiveFilter}
              />
            )}
          </div>
        </aside>

        {/* 照片預覽區：桌機右側，手機排到上方（order-first） */}
        <div className="order-first lg:order-last flex flex-1 items-center justify-center p-6 bg-bg-base overflow-auto">
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
                    // 預覽縮小顯示、保留留白空間感；以邊框圖片原始尺寸為上限避免放大模糊
                    width: `min(${frame.size.width}px, 22rem)`,
                  }}
                  title="點擊更換照片"
                  aria-label="點擊更換照片，目前已套用相機邊框預覽"
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
                  </div>
                  <img
                    src={frame.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  />
                </button>
              ) : (
                /* 無邊框：原本的單純照片預覽 */
                <img
                  ref={imgRef}
                  src={photoUrl}
                  alt="已上傳的照片預覽"
                  className="max-w-[50%] max-h-[50%] rounded-2xl shadow-xl object-contain block cursor-pointer"
                  style={{ filter: activeFilterCss }}
                  onClick={() => changeInputRef.current?.click()}
                  title="點擊更換照片"
                />
              )}
            </>
          ) : (
            <div className="w-1/2 max-w-2xl">
              <UploadZone onUpload={setPhotoUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
