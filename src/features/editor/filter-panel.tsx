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
  dark:     "bg-border",
};

export function FilterPanel({ filters, activeId, photoUrl, onSelect }: Props) {
  return (
    <section aria-label="Filter selection">


      {/* 2 行固定高度，超過 8 個往右延伸可橫滑 */}
      {!photoUrl ? (
        <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc((100vw-60px)/4.5)] gap-2 overflow-x-auto pb-1 lg:grid-rows-none lg:grid-cols-2 lg:grid-flow-row lg:auto-cols-auto lg:overflow-x-visible lg:pb-0">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="relative overflow-hidden rounded-lg border border-border"
              aria-hidden="true"
            >
              <div className={`aspect-square ${EMPTY_COLOR[filter.id] ?? "bg-bg-base"}`} />
              <div className="absolute bottom-0 inset-x-0 py-1 text-center font-display tracking-wider bg-black/10 text-content-secondary text-sm leading-none">
                {filter.label}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc((100vw-60px)/4.5)] gap-2 overflow-x-auto pb-1 lg:grid-rows-none lg:grid-cols-2 lg:grid-flow-row lg:auto-cols-auto lg:overflow-x-visible lg:pb-0">
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
