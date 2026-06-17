"use client";

import type { Frame } from "./types";

type Props = {
  frames: Frame[];
  activeId: string;
  onSelect: (frameId: string) => void;
};

export function FramePanel({ frames, activeId, onSelect }: Props) {
  return (
    <section aria-label="Frame selection">


      <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc((100vw-60px)/4.5)] gap-2 overflow-x-auto pb-1 lg:grid-rows-none lg:grid-cols-2 lg:grid-flow-row lg:auto-cols-auto lg:overflow-x-visible lg:pb-0">
        {frames.map((frame) => {
          const isActive = frame.id === activeId;
          return (
            <button
              key={frame.id}
              className={`group relative overflow-hidden rounded-lg border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive
                  ? "border-brand ring-1 ring-brand"
                  : "border-border hover:border-brand/60"
              }`}
              onClick={() => onSelect(frame.id)}
              aria-pressed={isActive}
              aria-label={frame.label}
            >
              <div className="aspect-square overflow-hidden flex items-center justify-center bg-bg-base">
                {frame.src ? (
                  <img
                    src={frame.src}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="font-display text-xs text-content-disabled tracking-widest">
                    NONE
                  </span>
                )}
              </div>
              {/* 邊框名稱標籤：最小 14px */}
              <div
                className={`absolute bottom-0 inset-x-0 py-1 text-center font-display tracking-wider text-sm leading-none transition-colors ${
                  isActive
                    ? "bg-brand text-content-on-brand"
                    : "bg-black/50 text-white group-hover:bg-black/65"
                }`}
              >
                {frame.label}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
