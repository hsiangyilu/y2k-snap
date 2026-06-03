"use client";

import type { Filter } from "./types";

type Props = {
  filters: Filter[];
  activeId: string;
  photoUrl: string;
  onSelect: (filterId: string) => void;
};

export function FilterPanel({ filters, activeId, photoUrl, onSelect }: Props) {
  return (
    <section aria-label="濾鏡選擇">
      {/* 標題縮小，改用 caption 級別搭配大寫 tracking */}
      <p className="font-display text-body-sm text-content-secondary tracking-[0.15em] uppercase mb-3">
        濾鏡
      </p>
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
              {/* 縮圖 */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={photoUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                  style={{ filter: filter.css }}
                />
              </div>

              {/* 濾鏡名稱標籤 */}
              <div
                className={`absolute bottom-0 inset-x-0 py-[3px] text-center font-display tracking-wider transition-colors ${
                  isActive
                    ? "bg-brand text-content-on-brand"
                    : "bg-black/50 text-white group-hover:bg-black/65"
                }`}
                style={{ fontSize: "8px" }}
              >
                {filter.label}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
