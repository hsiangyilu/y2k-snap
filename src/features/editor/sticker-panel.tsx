"use client";

import type { Sticker } from "./types";

type Props = {
  stickers: Sticker[];
  activeId: string;
  onSelect: (stickerId: string) => void;
};

export function StickerPanel({ stickers, activeId, onSelect }: Props) {
  return (
    <section aria-label="貼紙特效選擇">
      {/* 標題 — 最小 14px */}
      <p className="font-display text-sm text-content-secondary tracking-[0.15em] uppercase mb-3">
        貼紙
      </p>

      <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
        {stickers.map((sticker) => {
          const isActive = sticker.id === activeId;
          return (
            <button
              key={sticker.id}
              className={`group relative overflow-hidden rounded-lg border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive
                  ? "border-brand ring-1 ring-brand"
                  : "border-border hover:border-brand/60"
              }`}
              onClick={() => onSelect(sticker.id)}
              aria-pressed={isActive}
              aria-label={sticker.label}
            >
              <div className="aspect-square overflow-hidden flex items-center justify-center bg-bg-base">
                {sticker.src ? (
                  <img
                    src={sticker.src}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display text-xs text-content-disabled tracking-widest">
                    無貼紙
                  </span>
                )}
              </div>
              {/* 貼紙名稱標籤：最小 14px */}
              <div
                className={`absolute bottom-0 inset-x-0 py-1 text-center font-display tracking-wider text-sm leading-none transition-colors ${
                  isActive
                    ? "bg-brand text-content-on-brand"
                    : "bg-black/50 text-white group-hover:bg-black/65"
                }`}
              >
                {sticker.label}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
