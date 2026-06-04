"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { UploadZone } from "./upload-zone";
import { FilterPanel } from "./filter-panel";
import { Y2K_FILTERS } from "./types";

export function Editor() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("original");
  const imgRef = useRef<HTMLImageElement>(null);
  // 更換照片用的 file input（與上傳區分開）
  const changeInputRef = useRef<HTMLInputElement>(null);

  const activeFilterCss =
    Y2K_FILTERS.find((f) => f.id === activeFilter)?.css ?? "none";

  const handleDownload = useCallback(() => {
    const img = imgRef.current;
    if (!photoUrl || !img || img.naturalWidth === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (activeFilterCss !== "none") ctx.filter = activeFilterCss;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "y2k-snap.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [photoUrl, activeFilterCss]);

  // 點照片區塊觸發更換
  const handleChangePhoto = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setActiveFilter("original");
  }, [photoUrl]);

  return (
    <div className="flex flex-col h-dvh">
      {/* 頂部導覽列 */}
      <header className="flex items-center justify-between px-5 py-3 bg-bg-surface border-b border-border shrink-0">
        <Link
          href="/"
          className="font-display text-heading-sm text-content-primary tracking-widest hover:text-accent transition-colors leading-none"
          aria-label="返回首頁"
        >
          ← Y2K SNAP
        </Link>

        {photoUrl && (
          <button
            onClick={handleDownload}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-6 font-body font-semibold text-label-lg text-content-on-brand transition-colors hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="下載套用濾鏡後的照片"
          >
            下載
          </button>
        )}
      </header>

      {/* 主體：濾鏡面板 + 照片預覽 */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* 濾鏡面板：桌機左側，手機排到下方（order-last）；永遠顯示，無照片時為空狀態 */}
        <aside
          className="order-last lg:order-first w-full lg:w-56 xl:w-64 bg-bg-surface border-t border-border lg:border-t-0 lg:border-r overflow-y-auto shrink-0"
          aria-label="編輯工具"
        >
          <div className="p-4 flex flex-col gap-4">
            <FilterPanel
              filters={Y2K_FILTERS}
              activeId={activeFilter}
              photoUrl={photoUrl}
              onSelect={setActiveFilter}
            />
          </div>
        </aside>

        {/* 照片預覽區：桌機右側，手機排到上方（order-first） */}
        <div className="order-first lg:order-last flex flex-1 items-center justify-center p-6 bg-bg-base overflow-auto">
          {photoUrl ? (
            <>
              {/* 點照片更換：hidden input 獨立於圖片之外 */}
              <input
                ref={changeInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleChangePhoto(file);
                  e.target.value = "";
                }}
              />
              <img
                ref={imgRef}
                src={photoUrl}
                alt="已上傳的照片預覽"
                className="max-w-[50%] max-h-[50%] rounded-2xl shadow-xl object-contain block cursor-pointer"
                style={{ filter: activeFilterCss }}
                onClick={() => changeInputRef.current?.click()}
                title="點擊更換照片"
              />
            </>
          ) : (
            <div className="w-full max-w-md">
              <UploadZone onUpload={setPhotoUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
