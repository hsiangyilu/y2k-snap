"use client";

import { useCallback, useRef, useState } from "react";
import { StarBurst } from "@/components/y2k-decorations";
import { fileToImageUrl, isSupportedImage } from "@/lib/image-file";

type Props = {
  onUpload: (url: string) => void;
};

export function UploadZone({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!isSupportedImage(file)) {
        setError("不支援的檔案格式，請改用 JPG、PNG 或 HEIC");
        return;
      }

      setIsLoading(true);
      try {
        const url = await fileToImageUrl(file);
        onUpload(url);
      } catch {
        setError("照片處理失敗，請換一張再試");
      } finally {
        setIsLoading(false);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (isLoading) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, isLoading]
  );

  return (
    <div className="relative w-full">
      {/* input 必須放在 button 外面：interactive element 不能巢狀在 button 內，
          否則瀏覽器會把 input 從 DOM 移除，導致點擊完全無效 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <button
        className="group flex flex-col items-center justify-center gap-3 w-full aspect-square max-h-[60vh] min-h-36 rounded-2xl border-2 border-dashed border-border hover:border-brand transition-all cursor-pointer bg-bg-base hover:bg-gy-50 disabled:cursor-wait disabled:hover:border-border disabled:hover:bg-bg-base"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        disabled={isLoading}
        aria-label="上傳照片，拖曳或點擊選取"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <StarBurst
              size={28}
              className="text-brand animate-spin motion-reduce:animate-none"
              strokeWidth={2}
            />
            <span className="font-display text-heading-sm text-content-primary tracking-widest">
              轉換中…
            </span>
          </>
        ) : (
          <>
            <StarBurst
              size={28}
              className="text-content-disabled group-hover:text-brand transition-colors"
              strokeWidth={2}
            />
            <div className="flex flex-col items-center gap-1">
              <span className="font-display text-heading-sm text-content-primary tracking-widest">
                上傳照片
              </span>
            </div>
          </>
        )}
      </button>

      {/* 錯誤訊息：不以顏色為唯一資訊載體，搭配文字說明 */}
      {error && (
        <p
          role="alert"
          className="mt-3 text-center text-sm text-feedback-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
