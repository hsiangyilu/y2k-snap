"use client";

import type { Filter } from "./types";

type Props = {
  filters: Filter[];
  activeId: string;
  photoUrl?: string | null;
  onSelect: (filterId: string) => void;
};

// 空狀態：每個濾鏡對應 Y2K 色調，傳達濾鏡的情緒
const EMPTY_COLOR: Record<string, string> = {
  original: "bg-bg-base",
  washed:   "bg-gy-50",
  vivid:    "bg-gy-100",
  chrome:   "bg-ev-50",
  retro:    "bg-gy-100",
  neon:     "bg-ev-100",
  glam:     "bg-ev-50",
  dark:     "bg-[#C2C2C2]",
};

export function FilterPanel({ filters, activeId, photoUrl, onSelect }: Props) {
  return (
    <section aria-label="濾鏡選擇">
      {/* 標題 — 最小 14px */}
      <p className="font-display text-sm text-content-secondary tracking-[0.15em] uppercase mb-3">
        濾鏡
      </p>

      {/* 無照片：彩色佔位空狀態 */}
      {!photoUrl ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
            {filters.map((filter) => (
              <div
                key={filter.id}
                className="relative overflow-hidden rounded-lg border border-border"
                aria-hidden="true"
              >
                <div className={`aspect-square ${EMPTY_COLOR[filter.id] ?? "bg-bg-base"}`} />
                {/* 濾鏡名稱標籤：最小 14px */}
                <div className="absolute bottom-0 inset-x-0 py-1 text-center font-display tracking-wider bg-black/10 text-content-secondary text-sm leading-none">
                  {filter.label}
                </div>
              </div>
            ))}
          </div>
          {/* 提示文字：最小 14px */}
          <p className="text-sm text-content-disabled text-center tracking-wide pt-1">
            上傳照片後預覽濾鏡
          </p>
        </div>
      ) : (
        /* 有照片：正式濾鏡縮圖 */
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
          {filters.map((filter) => {
            const isActive = filter.id === activeId;
            return (
              <button
                key={filter.id}
                className={`group relative overflow-hidden rounded-lg border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive
                    ? "border-brand ring-1 ring-brand"
                    : "border-border hover:border-brand/60"
                }`}
                onClick={() => onSelect(filter.id)}
                aria-pressed={isActive}
                aria-label={filter.label}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photoUrl}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                    style={{ filter: filter.css }}
                  />
                </div>
                {/* 濾鏡名稱標籤：最小 14px */}
                <div
                  className={`absolute bottom-0 inset-x-0 py-1 text-center font-display tracking-wider text-sm leading-none transition-colors ${
                    isActive
                      ? "bg-brand text-content-on-brand"
                      : "bg-black/50 text-white group-hover:bg-black/65"
                  }`}
                >
                  {filter.label}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
