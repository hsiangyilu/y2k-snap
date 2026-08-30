"use client";

import type { Sticker, StickerTone } from "./types";

type Props = {
  stickers: Sticker[];
  activeId: string;
  tone: StickerTone;
  onSelect: (stickerId: string) => void;
  onToneChange: (tone: StickerTone) => void;
};

const TONE_OPTIONS: { id: StickerTone; label: string }[] = [
  { id: "bw", label: "B&W" },
  { id: "color", label: "COLOR" },
];

export function StickerPanel({
  stickers,
  activeId,
  tone,
  onSelect,
  onToneChange,
}: Props) {
  // 沒選貼紙時色調不影響畫面，不顯示切換避免誤導
  const hasSticker = activeId !== "none";

  return (
    <section aria-label="Sticker selection">
      {hasSticker && (
        <div className="mb-3 flex items-center gap-2">
          <span className="font-display text-xs tracking-wider text-content-secondary">
            PHOTO
          </span>
          <div
            className="flex gap-1 rounded-full border border-border p-1"
            aria-label="Photo tone"
          >
            {TONE_OPTIONS.map((option) => {
              const isActive = option.id === tone;
              return (
                <button
                  key={option.id}
                  onClick={() => onToneChange(option.id)}
                  aria-pressed={isActive}
                  aria-label={`Photo tone ${option.label}`}
                  className={`h-8 rounded-full px-4 font-display text-xs tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    isActive
                      ? "bg-brand text-content-on-brand"
                      : "text-content-secondary hover:text-content-primary"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc((100vw-60px)/4.5)] gap-2 overflow-x-auto pb-1 lg:grid-rows-none lg:grid-cols-2 lg:grid-flow-row lg:auto-cols-auto lg:overflow-x-visible lg:pb-0">
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
                    NONE
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
