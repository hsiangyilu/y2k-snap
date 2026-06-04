"use client";

import { useCallback, useRef } from "react";
import { StarBurst } from "@/components/y2k-decorations";

type Props = {
  onUpload: (url: string) => void;
};

export function UploadZone({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    onUpload(URL.createObjectURL(file));
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="relative w-full">
      {/* input 必須放在 button 外面：interactive element 不能巢狀在 button 內，
          否則瀏覽器會把 input 從 DOM 移除，導致點擊完全無效 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        className="group flex flex-col items-center justify-center gap-3 w-full min-h-36 rounded-2xl border-2 border-dashed border-border hover:border-brand transition-all cursor-pointer bg-bg-base hover:bg-gy-50"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        aria-label="上傳照片，拖曳或點擊選取"
      >
        <StarBurst
          size={28}
          className="text-content-disabled group-hover:text-brand transition-colors"
          strokeWidth={2}
        />
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-heading-sm text-content-primary tracking-widest">
            上傳照片
          </span>
          <span className="text-sm text-content-secondary tracking-wide">
            拖曳或點擊選取
          </span>
        </div>
      </button>
    </div>
  );
}
